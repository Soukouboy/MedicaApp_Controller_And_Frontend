document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (role === "patient") {
        try {
            const response = await fetch("http://localhost:5103/api/Patient/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                document.querySelector(".message").style.display = "block";
                return;
            }

            console.log("Réponse du serveur:", response);
            const patient = await response.json();
            // Stocker l'ID dans le localStorage pour l'utiliser après
            localStorage.setItem("patientId", patient.patientID);
 
            
          

      
         

            console.log("ID du patient:", patient.patientID); // Ajoutez cette ligne pour vérifier l'ID

            // Rediriger vers le dashboard
            window.location.href = "dashboard-patient.html";
        } catch (error) {
            console.error("Erreur :", error);
            alert("Une erreur est survenue lors de la connexion.");
        }
    } else if (role === "praticien") {
        try {
            const response = await fetch("http://localhost:5103/api/Praticien/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                document.querySelector(".message").style.display = "block";
                return;
            }
            const medecin = await response.json();
            // Stocker l'ID dans le localStorage pour l'utiliser après
            localStorage.setItem("medecinId", medecin.idPraticien);
              console.log("Réponse du serveur:", medecin);
            console.log("ID du médecin:", medecin.idPraticien); // Ajoutez cette ligne pour vérifier l'ID
           window.location.href = "dashboard-medecin.html";
          
        } catch (error) {
            console.error("Erreur :", error);
            alert("Une erreur est survenue lors de la connexion.");
        }
    } else {
        alert("Veuillez sélectionner un rôle valide !");
    }
});
