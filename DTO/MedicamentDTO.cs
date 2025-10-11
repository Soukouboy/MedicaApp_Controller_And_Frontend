namespace MedicalApp.API1.DTO
{
    public class MedicamentDTO

    {
        public string Nom { get; set; }
        public string Description { get; set; }
        public string Forme { get; set; } // Ex: Comprimé, Sirop, Pommade
        public string Dosage { get; set; } // Ex: 500mg, 10ml
        public double Prix { get; set; } // Prix unitaire du médicament
        public DateTime DateExpiration { get; set; } // Date d'expiration du médicament
        public int QuantiteDisponible { get; set; } // Quantité disponible en stock
    }
}
