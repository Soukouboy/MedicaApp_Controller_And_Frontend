namespace MedicalApp.API1.DTO
{
    public class OrdonnanceDTO
    {

        public List<MedicamentPrescriptionDTO> medicamentPrescription { get; set; } = new List<MedicamentPrescriptionDTO>();
        public DateTime date { get; set; } = DateTime.Now;

        public int renouvellementsRestants { get; set; } = 1;
        public int id_rendezvous { get; set; }
    }
}
