using MedicalApp.API1.DTO;
using MedicalApp.Metier;
using MedicalApp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Server;

namespace MedicalApp.API1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicamentController : ControllerBase
    {
        private readonly MedicamentService _medicamentService;
        public MedicamentController(MedicamentService medicamentService)
        {
            _medicamentService = medicamentService;

        }

        [HttpPost]
        public async Task<ActionResult> CreateMedicament([FromBody] MedicamentDTO medicament)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var medicaments = new Medicaments(medicament.Nom, medicament.Description, medicament.Forme, medicament.Dosage, medicament.Prix, medicament.DateExpiration, medicament.QuantiteDisponible);
                var createdMedicament = await _medicamentService.CreateMedicamentAsync(medicaments);
                return CreatedAtAction(nameof(GetMedicamentById), new { id = createdMedicament.IdMedoc }, createdMedicament);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Medicaments>> GetMedicamentById(int id)
        {
            var medicament = await _medicamentService.GetMedicamentByIdAsync(id);
            if (medicament == null)
            {
                return NotFound();
            }
            return Ok(medicament);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicaments>>> GetAllMedicaments()
        {
            var medicaments = await _medicamentService.GetAllMedicamentsAsync();
            return Ok(medicaments);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateMedicament(int id, [FromBody] Medicaments medicament)
        {
            if (id != medicament.IdMedoc)
            {
                return BadRequest("ID mismatch");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _medicamentService.UpdateMedicamentAsync(medicament);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteMedicament(int id)
        {
            try
            {
                await _medicamentService.DeleteMedicamentAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
