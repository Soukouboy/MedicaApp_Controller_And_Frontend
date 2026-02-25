using MedicalApp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedicalApp.Metier;

namespace MedicalApp.API1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilMedicalController:ControllerBase
    {
        private readonly ProfilMedicalService _service;
        private readonly IFileStorage _fileStorage;
        private readonly MedicalAppContext _context;

        public ProfilMedicalController (ProfilMedicalService profilMedicalService,IFileStorage fileStorage,MedicalAppContext appContext)
        {
            this._service = profilMedicalService;
            this._fileStorage = fileStorage;
            this._context = appContext;

        }

        [HttpPut("patient/{patientId}/image")]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> UploadOrReplaceImageForPatient(int patientId, IFormFile file)
        {
            // Trouver le ProfilMedical lié au patient
            var profil = await _service.GetByPatientAsync(patientId); // adapte PatientId si nécessaire

            if (profil == null) return NotFound();

            if (file == null || file.Length == 0) return BadRequest("Fichier invalide.");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext)) return BadRequest("Type de fichier non autorisé.");

            var relativePath = await _fileStorage.SaveProfilImageAsync(file);

            // supprimer ancienne image si existante
            if (!string.IsNullOrEmpty(profil.ProfilePath))
                await _fileStorage.DeleteFileAsync(profil.ProfilePath);

            profil.ProfilePath = relativePath;
            await _context.SaveChangesAsync();

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            return Ok(new { path = relativePath, url = $"{baseUrl}/{relativePath}" });
        }




    }
}
