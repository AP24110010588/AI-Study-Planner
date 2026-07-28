const API_URL = "http://localhost:5000/api";
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const full_name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const college = document.getElementById("college").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name,
                    email,
                    college,
                    password
                })
            });

            const data = await response.json();

            if (data.success) {
                document.getElementById("successModal").style.display = "flex";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Server Error");
        }
    });
}
/* ================================
   LOGIN
================================ */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        try {

   const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            if (data.success) {

                localStorage.setItem("token", data.token);

localStorage.setItem(
    "user",
    JSON.stringify(data.user)
);

                window.location.href = "dashboard.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert("Unable to connect to server.");

        }

    });

}
