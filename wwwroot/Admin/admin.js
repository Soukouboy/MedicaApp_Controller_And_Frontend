document.addEventListener("DOMContentLoaded", function() {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
        console.log("Admin ID récupéré du localStorage :", adminId);
        // Vous pouvez maintenant utiliser adminId pour faire des requêtes spécifiques à l'administrateur
    } else {
        console.log("Aucun Admin ID trouvé dans le localStorage.");
        // Rediriger vers la page de connexion si aucun ID n'est trouvé
        alert("Veuillez vous connecter en tant qu'administrateur.");
        window.location.href = "login_admin.html";
    }
});

function logout() {
    // Supprimer l'ID de l'administrateur du localStorage
    localStorage.removeItem("adminId");
    // Rediriger vers la page de connexion
    window.location.href = "login_admin.html";
}

// Récuperer et afficher les données de l'administrateur
document.addEventListener("DOMContentLoaded", async function() {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
        try {
            const response = await fetch(`http://localhost:5103/api/Admin/${adminId}`);
            if (response.ok) {
                const adminData = await response.json();
                document.getElementById("admin_name").textContent = adminData.nom;;
               // document.getElementById("adminEmail").textContent = adminData.email;

            } else {
                console.error("Erreur lors de la récupération des données de l'administrateur.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête:", error);
        }
    }
});


// Récuperer la liste des praticiens et l'afficher dans un tableau et comptabiliser le nombre total
document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("http://localhost:5103/api/Praticien");
        if (response.ok) {
            const praticiens = await response.json();
            const praticienTableBody = document.getElementById("doctorsTable");
            praticienTableBody.innerHTML = ""; // Clear existing rows
            praticiens.forEach(praticien => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${praticien.idPraticien}</td>
                    <td>${praticien.nom}</td>
                    <td>${praticien.prenom}</td>
                    <td>${praticien.specialite}</td>
                    <td>${praticien.email}</td>
                `;
                praticienTableBody.appendChild(row);
            });
            // Mettre à jour le nombre total de praticiens
            document.getElementById("totalPraticiens").textContent = praticiens.length;
        } else {
            console.error("Erreur lors de la récupération des praticiens.");
        } 
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }

    // Comptabiliser le nombre total de patients
    try {
        const response = await fetch("http://localhost:5103/api/Patient");
        if (response.ok) {
            const patients = await response.json();
            // Mettre à jour le nombre total de patients
          //  document.getElementById("totalPatients").textContent = patients.length;
            console.log("Nombre total de patients :", patients.length);
            document.getElementById("countPatients").textContent = patients.length;
        } else {
            console.error("Erreur lors de la récupération des patients.");
        }
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }

    // Comptabiliser le nombre total de rendez-vous
    try {
        const response = await fetch("http://localhost:5103/api/RendezVous");
        if (response.ok) {
            const rendezVous = await response.json();
            // Mettre à jour le nombre total de rendez-vous
            document.getElementById("countAppointments").textContent = rendezVous.length;

        } else {
            console.error("Erreur lors de la récupération des rendez-vous.");
        }
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
});

const patients=document.getElementById("patients");
const medecins=document.getElementById("medecins");
const appointments=document.getElementById("appointments");

if(patients){
    patients.addEventListener("click",async function(){
        try{
        const main=document.querySelector(".main");
        const pages=await fetch("patients.html");
        const pageContent=await pages.text();
        main.innerHTML=pageContent;

          function formatDate(d){ if(!d) return '—'; const dt=new Date(d); return dt.toLocaleDateString('fr-FR'); }

        // Récupérer et afficher la liste des patients dans le tableau 
        const response = await fetch("http://localhost:5103/api/Patient");
        if (response.ok) {
            const patients = await response.json();
            const patientTableBody = document.getElementById("patientsTable");
            patientTableBody.innerHTML = ""; // Clear existing rows
            patients.forEach((p, i) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                   <td>${i+1}</td>
                 <td><div style="display:flex;align-items:center;gap:10px"><img src="https://ui-avatars.com/api/?name=${encodeURIComponent((p.prenom||'')+' '+(p.nom||''))}&background=2f8f6f&color=fff&rounded=true&size=64" class="avatar"> <div><strong>${(p.prenom||'')+' '+(p.nom||'')}</strong><div style="color:#999;font-size:12px">ID: ${p.idPatient || p.id || '—'}</div></div></div></td>
                <td>${p.email || p.authentification?.email || '—'}</td>
                <td>${p.telephone || p.phone || p.authentification?.num_telephone || '—'}</td>
                <td>${formatDate(p.dateNaissance)}</td>
                 <td class="actions"><button class="view" data-id="${p.idPatient || p.id}">Voir</button><button class="edit" data-id="${p.idPatient || p.id}">Éditer</button></td>
      `;
                patientTableBody.appendChild(row);
            });
        } else {
            console.error("Erreur lors de la récupération des patients.");
        }
    } catch (error) {
            console.error("Erreur lors du chargement de la page des patients :", error);
        }
    });
}

if(medecins){
    medecins.addEventListener("click",function(){
        window.location.href="admin_medecins.html";
    });
}

if(appointments){
    appointments.addEventListener("click",function(){
        window.location.href="admin_appointments.html";
    });
}


document.getElementById("dashboard").addEventListener("click",function(){
    window.location.href="admin_dashboard.html";
});