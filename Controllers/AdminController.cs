using Microsoft.AspNetCore.Mvc;

namespace MedicalApp.API1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController:ControllerBase
    {
    private readonly Services.AdminService _adminService;
        public AdminController(Services.AdminService adminService)
        {
            _adminService = adminService;
        }
        [HttpPost]
        public async Task<ActionResult<Metier.Administrateur>> CreateAdmin([FromBody] DTO.AdminDTO adminDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                Metier.Administrateur admin = new Metier.Administrateur
                {
                    Nom = adminDto.Nom,
                    Prenom = adminDto.Prenom,
                    Email = adminDto.Email,
                    Password = adminDto.Password,
                    DateCreation = adminDto.DateCreation,
                    Actif = adminDto.Actif
                };
                var createdAdmin = await _adminService.AddAdminAsync(admin);
                return CreatedAtAction(nameof(GetAdminById), new { id = createdAdmin.Id }, createdAdmin);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("authenticate")]
        public async Task<ActionResult<Metier.Administrateur>> Authenticate([FromBody] AuthDTO authDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var admin = await _adminService.AuthenticateAsync(authDto.Email, authDto.Password);
                if (admin == null)
                    return Unauthorized("Invalid email or password.");
                return Ok(admin);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Metier.Administrateur>> GetAdminById(Guid id)
        {
            try
            {
                var admin = await _adminService.GetAdminByIdAsync(id);
                if (admin == null)
                    return NotFound();
                return Ok(admin);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }


    public class AuthDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
