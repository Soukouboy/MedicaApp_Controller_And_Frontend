using System.ComponentModel.DataAnnotations;

namespace MedicalApp.API1.DTO
{
    public class AdminDTO
    {

        [MaxLength(50)]
        public string Nom { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Prenom { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        [MaxLength(100)]
        public string Password { get; set; } = string.Empty;

        public DateTime DateCreation { get; set; } = DateTime.UtcNow;
        public bool Actif { get; set; } = true;
    }
}
