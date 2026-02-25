

// Code pour la page dashboard-patient.html
document.addEventListener("DOMContentLoaded", async () => {
    const patientId = localStorage.getItem("patientId");
    // Vérifie si l'utilisateur est connecté
    console.log("ID du patient récupéré depuis localStorage:", patientId);
    if (!patientId) {
        alert("Vous devez vous connecter !");
        window.location.href = "login.html";
        return;
    }
    try {
        // Récupération des infos du patient via l'API
        const response = await fetch(`http://localhost:5103/api/Patient/${patientId}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données du patient");
        }     
        const patient = await response.json();
        console.log(patient);
        console.log("ID récupéré depuis localStorage:", patientId); // Ajoutez cette ligne
        // Affiche les données dans la page
        afficherPatient(patient);
    } catch (error) {
        console.error("Erreur :", error);
        alert("Impossible de charger les informations du patient.");
    }
});
/**
 * Affiche les données du patient dans le dashboard
 * @param {Object} patient - Données du patient
 */
function afficherPatient(patient) {
    // On vérifie que les balises existent avant de remplir
    const nomElem = document.getElementById("Sexe-patient");
    const nomChat = document.getElementById("nom-chat");
    const prenomElem = document.getElementById("patient_nom");
     const dateNaissanceElem = document.getElementById("dateNaissance");
    const sexeElem = document.getElementById("sexe");
    const paysElem = document.getElementById("pays");
    const groupSanguinElem = document.getElementById("Groupsanguin");
    const AllergieElem = document.getElementById("Allergies");
    const TraitementElem = document.getElementById("Traitements");
    const antecedentsElem = document.getElementById("antecedants");
    const profilPictureElem = document.getElementById("patient_avatar");
    if (nomElem) nomElem.textContent = patient.nom|| "Nom inconnu";
    if (prenomElem) prenomElem.textContent = patient.prenom+" "+patient.nom  || "Prénom inconnu";
    if (nomChat) nomChat.textContent = patient.prenom+" "+ patient.nom || "Patient";
    if( dateNaissanceElem && patient.dateNaissance) {
        dateNaissanceElem.textContent = formatDate(patient.dateNaissance);
    }
    if (sexeElem) sexeElem.textContent = patient.sexe || "Sexe inconnu";
    if (paysElem && patient.adresse) {
        paysElem.textContent = patient.adresse.pays || "Pays inconnu";
    }
    if (groupSanguinElem && patient.profilMedical) {
        groupSanguinElem.textContent = patient.profilMedical.groupSanguin || "Groupe sanguin inconnu";
    }
    if (AllergieElem && patient.profilMedical) {
        AllergieElem.textContent ="Allergies:"+ patient.profilMedical.allergies ? patient.profilMedical.allergies.join(', ') : "Aucune allergie";
    }
    if (TraitementElem && patient.profilMedical) {
        TraitementElem.textContent = patient.profilMedical.traitements ? patient.profilMedical.traitements.join(', ') : "Aucun traitement";
    }
    if (antecedentsElem && patient.profilMedical) {
        antecedentsElem.textContent = patient.profilMedical.antecedents ? patient.profilMedical.antecedents.join(', ') : "Aucun antécédent";
    }
    if (profilPictureElem && patient.profilMedical.profilePath) {
        profilPictureElem.src = patient.profilMedical?.profilePath;
    }
}

/**
 * Formate une date en format lisible
 * @param {string} dateISO - Date au format ISO (ex: "1990-05-14T00:00:00")
 * @returns {string} - Date formatée en "14/05/1990"
 */
function formatDate(dateISO) {
    if (!dateISO) return null;
    const date = new Date(dateISO);
    return date.toLocaleDateString("fr-FR");
}
 

  //  Bouton dashboard
    const btnDashboard = document.getElementById('Dashboard');
    if (btnDashboard) {
        btnDashboard.addEventListener('click', () => {
            window.location.href = 'dashboard-patient.html';
        });
    }

 const btn_prendre_rdv=document.getElementById("btn-prendre-rdv");
 if(btn_prendre_rdv){
    btn_prendre_rdv.addEventListener('click',async()=>{
        try{
            const Prendre_rdv=await fetch("Prendre-rdv.html").then(res =>{

                if(!res) throw new Error("Erreur lors du chargement de Prendre-rdv.html")
                return res.text();    
            });
                document.getElementById('main-content').innerHTML = Prendre_rdv; 
           
            // Récupérer tous les médecins

            // Attendre un peu pour s'assurer que le DOM est mis à jour
            await new Promise(resolve => setTimeout(resolve, 0));

            // Appeler la fonction pour récupérer et afficher les praticiens
            await GetAllPraticiens();
            
                    

        }catch(err){
                console.error("Erreur lors du chargement du fichier profil.html:", err);
             document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement du Rendez Vous.</p>'; return;
        }

             // Fonction pour récupérer et afficher tous les praticiens
            async function GetAllPraticiens() {
                try {
                    const responses = await fetch(`http://localhost:5103/api/Praticien`);
                    if (!responses.ok) throw new Error("Erreur lors de la récupération des praticiens");

                    const medecins = await responses.json();
                    console.log(medecins);

                    // Vérification que l'élément select existe
                    const medecinSelect = document.getElementById("medecin");
                    if (!medecinSelect) {
                        console.error("L'élément select pour les médecins n'a pas été trouvé.");
                        return;
                    }

                    // Ajout des options pour chaque médecin
                    medecins.forEach(medecin => {
                        const option = document.createElement("option");
                        option.value = medecin.idPraticien;
                        option.textContent = `${medecin.specialite}  ${medecin.nom} ${medecin.prenom} `;
                        medecinSelect.appendChild(option);
                    });

                } catch (error) {
                    console.error("Erreur lors de la récupération des praticiens:", error);
                }
            }
            // Gestion de la soumission du formulaire de prise de rendez-vous
            const rdvForm = document.getElementById('rdvForm');
            if (rdvForm) {
                rdvForm.addEventListener('submit', async (event) => {
                    event.preventDefault(); // Empêche le rechargement de la page
                    const patientId = localStorage.getItem('patientId');
                    if (!patientId) {
                        alert("Vous devez vous connecter !");
                        window.location.href = "login.html";
                        return;
                    }
                    const medecinId = document.getElementById('medecin').value;
                    const dateHeure = document.getElementById('date').value;
                    if (!medecinId || !dateHeure) {
                        alert("Veuillez remplir tous les champs.");
                        return;
                    }
                    try {
                        const response = await fetch(`http://localhost:5103/api/RendezVous`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                patientId: patientId,
                                praticienId: medecinId,
                                dateHeure: dateHeure,
                            })
                        });    

                        if (!response.ok) throw new Error("Erreur lors de la prise de rendez-vous");

                        alert("Rendez-vous pris avec succès !");

                    } catch (error) {
                        console.error("Erreur lors de la prise de rendez-vous :", error);
                        alert("Impossible de prendre le rendez-vous.");
                        return;
                    }
                   
              
            });

        }
    });

     
 }

    //  Bouton déconnexion
    const btnDeconnexion = document.getElementById('btnDeconnexion');
    if (btnDeconnexion) {
        btnDeconnexion.addEventListener('click', () => {
            localStorage.removeItem('patientId');
            window.location.href = 'login.html';
        });
    }
 

// Gestion de la soumission du formulaire de profil
const btnProfil = document.getElementById('btnProfil');
if (btnProfil) {
btnProfil.addEventListener('click', async () => { // Charger le contenu HTML de profil 

    window.location.href = 'profil.html';

        });

        
       
        
        
     
}


    // Gestion du bouton de rendez-vous
    const btnRdv = document.getElementById('rdv');
    if (btnRdv) {
        btnRdv.addEventListener('click', async () => { // Charger le contenu HTML de rdv
         try { 
        const profilHTML = await fetch('rdv.html').then(res => {
         if (!res.ok) throw new Error("Erreur de chargement du fichier rdv.html");
          return res.text(); }); document.getElementById('main-content').innerHTML = profilHTML; 
          console.log("Chargement des rendez vous ...");
 

          patientId=localStorage.getItem('patientId');
          if (!patientId) {
            alert("Vous devez vous connecter !");
            window.location.href = "login.html";
            return; 
          }
            // Charger les rendez-vous du patient
            try {
                const response = await fetch(`http://localhost:5103/api/Patient/Rendezvous${patientId}`);
                if (!response.ok) throw new Error("Erreur lors de la récupération des rendez-vous");
                const rdvs = await response.json();
                afficherRendezVous(rdvs);

                console.log("Rendez-vous chargés:", rdvs);
            } catch (error) {
                console.error("Erreur lors de la récupération des rendez-vous :", error);
                alert("Impossible de charger les rendez-vous.");
            }



function afficherRendezVous(rdvs) {
    const tableBody = document.getElementById("rdvTable");

    // Si la table n’existe pas encore (par ex. si rdv.html pas chargé)
    if (!tableBody) {
        console.error("Le tableau rdvTable est introuvable dans rdv.html !");
        return;
    }

    // Réinitialiser le contenu
    tableBody.innerHTML = "";

    if (!rdvs || rdvs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="padding:12px; text-align:center; color:#888;">
                    Aucun rendez-vous trouvé.
                </td>
            </tr>`;
        return;
    }

    // Remplir le tableau avec les données
    rdvs.forEach((rdv, index) => {
        const row = document.createElement("tr");
        const dateHeure = new Date(rdv.dateHeure);
        row.innerHTML = `
            <td style="padding:10px;">${index + 1}</td>
            <td style="padding:10px;">
                ${dateHeure.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) || ""}
            </td>
            <td style="padding:10px;">${rdv.duree || "—"}</td>
            <td style="padding:10px;">${rdv.typeRDV || "Consultation"}</td>
            <td style="padding:10px;">
                ${rdv.praticien?.nom || "Inconnu"} ${rdv.praticien?.prenom || ""}
                <br><small style="color:#666;">${rdv.praticien?.specialite || ""}</small>
            </td>
            <td style="padding:10px;">${rdv.paiement || "Non payé"}</td>
            <td style="padding:10px; font-weight:bold; color:${
                rdv.etatRdv === "Confirme" ? "green" : rdv.etatRdv === "Annule" ? "red" : rdv.etatRdv==="Programme" ? "blue" :rdv.etatRdv==="Reporte" ? "orange" : "black"
            };">
                ${rdv.etatRdv || "En attente"}
            </td>
                <td style="padding:10px; text-align:left;">
                    <!-- Bouton Annuler en rouge -->
                    <button class="btn btn-danger" id="annuler-${rdv.idRdv}" style="color:#e74c3c;  border-radius: 4px; padding: 5px 10px; font-size: 14px; background-color:#e74c3c; border-color: #f5c6cb; color: white;">
                        Annuler
                    </button>
                    <!-- Bouton Reporter en orange -->
                    <button class="btn btn-warning" id="reporter-${rdv.idRdv}" style="color:#f39c12;   border-radius: 4px; padding: 5px 10px; font-size: 14px; background-color: #f39c12; border-color: #f5c6cb;color: white;">
                        Reporter
                    </button>
                </td>
        `;
 
        tableBody.appendChild(row);
        
    });

    // Ajout des gestionnaires d'événement pour tous les boutons Reporter
    rdvs.forEach((rdv) => {
        const reporterBtn = document.getElementById(`reporter-${rdv.idRdv}`);
        const annulerBtn = document.getElementById(`annuler-${rdv.idRdv}`);
        if (annulerBtn) {
            annulerBtn.addEventListener('click', async function() {
                if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
                    try {
                        const response = await fetch(`http://localhost:5103/api/RendezVous/${rdv.idRdv}/annuler`, {
                            method: 'PATCH', // Utiliser PATCH pour annuler un rendez-vous
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });
                        if (!response.ok) throw new Error("Erreur lors de l'annulation du rendez-vous");
                        alert("Rendez-vous annulé avec succès.");
                        window.location.reload(); // Recharger la page pour mettre à jour la liste
                    } catch (error) {
                        console.error("Erreur lors de l'annulation du rendez-vous :", error);
                        alert("Impossible d'annuler le rendez-vous.");
                    }
                }
            });
        }

        if (reporterBtn) {
            reporterBtn.addEventListener('click', function() {
                const calendar = document.getElementById('calendarContainer');
                if (calendar) {
                    calendar.style.display = 'block';
                    // Optionnel : stocker l'ID du rendez-vous à reporter
                    calendar.setAttribute('data-rdv-id', rdv.idRdv);
                   document.addEventListener("click", function(event) {
                        if (!calendar.contains(event.target) && !event.target.classList.contains('btn-warning')) {
                            calendar.style.display = 'none'; // Fermer le calendrier si on clique en dehors
                        }

                });
                }

                const saveBtn = document.getElementById('saveNewDateTime');

            if (saveBtn) {
                saveBtn.addEventListener('click', async function() {
                    const calendar = document.getElementById('calendarContainer');
                    const newDateInput = document.getElementById('newDateTime');

                    if (calendar && newDateInput) {
                        const rdvId = calendar.getAttribute('data-rdv-id'); // l'ID stocké
                        const newDateTime = newDateInput.value; // valeur choisie par l'utilisateur

                        if (!newDateTime) {
                            alert("Veuillez choisir une nouvelle date et heure !");
                            return;
                        }

                        console.log("Nouvelle date :", newDateTime, "pour RDV :", rdvId);

                        try {
                            const response = await fetch(`http://localhost:5103/api/RendezVous/${rdvId}/reporter`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ nouvelleDateHeure: newDateTime })
                            });

                            if (response.ok) {
                                alert("Rendez-vous reporté avec succès !");
                                calendar.style.display = "none"; // masquer le calendrier
                                  window.location.reload(); // Recharger la page pour mettre à jour la liste
                            } else {
                                alert("Erreur lors du report du rendez-vous !");
                            }
                        } catch (error) {
                            console.error("Erreur réseau :", error);
                            alert("Impossible de contacter le serveur.");
                        }
                    }
                });
            }


            });
        }
    });
}




         } 
         catch (err) {
             console.error("Erreur lors du chargement du fichier profil.html:", err);
             document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement du profil.</p>'; return;
             
        }
         
    
    
        }   
         );}

// Configuration API
    const API_CONFIG = {
        url: "http://localhost:8000",
        endpoint: "/diagnose",
        timeout: 15000
    };

// Sélecteurs (utilise vos IDs exacts)
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const nomChatElement = document.getElementById('nom-chat');

// État du typing indicator
let isTyping = false;

// Initialiser le message avec le nom du patient
function initializeChat() {
    const patientName = nomChatElement?.textContent || "Patient";
    // Le message initial est déjà dans votre HTML, on le personnalise juste si besoin
}

if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
        const chatInput = userInput.value.trim();
        
        if (!chatInput) {
            alert("Veuillez décrire vos symptômes.");
            return;
        }
        if (chatInput.length < 5) {
            alert("Veuillez décrire vos symptômes plus en détail (minimum 5 caractères).");
            return;
        }

        // Afficher message utilisateur
        addMessage("Vous", chatInput, "user-message");
        userInput.value = "";
        
        // Afficher "typing" indicator
        showTypingIndicator();
        
        try {
            const response = await fetch(`${API_CONFIG.url}${API_CONFIG.endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptoms: chatInput,
                    num_recommendations: 5
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Erreur ${response.status}: ${errorData.detail || response.statusText}`);
            }

            const data = await response.json();
            
            // Cacher typing indicator
            hideTypingIndicator();
            
            // Formater et afficher la réponse
            if (data.success && data.recommendations && data.recommendations.length > 0) {
                const patientName = nomChatElement?.textContent || "Patient";
                const botReply = formatMedicalResponse(data, patientName);
                addMessage("Dr. Assistant", botReply, "ai-message");
            } else {
                addMessage("Dr. Assistant", "Je n'ai pas pu identifier de spécialité adaptée. Essayez de décrire vos symptômes différemment.", "ai-message");
            }

        } catch (error) {
            console.error("❌ Erreur API:", error);
            hideTypingIndicator();
            const errorMsg = `
                <div class="error-message">
                    <strong>⚠️ Erreur de connexion</strong><br>
                    ${error.message}<br><br>
                    <small>Vérifiez que l'API tourne sur ${API_CONFIG.url}</small>
                </div>
            `;
            addMessage("Système", errorMsg, "ai-message");
        }
    });

    // Envoi avec Enter (sans Shift)
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });
}

/**
 * Formate la réponse médicale de manière conversationnelle
 */
function formatMedicalResponse(data, patientName) {
    let response = `
        <div style="margin-bottom: 15px;">
            <strong>🩺 ${patientName}, voici mon analyse de vos symptômes :</strong><br>
            <em style="color: #666; font-size: 0.9rem;">"${data.symptoms_analyzed}"</em>
        </div>
        
        <div style="margin-bottom: 15px;">
            D'après ce que vous me décrivez, je vous recommande de consulter :
        </div>
    `;

    // Cartes des spécialités
    data.recommendations.forEach(rec => {
        const priorityEmoji = rec.priority === 'haute' ? '🔴' : rec.priority === 'moyenne' ? '🟡' : '🟢';
        
        response += `
            <div class="specialty-card priority-${rec.priority}">
                <div class="confidence-badge">${rec.confidence}</div>
                <strong>${priorityEmoji} ${rec.rank}. ${rec.specialty}</strong>
                <div style="margin-top: 8px; font-size: 0.9rem; color: #555;">
                    <strong>Priorité :</strong> ${rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}<br>
                    <strong>Symptômes détectés :</strong> 
                    ${rec.matching_symptoms.length > 0 
                        ? rec.matching_symptoms.map(s => `<span class="symptoms-highlight">${s}</span>`).join(', ')
                        : '<em>Aucun symptôme spécifique détecté</em>'
                    }<br>
                    <strong>Description :</strong> ${rec.description}
                </div>
            </div>
        `;
    });

    // Disclaimer médical
    response += `
        <div class="disclaimer">
            <strong>⚠️ Avertissement important :</strong><br>
            ${data.disclaimer}
        </div>
    `;

    return response;
}

/**
 * Affiche l'indicator "est en train d'écrire"
 */
function showTypingIndicator() {
    if (isTyping) return; // Éviter les doublons
    
    isTyping = true;
    const typingDiv = document.createElement("div");
    typingDiv.className = "message ai-message";
    typingDiv.id = "typing-indicator";
    typingDiv.innerHTML = `
        <div class="message-header">
            <i class="fas fa-robot"></i>
            <span><strong>Dr. Assistant</strong></span>
        </div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Cache l'indicator "est en train d'écrire"
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

/**
 * Ajoute un message dans le chat (respecte votre structure HTML)
 */
function addMessage(sender, text, cssClass) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${cssClass}`;
    
    // Structure exacte de votre HTML
    messageDiv.innerHTML = `
        <div class="message-header">
            <i class="fas ${sender === 'Vous' ? 'fa-user-circle' : 'fa-robot'}"></i>
            <span><strong>${sender}</strong></span>
        </div>
        <div class="message-content">${text}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialiser le chat au chargement
initializeChat();
// Gestion du bouton document Pour le telechargement des ordonnances et comptes rendus
const idPatient = localStorage.getItem('patientId');   // à récupérer dans le JWT, l'URL, etc.

const btn_document=document.getElementById('document');

if(btn_document){
    btn_document.addEventListener('click',async()=>{
        try { 
            const documentHTML = await fetch('document.html').then(res => {
                if (!res.ok) throw new Error("Erreur de chargement du fichier document.html");
                return res.text();
            });
            document.getElementById('main-content').innerHTML = documentHTML;
            console.log("Chargement des documents ...");
            await new Promise(resolve => setTimeout(resolve, 100)); // Attendre que le DOM soit mis à jour
            await loadOrdonnances();  // Appeler la fonction pour charger les ordonnances
  // Code pour document.html
 

            /* 1. Chargement de la liste des ordonnances */
      async function loadOrdonnances() {
        try {
          const res = await fetch(`http://localhost:5103/api/Ordonnance/${idPatient}/Patient`);
          if (!res.ok) throw new Error("Erreur réseau");
          const liste = await res.json();
          console.log(liste);

          const grid = document.getElementById('ordoGrid');
          grid.innerHTML = '';          // vide l'ancien contenu

            /* 2. Génération + téléchargement du PDF */
      async function genererPDF(idDoc) {
        try {
          const res = await fetch(`http://localhost:5103/api/Ordonnance/${idDoc}/download`, {
            method: 'GET',
            headers: { 'Accept': 'application/pdf' }
          });
          if (!res.ok) throw new Error("Génération impossible");

          const blob = await res.blob();                 // bytes du PDF
          const url  = window.URL.createObjectURL(blob);
          const a    = document.createElement('a');
          a.href     = url;
          a.download = `Ordonnance_${idDoc}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } catch (e) {
          alert("Erreur lors de la création du PDF.");
        }
      }



          liste.forEach(ordo => {
            const card = document.createElement('div');
            console.log(ordo);
            card.className = 'document-card';
            card.innerHTML = `
              <i class="fas fa-file-prescription" style="color:#2f8f6f;"></i>
              <span>Ordonnance du ${new Date(ordo.dateCreation).toLocaleDateString()}</span>
              <button  id="btn-download-${ordo.idDocument}">
                <i class="fa fa-download" ></i> Générer le PDF
              </button>
            `;
            grid.appendChild(card);

            // Ajouter l'événement de clic pour le bouton de téléchargement
            const downloadBtn = document.getElementById(`btn-download-${ordo.idDocument}`);
            downloadBtn.addEventListener('click', () => genererPDF(ordo.idDocument));

          });
        } catch (e) {
          console.error(e);
          alert("Impossible de charger les ordonnances.");
        }
      }

      

      /* 3. Au chargement de la page */
      document.addEventListener('DOMContentLoaded', loadOrdonnances);


        }
        catch (err) {
            console.error("Erreur lors du chargement du fichier document.html:", err);
            document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement des documents.</p>'; return;
        }
    });
}






// Prendre rendez vous 

       
       

         