using System;
using System.Threading;
using System.Threading.Tasks;
using MedicalApp.API1;
using MedicalApp.API1.DTO;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DiagnoseController : ControllerBase
{
    private readonly IDiagnoseService _service;
    private readonly ILogger<DiagnoseController> _logger;

    public DiagnoseController(IDiagnoseService service, ILogger<DiagnoseController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpPost] // sera accessible via POST /api/diagnose
    public async Task<IActionResult> Diagnose([FromBody] DiagnostiqueRequestDTO request, CancellationToken ct = default)
    {
        if (request == null) return BadRequest("Payload required.");
            
       
      
        


            // Valeur IANA recommandée : par ex "Europe/Paris" ou "Africa/Casablanca"
            // Ici on essaie de fournir une valeur IANA "Africa/Casablanca" pour le Maroc.
     
            // Si tu veux convertir dynamiquement depuis TimeZoneInfo.Local, utilise TimeZoneConverter package.
        

        if (string.IsNullOrWhiteSpace(request.description))
            return BadRequest("Description is required.");

        if(string.IsNullOrWhiteSpace(request.myuuid))
        {
            request.myuuid = Guid.NewGuid().ToString();
        }
        if(string.IsNullOrWhiteSpace(request.timezone))
        {
            request.timezone = "Africa/Casablanca";
        }


        try
        {
            var response = await _service.DiagnoseAsync(request, ct);
            return Ok(response);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error calling external diagnose API");
            return StatusCode(502, "Error calling external diagnose service");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during diagnose");
            return StatusCode(500, "Internal server error");
        }
    }
}
