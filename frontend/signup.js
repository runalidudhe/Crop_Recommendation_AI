/* =========================================================
   AGROAI SIGNUP
   Design unchanged
   Signup → Backend → Login
   Password Show / Hide
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const signupForm =
        document.getElementById("signupForm");


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    const passwordToggleButtons =
        document.querySelectorAll(".password-toggle");


    passwordToggleButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId =
                button.getAttribute("data-target");

            const passwordInput =
                document.getElementById(targetId);


            if (!passwordInput) {
                return;
            }


            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                button.textContent = "🙈";

                button.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";

                button.textContent = "👁️";

                button.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }

        });

    });


    /* =====================================================
       SIGNUP FORM
    ===================================================== */

    if (!signupForm) {
        return;
    }


    /* Prevent duplicate event listener */

    if (
        signupForm.dataset.initialized === "true"
    ) {
        return;
    }


    signupForm.dataset.initialized = "true";


    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =================================================
               GET INPUT VALUES
            ================================================= */

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            /* =================================================
               NAME VALIDATION
            ================================================= */

            if (name === "") {

                alert(
                    "Please enter your full name."
                );

                return;
            }


            if (name.length < 3) {

                alert(
                    "Name must contain at least 3 characters."
                );

                return;
            }


            const namePattern =
                /^[A-Za-z ]+$/;


            if (!namePattern.test(name)) {

                alert(
                    "Name can contain only letters and spaces."
                );

                return;
            }


            /* =================================================
               EMAIL VALIDATION
            ================================================= */

            if (email === "") {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            /* =================================================
               PASSWORD VALIDATION
            ================================================= */

            if (password === "") {

                alert(
                    "Please enter a password."
                );

                return;
            }


            if (password.length < 8) {

                alert(
                    "Password must contain at least 8 characters."
                );

                return;
            }


            if (!/[A-Z]/.test(password)) {

                alert(
                    "Password must contain at least one uppercase letter."
                );

                return;
            }


            if (!/[a-z]/.test(password)) {

                alert(
                    "Password must contain at least one lowercase letter."
                );

                return;
            }


            if (!/[0-9]/.test(password)) {

                alert(
                    "Password must contain at least one number."
                );

                return;
            }


            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {

                alert(
                    "Password must contain at least one special character."
                );

                return;
            }


            /* =================================================
               CONFIRM PASSWORD
            ================================================= */

            if (confirmPassword === "") {

                alert(
                    "Please confirm your password."
                );

                return;
            }


            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match!"
                );

                return;
            }


            /* =================================================
               DISABLE BUTTON
            ================================================= */

            const signupButton =
                signupForm.querySelector(
                    ".signup-btn"
                );


            if (signupButton) {

                signupButton.disabled = true;

                signupButton.textContent =
                    "Creating Account...";
            }


            /* =================================================
               BACKEND SIGNUP
            ================================================= */

            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:8000/signup",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })
                        }
                    );


                let data = {};


                try {

                    data =
                        await response.json();

                } catch (jsonError) {

                    data = {};
                }


                /* =================================================
                   SUCCESS
                ================================================= */

                if (response.ok) {

                    alert(
                        "Account created successfully! 🎉"
                    );


                    window.location.href =
                        "login.html";


                    return;
                }


                /* =================================================
                   BACKEND ERROR
                ================================================= */

                alert(
                    data.message ||
                    data.detail ||
                    "Account creation failed."
                );

            }


            /* =================================================
               CONNECTION ERROR
            ================================================= */

            catch (error) {

                console.error(
                    "Signup Error:",
                    error
                );


                alert(
                    "Backend se connection nahi ho raha.\n\n" +
                    "Please make sure FastAPI server is running."
                );

            }


            finally {

                if (signupButton) {

                    signupButton.disabled =
                        false;

                    signupButton.textContent =
                        "Create Account →";
                }

            }

        }
    );

});