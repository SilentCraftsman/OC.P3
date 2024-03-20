const baseApiUrl = "http://localhost:5678/api/";

document.addEventListener("submit", (e) => {
  e.preventDefault();
  let form = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
  };

  fetch(`${baseApiUrl}users/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    }),
  }).then((response) => {
    if (response.status !== 200) {
      alert("Email ou mot de passe erronés");
    } else {
      response.json().then((data) => {
        sessionStorage.setItem("token", data.token); //STORE TOKEN
        window.location.replace("index.html");
      });
    }
  });
});
document.getElementById("logBtn").addEventListener("click", () => {
  // Effacer le token de session
  sessionStorage.removeItem("token");
  // Rediriger vers la page de connexion
  window.location.replace("index.html");
});
