using System.Text.Json.Serialization;

namespace MedicalApp.API1.DTO
{
    public class DiagnostiqueRequestDTO
    {

        // Le binder JSON / model binding remplira ces propriétés si le client les envoie.
        // On expose des propriétés publiques avec noms JSON explicites pour coller à l'API externe.

        [JsonPropertyName("description")]
        public string description { get; set; } = string.Empty;
      
        [JsonPropertyName("myuuid")]
        public string myuuid { get; set; } = string.Empty; // on remplira par défaut au controller si vide
        [JsonPropertyName("lang")]
      
        public string lang { get; set; } = "fr";

    
        [JsonPropertyName("timezone")]
        public string timezone { get; set; } = string.Empty; // on complètera au controller si vide

        [JsonPropertyName("diseases_list")]
        [JsonIgnore]
        public string? diseases_list { get; set; } = string.Empty;  // optional

        [JsonPropertyName("model")]
        [JsonIgnore]
        public string model { get; set; } =string.Empty;

        [JsonPropertyName("response_mode")]
        [JsonIgnore]
        public string response_mode { get; set; } = "direct";

        // constructeur sans paramètre requis pour la désérialisation/model binding
        public DiagnostiqueRequestDTO() { }

        // constructeur pratique si tu veux créer manuellement l'objet
        public DiagnostiqueRequestDTO(string description,string myuuid,string lang, string timezone)
        {
            this.description = description ?? string.Empty;
            this.myuuid = myuuid ?? string.Empty;
            this.lang = lang ?? "fr";
            this.timezone = timezone;
            this.model = "gpt4o";
            this.response_mode = "direct";

        }

    }


    
        public class DiagnostiqueResponseDTO
        {
            public string Result { get; set; }
            public List<DiagnosticData> Data { get; set; } = new();
            public AnonymizationInfo Anonymization { get; set; }
            public string DetectedLang { get; set; }
            public string Model { get; set; }
            public string QueryType { get; set; }
            public string RawJson { get; set; } // Pour debug
        }

        public class DiagnosticData
        {
            public string Diagnosis { get; set; }
            public string Description { get; set; }
            public List<string> SymptomsInCommon { get; set; } = new();
            public List<string> SymptomsNotInCommon { get; set; } = new();
        }

        public class AnonymizationInfo
        {
            public bool HasPersonalInfo { get; set; }
            public string AnonymizedText { get; set; }
            public string AnonymizedTextHtml { get; set; }
        }
    }

