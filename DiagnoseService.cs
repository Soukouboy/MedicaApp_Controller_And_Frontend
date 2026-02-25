using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using MedicalApp.API1.DTO;

namespace MedicalApp.API1
{
    public interface IDiagnoseService
    {
        Task<DiagnostiqueResponseDTO> DiagnoseAsync(DiagnostiqueRequestDTO request, CancellationToken ct = default);
    }
    public class DiagnoseService: IDiagnoseService
    {
        private readonly HttpClient _http;
        private readonly string _subscriptionKey;
        private readonly ILogger<DiagnoseService> _logger;

        private const string ExternalUrl ="https://dxgpt-apim.azure-api.net/api/diagnose";
        public DiagnoseService(HttpClient http, IConfiguration configuration, ILogger<DiagnoseService> _logger)
        {
            this._logger = _logger;
            _http = http;
            _subscriptionKey = configuration["DXGPT_SUBSCRIPTION_KEY"] ?? throw new ArgumentNullException("DXGPT_SUBSCRIPTION_KEY not configured");
        }
        public async Task<DiagnostiqueResponseDTO> DiagnoseAsync(DiagnostiqueRequestDTO request, CancellationToken ct = default)
        {
            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, ExternalUrl);
            httpRequest.Headers.Add("Ocp-Apim-Subscription-Key", _subscriptionKey);
            httpRequest.Headers.Add("Accept", "application/json");
            httpRequest.Headers.Add("Cache-Control", "no-cache");
            httpRequest.Content = JsonContent.Create(request);

            _logger.LogInformation("Requête → {Url}", httpRequest.RequestUri?.ToString());

            var body = JsonSerializer.Serialize(request);
            _logger.LogInformation("Body envoyé : {Body}", body);


            using var resp = await _http.SendAsync(httpRequest, ct);
            var raw = await resp.Content.ReadAsStringAsync(ct);

            _logger.LogInformation("Status : {Status} – Raw body : {Body}",
                      (int)resp.StatusCode, raw);

            var result = new DiagnostiqueResponseDTO();
            result.RawJson = raw;

            if (!resp.IsSuccessStatusCode)
            {
                // Log + throw or return error info
                throw new HttpRequestException($"External API error {(int)resp.StatusCode}: {raw}");
            }

            // ======================= ÉTAPE 2 : Vérification si déjà prêt =======================
            // Parfois l'API peut répondre directement si le traitement est rapide
            // On tente donc de désérialiser la réponse pour voir si c'est déjà "success"
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tempResult = JsonSerializer.Deserialize<DiagnostiqueResponseDTO>(raw, options);



            // Si le résultat est déjà "success", on le retourne immédiatement
            if (tempResult?.Result?.Equals("success", StringComparison.OrdinalIgnoreCase) == true)
            {
                _logger.LogInformation("Diagnostic immédiatement disponible");
                tempResult.RawJson = raw;
                return tempResult;
            }

            // ======================= ÉTAPE 3 : Polling jusqu'à obtention du résultat =======================
            // Si on arrive ici, c'est que l'API a renvoyé {"result":"processing"}
            // On doit donc interroger régulièrement l'API pour savoir quand le traitement est terminé

            string uuid = request.myuuid; // UUID unique pour suivre cette demande
            DiagnostiqueResponseDTO finalResult = null;

            // On essaye pendant 30 secondes maximum (30 itérations × 1 seconde)
            for (int i = 0; i < 30; i++)
            {
                _logger.LogInformation("Polling tentative #{Iter} pour UUID {Uuid}", i + 1, uuid);

                // Construction de la requête GET pour vérifier le statut
                using var pollRequest = new HttpRequestMessage(
                    HttpMethod.Get,
                    $"{ExternalUrl}/{uuid}"); // Important : on ajoute l'UUID à l'URL
                pollRequest.Headers.Add("Ocp-Apim-Subscription-Key", _subscriptionKey);

                // Envoi de la requête de statut
                var pollResp = await _http.SendAsync(pollRequest, ct);
                var pollJson = await pollResp.Content.ReadAsStringAsync(ct);
                _logger.LogInformation("Polling réponse - {Json}", pollJson);

                // Désérialisation de la réponse de polling
                var pollResult = JsonSerializer.Deserialize<DiagnostiqueResponseDTO>(pollJson, options);

                // Si le résultat est "success", c'est terminé !
                if (pollResult?.Result?.Equals("success", StringComparison.OrdinalIgnoreCase) == true)
                {
                    _logger.LogInformation("Diagnostic pris après {Iter} tentatives", i + 1);
                    finalResult = pollResult;
                    finalResult.RawJson = pollJson;
                    break; // On sort de la boucle
                }

                // Sinon, on attend 1 seconde avant de réessayer
                _logger.LogInformation("Diagnostic encore en cours, attente de 1 seconde...");
                await Task.Delay(1000, ct);
            }

            // ======================= ÉTAPE 4 : Vérification du résultat final =======================
            // Si après 30 secondes on n'a pas de résultat, on lance une exception
            if (finalResult == null)
            {
                throw new TimeoutException($"Diagnostic non terminé après 30 secondes pour UUID {uuid}");
            }

            return finalResult;
        }
    }

}
      

    

