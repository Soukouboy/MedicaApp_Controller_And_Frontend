using Microsoft.AspNetCore.Mvc;
using MedicalApp;
using MedicalApp.API1.DTO;


namespace MedicalApp.API1.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    public class DocumentMedicalControleur : ControllerBase
        {

        private readonly DocumentMedicalService  _documentService;  // Changement pour l'interface (meilleure pratique)
        private readonly PatientService _patientService;
        private readonly RendezVousService _rdvService;

        // Modification : Utilisation d'une interface pour le découplage et la testabilité
        public DocumentMedicalControleur(DocumentMedicalService documentService, PatientService patientService, RendezVousService rdvService)
        {
            _documentService = documentService;
            _patientService = patientService;
            _rdvService = rdvService;
        }
        [HttpPost]
        public async Task <ActionResult<DocumentMedical>> CreateDocument([FromBody] DocumentMedicalDTO doc)
        {
            // Nouveau : Validation du modèle avant traitement
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            { 
                var rdv = await _rdvService.GetRdvByIdAsync(doc.id_rendezvous);

                if (rdv == null)
                    return BadRequest($"Rendez-vous avec ID {doc.id_rendezvous} introuvable.");
                var praticien = rdv.praticien;

                var newDoc= new DocumentMedical (rdv, doc.dateCreation );



                var created = await _documentService.CreateDocumentAsync(newDoc);
                // Correction : "DocumentId" au lieu de "DocumentID" pour correspondre au nom standard
                return CreatedAtAction(nameof(GetDocumentById), new { id = created.IdDocument }, created);
            }
            catch (Exception ex)
            {
                // Nouveau : Gestion des erreurs serveur
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentMedical>>> GetAllDocuments()
        {
            try
            {
                var documents = await _documentService.GetAllDocumentsAsync();
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentMedical>> GetDocumentById(int id)
        {
            try
            {
                var doc = await _documentService.GetDocumentByIdAsync(id);
                if (doc == null)
                    return NotFound($"Document avec ID {id} introuvable.");
                return Ok(doc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDocument(int id, [FromBody] DocumentMedicalDTO doc)
        {
            // Nouveau : Validation du modèle avant traitement
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var existing = await _documentService.GetDocumentByIdAsync(id);
               
 
                var rdv = await _rdvService.GetRdvByIdAsync(doc.id_rendezvous);
                if (rdv == null)
                    return BadRequest($"Rendez-vous avec ID {doc.id_rendezvous} introuvable.");
                // Met à jour les propriétés
               
                existing.id_rendezvous = doc.id_rendezvous;
                existing.rendezVous = rdv;
                existing.dateCreation = doc.dateCreation;
                await _documentService.UpdateDocumentAsync(existing);
                return NoContent(); // 204 No Content pour une mise à jour réussie sans corps de réponse
            }
            catch (Exception ex)
            {
                // Nouveau : Gestion des erreurs serveur
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDocument(int id)
        {
            try
            {
                var existing = await _documentService.GetDocumentByIdAsync(id);
                if (existing == null)
                    return NotFound($"Document avec ID {id} introuvable.");
                await _documentService.DeleteDocumentAsync(id);
                return NoContent(); // 204 No Content pour une suppression réussie
            }
            catch (Exception ex)
            {
                // Nouveau : Gestion des erreurs serveur
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }



}
