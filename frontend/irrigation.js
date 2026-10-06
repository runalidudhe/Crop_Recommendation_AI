/* =====================================================
   AGROAI SMART IRRIGATION
   Frontend Controller
===================================================== */

const API_URL = "http://127.0.0.1:8000";


/* =====================================================
   MAHARASHTRA DISTRICTS
===================================================== */

const districts = [
    "Ahilyanagar",
    "Akola",
    "Amravati",
    "Bhandara",
    "Beed",
    "Buldhana",
    "Chandrapur",
    "Chhatrapati Sambhajinagar",
    "Dharashiv",
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
   START
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

    district.disabled = true;

    state.addEventListener("change", function () {

        district.innerHTML =
            '<option value="">Select District</option>';

        if (state.value === "Maharashtra") {

            district.disabled = false;

            districts.forEach(function (item) {

                const option = document.createElement("option");

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

        /* ---------------------------------------------
           FORM ELEMENTS
        --------------------------------------------- */

        const stateElement =
            document.getElementById("state");

        const districtElement =
            document.getElementById("district");

        const cropElement =
            document.getElementById("crop");

        const moistureElement =
            document.getElementById("soilMoisture");

        const areaElement =
            document.getElementById("fieldArea");


        /* ---------------------------------------------
           VALUES
        --------------------------------------------- */

        const state =
            stateElement
                ? stateElement.value.trim()
                : "";

        const district =
            districtElement
                ? districtElement.value.trim()
                : "";

        const crop =
            cropElement
                ? cropElement.value.trim()
                : "";

        const soilMoisture =
            moistureElement
                ? Number(moistureElement.value)
                : NaN;

        const fieldArea =
            areaElement
                ? Number(areaElement.value)
                : NaN;


        /* ---------------------------------------------
           VALIDATION
        --------------------------------------------- */

        if (!state) {

            showError(
                "Please select your state."
            );

            return;
        }

        if (state !== "Maharashtra") {

            showError(
                "Please select Maharashtra."
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


        /* ---------------------------------------------
           LOADING
        --------------------------------------------- */

        setLoading(true);


        try {

            /* -----------------------------------------
               API REQUEST
            ----------------------------------------- */

            const response = await fetch(
                `${API_URL}/irrigation`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        state: state,

                        district: district,

                        crop: crop,

                        soil_moisture: soilMoisture,

                        field_area: fieldArea,

                        country: "IN"

                    })

                }
            );


            /* -----------------------------------------
               READ RESPONSE
            ----------------------------------------- */

            let data = {};

            try {

                data = await response.json();

            } catch (jsonError) {

                throw new Error(
                    "The AgroAI backend returned an invalid response."
                );

            }


            /* -----------------------------------------
               HTTP ERROR
            ----------------------------------------- */

            if (!response.ok) {

                throw new Error(

                    data.detail ||

                    data.message ||

                    `Irrigation service failed (${response.status}).`

                );

            }


            /* -----------------------------------------
               APPLICATION ERROR
            ----------------------------------------- */

            if (data.success === false) {

                throw new Error(

                    data.message ||

                    "Unable to calculate irrigation."

                );

            }


            /* -----------------------------------------
               SHOW RESULT
            ----------------------------------------- */

            showResult(data);

        }

        catch (error) {

            console.error(
                "Irrigation Error:",
                error
            );


            if (
                error instanceof TypeError &&
                error.message
                    .toLowerCase()
                    .includes("fetch")
            ) {

                showError(
                    "Unable to connect to the AgroAI backend. Please make sure the backend is running on port 8000."
                );

            } else {

                showError(
                    error.message ||
                    "Unable to get irrigation advice. Please try again."
                );

            }

        }

        finally {

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

    const irrigation =
        data.irrigation || {};


    /* =================================================
       INPUT VALUES
    ================================================= */

    const districtInput =
        document.getElementById("district");

    const cropInput =
        document.getElementById("crop");

    const fieldAreaInput =
        document.getElementById("fieldArea");

    const moistureInput =
        document.getElementById("soilMoisture");


    const districtValue =
        districtInput
            ? districtInput.value
            : "";

    const cropValue =
        cropInput
            ? cropInput.value
            : "";

    const fieldAreaValue =
        fieldAreaInput
            ? fieldAreaInput.value
            : "";

    const moistureValue =
        moistureInput
            ? moistureInput.value
            : "";


    /* =================================================
       LOCATION
    ================================================= */

    setText(
        "resultLocation",

        `${location.name || districtValue}, ${location.state || "Maharashtra"}`
    );


    setText(
        "resultCrop",

        `${data.crop || cropValue} • ${data.field_area ?? fieldAreaValue} acres`
    );


    /* =================================================
       SOIL MOISTURE
    ================================================= */

    const moisture =
        data.soil_moisture !== undefined
            ? Number(data.soil_moisture)
            : Number(moistureValue);


    setText(
        "resultMoisture",

        Number.isFinite(moisture)
            ? `${moisture}%`
            : "--%"
    );


    /* =================================================
       CURRENT WEATHER
    ================================================= */

    setText(
        "resultTemperature",

        current.temperature !== undefined
            ? `${current.temperature}°C`
            : "--°C"
    );


    setText(
        "resultHumidity",

        current.humidity !== undefined
            ? `${current.humidity}%`
            : "--%"
    );


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

                Number(
                    day.rain_probability || 0
                )
            );

    });


    /* =================================================
       BACKEND FORECAST VALUES
    ================================================= */

    const backendRain =
        irrigation.next_2_days_rain_mm;

    const backendProbability =
        irrigation.next_2_days_rain_probability;


    setText(
        "resultRain",

        backendRain !== undefined
            ? `${Number(backendRain).toFixed(1)} mm`
            : `${totalRain.toFixed(1)} mm`
    );


    setText(
        "resultProbability",

        backendProbability !== undefined
            ? `${Math.round(Number(backendProbability))}%`
            : `${Math.round(highestProbability)}%`
    );


    /* =================================================
       WATER REQUIREMENT
       FIXED SECTION
    ================================================= */

    setText(
        "waterCategory",

        getWaterCategory(
            irrigation.status,
            moisture
        )
    );


    /*
       Backend values:

       daily_water_liters
       water_per_acre_liters
       total_water_liters
       water_depth_mm
       irrigation_required
    */

    const dailyWater =
        Number(
            irrigation.daily_water_liters ??
            irrigation.total_water_liters ??
            0
        );


    const waterPerAcre =
        Number(
            irrigation.water_per_acre_liters ??
            0
        );


    const totalWater =
        Number(
            irrigation.total_water_liters ??
            0
        );


    const waterDepth =
        Number(
            irrigation.water_depth_mm ??
            0
        );


    const irrigationRequired =
        irrigation.irrigation_required === true;


    /* =================================================
       DAILY WATER
    ================================================= */

    setText(
        "dailyWater",

        Number.isFinite(dailyWater)
            ? `${Math.round(dailyWater).toLocaleString("en-IN")} L/day`
            : "--"
    );


    /* =================================================
       WATER PER ACRE
    ================================================= */

    setText(
        "waterPerAcre",

        Number.isFinite(waterPerAcre)
            ? `${Math.round(waterPerAcre).toLocaleString("en-IN")} L/acre`
            : "--"
    );


    /* =================================================
       TOTAL WATER
    ================================================= */

    setText(
        "totalWater",

        Number.isFinite(totalWater)
            ? `${Math.round(totalWater).toLocaleString("en-IN")} L`
            : "--"
    );


    /* =================================================
       RECOMMENDED WATER
    ================================================= */

    setText(
        "recommendedWater",

        irrigationRequired

            ? `${waterDepth.toFixed(1)} mm estimated irrigation depth`

            : "0 L — irrigation not currently required"

    );


    /* =================================================
       WATER NOTE
    ================================================= */

    setText(
        "waterRequirementNote",

        irrigationRequired

            ? "Estimated project-level water quantity based on crop water group, soil-moisture deficit and field area. Actual irrigation should also consider crop stage, soil type, irrigation method and local agronomic guidance."

            : "No irrigation quantity is recommended at this time because current soil moisture and/or rainfall conditions indicate that irrigation should be postponed or monitored."

    );


    /* =================================================
       IRRIGATION STATUS
    ================================================= */

    const status =
        String(
            irrigation.status ||
            "WAIT AND MONITOR"
        ).toUpperCase();


    setText(
        "irrigationStatus",
        status
    );


    setText(
        "statusReason",

        irrigation.reason ||

        "Check soil moisture and weather conditions before irrigation."
    );


    setText(
        "waterAdvice",

        irrigation.water_advice ||

        "Check soil moisture before watering."
    );


    setText(
        "timingAdvice",

        irrigation.timing ||

        "Monitor soil moisture and weather before irrigation."
    );


    setText(
        "warningAdvice",

        irrigation.warning ||

        "No major irrigation warning."
    );


    /* =================================================
       STATUS STYLE
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
            "stop",
            "recommended"
        );

    }


    /* =================================================
       NOT RECOMMENDED
    ================================================= */

    if (
        status.includes("NOT") ||
        status.includes("AVOID") ||
        status.includes("STOP")
    ) {

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


    /* =================================================
       WAIT / MONITOR
    ================================================= */

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


    /* =================================================
       IRRIGATION RECOMMENDED
    ================================================= */

    else {

        if (statusCard) {

            statusCard.classList.add(
                "recommended"
            );

        }


        if (statusIcon) {

            statusIcon.textContent =
                "💧";

        }

    }


    /* =================================================
       RAIN FORECAST CARDS
    ================================================= */

    renderForecast(forecast);


    /* =================================================
       SHOW RESULT
    ================================================= */

    if (result) {

        result.classList.remove(
            "hidden"
        );


        setTimeout(function () {

            result.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }, 100);

    }

}


/* =====================================================
   WATER CATEGORY
===================================================== */

function getWaterCategory(
    status,
    moisture
) {

    const safeStatus =
        String(
            status || ""
        ).toUpperCase();


    if (
        safeStatus.includes("STOP") ||
        safeStatus.includes("AVOID") ||
        safeStatus.includes("NOT")
    ) {

        return "Low / Avoid";

    }


    if (
        safeStatus.includes("WAIT") ||
        safeStatus.includes("MONITOR")
    ) {

        return "Monitor";

    }


    if (
        Number(moisture) < 30
    ) {

        return "Higher Attention";

    }


    return "Guidance Based";

}


/* =====================================================
   RAIN FORECAST
===================================================== */

function renderForecast(
    forecast
) {

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

                <strong>
                    Forecast unavailable
                </strong>

                <div class="rain-mm">
                    --
                </div>

                <small>
                    Try again later
                </small>

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


            const temperatureMin =
                day.temperature_min !== undefined
                    ? Number(
                        day.temperature_min
                    )
                    : null;


            const temperatureMax =
                day.temperature_max !== undefined
                    ? Number(
                        day.temperature_max
                    )
                    : null;


            let temperatureText = "";


            if (
                temperatureMin !== null &&
                temperatureMax !== null
            ) {

                temperatureText = `

                    <small>
                        ${temperatureMin.toFixed(1)}°C
                        –
                        ${temperatureMax.toFixed(1)}°C
                    </small>

                `;

            }


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

                ${temperatureText}

            `;


            container.appendChild(
                card
            );

        });

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(
    value
) {

    if (!value) {
        return "--";
    }


    const date =
        new Date(
            value + "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


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

function setLoading(
    loading
) {

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


    if (
        !button ||
        !text ||
        !loader
    ) {

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

function showError(
    message
) {

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


    error.textContent =
        "";


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


                const form =
                    document.getElementById(
                        "irrigationForm"
                    );


                if (form) {

                    form.reset();

                }


                const district =
                    document.getElementById(
                        "district"
                    );


                if (district) {

                    district.innerHTML =
                        '<option value="">Select District</option>';

                    district.disabled =
                        true;

                }


                const result =
                    document.getElementById(
                        "irrigationResult"
                    );


                if (result) {

                    result.classList.add(
                        "hidden"
                    );

                }


                const statusCard =
                    document.getElementById(
                        "statusCard"
                    );


                if (statusCard) {

                    statusCard.classList.remove(
                        "wait",
                        "stop",
                        "recommended"
                    );

                }

            }
        );

    }


    /* =================================================
       CHECK ANOTHER FARM
    ================================================= */

    if (anotherBtn) {

        anotherBtn.addEventListener(
            "click",
            function () {

                const result =
                    document.getElementById(
                        "irrigationResult"
                    );


                if (result) {

                    result.classList.add(
                        "hidden"
                    );

                }


                hideError();


                const form =
                    document.getElementById(
                        "irrigationForm"
                    );


                if (form) {

                    form.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }

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


/* =====================================================
   SAFE TEXT HELPER
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =

            value !== undefined &&
            value !== null &&
            value !== ""

                ? value

                : "--";

    }

}