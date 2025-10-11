namespace MedicalApp.API1.DTO
{
    public class RdvDTO
    {

    
        public DateTime dateHeure { get; set; }
        public int duree { get; set; }
        public string typeRDV { get; set; }
        public EtatRdv etatRdv { get; set; } = EtatRdv.EnAttente;
        public Patient patient { get; set; }
        public Praticien praticien { get; set; }

    }
}
