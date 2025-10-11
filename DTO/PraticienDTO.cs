namespace MedicalApp.API1.DTO
{
    public class PraticienDTO
    {
        public string Nom { get; set; } = string.Empty;

        public string Prenom { get; set; } = string.Empty;

        public string specialite { get; set; } = string.Empty;

        public string lieuConsultation { get; set; } = string.Empty;

        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string phone { get; set; }
        public List<string> languesParlees { get; set; } = new List<string>();
        public string sexe { get; set; } = string.Empty;
    }
}
