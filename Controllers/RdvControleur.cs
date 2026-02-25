using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using MedicalApp.Metier;
using MedicalApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedicalApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RendezVousController : ControllerBase
    {
        // Modification : Utilisation d'interfaces pour le découplage
        private readonly RendezVousService _rvService;
        private readonly PatientService _patientService;
        private readonly PraticienService _praticienService;
       

        public RendezVousController(
            RendezVousService rvService,
            PatientService patientService,
            PraticienService praticienService)
        {
            _rvService = rvService;
            _patientService = patientService;
            _praticienService = praticienService;
        }

        [HttpPost]
        public async Task<ActionResult<RendezVous>> PrendreRendezVous([FromBody] PrendreRdvModel model)
        {
            // Nouveau : Validation du modèle
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var patient = await _patientService.GetPatientByIdAsync(model.PatientId);
                if (patient == null)
                    return NotFound($"Patient ID {model.PatientId} introuvable");

                var praticien = await _praticienService.GetPraticienByIdAsync(model.PraticienId);
                if (praticien == null)
                    return NotFound($"Praticien ID {model.PraticienId} introuvable");

               

                var rdv = await _rvService.PrendreRdvAsync(patient, praticien, model.DateHeure);
                return CreatedAtAction(nameof(GetRendezVousById), new { id = rdv.IdRdv }, rdv);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur : {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RendezVous>> GetRendezVousById(int id)
        {
            try
            {
                var rdv = await _rvService.GetRdvByIdAsync(id);
                return rdv == null
                    ? NotFound($"Rendez-vous ID {id} introuvable")
                    : Ok(rdv);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur : {ex.Message}");
            }
        }

        [HttpPatch("{id}/annuler")]
        public async Task<IActionResult> AnnulerRendezVous(int id)
        {
            try
            {
                // Nouveau : Vérification de l'existence avant annulation
                var result = await _rvService.AnnulerRdvAsync(id);
                if (result == null) return NotFound($"Rendez-vous ID {id} introuvable");
               
                else return Ok(result);
              
                     
            }
            catch (InvalidOperationException ex)
            {
                // Nouveau : Gestion des erreurs métier spécifiques
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur : {ex.Message}");
            }
        }

        [HttpPatch("{id}/reporter")]
        public async Task<IActionResult> ReporterRendezVous(int id, [FromBody] ReporterRdvModel model)
        {
            // Nouveau : Validation du modèle
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Nouveau : Vérification de disponibilité du nouveau créneau
                var rdv = await _rvService.GetRdvByIdAsync(id);
                if (rdv == null)
                    return NotFound($"Rendez-vous ID {id} introuvable");
/*
                if (!await _rvService.IsSlotAvailable(rdv.PraticienId, model.NouvelleDateHeure))
                    return Conflict("Nouveau créneau indisponible");
*/
                await _rvService.ReporterRdvAsync(id, model.NouvelleDateHeure);
                return Ok(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur : {ex.Message}");
            }
        }

        [HttpPatch("{id}/confirmer")]
        public async Task<IActionResult> ConfirmerRendezVous(int id, [FromBody] ConfirmRdvModel model)
        {
            // Nouveau : Validation du modèle
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var praticien = await _praticienService.GetPraticienByIdAsync(model.PraticienId);
                if (praticien == null)
                    return NotFound($"Praticien ID {model.PraticienId} introuvable");
                /*
                             // Nouveau : Vérification de l'existence du rendez-vous
                             var rdvExists = await _rvService.RdvExistsAsync(id);
                             if (!rdvExists)
                            return NotFound($"Rendez-vous ID {id} introuvable");
               */
                await _rvService.ConfirmerRdvAsync(id, praticien);
                return Ok(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur : {ex.Message}");
            }
        }
        [HttpGet]
        public async Task<ActionResult> GetAllRendezVous()
        {
            try
            {
                var rdvs = await _rvService.GetAllRdvAsync();
                return Ok(rdvs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur : {ex.Message}");
            }
        }


        /// <summary>
        /// Modèles de données avec validations étendues
        /// </summary>
        public class PrendreRdvModel
        {
            [Required(ErrorMessage = "L'ID patient est requis")]
            public int PatientId { get; set; }

            [Required(ErrorMessage = "L'ID praticien est requis")]
            public int PraticienId { get; set; }

            [Required(ErrorMessage = "La date/heure est requise")]
            [FutureDate(ErrorMessage = "La date doit être dans le futur")]
            public DateTime DateHeure { get; set; }
        }

        public class ReporterRdvModel
        {
            [Required(ErrorMessage = "La nouvelle date/heure est requise")]
            [FutureDate(ErrorMessage = "La date doit être dans le futur")]
            public DateTime NouvelleDateHeure { get; set; }
        }

        public class ConfirmRdvModel
        {
            [Required(ErrorMessage = "L'ID praticien est requis")]
            public int PraticienId { get; set; }
        }

        // Nouveau : Validateur personnalisé pour les dates futures
        public class FutureDateAttribute : ValidationAttribute
        {
            protected override ValidationResult IsValid(object value, ValidationContext context)
            {
                if (value is DateTime date && date < DateTime.Now)
                    return new ValidationResult(ErrorMessage);
                return ValidationResult.Success;
            }
        }
    }
}