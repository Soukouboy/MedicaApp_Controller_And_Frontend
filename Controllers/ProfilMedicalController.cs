using Microsoft.AspNetCore.Mvc;

namespace MedicalApp.API1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilMedicalController:ControllerBase
    {
        private readonly ProfilMedicalService service;

       public ProfilMedicalController (ProfilMedicalService profilMedicalService)
        {
            this.service = profilMedicalService;

        }


      


    }
}
