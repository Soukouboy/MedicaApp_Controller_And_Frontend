
        // Simulation de l'IA médicale
        document.addEventListener('DOMContentLoaded', function() {
            const chatMessages = document.getElementById('chat-messages');
            const userInput = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-btn');

            // Réponses prédéfinies de l'IA avec des réponses plus médicales
            const aiResponses = {
                "symptômes": "L'analyse des symptômes nécessite plus de détails : durée d'évolution, intensité, facteurs aggravants/calmants. Pour une évaluation précise, pourriez-vous préciser :\n1. La localisation exacte\n2. Le caractère aigu/chronique\n3. Les symptômes associés ?",
                "traitement": "Selon les dernières recommandations HAS 2023, le traitement de première intention serait :\n\n1. [Médicament A] 500mg 2x/jour\n2. [Médicament B] si contre-indication\n\nVoulez-vous que je vérifie les interactions avec le traitement actuel du patient ?",
                "diagnostic": "Hypothèses diagnostiques (par ordre de probabilité) :\n1. Pathologie X (60%)\n- Critères : A, B, C\n2. Pathologie Y (30%)\n- Critères : D, E\n\nJe recommande les examens complémentaires suivants pour affiner :\n- Bilan sanguin complet\n- Imagerie spécifique",
                "urgence": "[ALERTE] Selon les critères de gravité, je recommande :\n1. Hospitalisation immédiate si :\n- Signes vitaux altérés\n- Douleur thoracique\n2. Consultation en urgence (<6h) si :\n- Symptômes neurologiques focaux\nVoulez-vous que je génère une fiche d'orientation pour les urgences ?",
                "recherche": "D'après PubMed et les dernières guidelines, voici les données récentes :\n\n- Étude RECOVERY (2023) : Nouveaux protocoles pour...\n- Méta-analyse BMJ : Efficacité démontrée de...\n\nJe peux vous envoyer les articles complets si besoin.",
                "default": "Je suis votre assistant médical IA certifié. Voici ce que je peux faire :\n\n• Analyser des symptômes complexes\n• Proposer des arbres décisionnels\n• Vérifier les interactions médicamenteuses\n• Expliquer les dernières recommandations\n• Générer des fiches patient structurées\n\nComment puis-je vous assister aujourd'hui ?"
            };

            // Gestion de l'envoi de message
            function sendMessage() {
                const message = userInput.value.trim();
                if (message === '') return;

                // Ajout du message de l'utilisateur
                addUserMessage(message);
                userInput.value = '';

                // Réponse de l'IA après un délai
                setTimeout(() => {
                    const aiMessage = generateAIResponse(message);
                    addAIMessage(aiMessage);
                }, 1000);
            }

            // Ajout d'un message utilisateur
            function addUserMessage(text) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message user-message';
                messageDiv.innerHTML = `
                    <div class="message-header">
                        <i class="fas fa-user-md"></i>
                        <span>Vous</span>
                    </div>
                    <p>${text}</p>
                `;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            // Ajout d'un message IA
            function addAIMessage(text) {
                // Formatage des listes à puces
                const formattedText = text.replace(/\n•/g, '<br>•')
                                          .replace(/\n-/g, '<br>-')
                                          .replace(/\n\d+\./g, '<br>$&');

                const messageDiv = document.createElement('div');
                messageDiv.className = 'message ai-message';
                messageDiv.innerHTML = `
                    <div class="message-header">
                        <i class="fas fa-robot"></i>
                        <span>Assistant IA</span>
                    </div>
                    <p>${formattedText}</p>
                `;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            // Génération de réponse IA améliorée
            function generateAIResponse(message) {
                const lowerMsg = message.toLowerCase();

                if (/(symptôme|douleur|manifestation)/.test(lowerMsg)) {
                    return aiResponses["symptômes"];
                } else if (/(traitement|médicament|thérapie|prescrire)/.test(lowerMsg)) {
                    return aiResponses["traitement"];
                } else if (/(diagnostic|pathologie|maladie)/.test(lowerMsg)) {
                    return aiResponses["diagnostic"];
                } else if (/(urgence|urgent|grave|alarme)/.test(lowerMsg)) {
                    return aiResponses["urgence"];
                } else if (/(recherche|étude|publication|donnée)/.test(lowerMsg)) {
                    return aiResponses["recherche"];
                } else {
                    return aiResponses["default"];
                }
            }

            // Événements
            sendBtn.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') sendMessage();
            });

            // Gestion des téléchargements de documents
            document.querySelectorAll('.document-card button').forEach(button => {
                button.addEventListener('click', function() {
                    const docType = this.parentElement.querySelector('i').className.includes('pdf') ? 'PDF' :
                                   this.parentElement.querySelector('i').className.includes('image') ? 'Image' : 'Ordonnance';
                    alert("Simulation : Telechargement du document (${docType}) démarré");
                });
            });

            // Simulation de recherche de patient
            document.querySelector('.search-box button').addEventListener('click', function() {
                const query = document.querySelector('.search-box input').value;
                if (query) {
                    addAIMessage(`Résultats de recherche pour "${query}" :\n• Patient 1 : Jean Dupont (ID: 123)\n• Patient 2 : Marie Martin (ID: 456)`);
                }
            });
        });
   