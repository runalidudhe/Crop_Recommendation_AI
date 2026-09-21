/* =====================================================
   AGROAI SMART IRRIGATION
===================================================== */

const API_URL = "http://127.0.0.1:8000";


/* =====================================================
   DISTRICTS
===================================================== */

const districts = [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal"
];


/* =====================================================
   DOM CONTENT LOADED
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupDistricts();

    setupAuth();

    setupForm();

    setupButtons();

});


/* =====================================================
   DISTRICT SETUP
===================================================== */

function setupDistricts() {

    const state = document.getElementById("state");

    const district = document.getElementById("district");


    if (!state || !district) {
        return;
    }


    state.addEventListener("change", function () {

        district.innerHTML =
            '<option value="">Select District</option>';


        if (state.value === "Maharashtra") {

            district.disabled = false;


            districts.forEach(function (item) {

                const option =
                    document.createElement("option");

                option.value = item;

                option.textContent = item;

                district.appendChild(option);

            });

        } else {

            district.disabled = true;

        }

    });

}


/* =====================================================
   AUTH
===================================================== */

function setupAuth() {

    const loggedIn =
        localStorage.getItem("agroai_logged_in") === "true";


    const loginLink =
        document.getElementById("loginLink");


    const signupLink =
        document.getElementById("signupLink");


    const logoutBtn =
        document.getElementById("logoutBtn");


    if (!loginLink || !signupLink || !logoutBtn) {
        return;
    }


    if (loggedIn) {

        loginLink.style.display = "none";

        signupLink.style.display = "none";

        logoutBtn.style.display = "inline-block";


        logoutBtn.addEventListener("click", function () {

            localStorage.removeItem("agroai_logged_in");

            localStorage.removeItem("agroai_role");

            localStorage.removeItem("loggedInUser");

            window.location.href = "index.html";

        });


    } else {

        loginLink.style.display = "inline-block";

        signupLink.style.display = "inline-block";

        logoutBtn.style.display = "none";

    }

}


/* =====================================================
   FORM
===================================================== */

function setupForm() {

    const form =
        document.getElementById("irrigationForm");


    if (!form) {
        return;
    }


    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        hideError();


        /* -------------------------------------------------
           GET FORM VALUES
        ------------------------------------------------- */

        const state =
            document.getElementById("state").value;


        const district =
            document.getElementById("district").value;


        const crop =
            document.getElementById("crop").value;


        const soilMoisture =
            Number(
                document.getElementById("soilMoisture").value
            );


        const fieldArea =
            Number(
                document.getElementById("fieldArea").value
            );


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (!state) {

            showError(
                "Please select your state."
            );

            return;

        }


        if (!district) {

            showError(
                "Please select your district."
            );

            return;

        }


        if (!crop) {

            showError(
                "Please select your crop."
            );

            return;

        }


        if (
            Number.isNaN(soilMoisture) ||
            soilMoisture < 0 ||
            soilMoisture > 100
        ) {

            showError(
                "Soil moisture must be between 0 and 100%."
            );

            return;

        }


        if (
            Number.isNaN(fieldArea) ||
            fieldArea <= 0
        ) {

            showError(
                "Please enter a valid field area."
            );

            return;

        }


        /* -------------------------------------------------
           LOADING
        ------------------------------------------------- */

        setLoading(true);


        try {

            /* -------------------------------------------------
               ADVANCED IRRIGATION API
            ------------------------------------------------- */

            const response =
                await fetch(
                    `${API_URL}/irrigation-advanced`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            district: district,

                            state: state,

                            country: "IN",

                            crop: crop,

                            soil_moisture:
                                soilMoisture,

                            field_area:
                                fieldArea

                        })

                    }
                );


            const data =
                await response.json();


            /* -------------------------------------------------
               API ERROR
            ------------------------------------------------- */

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Irrigation service failed."
                );

            }


            if (data.success === false) {

                throw new Error(
                    data.message ||
                    "Unable to calculate irrigation."
                );

            }


            /* -------------------------------------------------
               SHOW RESULT
            ------------------------------------------------- */

            showResult(data);


        } catch (error) {

            console.error(
                "Irrigation Error:",
                error
            );


            showError(
                "Unable to get irrigation advice. Please make sure the AgroAI backend is running."
            );


        } finally {

            setLoading(false);

        }

    });

}


/* =====================================================
   SHOW RESULT
===================================================== */

function showResult(data) {

    const result =
        document.getElementById(
            "irrigationResult"
        );


    const location =
        data.location || {};


    const weather =
        data.weather || {};


    const current =
        weather.current || {};


    /*
       IMPORTANT:

       Advanced water information is inside:

       data.irrigation

       according to your backend JSON.
    */

    const irrigation =
        data.irrigation || {};


    /* =================================================
       LOCATION
    ================================================= */

    const districtInput =
        document.getElementById("district");


    const cropInput =
        document.getElementById("crop");


    const fieldAreaInput =
        document.getElementById("fieldArea");


    document.getElementById(
        "resultLocation"
    ).textContent =
        `${location.name || districtInput.value}, ${location.state || "Maharashtra"}`;


    document.getElementById(
        "resultCrop"
    ).textContent =
        `${data.crop || cropInput.value} • ${data.field_area || fieldAreaInput.value} acres`;


    /* =================================================
       SOIL MOISTURE
    ================================================= */

    document.getElementById(
        "resultMoisture"
    ).textContent =
        `${data.soil_moisture ?? document.getElementById("soilMoisture").value}%`;


    /* =================================================
       WEATHER
    ================================================= */

    document.getElementById(
        "resultTemperature"
    ).textContent =
        current.temperature !== undefined
            ? `${current.temperature}°C`
            : "--°C";


    document.getElementById(
        "resultHumidity"
    ).textContent =
        current.humidity !== undefined
            ? `${current.humidity}%`
            : "--%";


    /* =================================================
       FORECAST
    ================================================= */

    const forecast =
        Array.isArray(weather.forecast)
            ? weather.forecast
            : [];


    const nextTwoDays =
        forecast.slice(0, 2);


    let totalRain = 0;

    let highestProbability = 0;


    nextTwoDays.forEach(function (day) {

        totalRain +=
            Number(day.rain_mm || 0);


        highestProbability =
            Math.max(
                highestProbability,
                Number(day.rain_probability || 0)
            );

    });


    /*
       Prefer backend calculated values if available.
       Otherwise calculate from forecast.
    */

    const backendRain =
        irrigation.next_2_days_rain_mm;


    const backendProbability =
        irrigation.next_2_days_rain_probability;


    document.getElementById(
        "resultRain"
    ).textContent =
        backendRain !== undefined
            ? `${Number(backendRain).toFixed(1)} mm`
            : `${totalRain.toFixed(1)} mm`;


    document.getElementById(
        "resultProbability"
    ).textContent =
        backendProbability !== undefined
            ? `${Math.round(Number(backendProbability))}%`
            : `${Math.round(highestProbability)}%`;


    /* =====================================================
       ADVANCED WATER REQUIREMENT
    ===================================================== */

    const waterCategory =
        document.getElementById(
            "waterCategory"
        );


    const dailyWater =
        document.getElementById(
            "dailyWater"
        );


    const waterPerAcre =
        document.getElementById(
            "waterPerAcre"
        );


    const totalWater =
        document.getElementById(
            "totalWater"
        );


    const recommendedWater =
        document.getElementById(
            "recommendedWater"
        );


    const waterRequirementNote =
        document.getElementById(
            "waterRequirementNote"
        );


    /* -----------------------------------------------------
       WATER CATEGORY
    ----------------------------------------------------- */

    if (waterCategory) {

        waterCategory.textContent =
            irrigation.water_category || "--";

    }


    /* -----------------------------------------------------
       DAILY WATER REQUIREMENT
    ----------------------------------------------------- */

    if (dailyWater) {

        dailyWater.textContent =
            irrigation.daily_water_mm !== undefined
                ? `${irrigation.daily_water_mm} mm/day`
                : "-- mm/day";

    }


    /* -----------------------------------------------------
       WATER PER ACRE
    ----------------------------------------------------- */

    if (waterPerAcre) {

        waterPerAcre.textContent =
            irrigation.estimated_water_litres_per_acre !== undefined
                ? `${Number(
                    irrigation.estimated_water_litres_per_acre
                ).toLocaleString("en-IN")} L`
                : "-- L";

    }


    /* -----------------------------------------------------
       TOTAL FIELD WATER
    ----------------------------------------------------- */

    if (totalWater) {

        totalWater.textContent =
            irrigation.estimated_water_litres_total !== undefined
                ? `${Number(
                    irrigation.estimated_water_litres_total
                ).toLocaleString("en-IN")} L/day`
                : "-- L/day";

    }


    /* -----------------------------------------------------
       RECOMMENDED WATER
    ----------------------------------------------------- */

    if (recommendedWater) {

        recommendedWater.textContent =
            irrigation.recommended_water_litres !== undefined
                ? `${Number(
                    irrigation.recommended_water_litres
                ).toLocaleString("en-IN")} L/day`
                : "-- L/day";

    }


    /* -----------------------------------------------------
       WATER REQUIREMENT NOTE
    ----------------------------------------------------- */

    if (waterRequirementNote) {

        waterRequirementNote.textContent =
            irrigation.water_requirement_note ||
            "Water requirement depends on crop type, field area, soil moisture and weather conditions.";

    }


    /* =================================================
       STATUS
    ================================================= */

    const status =
        String(
            irrigation.status ||
            "WAIT AND MONITOR"
        ).toUpperCase();


    document.getElementById(
        "irrigationStatus"
    ).textContent =
        status;


    document.getElementById(
        "statusReason"
    ).textContent =
        irrigation.reason ||
        "Check soil moisture and weather conditions before irrigation.";


    document.getElementById(
        "waterAdvice"
    ).textContent =
        irrigation.water_advice ||
        "Check soil moisture before watering.";


    document.getElementById(
        "timingAdvice"
    ).textContent =
        irrigation.timing ||
        "Monitor soil moisture and weather before irrigation.";


    document.getElementById(
        "warningAdvice"
    ).textContent =
        irrigation.warning ||
        "No major irrigation warning.";


    /* =================================================
       STATUS COLOR
    ================================================= */

    const statusCard =
        document.getElementById(
            "statusCard"
        );


    const statusIcon =
        document.getElementById(
            "statusIcon"
        );


    if (statusCard) {

        statusCard.classList.remove(
            "wait",
            "stop"
        );

    }


    if (status.includes("NOT") ||
        status.includes("AVOID") ||
        status.includes("STOP")) {


        if (statusCard) {

            statusCard.classList.add(
                "stop"
            );

        }


        if (statusIcon) {

            statusIcon.textContent =
                "🛑";

        }

    }

    else if (
        status.includes("WAIT") ||
        status.includes("MONITOR")
    ) {


        if (statusCard) {

            statusCard.classList.add(
                "wait"
            );

        }


        if (statusIcon) {

            statusIcon.textContent =
                "⏳";

        }

    }

    else {


        if (statusIcon) {

            statusIcon.textContent =
                "💧";

        }

    }


    /* =================================================
       RAIN FORECAST
    ================================================= */

    renderForecast(
        forecast
    );


    /* =================================================
       SHOW RESULT
    ================================================= */

    if (result) {

        result.classList.remove(
            "hidden"
        );


        result.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =====================================================
   FORECAST
===================================================== */

function renderForecast(forecast) {

    const container =
        document.getElementById(
            "rainForecast"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!forecast.length) {

        container.innerHTML = `
            <div class="rain-day">
                <strong>Forecast unavailable</strong>
                <div class="rain-mm">--</div>
                <small>Try again later</small>
            </div>
        `;

        return;

    }


    forecast
        .slice(0, 5)
        .forEach(function (day) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "rain-day";


            const date =
                formatDate(
                    day.date
                );


            const rain =
                Number(
                    day.rain_mm || 0
                );


            const probability =
                Math.round(
                    Number(
                        day.rain_probability || 0
                    )
                );


            card.innerHTML = `

                <strong>
                    ${date}
                </strong>

                <div class="rain-mm">
                    ${rain.toFixed(1)} mm
                </div>

                <small>
                    ${probability}% rain chance
                </small>

            `;


            container.appendChild(
                card
            );

        });

}


/* =====================================================
   DATE
===================================================== */

function formatDate(value) {

    if (!value) {

        return "--";

    }


    const date =
        new Date(
            value + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


/* =====================================================
   LOADING
===================================================== */

function setLoading(loading) {

    const button =
        document.getElementById(
            "irrigationBtn"
        );


    const text =
        document.getElementById(
            "btnText"
        );


    const loader =
        document.getElementById(
            "loader"
        );


    if (!button || !text || !loader) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        text.textContent =
            "Analyzing...";


        loader.style.display =
            "inline-block";

    }

    else {

        text.textContent =
            "💧 Check Irrigation";


        loader.style.display =
            "none";

    }

}


/* =====================================================
   ERROR
===================================================== */

function showError(message) {

    const error =
        document.getElementById(
            "errorMessage"
        );


    if (!error) {
        return;
    }


    error.textContent =
        message;


    error.style.display =
        "block";

}


function hideError() {

    const error =
        document.getElementById(
            "errorMessage"
        );


    if (!error) {
        return;
    }


    error.style.display =
        "none";

}


/* =====================================================
   BUTTONS
===================================================== */

function setupButtons() {

    const resetBtn =
        document.getElementById(
            "resetBtn"
        );


    const anotherBtn =
        document.getElementById(
            "anotherBtn"
        );


    const printBtn =
        document.getElementById(
            "printBtn"
        );


    /* =================================================
       RESET
    ================================================= */

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            function () {

                hideError();


                document.getElementById(
                    "irrigationResult"
                ).classList.add(
                    "hidden"
                );


                const district =
                    document.getElementById(
                        "district"
                    );


                if (district) {

                    district.disabled =
                        true;

                }

            }
        );

    }


    /* =================================================
       CHECK ANOTHER
    ================================================= */

    if (anotherBtn) {

        anotherBtn.addEventListener(
            "click",
            function () {

                document.getElementById(
                    "irrigationResult"
                ).classList.add(
                    "hidden"
                );


                document.getElementById(
                    "irrigationForm"
                ).scrollIntoView({
                    behavior: "smooth"
                });

            }
        );

    }


    /* =================================================
       PRINT
    ================================================= */

    if (printBtn) {

        printBtn.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }

}