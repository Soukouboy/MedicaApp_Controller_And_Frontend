

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

    if (nomElem) nomElem.textContent = patient.nom || "Nom inconnu";
    if (prenomElem) prenomElem.textContent = patient.prenom || "Prénom inconnu";
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
    try { 
        const profilHTML = await fetch('profil.html').then(res => {
         if (!res.ok) throw new Error("Erreur de chargement du fichier profil.html");
          return res.text(); 
        }); 
          document.getElementById('main-content').innerHTML = profilHTML; 
          console.log("Chargement du profil médical...");
            
         } 
         catch (err) {
             console.error("Erreur lors du chargement du fichier profil.html:", err);
             document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement du profil.</p>'; return;
             
        }

 
        async function loadPatientData(patientId) { 
            try {
                 const response = await fetch(`http://localhost:5103/api/Patient/${patientId}`);
                     if (!response.ok) throw new Error("Erreur lors du chargement des données du patient");
                      const patient = await response.json(); console.log("Données du patient chargées:", patient);
                      localStorage.setItem('password', patient.authentification?.password || ''); // Stocker le mot de passe dans localStorage
                        
                       // Remplir les champs du formulaire avec les données du patient 
                        document.getElementById('nom').value = patient.nom || ''; 
                        document.getElementById('prenom').value = patient.prenom || ''; 
                       //  Convertir la date de naissance au format YYYY-MM-DD pour l'input de type date 
                        const dateNaissance = new Date(patient.dateNaissance); 
                        const formattedDate = dateNaissance.toISOString().split('T')[0];
                         document.getElementById('dateNaissance').value = formattedDate || ''; 
                        document.getElementById('sexe').value = patient.sexe || '';
                         document.getElementById('pays').value = patient.adresse?.pays || ''; 
                       // // Remplir le groupe sanguin 
                        document.getElementById('groupSanguin').value = patient.profilMedical?.groupSanguin || '';
                       //  // Joindre les allergies, traitements, et antécédents en chaînes séparées par des virgules 
                        document.getElementById('allergies').value = patient.profilMedical?.allergies?.join(', ') || '';
                         document.getElementById('antecedents').value = patient.profilMedical?.antecedents?.join(', ') || ''; 
                        document.getElementById('email').value = patient.authentification?.email || ''; 
                        document.getElementById('phone').value = patient.authentification?.num_telephone || ''; 
                        document.getElementById('adresse').value = patient.adresse?.rue || 'Rue inconnue'; 
                        document.getElementById('codePostal').value = patient.adresse?.codePostal || 'Code postal inconnu';
                         document.getElementById('ville').value = patient.adresse?.ville || ' Ville inconnue'; 

              

            }
            catch (err) { 
                            console.error("Erreur lors du chargement des données du patient:", err);
            } 
        } // Charger les données du patient lorsque la page se charge 

        const patientId = localStorage.getItem('patientId'); // Assurez-vous que l'ID du patient est stocké dans localStorage
       
         loadPatientData(patientId); // Charger les données du patient
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

const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages'); // conteneur <div> qui affiche la discussion
const userInput = document.getElementById('user-input'); // champ de saisie utilisateur

if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
        try {
            const chatInput = userInput.value;
            if (!chatInput) {
                alert("Veuillez préciser vos symptômes.");
                return;
            }
            
            // ✅ Afficher le message utilisateur immédiatement
            addMessage("Vous", chatInput, "user-message");
            console.log("Message utilisateur :", chatInput);
            userInput.value = ""; // Effacer le champ de saisie

            
            API_URL="https://d6a8efbab122.ngrok-free.app" // URL de votre backend FastAPI
            // 🔄 Envoyer au backend (FastAPI)
            try {
                  // Appel à l'API
                const response = await fetch(`${API_URL}/analyze`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ symptoms:chatInput }),
                });
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                
              
                
                const data = await response.json();
                const botReply = data.reply || "Désolé, je n’ai pas compris.";

                // ✅ Afficher la réponse du bot dans l’UI
                addMessage("Assistant IA", botReply, "ai-message");

            } catch (error) {
                console.error("Erreur API :", error);
                addMessage("Assistant IA", "⚠️ Impossible de contacter le chatbot.", "ai-message");
            }

        } catch (err) {
            console.error("Erreur JS:", err);
            document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement du chat.</p>';
        }
    });
}

// 🔹 Fonction pour ajouter un message dans le chat
function addMessage(sender, text, cssClass) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${cssClass}`;
    messageDiv.innerHTML = `
        <div class="message-header">
            <i class="${sender === "Vous" ? "fas fa-user-md" : "fas fa-robot"}"></i>
            <span>${sender}</span>
        </div>
        <p>${text}</p>
    `;
    chatMessages.appendChild(messageDiv);

    // Scroll automatique vers le bas
    chatMessages.scrollTop = chatMessages.scrollHeight;
}



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
        }
        catch (err) {
            console.error("Erreur lors du chargement du fichier document.html:", err);
            document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement des documents.</p>'; return;
        }
    });
}

const ordonnance= document.getElementById('ordonnance_pdf');
const doc_ordonnance= document.getElementById('ordonnance_pdf_doc');
if(ordonnance || doc_ordonnance){
    ordonnance.addEventListener('click',async()=>{  
        try{
            const response=await fetch('http://localhost:5103/api/Ordonnance/4/download');
            if(!response.ok) throw new Error("Erreur lors du téléchargement de l'ordonnance");
            const blob=await response.blob();
            const url=window.URL.createObjectURL(blob);
            const a=document.createElement('a');
            a.href=url;
            a.download='ordonnance.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }catch(err){
            console.error("Erreur lors du téléchargement de l'ordonnance:",err);
            alert("Impossible de télécharger l'ordonnance.");
        }
    });
}





// Prendre rendez vous 

       
       

         