document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

     
        try {
            const response = await fetch("http://localhost:5103/api/Admin/authenticate", {
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
            const Admin = await response.json();
            // Stocker l'ID dans le localStorage pour l'utiliser après
            localStorage.setItem("adminId", Admin.id);
              console.log("Réponse du serveur:", Admin);
            console.log("ID de l'administrateur:", Admin.id); // Ajoutez cette ligne pour vérifier l'ID
           window.location.href = "admin_dashboard.html";
          
        } catch (error) {
            console.error("Erreur :", error);
            alert("Une erreur est survenue lors de la connexion.");
        }
     
});
