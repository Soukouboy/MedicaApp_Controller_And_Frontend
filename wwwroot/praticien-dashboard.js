
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

                // --- Ajout dynamique : barre de filtres (Jour / Semaine / Mois / Tous)
                // Insérer en haut de la zone main-content si elle n'existe pas encore
                if (!document.getElementById('rdvFilterBar')) {
                    const filterBar = document.createElement('div');
                    filterBar.id = 'rdvFilterBar';
                    // aligner les boutons au centre et descendre la barre d'1cm pour un meilleur espacement
                    filterBar.style.cssText = 'display:flex; gap:12px; align-items:center; padding:14px 0; margin-top:50px; margin-bottom:30px; justify-content:center; width:50%;';

                    const ranges = [
                        {key: 'day', label: "Aujourd'hui"},
                        {key: 'week', label: 'Cette semaine'},
                        {key: 'month', label: 'Ce mois'},
                        {key: 'all', label: 'Tous'}
                    ];

                    ranges.forEach(r => {
                        const btn = document.createElement('button');
                        btn.className = 'rdv-filter-btn';
                        btn.dataset.range = r.key;
                        btn.textContent = r.label;
                        // style par défaut (vert du site)
                        btn.style.cssText = 'background: linear-gradient(90deg,#1f6f54 60%, #2f8f6f 100%); color:#fff; border:none; padding:8px 14px; border-radius:10px; cursor:pointer; transition: transform 0.08s, box-shadow 0.12s;';
                        // hover effect
                        btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-2px) scale(1.02)'; btn.style.boxShadow = '0 6px 18px rgba(31,111,84,0.12)'; });
                        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; btn.style.boxShadow = ''; });
                        // active visual for 'all' by default
                        if (r.key === 'all') btn.classList.add('active');
                        filterBar.appendChild(btn);
                    });

                    // Try to place the filter bar on the same line as the section title 'Mes Rendez-vous'
                    const sectionHeader = mainContent.querySelector('.patient-overview h2');
                    if (sectionHeader) {
                        // Create a wrapper that places the title at left and filters at right on the same line
                        const wrapper = document.createElement('div');
                        wrapper.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:16px; width:100%; margin-bottom:6px;';

                        // Move the existing header into the wrapper
                        sectionHeader.parentNode.insertBefore(wrapper, sectionHeader);
                        wrapper.appendChild(sectionHeader);
                        wrapper.appendChild(filterBar);
                    } else {
                        // Fallback: insert at top of mainContent
                        mainContent.insertBefore(filterBar, mainContent.firstChild);
                    }
                }

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
                    // Stocker et afficher
                    window.praticienRdvs = Array.isArray(rdvs) ? rdvs.slice() : [];
                    afficherRendezVous(rdvs);
                    console.log("Rendez-vous chargés:", rdvs);

                    // Attacher le comportement des boutons de tri (ils ont été ajoutés dynamiquement au-dessus)
                    const filterBtns = document.querySelectorAll('#rdvFilterBar .rdv-filter-btn');
                    if (filterBtns && filterBtns.length) {
                        // utilitaires
                        function rdvWithinRange(dateStr, range) {
                            if (!dateStr) return false;
                            const d = new Date(dateStr);
                            const now = new Date();
                            if (range === 'day') return d.toDateString() === now.toDateString();
                            if (range === 'week') {
                                const monday = new Date(now);
                                const day = (now.getDay() + 6) % 7;
                                monday.setDate(now.getDate() - day);
                                monday.setHours(0,0,0,0);
                                const sunday = new Date(monday);
                                sunday.setDate(monday.getDate() + 6);
                                sunday.setHours(23,59,59,999);
                                return d >= monday && d <= sunday;
                            }
                            if (range === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                            return true;
                        }

                        function applyRdvFilter(range) {
                            const base = Array.isArray(window.praticienRdvs) ? window.praticienRdvs : [];
                            const filtered = base.filter(r => range === 'all' ? true : rdvWithinRange(r.dateHeure || r.date || r.dateRDV, range));
                            try { afficherRendezVous(filtered); } catch (e) { console.error(e); }
                        }

                        // Attach events and dynamic styling
                        filterBtns.forEach(btn => {
                            // click handler
                            btn.addEventListener('click', (ev) => {
                                filterBtns.forEach(b => {
                                    b.classList.remove('active');
                                    // reset style
                                    b.style.background = 'linear-gradient(90deg,#1f6f54 60%, #2f8f6f 100%)';
                                    b.style.boxShadow = '';
                                });
                                const cur = ev.currentTarget;
                                cur.classList.add('active');
                                // active style
                                cur.style.background = 'linear-gradient(90deg,#144f3e 60%, #1f7a56 100%)';
                                cur.style.boxShadow = '0 8px 22px rgba(20,79,62,0.18)';
                                const range = cur.dataset.range || 'all';
                                applyRdvFilter(range);
                            });
                            // keyboard accessibility: allow Enter key
                            btn.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') btn.click(); });
                        });
                    }

                    // --- Ajout : stockage et filtres pour les rendez-vous (jour / semaine / mois / tous)
                    try {
                        // Conserver les rendez-vous chargés pour filtres ultérieurs
                        // window.praticienRdvs = Array.isArray(rdvs) ? rdvs.slice() : [];

                        // // Crée une barre de filtres simple (si elle n'existe pas déjà)
                        // if (!document.getElementById('rdvFilters')) {
                        //     const filters = document.createElement('div');
                        //     filters.id = 'rdvFilters';
                        //     filters.style.cssText = 'display:flex; gap:8px; margin:12px 0;';
                            

                        //     // Inserer au-dessus du tableau de rdv si possible
                        //     const table = document.getElementById('rdvTable');
                        //     if (table && table.parentNode) {
                        //         table.parentNode.insertBefore(filters, table.parentNode.firstChild);
                        //     } else {
                        //         // Sinon insérer dans main-content
                        //         if (mainContent) mainContent.insertBefore(filters, mainContent.firstChild);
                        //     }
                        // }

                        // // Fonction utilitaire pour vérifier si une date est dans une plage
                        // function rdvWithinRange(dateStr, range) {
                        //     if (!dateStr) return false;
                        //     const d = new Date(dateStr);
                        //     const now = new Date();
                        //     if (range === 'day') {
                        //         return d.toDateString() === now.toDateString();
                        //     }
                        //     if (range === 'week') {
                        //         // semaine commençant le lundi
                        //         const monday = new Date(now);
                        //         const day = (now.getDay() + 6) % 7; // 0=Monday
                        //         monday.setDate(now.getDate() - day);
                        //         monday.setHours(0,0,0,0);
                        //         const sunday = new Date(monday);
                        //         sunday.setDate(monday.getDate() + 6);
                        //         sunday.setHours(23,59,59,999);
                        //         return d >= monday && d <= sunday;
                        //     }
                        //     if (range === 'month') {
                        //         return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                        //     }
                        //     return true;
                        // }

                        // // Appliquer un filtre et ré-afficher
                        // function applyRdvFilter(range) {
                        //     const base = Array.isArray(window.praticienRdvs) ? window.praticienRdvs : [];
                        //     const filtered = base.filter(r => range === 'all' ? true : rdvWithinRange(r.dateHeure || r.date || r.dateRDV, range));
                        //     // Réutilise la fonction existante d'affichage
                        //     try {
                        //         afficherRendezVous(filtered);
                        //     } catch (e) {
                        //         console.error('Erreur lors du rendu des rdv filtrés', e);
                        //     }
                        // }

                        // Attacher les listeners aux boutons de filtres
                        document.querySelectorAll('.rdv-filter-btn').forEach(btn => {
                            btn.addEventListener('click', (ev) => {
                                document.querySelectorAll('.rdv-filter-btn').forEach(b => b.classList.remove('active'));
                                ev.currentTarget.classList.add('active');
                                const range = ev.currentTarget.dataset.range || 'all';
                                applyRdvFilter(range);
                            });
                        });

                    } catch (filterErr) {
                        console.error('Erreur lors de l' + "" + 'initialisation des filtres de rdv', filterErr);
                    }
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
                                localStorage.setItem('rdvId', rdv.idRdv);
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
    

btn_patients= document.getElementById("btn-patient");

if(btn_patients){
    btn_patients.addEventListener('click',()=>{

        window.location.href='Liste-patient-medecin.html';
    });
}

/*
  Fonction Trie
  - Définit les utilitaires de filtrage des rendez-vous (jour / semaine / mois / tous)
  - S'attache aux boutons de filtre si l'élément #rdvFilters est présent
  - Utilise `window.praticienRdvs` comme source des rendez-vous et réutilise
    la fonction existante `afficherRendezVous` pour l'affichage filtré.
  NOTE: la fonction est idempotente et n'ajoute pas de listeners plusieurs fois.
// */
// function Trie() {
//     // utilitaire pour vérifier une date dans une plage
//     function rdvWithinRange(dateStr, range) {
//         if (!dateStr) return false;
//         const d = new Date(dateStr);
//         const now = new Date();
//         if (range === 'day') {
//             return d.toDateString() === now.toDateString();
//         }
//         if (range === 'week') {
//             // semaine commençant le lundi
//             const monday = new Date(now);
//             const day = (now.getDay() + 6) % 7; // 0=Monday
//             monday.setDate(now.getDate() - day);
//             monday.setHours(0,0,0,0);
//             const sunday = new Date(monday);
//             sunday.setDate(monday.getDate() + 6);
//             sunday.setHours(23,59,59,999);
//             return d >= monday && d <= sunday;
//         }
//         if (range === 'month') {
//             return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
//         }
//         return true;
//     }

//     // applique le filtre et ré-affiche en appelant la fonction existante
//     function applyRdvFilter(range) {
//         const base = Array.isArray(window.praticienRdvs) ? window.praticienRdvs : [];
//         const filtered = base.filter(r => range === 'all' ? true : rdvWithinRange(r.dateHeure || r.date || r.dateRDV, range));
//         try {
//             if (typeof afficherRendezVous === 'function') {
//                 afficherRendezVous(filtered);
//             } else {
//                 console.warn('afficherRendezVous non trouvé — impossible d\'afficher les rdv filtrés.');
//             }
//         } catch (e) {
//             console.error('Erreur lors du rendu des rdv filtrés', e);
//         }
//     }

//     // attache les listeners aux boutons de filtre si pas déjà attachés
//     function attachFiltersIfPresent() {
//         const filters = document.getElementById('rdvFilters');
//         if (!filters) return false;
//         if (filters.dataset.rdvListenersAttached === 'true') return true; // déjà attaché

//         const buttons = filters.querySelectorAll('.rdv-filter-btn');
//         buttons.forEach(btn => {
//             btn.addEventListener('click', (ev) => {
//                 buttons.forEach(b => b.classList.remove('active'));
//                 ev.currentTarget.classList.add('active');
//                 const range = ev.currentTarget.dataset.range || 'all';
//                 applyRdvFilter(range);
//             });
//         });

//         // marque comme attaché pour éviter doublons
//         filters.dataset.rdvListenersAttached = 'true';
//         return true;
//     }

//     // Première tentative d'attachement immédiat
//     const attachedNow = attachFiltersIfPresent();
//     if (!attachedNow) {
//         // Si l'élément n'existe pas encore (chargement dynamique), observer le DOM
//         const obs = new MutationObserver((mutations, observer) => {
//             if (attachFiltersIfPresent()) {
//                 observer.disconnect();
//             }
//         });
//         obs.observe(document.body, { childList: true, subtree: true });
//     }
// }

// // Expose la fonction globalement pour pouvoir l'appeler depuis la console si besoin
