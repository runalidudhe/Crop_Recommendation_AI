
/* =========================================================
   AGROAI - CROP RECOMMENDATION
   FINAL SCRIPT
   ---------------------------------------------------------
   - Existing HTML structure preserved
   - Existing CSS structure preserved
   - No result flash on page load
   - Strict validation
   - Prevents double submit
   - Result remains visible after prediction
   - Reset works correctly
   - Print Result works
========================================================= */

"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form = document.getElementById("cropForm");
    const result = document.getElementById("result");
    const recommendBtn = document.getElementById("recommendBtn");
    const resetBtn = document.getElementById("resetBtn");
    const message = document.getElementById("message");

    const inputN = document.getElementById("N");
    const inputP = document.getElementById("P");
    const inputK = document.getElementById("K");
    const inputTemperature = document.getElementById("temperature");
    const inputHumidity = document.getElementById("humidity");
    const inputPH = document.getElementById("ph");
    const inputRainfall = document.getElementById("rainfall");


    /* =====================================================
       REQUIRED ELEMENT CHECK
    ===================================================== */

    if (
        !form ||
        !result ||
        !recommendBtn ||
        !resetBtn ||
        !message ||
        !inputN ||
        !inputP ||
        !inputK ||
        !inputTemperature ||
        !inputHumidity ||
        !inputPH ||
        !inputRainfall
    ) {
        console.error(
            "AgroAI: Required crop page elements are missing."
        );

        return;
    }


    /* =====================================================
       STATE
    ===================================================== */

    let isPredicting = false;


    /* =====================================================
       CROP INFORMATION
    ===================================================== */

    const cropInfo = {

        rice: {
            about:
                "Rice grows well in warm and humid conditions.",
            water:
                "Requires high water availability.",
            soil:
                "Prefers fertile and clayey soil."
        },

        maize: {
            about:
                "Maize is an important cereal crop.",
            water:
                "Requires moderate and regular water.",
            soil:
                "Prefers fertile and well-drained soil."
        },

        chickpea: {
            about:
                "Chickpea is an important pulse crop.",
            water:
                "Requires low to moderate water.",
            soil:
                "Prefers well-drained fertile soil."
        },

        kidneybeans: {
            about:
                "Kidney bean is a nutritious pulse crop.",
            water:
                "Requires moderate moisture.",
            soil:
                "Prefers fertile and well-drained soil."
        },

        pigeonpeas: {
            about:
                "Pigeon pea is a drought-tolerant pulse crop.",
            water:
                "Requires moderate water.",
            soil:
                "Grows well in well-drained soil."
        },

        mothbeans: {
            about:
                "Moth bean is a drought-resistant pulse crop.",
            water:
                "Requires relatively low water.",
            soil:
                "Can grow in sandy and dry soils."
        },

        mungbean: {
            about:
                "Mung bean is a short-duration pulse crop.",
            water:
                "Requires moderate moisture.",
            soil:
                "Prefers well-drained fertile soil."
        },

        blackgram: {
            about:
                "Black gram is an important pulse crop.",
            water:
                "Requires moderate moisture.",
            soil:
                "Prefers fertile and well-drained soil."
        },

        lentil: {
            about:
                "Lentil is a cool-season pulse crop.",
            water:
                "Requires moderate water.",
            soil:
                "Prefers well-drained fertile soil."
        },

        banana: {
            about:
                "Banana is a tropical fruit crop.",
            water:
                "Requires regular and sufficient water.",
            soil:
                "Prefers fertile and well-drained soil."
        },

        mango: {
            about:
                "Mango is a tropical fruit crop.",
            water:
                "Requires moderate water.",
            soil:
                "Prefers well-drained soil."
        },

        grapes: {
            about:
                "Grapes are an important fruit crop.",
            water:
                "Requires controlled irrigation.",
            soil:
                "Prefers well-drained soil."
        },

        watermelon: {
            about:
                "Watermelon is a warm-season fruit crop.",
            water:
                "Requires adequate water.",
            soil:
                "Prefers sandy and well-drained soil."
        },

        muskmelon: {
            about:
                "Muskmelon is a warm-season fruit crop.",
            water:
                "Requires controlled irrigation.",
            soil:
                "Prefers fertile and well-drained soil."
        },

        apple: {
            about:
                "Apple is a temperate fruit crop.",
            water:
                "Requires regular moisture.",
            soil:
                "Prefers fertile and well-drained soil."
        },

        orange: {
            about:
                "Orange is a citrus fruit crop.",
            water:
                "Requires regular irrigation.",
            soil:
                "Prefers well-drained fertile soil."
        },

        papaya: {
            about:
                "Papaya is a tropical fruit crop.",
            water:
                "Requires regular controlled watering.",
            soil:
                "Prefers fertile and well-drained soil."
        },

        coconut: {
            about:
                "Coconut is a tropical plantation crop.",
            water:
                "Requires adequate moisture.",
            soil:
                "Prefers sandy and well-drained soil."
        },

        cotton: {
            about:
                "Cotton is an important commercial fiber crop.",
            water:
                "Requires moderate water.",
            soil:
                "Prefers fertile and well-drained soil."
        },

        jute: {
            about:
                "Jute is an important natural fiber crop.",
            water:
                "Requires adequate rainfall and moisture.",
            soil:
                "Prefers fertile moisture-retentive soil."
        },

        coffee: {
            about:
                "Coffee is an important plantation crop.",
            water:
                "Requires adequate rainfall.",
            soil:
                "Prefers fertile and well-drained soil."
        }

    };


    /* =====================================================
       UTILITY - ESCAPE HTML
       Prevents unsafe HTML injection from backend data.
    ===================================================== */

    function escapeHTML(value) {

        const div = document.createElement("div");

        div.textContent = String(value);

        return div.innerHTML;
    }


    /* =====================================================
       GET NUMBER VALUE
    ===================================================== */

    function getNumber(input) {

        if (!input) {
            return null;
        }

        const rawValue = input.value.trim();

        if (rawValue === "") {
            return null;
        }

        const number = Number(rawValue);

        if (!Number.isFinite(number)) {
            return null;
        }

        return number;
    }


    /* =====================================================
       GET FORM DATA
    ===================================================== */

    function getFormData() {

        return {

            N: getNumber(inputN),

            P: getNumber(inputP),

            K: getNumber(inputK),

            temperature:
                getNumber(inputTemperature),

            humidity:
                getNumber(inputHumidity),

            ph:
                getNumber(inputPH),

            rainfall:
                getNumber(inputRainfall)

        };

    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateData(data) {

        const fieldNames = {

            N: "Nitrogen (N)",

            P: "Phosphorus (P)",

            K: "Potassium (K)",

            temperature: "Temperature",

            humidity: "Humidity",

            ph: "Soil pH",

            rainfall: "Rainfall"

        };


        /* -----------------------------------------------
           REQUIRED CHECK
        ------------------------------------------------ */

        for (const key in data) {

            if (data[key] === null) {

                return (
                    "Please enter " +
                    fieldNames[key] +
                    "."
                );

            }

        }


        /* -----------------------------------------------
           NPK NON-NEGATIVE
        ------------------------------------------------ */

        if (data.N < 0) {

            return "Nitrogen cannot be negative.";

        }


        if (data.P < 0) {

            return "Phosphorus cannot be negative.";

        }


        if (data.K < 0) {

            return "Potassium cannot be negative.";

        }


        /* -----------------------------------------------
           HUMIDITY
        ------------------------------------------------ */

        if (
            data.humidity < 0 ||
            data.humidity > 100
        ) {

            return (
                "Humidity must be between 0 and 100%."
            );

        }


        /* -----------------------------------------------
           PH
        ------------------------------------------------ */

        if (
            data.ph < 0 ||
            data.ph > 14
        ) {

            return (
                "Soil pH must be between 0 and 14."
            );

        }


        /* -----------------------------------------------
           RAINFALL
        ------------------------------------------------ */

        if (data.rainfall < 0) {

            return "Rainfall cannot be negative.";

        }


        return null;

    }


    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    function showMessage(text) {

        message.textContent = text || "";

    }


    /* =====================================================
       CLEAR MESSAGE
    ===================================================== */

    function clearMessage() {

        message.textContent = "";

    }


    /* =====================================================
       KEEP RESULT CONTAINER STABLE
       IMPORTANT FLASH FIX
    ===================================================== */

    function showResultArea() {

        result.style.visibility = "visible";

        result.style.opacity = "1";

    }


    /* =====================================================
       HIDE RESULT ONLY WHEN RESETTING
    ===================================================== */

    function hideResultArea() {

        result.innerHTML = "";

        result.style.visibility = "hidden";

        result.style.opacity = "0";

    }


    /* =====================================================
       LOADING RESULT
    ===================================================== */

    function showLoading() {

        showResultArea();


        result.innerHTML = `

            <div class="result-content">

                <div class="result-symbol">
                    🤖
                </div>

                <h3>
                    AI is analyzing...
                </h3>

                <p>
                    Please wait while AgroAI analyzes
                    your farming conditions.
                </p>

            </div>

        `;

    }


    /* =====================================================
       ERROR RESULT
    ===================================================== */

    function showError(errorText) {

        showResultArea();


        const safeError =
            escapeHTML(
                errorText ||
                "Prediction failed."
            );


        result.innerHTML = `

            <div class="error-result">

                <div class="error-icon">
                    ❌
                </div>

                <h3>
                    Prediction Error
                </h3>

                <p>
                    ${safeError}
                </p>

                <p>
                    Make sure your FastAPI backend
                    is running on port 8000.
                </p>

            </div>

        `;

    }


    /* =====================================================
       NORMALIZE CROP NAME
    ===================================================== */

    function normalizeCropName(name) {

        return String(name)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "")
            .replace(/-/g, "")
            .replace(/_/g, "");

    }


    /* =====================================================
       SHOW FINAL RESULT
    ===================================================== */

    function showResult(cropName, data) {

        showResultArea();


        const safeCropName =
            escapeHTML(cropName);


        const cropKey =
            normalizeCropName(cropName);


        const info =
            cropInfo[cropKey];


        let informationHTML = "";


        /* -----------------------------------------------
           CROP INFORMATION
        ------------------------------------------------ */

        if (info) {

            informationHTML = `

                <div class="info-box">

                    <h3>
                        📖 About ${safeCropName}
                    </h3>

                    <p>
                        ${escapeHTML(info.about)}
                    </p>

                </div>


                <div class="info-box">

                    <h3>
                        💧 Water Requirement
                    </h3>

                    <p>
                        ${escapeHTML(info.water)}
                    </p>

                </div>


                <div class="info-box">

                    <h3>
                        🌿 Soil Information
                    </h3>

                    <p>
                        ${escapeHTML(info.soil)}
                    </p>

                </div>

            `;

        }


        /* -----------------------------------------------
           FINAL RESULT HTML
        ------------------------------------------------ */

        result.innerHTML = `

            <div
                class="result-content"
                id="printResult"
            >

                <div class="result-symbol">
                    🌾
                </div>


                <h3>
                    Recommended Crop
                </h3>


                <div class="crop-name">
                    ${safeCropName}
                </div>


                <div class="ai-box">

                    <h3>
                        🤖 AI Recommendation
                    </h3>

                    <p>
                        Based on the entered soil and
                        weather conditions, AgroAI recommends
                        <strong>${safeCropName}</strong>.
                    </p>

                </div>


                <div class="info-box">

                    <h3>
                        📊 Input Summary
                    </h3>

                    <p>
                        <strong>Nitrogen:</strong>
                        ${data.N}
                    </p>

                    <p>
                        <strong>Phosphorus:</strong>
                        ${data.P}
                    </p>

                    <p>
                        <strong>Potassium:</strong>
                        ${data.K}
                    </p>

                    <p>
                        <strong>Temperature:</strong>
                        ${data.temperature} °C
                    </p>

                    <p>
                        <strong>Humidity:</strong>
                        ${data.humidity} %
                    </p>

                    <p>
                        <strong>Soil pH:</strong>
                        ${data.ph}
                    </p>

                    <p>
                        <strong>Rainfall:</strong>
                        ${data.rainfall} mm
                    </p>

                </div>


                ${informationHTML}


                <button
                    type="button"
                    class="print-button"
                    id="printBtn"
                >
                    🖨️ Print Result
                </button>

            </div>

        `;


        /* -----------------------------------------------
           PRINT BUTTON
        ------------------------------------------------ */

        const printBtn =
            document.getElementById("printBtn");


        if (printBtn) {

            printBtn.addEventListener(
                "click",
                printCropResult
            );

        }

    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();
            event.stopPropagation();


            /* ---------------------------------------------
               PREVENT DOUBLE SUBMIT
            --------------------------------------------- */

            if (isPredicting) {

                return;

            }


            isPredicting = true;


            clearMessage();


            /* ---------------------------------------------
               GET DATA
            --------------------------------------------- */

            const data =
                getFormData();


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            const validationError =
                validateData(data);


            if (validationError) {

                showMessage(
                    validationError
                );

                isPredicting = false;

                return;

            }


            /* ---------------------------------------------
               BUTTON STATE
            --------------------------------------------- */

            recommendBtn.disabled = true;

            recommendBtn.textContent =
                "🤖 Analyzing...";


            /* ---------------------------------------------
               SHOW LOADING
            --------------------------------------------- */

            showLoading();


            try {

                /* -----------------------------------------
                   API REQUEST
                ----------------------------------------- */

                const response =
                    await fetch(
                        "http://127.0.0.1:8000/predict",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                /* -----------------------------------------
                   RESPONSE TEXT FIRST
                   Prevent JSON parsing crash
                ----------------------------------------- */

                const responseText =
                    await response.text();


                let responseData;


                try {

                    responseData =
                        JSON.parse(
                            responseText
                        );

                }

                catch {

                    throw new Error(
                        "Backend returned an invalid response."
                    );

                }


                /* -----------------------------------------
                   HTTP ERROR
                ----------------------------------------- */

                if (!response.ok) {

                    throw new Error(
                        responseData.detail ||
                        "Prediction failed."
                    );

                }


                /* -----------------------------------------
                   CROP RESULT
                ----------------------------------------- */

                const crop =
                    responseData.recommended_crop;


                if (
                    crop === undefined ||
                    crop === null ||
                    String(crop).trim() === ""
                ) {

                    throw new Error(
                        "Backend se crop result nahi mila."
                    );

                }


                /* -----------------------------------------
                   FINAL RESULT
                ----------------------------------------- */

                showResult(
                    String(crop).trim(),
                    data
                );

            }


            catch (error) {

                console.error(
                    "AgroAI Prediction Error:",
                    error
                );


                showError(
                    error.message ||
                    "Backend server se connection nahi ho raha."
                );

            }


            finally {

                /* -----------------------------------------
                   RESTORE BUTTON
                ----------------------------------------- */

                recommendBtn.disabled = false;

                recommendBtn.textContent =
                    "🌾 Get Crop Recommendation";


                isPredicting = false;

            }

        }
    );


    /* =====================================================
       RESET
    ===================================================== */

    resetBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            /* ---------------------------------------------
               Cancel JS predicting state
            --------------------------------------------- */

            isPredicting = false;


            /* ---------------------------------------------
               Reset form
            --------------------------------------------- */

            form.reset();


            /* ---------------------------------------------
               Clear message
            --------------------------------------------- */

            clearMessage();


            /* ---------------------------------------------
               Restore button
            --------------------------------------------- */

            recommendBtn.disabled = false;

            recommendBtn.textContent =
                "🌾 Get Crop Recommendation";


            /* ---------------------------------------------
               Hide result
            --------------------------------------------- */

            hideResultArea();

        }
    );


    /* =====================================================
       PRINT RESULT
    ===================================================== */

    function printCropResult() {

        const printResult =
            document.getElementById(
                "printResult"
            );


        if (!printResult) {

            alert(
                "Please get a crop recommendation first."
            );

            return;

        }


        const printWindow =
            window.open(
                "",
                "_blank",
                "width=850,height=750"
            );


        if (!printWindow) {

            alert(
                "Please allow pop-ups in your browser."
            );

            return;

        }


        printWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <title>
                    AgroAI Crop Recommendation
                </title>

                <style>

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;

                        padding: 30px;

                        color: #26382c;

                        background: white;

                        line-height: 1.6;
                    }

                    .print-header {
                        text-align: center;

                        border-bottom:
                            2px solid #18843d;

                        padding-bottom: 15px;

                        margin-bottom: 25px;
                    }

                    .print-header h1 {
                        color: #176b35;

                        margin: 0;
                    }

                    .print-header p {
                        color: #666;

                        margin: 5px 0;
                    }

                    .result-content {
                        max-width: 700px;

                        margin: auto;

                        text-align: center;
                    }

                    .result-symbol,
                    .crop-icon {
                        font-size: 50px;

                        text-align: center;
                    }

                    .crop-name,
                    .recommended-crop-name {
                        color: #18843d;

                        font-size: 30px;

                        font-weight: bold;

                        text-align: center;

                        text-transform: capitalize;
                    }

                    .ai-box,
                    .info-box,
                    .ai-recommendation,
                    .crop-information {
                        border:
                            1px solid #ccc;

                        padding: 15px;

                        margin-top: 15px;

                        border-radius: 10px;

                        text-align: left;
                    }

                    .ai-box,
                    .ai-recommendation {
                        background: #edf8ed;
                    }

                    #printBtn,
                    .print-button,
                    .print-btn {
                        display: none !important;
                    }

                </style>

            </head>


            <body>

                <div class="print-header">

                    <h1>
                        🌱 AgroAI
                    </h1>

                    <p>
                        AI Powered Crop Recommendation
                    </p>

                </div>


                ${printResult.outerHTML}


            </body>

            </html>

        `);


        printWindow.document.close();


        printWindow.focus();


        setTimeout(
            function () {

                printWindow.print();

                printWindow.close();

            },
            500
        );

    }


    /* =====================================================
       INITIAL PAGE STATE
       -----------------------------------------------------
       IMPORTANT:
       We do NOT insert default result HTML.
       We do NOT call API.
       We do NOT call loading.
       We only make the empty result area invisible.
       
       This prevents result flashing during page load.
    ===================================================== */

    result.style.visibility = "hidden";
    result.style.opacity = "0";


    /* =====================================================
       FINAL LOG
    ===================================================== */

    console.log(
        "AgroAI: crop.js loaded successfully."
    );

});

