using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MedicalApp.API1.DTO;
using MedicalApp.Services;
using MedicalApp.Metier;

namespace MedicalApp.Controllers
{
    /// <summary>
    /// Contrôleur pour gérer les opérations CRUD et d'authentification des praticiens.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PraticienController : ControllerBase
    {
        private readonly PraticienService _praticienService;

        // Injection du service métier Praticien
        public PraticienController(PraticienService praticienService)
        {
            _praticienService = praticienService;
        }

        /// <summary>
        /// Crée un nouveau praticien.
        /// POST: api/praticien
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Praticien>> CreatePraticien([FromBody] PraticienDTO praticien)
        {
            Praticien praticien1 = new Praticien(
                praticien.Nom,
                praticien.Prenom,
                praticien.specialite,
                praticien.lieuConsultation,
                praticien.email,
                praticien.password,
                praticien.phone,
                praticien.languesParlees,
                praticien.sexe
            );
            var created = await _praticienService.CreatePraticienAsync(praticien1);
            return CreatedAtAction(nameof(GetPraticienById), new { id = created.IDPraticien }, created);
        }

        /// <summary>
        /// Récupère tous les praticiens.
        /// GET: api/praticien
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Praticien>>> GetAllPraticiens()
        {
            var liste = await _praticienService.GetAllPraticiensAsync();
            return Ok(liste);
        }

        /// <summary>
        /// Récupère un praticien par ID.
        /// GET: api/praticien/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Praticien>> GetPraticienById(int id)
        {
            var praticien = await _praticienService.GetPraticienByIdAsync(id);
            if (praticien == null)
                return NotFound();
            return Ok(praticien);
        }

        /// <summary>
        /// Met à jour un praticien existant.
        /// PUT: api/praticien/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePraticien(int id, [FromBody] Praticien praticien)
        {
            if (id != praticien.IDPraticien)
                return BadRequest();

            await _praticienService.UpdatePatientAsync(praticien);
            return NoContent();
        }

        /// <summary>
        /// Supprime un praticien par ID.
        /// DELETE: api/praticien/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePraticien(int id)
        {
            await _praticienService.DeletePraticienAsync(id);
            return NoContent();
        }

        /// <summary>
        /// Authentifie un praticien via email et mot de passe.
        /// POST: api/praticien/login
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<Praticien>> Login([FromBody] LoginPraticienModel login)
        {
            var praticien = await _praticienService.FindByEmailAsync(login.Email, login.Password);
            if (praticien == null)
                return Unauthorized();
            return Ok(praticien);
        }

        /// <summary>
        /// Récupère la liste des rendez-vous d'un praticien.
        /// GET: api/praticien/{id}/rendezvous
        /// </summary>
        [HttpGet("rendezvous/{id}")]
        public async Task<ActionResult<IEnumerable<RendezVous>>> GetRendezVous(int id)
        {
            var rdvs = await _praticienService.GetRendezVousByPraticienAsync(id);
            return Ok(rdvs);
        }

        // Récupérer la liste des patients d'un praticien

        [HttpGet("{id}/patients")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatientsByPraticien(int id)
        {
            var patients = await _praticienService.GetPatientsByPraticienAsync(id);
            return Ok(patients);
        }
    }

    /// <summary>
    /// Modèle pour la connexion des praticiens.
    /// </summary>
    public class LoginPraticienModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
