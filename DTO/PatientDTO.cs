using System.ComponentModel.DataAnnotations;
using MedicalApp.Metier;

namespace MedicalApp.API1.DTO
{
    public class PatientDTO
    {

        [Required, StringLength(100)]
        public string Nom { get; set; }
        [Required, StringLength(100)]
        public string Prenom { get; set; }


        public Adresse adresse { get; set; }

        public DateTime dateNaissance { get; set; }

        public Authentification authentification { get; set; }

        public ProfilMedical ProfilMedical { get; set; }
        public string sexe { get; set; } = string.Empty;
    }
}
