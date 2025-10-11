
// Code pour la page dashboard-patient.html
document.addEventListener("DOMContentLoaded", async () => {
    const medecinId = localStorage.getItem("medecinId");
    // Vérifie si l'utilisateur est connecté
    console.log("ID du patient récupéré depuis localStorage:", medecinId);
    if (!medecinId) {
        alert("Vous devez vous connecter !");
        window.location.href = "login.html";
        return;
    }
    try {
        // Récupération des infos du patient via l'API
        const response = await fetch(`http://localhost:5103/api/Praticien/${medecinId}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données du patient");
        }
        const medecin = await response.json();
        console.log(medecin);
        console.log("ID récupéré depuis localStorage:", medecinId); // Ajoutez cette ligne
        // Affiche les données dans la page
        afficherPatient(medecin);
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
    const nomElem = document.getElementById("praticien_nom");
    const nomChat = document.getElementById("nom-chat");
     const lieu = document.getElementById("lieu");
    const sexeElem = document.getElementById("sexe");
    const email = document.getElementById("email");
    const num_telephone = document.getElementById("num_telephone");
    const LanguesParlees = document.getElementById("profil_langues");
    const specialite = document.getElementById("specialite");
    if (nomElem) nomElem.textContent = patient.nom + " "+patient.prenom|| "Nom inconnu";
    if (nomChat) nomChat.textContent =  patient.nom || "Patient";
    if (lieu) lieu.textContent = patient.lieuConsultation || "Lieu inconnu";
    if(specialite) specialite.textContent = patient.specialite || "Spécialité inconnue";
    if (email) email.textContent = patient.email || "Email inconnu";
    if (num_telephone) num_telephone.textContent = patient.phone || "Numéro inconnu";
    if (LanguesParlees) LanguesParlees.textContent = patient.languesParlees ? patient.languesParlees.join(', ') : "Aucune langue renseignée";
    if (sexeElem) {
          sexeElem.textContent = sexeTexte;
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
    const btnDashboard = document.getElementById('btn-dashboard');
    if (btnDashboard) {
        btnDashboard.addEventListener('click', () => {
            window.location.href = 'dashboard-patient.html';
        });
    }

 

    //  Bouton déconnexion
    const btnDeconnexion = document.getElementById('btnDeconnexion');
    if (btnDeconnexion) {
        btnDeconnexion.addEventListener('click', () => {
            localStorage.removeItem('medecinId'); // Supprime l'ID du praticien du localStorage
            alert("Vous avez été déconnecté.");
            window.location.href = 'login.html';
        });
    }


    const btnDash= document.getElementById("btn-dashboard");

    if(btnDash){
        btnDash.addEventListener('click',()=>{

            window.location.href='dashboard-medecin.html';
        });
    }

     

    document.addEventListener('DOMContentLoaded', function() {
    const btnRdv = document.getElementById('btn-rdv');
        
    if (btnRdv) {
        btnRdv.addEventListener('click', async () => {
            try {
                const profilHTML = await fetch('rdv_praticien.html').then(res => {
                    if (!res.ok) throw new Error("Erreur de chargement du fichier rdv_medecin.html");
                    return res.text();
                });

                const mainContent = document.getElementById('main-content');
                if (!mainContent) {
                    console.error("L'élément main-content n'a pas été trouvé dans le DOM.");
                    return;
                }

                mainContent.innerHTML = profilHTML;
                console.log("Chargement des rendez-vous...");

                const medecinId = localStorage.getItem('medecinId');
                if (!medecinId) {
                    alert("Vous devez vous connecter !");
                    window.location.href = "login.html";
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:5103/api/Praticien/rendezvous/${medecinId}`);
                    if (!response.ok) throw new Error("Erreur lors de la récupération des rendez-vous");
                    const rdvs = await response.json();
                    afficherRendezVous(rdvs);
                    console.log("Rendez-vous chargés:", rdvs);
                } catch (error) {
                    console.error("Erreur lors de la récupération des rendez-vous :", error);
                    alert("Impossible de charger les rendez-vous.");
                }
            } catch (err) {
                console.error("Erreur lors du chargement du fichier rdv_praticien:", err);
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = '<p>Erreur lors du chargement des rendez-vous.</p>';
                }
                return;
            }

            function afficherRendezVous(rdvs) {
                const tableBody = document.getElementById("rdvTable");
                if (!tableBody) {
                    console.error("Le tableau rdvTable est introuvable dans rdv_praticien.html !");
                    return;
                }

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
                            ${rdv.patient?.nom || "Inconnu"} ${rdv.patient?.prenom || ""}
                            <br><small style="color:#666;">${rdv.patient?.sexe || ""}</small>
                        </td>
                        <td style="padding:10px;">${rdv.paiement || "Non payé"}</td>
                        <td style="padding:10px; font-weight:bold; color:${
                            rdv.etatRdv === "Confirme" ? "green" : rdv.etatRdv === "Annule" ? "red" : rdv.etatRdv==="Programme" ? "blue" : rdv.etatRdv==="Reporte" ? "orange" : "black"
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
                            <button class="btn btn-confirm" id="confirmer-${rdv.idRdv}" style="color:#f39c12;   border-radius: 4px; padding: 5px 10px; font-size: 14px; background-color: #19f312ff; border-color: #f5c6cb;color: white;">
                                Confirmer
                            </button>

                             <button class="btn btn-document" id="document-${rdv.idRdv}" style="color:#f39c12;   border-radius: 4px; padding: 5px 10px; font-size: 14px; background-color: #1234f3ff; border-color: #f5c6cb;color: white;">
                                Docs
                            </button> 
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                rdvs.forEach((rdv) => {
                    const reporterBtn = document.getElementById(`reporter-${rdv.idRdv}`);
                    const annulerBtn = document.getElementById(`annuler-${rdv.idRdv}`);
                    const confirmerBtn = document.getElementById(`confirmer-${rdv.idRdv}`);
                    const documentBtn = document.getElementById(`document-${rdv.idRdv}`);

                    if(documentBtn){
                    documentBtn.addEventListener('click', async function() {
                        try {

                                    const profilHTML = await fetch('page-document.html').then(res => {
                                    if (!res.ok) throw new Error("Erreur de chargement du fichier de création de document");
                                    return res.text();
                                });

                                const mainContent = document.getElementById('main-content');
                                if (!mainContent) {
                                    console.error("L'élément main-content n'a pas été trouvé dans le DOM.");
                                    return;
                                }

                                mainContent.innerHTML = profilHTML;
                                console.log("Chargement des rendez-vous...");                            

                                    
                            }
                            catch (error) {
                                    console.error("Erreur lors de la récupération des documents :", error);
                                    alert("Impossible de charger les documents.");
                                }   
                
                        
                    });
                }

                    if (annulerBtn) {
                        annulerBtn.addEventListener('click', async function() {
                            if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
                                try {
                                    const response = await fetch(`http://localhost:5103/api/RendezVous/${rdv.idRdv}/annuler`, {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                    });
                                    if (!response.ok) throw new Error("Erreur lors de l'annulation du rendez-vous");
                                    alert("Rendez-vous annulé avec succès.");
                                    window.location.reload();
                                } catch (error) {
                                    console.error("Erreur lors de l'annulation du rendez-vous :", error);
                                    alert("Impossible d'annuler le rendez-vous.");
                                }
                            }
                        });
                    }
                    if (confirmerBtn) {
                        confirmerBtn.addEventListener('click', async function() {
                            try {
                                const response = await fetch(`http://localhost:5103/api/RendezVous/${rdv.idRdv}/confirmer`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ praticienId: localStorage.getItem('medecinId') })
                                });
                                if (!response.ok) throw new Error("Erreur lors de la confirmation du rendez-vous");
                                alert("Rendez-vous Confirmé avec succès!!!");
                                window.location.reload();
                            } catch (error) {
                                console.error("Erreur lors de la confirmation du rendez-vous", error);
                                alert("Impossible de confirmer le rendez-vous");
                            }
                        });
                    }

                    if (reporterBtn) {
                        reporterBtn.addEventListener('click', function() {
                            const calendar = document.getElementById('calendarContainer');
                            if (calendar) {
                                calendar.style.display = 'block';
                                calendar.setAttribute('data-rdv-id', rdv.idRdv);

                                document.addEventListener("click", function(event) {
                                    if (!calendar.contains(event.target) && !event.target.classList.contains('btn-warning')) {
                                        calendar.style.display = 'none';
                                    }
                                });
                            }

                            const saveBtn = document.getElementById('saveNewDateTime');
                            if (saveBtn) {
                                saveBtn.addEventListener('click', async function() {
                                    const newDateInput = document.getElementById('newDateTime');
                                    if (calendar && newDateInput) {
                                        const rdvId = calendar.getAttribute('data-rdv-id');
                                        const newDateTime = newDateInput.value;

                                        if (!newDateTime) {
                                            alert("Veuillez choisir une nouvelle date et heure !");
                                            return;
                                        }

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
                                                calendar.style.display = "none";
                                                window.location.reload();
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
    
        });
    }
});
    

