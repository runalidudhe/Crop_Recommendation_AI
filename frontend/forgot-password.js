/* =========================================================
   AGROAI - FORGOT PASSWORD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const forgotPasswordForm =
        document.getElementById("forgotPasswordForm");

    const newPasswordInput =
        document.getElementById("newPassword");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const newPasswordToggle =
        document.getElementById("newPasswordToggle");

    const confirmPasswordToggle =
        document.getElementById("confirmPasswordToggle");


    /* =====================================================
       SHOW / HIDE NEW PASSWORD
    ===================================================== */

    if (newPasswordInput && newPasswordToggle) {

        newPasswordToggle.addEventListener("click", function () {

            if (newPasswordInput.type === "password") {

                newPasswordInput.type = "text";

                newPasswordToggle.textContent = "🙈";

                newPasswordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                newPasswordInput.type = "password";

                newPasswordToggle.textContent = "👁️";

                newPasswordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        });
    }


    /* =====================================================
       SHOW / HIDE CONFIRM PASSWORD
    ===================================================== */

    if (confirmPasswordInput && confirmPasswordToggle) {

        confirmPasswordToggle.addEventListener("click", function () {

            if (confirmPasswordInput.type === "password") {

                confirmPasswordInput.type = "text";

                confirmPasswordToggle.textContent = "🙈";

                confirmPasswordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                confirmPasswordInput.type = "password";

                confirmPasswordToggle.textContent = "👁️";

                confirmPasswordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        });
    }


    /* =====================================================
       FORGOT PASSWORD FORM
    ===================================================== */

    if (forgotPasswordForm) {

        forgotPasswordForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const email =
                    document.getElementById("email").value.trim();

                const newPassword =
                    newPasswordInput.value;

                const confirmPassword =
                    confirmPasswordInput.value;


                /* =================================================
                   VALIDATION
                ================================================= */

                if (email === "") {

                    alert("Please enter your email address.");

                    return;
                }


                if (newPassword === "") {

                    alert("Please enter your new password.");

                    return;
                }


                if (newPassword.length < 6) {

                    alert(
                        "Password must be at least 6 characters long."
                    );

                    return;
                }


                if (confirmPassword === "") {

                    alert("Please confirm your new password.");

                    return;
                }


                if (newPassword !== confirmPassword) {

                    alert("Passwords do not match.");

                    return;
                }


                /* =================================================
                   BACKEND REQUEST
                ================================================= */

                try {

                    const response = await fetch(
                        "http://127.0.0.1:8000/forgot-password",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                new_password: newPassword
                            })
                        }
                    );


                    const data = await response.json();


                    /* =================================================
                       SUCCESS
                    ================================================= */

                    if (response.ok && data.success === true) {

                        alert(
                            "Password reset successfully! 🎉\n\nPlease login with your new password."
                        );

                        window.location.href = "login.html";

                        return;
                    }


                    /* =================================================
                       ERROR
                    ================================================= */

                    alert(
                        data.message ||
                        data.detail ||
                        "Unable to reset password."
                    );

                } catch (error) {

                    console.error(
                        "Forgot Password Error:",
                        error
                    );

                    alert(
                        "Backend se connection nahi ho raha.\n\nPlease make sure FastAPI server is running."
                    );
                }

            }
        );
    }

});