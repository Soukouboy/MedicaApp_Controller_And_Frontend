using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MedicalApp.API1.DTO;
using System.Collections.Generic;
using MedicalApp.PdfGenerator;
using System.Threading.Tasks;
using MedicalApp.Services;
using MedicalApp.Metier;
namespace MedicalApp.API1.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdonnanceController :  ControllerBase
    {

        private readonly DocumentMedicalService _documentService;  // Changement pour l'interface (meilleure pratique)
        private readonly PatientService _patientService;
        private readonly RendezVousService _rdvService;
        private readonly MedicamentService _medicamentService;
        private readonly PdfService _pdfService;
        private readonly OrdonnanceService _ordonnanceService;

        // Modification : Utilisation d'une interface pour le découplage et la testabilité
        public OrdonnanceController(DocumentMedicalService documentService, PatientService patientService, RendezVousService rdvService, MedicamentService medicamentService,PdfService pdfService, OrdonnanceService ordonnanceService)
        {
            _documentService = documentService;
            _patientService = patientService;
            _rdvService = rdvService;
            _medicamentService = medicamentService;
            _pdfService = pdfService;
            _ordonnanceService = ordonnanceService;
        }
        /*
        [HttpPost]
        public async Task<ActionResult> CreateOrdonnance([FromBody] OrdonnanceDTO ordonnance)
        {
            if (!ModelState.IsValid) { 
                return BadRequest(ModelState);
            }
            try
            {
                var rendezVous =await _rdvService.GetRdvByIdAsync(ordonnance.id_rendezvous);
                if (rendezVous == null)
                    return BadRequest($"Rendez-vous avec ID {ordonnance.id_rendezvous} introuvable.");
                var medicaments = new List<Medicaments>();

                foreach (var medId in ordonnance.medicamentPrescription)
                {
                    var medicament = await _medicamentService.GetMedicamentByIdAsync(medId.IdMedicament);
                    var quantite= medId.QuantitePrescrite;
                    if (medicament == null)
                        return BadRequest($"Médicament avec ID {medId} introuvable.");
                    medicament.ordonnaceMedicaments.Add(new OrdonnanceMedicament
                    {
                        QuantitePrescrite = quantite,
                        medicament = medicament
                    });
                    medicaments.Add(medicament);
                }

                var ordonnanceNew = new Ordonnance(rendezVous, medicaments, ordonnance.date);
                await  _documentService.CreateDocumentAsync(ordonnanceNew);
                return CreatedAtAction(nameof(GetOrdonnanceById), new { id = ordonnanceNew.IdDocument }, ordonnance);
            }
            catch (Exception exception) {
                
                return StatusCode(500, $"Internal server error: {exception.StackTrace}");
            } 
        }
        */


        [HttpPost]
        public async Task<ActionResult> CreateOrdonnance([FromBody] OrdonnanceDTO ordonnance)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // 🔹 1. Vérifier que le rendez-vous existe
                var rendezVous = await _rdvService.GetRdvByIdAsync(ordonnance.id_rendezvous);
                if (rendezVous == null)
                    return BadRequest($"Rendez-vous avec ID {ordonnance.id_rendezvous} introuvable.");

                // 🔹 2. Créer une nouvelle ordonnance VIDE (on va remplir ses médicaments après)
                var ordonnanceNew = new Ordonnance(rendezVous, new List<OrdonnanceMedicament>(), ordonnance.date);

                // 🔹 3. Pour chaque médicament prescrit dans le DTO
                foreach (var medId in ordonnance.medicamentPrescription)
                {
                    var medicament = await _medicamentService.GetMedicamentByIdAsync(medId.IdMedicament);
                    if (medicament == null)
                        return BadRequest($"Médicament avec ID {medId.IdMedicament} introuvable.");

                    // 🔹 4. On ajoute la relation dans l'ordonnance
                    // 👉 Ici on crée un "OrdonnanceMedicament" qui fait le lien entre l'ordonnance et le médicament,
                    // et qui contient aussi la quantité prescrite.
                    ordonnanceNew.ordonnaceMedicaments.Add(new OrdonnanceMedicament
                    {
                             // FK vers le médicament
                        medicament = medicament,              // Objet médicament
                        QuantitePrescrite = medId.QuantitePrescrite,// Info spécifique à la prescription
                        NombreUsageJour = medId.NombreUsageJour
                    });
                }

                // 🔹 5. Sauvegarde dans la base via le service
                await _documentService.CreateDocumentAsync(ordonnanceNew);

                return CreatedAtAction(nameof(GetOrdonnanceById), new { id = ordonnanceNew.IdDocument }, ordonnance);
            }
            catch (Exception exception)
            {
                return StatusCode(500, $"Internal server error: {exception.StackTrace}");
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Ordonnance>> GetOrdonnanceById(int id)
        {
            var doc = await _documentService.GetDocumentByIdAsync(id);
            if (doc == null || doc.GetType() != typeof(Ordonnance))
                return NotFound($"Ordonnance avec ID {id} introuvable.");
            return Ok((Ordonnance)doc);
        }
        [HttpGet("{id}/Patient")]
        public async Task<ActionResult<IEnumerable<Ordonnance>>> GetAllOrdonnancesOfPatients(int id)
        {
            try
            {
                var documents = await _documentService.GetDocumentsByPatientAsync(id);
                var ordonnances = documents.OfType<Ordonnance>(); // Filtrer uniquement les ordonnances
                return Ok(ordonnances);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrdonnance(int id, [FromBody] Ordonnance ordonnance)
        {
            if (id != ordonnance.IdDocument)
                return BadRequest("ID mismatch.");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var existing = await _documentService.GetDocumentByIdAsync(id);
            if (existing == null || existing.GetType() != typeof(Ordonnance))
                return NotFound($"Ordonnance avec ID {id} introuvable.");
            try
            {
                await _documentService.UpdateDocumentAsync(ordonnance);
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpDelete("{id}")]
        public async   Task<ActionResult> DeleteOrdonnance(int id)
        {
            var existing = await _documentService.GetDocumentByIdAsync(id);
            if (existing == null || existing.GetType() != typeof(Ordonnance))
                return NotFound($"Ordonnance avec ID {id} introuvable.");
            try
            {
                await _documentService.DeleteDocumentAsync(id);
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("{id}/download")]
        public async Task<IActionResult> DownloadOrdonnance(int id)
        {
            // Récupération de l’ordonnance depuis ton service/metier
            var ordonnance =await _ordonnanceService.GetOrdonnancesByAsync(id) ;
            if (ordonnance == null)
                return NotFound("Ordonnance introuvable.");

            // Générer le PDF en mémoire
            var pdfBytes = _pdfService.GenerateOrdonnancePdf(ordonnance);

            // Retourner le fichier directement au navigateur
            return File(pdfBytes, "application/pdf", $"Ordonnance-{id}.pdf");
        }


        // To be implemented
    }


}
