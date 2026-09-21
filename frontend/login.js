/* =========================================================
   AGROAI LOGIN
   SAVE USER NAME FOR ALL PAGES
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    const passwordInput =
        document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                this.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                this.textContent = "👁";

            }

        });

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        if (!email || !password) {

            alert("Please enter email and password.");

            return;
        }


        try {

            const response = await fetch(
                "http://127.0.0.1:8000/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            console.log("LOGIN RESPONSE:", data);


            /* =============================================
               LOGIN FAILED
            ============================================= */

            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Invalid email or password."
                );

                return;
            }


            /* =============================================
               COMMON LOGIN DATA
            ============================================= */

            localStorage.setItem(
                "agroai_logged_in",
                "true"
            );


            /* =============================================
               ADMIN LOGIN
            ============================================= */

            if (data.role === "admin") {

                localStorage.setItem(
                    "agroai_role",
                    "admin"
                );

                localStorage.setItem(
                    "agroai_user_name",
                    "Admin"
                );

                localStorage.setItem(
                    "agroai_user_email",
                    email
                );

                alert("Admin login successful.");

                window.location.href =
                    "admin.html";

                return;
            }


            /* =============================================
               NORMAL USER LOGIN
            ============================================= */

            localStorage.setItem(
                "agroai_role",
                "user"
            );


            /*
               IMPORTANT:
               Backend returns:

               data.user.name
               data.user.email
               data.user.id
            */

            let userName = "";

            let userEmail = email;


            if (
                data.user &&
                typeof data.user === "object"
            ) {

                if (data.user.name) {

                    userName =
                        String(data.user.name).trim();

                }

                if (data.user.email) {

                    userEmail =
                        String(data.user.email).trim();

                }

            }


            /*
               If backend somehow doesn't return name,
               do NOT save "User" as the actual name.
            */

            if (!userName) {

                console.warn(
                    "User name was not returned by backend."
                );

                userName = "User";

            }


            /* =============================================
               SAVE NAME
            ============================================= */

            localStorage.setItem(
                "agroai_user_name",
                userName
            );


            localStorage.setItem(
                "agroai_user_email",
                userEmail
            );


            console.log(
                "Saved user name:",
                localStorage.getItem(
                    "agroai_user_name"
                )
            );


            alert(
                "Welcome, " + userName + "!"
            );


            window.location.href =
                "index.html";


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Unable to connect to AgroAI server."
            );

        }

    });

});