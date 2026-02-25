using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using MedicalApp.API1.DTO;
using MedicalApp.Metier;
using MedicalApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly PatientService _patientService;  // Changement pour l'interface (meilleure pratique)
     //   private readonly IConfiguration _configuration;

        // Modification : Utilisation d'une interface pour le découplage et la testabilité
        public PatientController(PatientService patientService )
        {
            _patientService = patientService;
            
        }

        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient([FromBody] PatientDTO patient)
        {
            // Nouveau : Validation du modèle avant traitement
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                Patient patient1 = new Patient(patient.Nom, patient.Prenom, patient.dateNaissance, patient.adresse, patient.authentification, patient.ProfilMedical, patient.sexe);
                var created = await _patientService.CreatePatientAsync(patient1);
                // Correction : "PatientId" au lieu de "PatientID" pour correspondre au nom standard
                return CreatedAtAction(nameof(GetPatientById), new { id = created.PatientID }, created);
            }
            catch (Exception ex)
            {
                // Nouveau : Gestion des erreurs serveur
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetAllPatients()
        {
            try
            {
                var patients = await _patientService.GetAllPatientsAsync();
                return Ok(patients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatientById(int id)
        {
            try
            {
                var patient = await _patientService.GetPatientByIdAsync(id);
             //   patient.ProfilMedical.ProfilePath = patient.ProfilMedical.GetProfilePictureUrl(_configuration);
                return patient == null ? NotFound() : Ok(patient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient patient)
        {
            // Nouveau : Double validation du modèle et de la cohérence des IDs
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != patient.PatientID)
                return BadRequest("ID mismatch");

            var patientExists = await _patientService.GetPatientByIdAsync(id);
            patientExists.authentification.num_telephone=patient.authentification.num_telephone; // Numero de téléphone mis à jour
            patientExists.authentification.email=patient.authentification.email; // Email mis à jour
            // patientExists.authentification.password=patient.authentification.password; // Mot de passe mis à jour



            patientExists.Nom=patient.Nom;  // Nom mis à jour
            patientExists.Prenom=patient.Prenom;// Prenom mis à jour
            patientExists.sexe=patient.sexe;// Sexe mis à jour
            patientExists.dateNaissance=patient.dateNaissance;// Date de naissance mis à jour



            patientExists.adresse.pays=patient.adresse.pays;// Pays mis à jour
            patientExists.adresse.ville=patient.adresse.ville;// Ville mis à jour
            patientExists.adresse.codePostal=patient.adresse.codePostal;// Code postal mis à jour
            patientExists.adresse.rue=patient.adresse.rue;// Rue mis à jour


            patientExists.ProfilMedical.groupSanguin = patient.ProfilMedical.groupSanguin;// Groupe sanguin mis à jour
            patientExists.ProfilMedical.allergies = patient.ProfilMedical.allergies;// Allergies mis à jour
         //   patientExists.ProfilMedical.ProfilePath= patient.ProfilMedical.ProfilePath;// Chemin de l'image de profil mis à jour
            patientExists.ProfilMedical.Antecedents = patient.ProfilMedical.Antecedents;// Antécédents mis à jour






            try
            {
                await _patientService.UpdatePatientAsync(patientExists);
                return Ok(patientExists);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Patient>> DeletePatient(int id)
        {
            try
            {
                var deleted = await _patientService.DeletePatientAsync(id);

                // Nouveau : Gestion du cas où l'entité n'existe pas
                if (deleted is null)
                {
                    return NotFound();
                }
                return Ok(deleted);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<Patient>> Login([FromBody] LoginModel login)
        {
            // Nouveau : Validation des credentials avant traitement
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Nouveau : Sécurisation avec vérification de mot de passe hashé
                var patient = await _patientService.FindByEmailAsync(login.Email, login.Password);
                return patient == null
                    ? Unauthorized("Invalid credentials")
                    : Ok(patient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("Rendezvous{id}")]

        public async Task<ActionResult<IEnumerable<RendezVous>>> GetAllRdvPatient(int id)
        {
            try
            {
                var rdvs = await _patientService.GetRendezVousByPatienAsync(id);
                return Ok(rdvs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

   
   

        public class LoginModel
        {
            [Required]
            [EmailAddress]  // Nouveau : Validation du format email
            public string Email { get; set; }

            [Required]
            [StringLength(100, MinimumLength = 8)]  // Nouveau : Politique de mot de passe
            public string Password { get; set; }
        }
    }
}