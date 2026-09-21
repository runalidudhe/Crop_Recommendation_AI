/* =========================================================
   AGROAI CROP RECOMMENDATION
   COMPLETE JAVASCRIPT
========================================================= */


/* =========================================================
   API
========================================================= */

const API_URL =
    "http://127.0.0.1:8000";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const cropForm =
            document.getElementById("cropForm");


        const state =
            document.getElementById("state");


        const district =
            document.getElementById("district");


        const nitrogen =
            document.getElementById("nitrogen");


        const phosphorus =
            document.getElementById("phosphorus");


        const potassium =
            document.getElementById("potassium");


        const temperature =
            document.getElementById("temperature");


        const humidity =
            document.getElementById("humidity");


        const ph =
            document.getElementById("ph");


        const rainfall =
            document.getElementById("rainfall");


        const predictButton =
            document.getElementById("predictButton");


        const predictIcon =
            document.getElementById("predictIcon");


        const predictText =
            document.getElementById("predictText");


        const formMessage =
            document.getElementById("formMessage");


        const resetButton =
            document.getElementById("resetButton");


        const resultSection =
            document.getElementById("resultSection");


        const printButton =
            document.getElementById("printButton");


        const saveButton =
            document.getElementById("saveButton");


        const againButton =
            document.getElementById("againButton");


        const askButton =
            document.getElementById("askButton");


        const loginLink =
            document.getElementById("loginLink");


        const signupLink =
            document.getElementById("signupLink");


        const logoutLink =
            document.getElementById("logoutLink");


        const cropImage =
            document.getElementById("cropImage");


        const imageFallback =
            document.getElementById("imageFallback");


        const topRecommendations =
            document.getElementById(
                "topRecommendations"
            );


        const topRecommendationNote =
            document.getElementById(
                "topRecommendationNote"
            );


        /* =====================================================
           DISTRICTS
        ===================================================== */

        const maharashtraDistricts = [

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
           LOGIN / LOGOUT
        ===================================================== */

        function updateLoginState() {

            let loggedIn = false;

            let storedUser = null;


            try {

                loggedIn =
                    localStorage.getItem(
                        "agroai_logged_in"
                    ) === "true";


                const userData =
                    localStorage.getItem(
                        "agroai_user"
                    );


                if (userData) {

                    try {

                        storedUser =
                            JSON.parse(userData);

                    }
                    catch (error) {

                        storedUser = null;

                    }

                }

            }
            catch (error) {

                loggedIn = false;

            }


            if (loggedIn) {

                /* Hide Login */

                if (loginLink) {

                    loginLink.classList.add(
                        "hidden"
                    );

                }


                /* Hide Signup */

                if (signupLink) {

                    signupLink.classList.add(
                        "hidden"
                    );

                }


                /* Show Logout */

                if (logoutLink) {

                    logoutLink.classList.remove(
                        "hidden"
                    );

                }

            }
            else {

                /* Show Login */

                if (loginLink) {

                    loginLink.classList.remove(
                        "hidden"
                    );

                }


                /* Show Signup */

                if (signupLink) {

                    signupLink.classList.remove(
                        "hidden"
                    );

                }


                /* Hide Logout */

                if (logoutLink) {

                    logoutLink.classList.add(
                        "hidden"
                    );

                }

            }

        }


        updateLoginState();


        /* =====================================================
           LOGOUT
        ===================================================== */

        if (logoutLink) {

            logoutLink.addEventListener(
                "click",
                function () {

                    try {

                        localStorage.removeItem(
                            "agroai_logged_in"
                        );


                        localStorage.removeItem(
                            "agroai_user"
                        );


                        localStorage.removeItem(
                            "agroai_user_email"
                        );

                    }
                    catch (error) {

                        console.warn(
                            "Logout storage error:",
                            error
                        );

                    }


                    updateLoginState();


                    window.location.href =
                        "index.html";

                }
            );

        }


        /* =====================================================
           STATE -> DISTRICT
        ===================================================== */

        if (state) {

            state.addEventListener(
                "change",
                function () {

                    clearError(
                        state
                    );


                    district.innerHTML =
                        `
                        <option value="">
                            Select District
                        </option>
                        `;


                    if (
                        state.value ===
                        "Maharashtra"
                    ) {

                        district.disabled =
                            false;


                        maharashtraDistricts
                            .forEach(
                                function (name) {

                                    const option =
                                        document.createElement(
                                            "option"
                                        );


                                    option.value =
                                        name;


                                    option.textContent =
                                        name;


                                    district.appendChild(
                                        option
                                    );

                                }
                            );

                    }
                    else {

                        district.disabled =
                            true;

                    }

                }
            );

        }


        /* =====================================================
           FORM FIELDS
        ===================================================== */

        const fields = [

            state,
            district,
            nitrogen,
            phosphorus,
            potassium,
            temperature,
            humidity,
            ph,
            rainfall

        ];


        /* =====================================================
           ERROR ELEMENT
        ===================================================== */

        function getErrorElement(
            field
        ) {

            if (!field) {
                return null;
            }


            return document.getElementById(
                field.id + "Error"
            );

        }


        /* =====================================================
           CLEAR ERROR
        ===================================================== */

        function clearError(
            field
        ) {

            if (!field) {
                return;
            }


            const group =
                field.closest(
                    ".form-group"
                );


            const error =
                getErrorElement(
                    field
                );


            if (group) {

                group.classList.remove(
                    "invalid",
                    "valid"
                );

            }


            if (error) {

                error.textContent =
                    "";

            }

        }


        /* =====================================================
           SET ERROR
        ===================================================== */

        function setError(
            field,
            message
        ) {

            if (!field) {
                return false;
            }


            const group =
                field.closest(
                    ".form-group"
                );


            const error =
                getErrorElement(
                    field
                );


            if (group) {

                group.classList.remove(
                    "valid"
                );


                group.classList.add(
                    "invalid"
                );

            }


            if (error) {

                error.textContent =
                    message;

            }


            return false;

        }


        /* =====================================================
           SET VALID
        ===================================================== */

        function setValid(
            field
        ) {

            if (!field) {
                return;
            }


            const group =
                field.closest(
                    ".form-group"
                );


            const error =
                getErrorElement(
                    field
                );


            if (group) {

                group.classList.remove(
                    "invalid"
                );


                group.classList.add(
                    "valid"
                );

            }


            if (error) {

                error.textContent =
                    "";

            }

        }


        /* =====================================================
           VALIDATE FIELD
        ===================================================== */

        function validateField(
            field
        ) {

            if (!field) {
                return true;
            }


            const value =
                field.value.trim();


            /* STATE */

            if (
                field === state
            ) {

                if (!value) {

                    return setError(
                        field,
                        "Please select a state."
                    );

                }

                setValid(field);

                return true;

            }


            /* DISTRICT */

            if (
                field === district
            ) {

                if (!value) {

                    return setError(
                        field,
                        "Please select a district."
                    );

                }

                setValid(field);

                return true;

            }


            /* EMPTY */

            if (!value) {

                return setError(
                    field,
                    "This field is required."
                );

            }


            const number =
                Number(value);


            if (
                !Number.isFinite(
                    number
                )
            ) {

                return setError(
                    field,
                    "Please enter a valid number."
                );

            }


            /* NITROGEN */

            if (
                field === nitrogen
            ) {

                if (
                    number < 0 ||
                    number > 140
                ) {

                    return setError(
                        field,
                        "Enter N between 0 and 140."
                    );

                }

            }


            /* PHOSPHORUS */

            if (
                field === phosphorus
            ) {

                if (
                    number < 0 ||
                    number > 145
                ) {

                    return setError(
                        field,
                        "Enter P between 0 and 145."
                    );

                }

            }


            /* POTASSIUM */

            if (
                field === potassium
            ) {

                if (
                    number < 0 ||
                    number > 205
                ) {

                    return setError(
                        field,
                        "Enter K between 0 and 205."
                    );

                }

            }


            /* TEMPERATURE */

            if (
                field === temperature
            ) {

                if (
                    number < -10 ||
                    number > 60
                ) {

                    return setError(
                        field,
                        "Temperature must be -10 to 60 °C."
                    );

                }

            }


            /* HUMIDITY */

            if (
                field === humidity
            ) {

                if (
                    number < 0 ||
                    number > 100
                ) {

                    return setError(
                        field,
                        "Humidity must be 0 to 100%."
                    );

                }

            }


            /* PH */

            if (
                field === ph
            ) {

                if (
                    number < 0 ||
                    number > 14
                ) {

                    return setError(
                        field,
                        "pH must be between 0 and 14."
                    );

                }

            }


            /* RAINFALL */

            if (
                field === rainfall
            ) {

                if (
                    number < 0 ||
                    number > 3000
                ) {

                    return setError(
                        field,
                        "Rainfall must be 0 to 3000 mm."
                    );

                }

            }


            setValid(
                field
            );


            return true;

        }


        /* =====================================================
           VALIDATE ENTIRE FORM
        ===================================================== */

        function validateForm() {

            let valid = true;


            fields.forEach(
                function (field) {

                    if (
                        !validateField(
                            field
                        )
                    ) {

                        valid = false;

                    }

                }
            );


            if (!valid) {

                formMessage.textContent =
                    "Please correct the highlighted fields.";

                formMessage.className =
                    "form-message error-message";

            }
            else {

                formMessage.textContent =
                    "";

                formMessage.className =
                    "form-message";

            }


            return valid;

        }


        /* =====================================================
           LIVE VALIDATION
        ===================================================== */

        fields.forEach(
            function (field) {

                if (!field) {
                    return;
                }


                field.addEventListener(
                    "blur",
                    function () {

                        validateField(
                            field
                        );

                    }
                );


                field.addEventListener(
                    "input",
                    function () {

                        if (
                            field.value.trim()
                        ) {

                            validateField(
                                field
                            );

                        }

                    }
                );


                field.addEventListener(
                    "change",
                    function () {

                        validateField(
                            field
                        );

                    }
                );

            }
        );


        /* =====================================================
           ENTER -> NEXT FIELD
        ===================================================== */

        if (cropForm) {

            cropForm.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key !==
                        "Enter"
                    ) {

                        return;

                    }


                    if (
                        event.target.tagName !==
                        "INPUT"
                    ) {

                        return;

                    }


                    event.preventDefault();


                    const currentIndex =
                        fields.indexOf(
                            event.target
                        );


                    if (
                        currentIndex === -1
                    ) {

                        return;

                    }


                    const currentField =
                        fields[currentIndex];


                    if (
                        !validateField(
                            currentField
                        )
                    ) {

                        currentField.focus();

                        return;

                    }


                    const nextField =
                        fields[
                            currentIndex + 1
                        ];


                    if (nextField) {

                        if (
                            nextField.disabled
                        ) {

                            return;

                        }


                        nextField.focus();

                    }
                    else {

                        cropForm.requestSubmit();

                    }

                }
            );


            /* =================================================
               SUBMIT
            ================================================= */

            cropForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    if (
                        !validateForm()
                    ) {

                        const firstInvalid =
                            fields.find(
                                function (field) {

                                    const group =
                                        field.closest(
                                            ".form-group"
                                        );


                                    return group &&
                                        group.classList.contains(
                                            "invalid"
                                        );

                                }
                            );


                        if (
                            firstInvalid
                        ) {

                            firstInvalid.focus();

                        }


                        return;

                    }


                    await getPrediction();

                }
            );

        }


        /* =====================================================
           LOADING STATE
        ===================================================== */

        function setLoading(
            loading
        ) {

            if (!predictButton) {
                return;
            }


            if (loading) {

                predictButton.disabled =
                    true;


                predictButton.classList.add(
                    "loading"
                );


                predictIcon.textContent =
                    "";


                predictText.textContent =
                    "Analyzing...";

            }
            else {

                predictButton.disabled =
                    false;


                predictButton.classList.remove(
                    "loading"
                );


                predictIcon.textContent =
                    "🌾";


                predictText.textContent =
                    "Get AI Recommendation";

            }

        }


        /* =====================================================
           SAFE TEXT
        ===================================================== */

        function safeValue(
            value,
            fallback = "—"
        ) {

            if (
                value === null ||
                value === undefined ||
                String(value).trim() === ""
            ) {

                return fallback;

            }


            return String(value);

        }


        /* =====================================================
           CROP NAME
        ===================================================== */

        function formatCropName(
            crop
        ) {

            const value =
                safeValue(
                    crop,
                    "Unknown"
                );


            return value
                .replace(
                    /[_-]+/g,
                    " "
                )
                .replace(
                    /\b\w/g,
                    function (letter) {

                        return letter.toUpperCase();

                    }
                );

        }


        /* =====================================================
           IMAGE NAME
        ===================================================== */

        function normalizeCropImageName(
            crop
        ) {

            return String(
                crop || ""
            )
                .trim()
                .toLowerCase()
                .replace(
                    /[\s_-]+/g,
                    ""
                );

        }


        /* =====================================================
           LOAD MAIN CROP IMAGE
        ===================================================== */

        function loadMainCropImage(
            crop
        ) {

            if (
                !cropImage
            ) {

                return;

            }


            const normalized =
                normalizeCropImageName(
                    crop
                );


            if (
                !normalized
            ) {

                cropImage.style.display =
                    "none";

                imageFallback.style.display =
                    "flex";

                return;

            }


            const urls = [

                `${API_URL}/images/${normalized}.jpg`,

                `images/${normalized}.jpg`,

                `/frontend/images/${normalized}.jpg`

            ];


            let currentIndex =
                0;


            imageFallback.style.display =
                "none";


            cropImage.style.display =
                "block";


            cropImage.alt =
                `${formatCropName(crop)} crop`;


            function tryNextImage() {

                if (
                    currentIndex >=
                    urls.length
                ) {

                    cropImage.style.display =
                        "none";


                    imageFallback.style.display =
                        "flex";


                    return;

                }


                cropImage.src =
                    urls[currentIndex];

                currentIndex++;

            }


            cropImage.onload =
                function () {

                    cropImage.style.display =
                        "block";


                    imageFallback.style.display =
                        "none";

                };


            cropImage.onerror =
                function () {

                    tryNextImage();

                };


            tryNextImage();

        }


        /* =====================================================
           TOP RECOMMENDATION IMAGE
        ===================================================== */

        function setRecommendationImage(
            image,
            crop
        ) {

            const normalized =
                normalizeCropImageName(
                    crop
                );


            const urls = [

                `${API_URL}/images/${normalized}.jpg`,

                `images/${normalized}.jpg`,

                `/frontend/images/${normalized}.jpg`

            ];


            let index = 0;


            function tryImage() {

                if (
                    index >=
                    urls.length
                ) {

                    image.style.display =
                        "none";


                    const fallback =
                        image.parentElement
                            .querySelector(
                                ".top-crop-image-fallback"
                            );


                    if (fallback) {

                        fallback.style.display =
                            "flex";

                    }


                    return;

                }


                image.src =
                    urls[index];

                index++;

            }


            image.onload =
                function () {

                    image.style.display =
                        "block";

                };


            image.onerror =
                function () {

                    tryImage();

                };


            tryImage();

        }


        /* =====================================================
           TOP 3 RENDER
        ===================================================== */

        function renderTopRecommendations(
            recommendations
        ) {

            if (
                !topRecommendations
            ) {

                return;

            }


            topRecommendations.innerHTML =
                "";


            if (
                topRecommendationNote
            ) {

                topRecommendationNote.textContent =
                    "";

            }


            if (
                !Array.isArray(
                    recommendations
                ) ||
                recommendations.length === 0
            ) {

                if (
                    topRecommendationNote
                ) {

                    topRecommendationNote.textContent =
                        "The model did not return additional recommendation scores.";

                }

                return;

            }


            /*
             * Use only actual model results.
             * Never invent crop names.
             */

            const valid =
                recommendations
                    .filter(
                        function (item) {

                            return (
                                item &&
                                item.crop
                            );

                        }
                    )
                    .slice(
                        0,
                        3
                    );


            valid.forEach(
                function (
                    item,
                    index
                ) {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "top-crop-card";


                    const crop =
                        String(
                            item.crop
                        );


                    const cropName =
                        formatCropName(
                            crop
                        );


                    const probability =
                        Number(
                            item.probability
                        );


                    let scoreText =
                        "N/A";


                    if (
                        Number.isFinite(
                            probability
                        )
                    ) {

                        scoreText =
                            `${probability.toFixed(2)}%`;

                    }


                    card.innerHTML = `

                        <div class="top-crop-rank">
                            ${String(index + 1).padStart(2, "0")}
                        </div>


                        <div class="top-crop-image-wrapper">

                            <img
                                class="top-crop-image"
                                alt="${cropName}">

                            <div class="top-crop-image-fallback">
                                🌱
                            </div>

                        </div>


                        <div class="top-crop-content">

                            <span class="top-crop-position">
                                ${index === 0 ? "BEST MATCH" : "MODEL ALTERNATIVE"}
                            </span>

                            <h4 class="top-crop-name">
                                ${cropName}
                            </h4>


                            <div class="top-crop-score">

                                <span>
                                    Model Score
                                </span>

                                <strong>
                                    ${scoreText}
                                </strong>

                            </div>

                        </div>

                    `;


                    topRecommendations.appendChild(
                        card
                    );


                    const image =
                        card.querySelector(
                            ".top-crop-image"
                        );


                    setRecommendationImage(
                        image,
                        crop
                    );

                }
            );


            if (
                valid.length < 3 &&
                topRecommendationNote
            ) {

                topRecommendationNote.textContent =
                    `The model returned ${valid.length} result${valid.length === 1 ? "" : "s"}. No artificial crops were added.`;

            }

        }


        /* =====================================================
           RENDER RESULT
        ===================================================== */

        function renderResult(
            data
        ) {

            const crop =
                safeValue(
                    data.recommended_crop,
                    "Unknown"
                );


            const confidence =
                data.confidence;


            const farm =
                data.farm_data ||
                {};


            const cropInfo =
                data.crop_information ||
                {};


            const districtInfo =
                data.district_intelligence ||
                {};



            /* MAIN CROP */

            document.getElementById(
                "recommendedCrop"
            ).textContent =
                formatCropName(
                    crop
                );



            /* CONFIDENCE */

            const confidenceValue =
                document.getElementById(
                    "confidenceValue"
                );


            if (
                confidence !== null &&
                confidence !== undefined &&
                Number.isFinite(
                    Number(confidence)
                )
            ) {

                confidenceValue.textContent =
                    `${Number(confidence).toFixed(2)}%`;

            }
            else {

                confidenceValue.textContent =
                    "N/A";

            }



            /* MAIN IMAGE */

            loadMainCropImage(
                crop
            );



            /* =================================================
               FARM CONDITIONS
            ================================================= */

            document.getElementById(
                "resultState"
            ).textContent =
                safeValue(
                    farm.state
                );


            document.getElementById(
                "resultDistrict"
            ).textContent =
                safeValue(
                    farm.district
                );


            document.getElementById(
                "resultNitrogen"
            ).textContent =
                safeValue(
                    farm.N
                );


            document.getElementById(
                "resultPhosphorus"
            ).textContent =
                safeValue(
                    farm.P
                );


            document.getElementById(
                "resultPotassium"
            ).textContent =
                safeValue(
                    farm.K
                );


            document.getElementById(
                "resultTemperature"
            ).textContent =
                farm.temperature !== undefined
                    ? `${farm.temperature} °C`
                    : "—";


            document.getElementById(
                "resultHumidity"
            ).textContent =
                farm.humidity !== undefined
                    ? `${farm.humidity} %`
                    : "—";


            document.getElementById(
                "resultPh"
            ).textContent =
                safeValue(
                    farm.ph
                );


            document.getElementById(
                "resultRainfall"
            ).textContent =
                farm.rainfall !== undefined
                    ? `${farm.rainfall} mm`
                    : "—";



            /* =================================================
               CROP INFORMATION
            ================================================= */

            document.getElementById(
                "cropSeason"
            ).textContent =
                safeValue(
                    cropInfo.season
                );


            document.getElementById(
                "cropSoil"
            ).textContent =
                safeValue(
                    cropInfo.soil
                );


            document.getElementById(
                "cropWater"
            ).textContent =
                safeValue(
                    cropInfo.water
                );


            document.getElementById(
                "cropTemperature"
            ).textContent =
                safeValue(
                    cropInfo.temperature
                );


            document.getElementById(
                "cropPh"
            ).textContent =
                safeValue(
                    cropInfo.ph
                );


            document.getElementById(
                "cropFertilizer"
            ).textContent =
                safeValue(
                    cropInfo.fertilizer
                );


            document.getElementById(
                "cropSowing"
            ).textContent =
                safeValue(
                    cropInfo.sowing
                );


            document.getElementById(
                "cropHarvesting"
            ).textContent =
                safeValue(
                    cropInfo.harvesting
                );


            document.getElementById(
                "farmingTips"
            ).textContent =
                safeValue(
                    cropInfo.tips
                );


            document.getElementById(
                "precautions"
            ).textContent =
                safeValue(
                    cropInfo.precautions
                );



            /* =================================================
               DISTRICT
            ================================================= */

            document.getElementById(
                "districtTitle"
            ).textContent =
                safeValue(
                    districtInfo.district ||
                    farm.district
                );


            document.getElementById(
                "districtOverview"
            ).textContent =
                safeValue(
                    districtInfo.overview
                );


            document.getElementById(
                "districtMajorCrops"
            ).textContent =
                safeValue(
                    districtInfo.major_crops
                );


            document.getElementById(
                "districtRainfall"
            ).textContent =
                safeValue(
                    districtInfo.rainfall
                );


            document.getElementById(
                "districtClimate"
            ).textContent =
                safeValue(
                    districtInfo.climate
                );


            document.getElementById(
                "districtFarmingFocus"
            ).textContent =
                safeValue(
                    districtInfo.farming_focus
                );


            document.getElementById(
                "districtNote"
            ).textContent =
                safeValue(
                    districtInfo.note
                );



            /* =================================================
               TOP 3
            ================================================= */

            renderTopRecommendations(
                data.top_recommendations
            );



            /* =================================================
               SAVE LAST RESULT
            ================================================= */

            try {

                localStorage.setItem(
                    "agroai_last_crop_result",
                    JSON.stringify(data)
                );


                localStorage.setItem(
                    "agroai_selected_crop",
                    crop
                );


                localStorage.setItem(
                    "agroai_selected_district",
                    farm.district || ""
                );

            }
            catch (error) {

                console.warn(
                    "Unable to save crop result:",
                    error
                );

            }



            /* =================================================
               SHOW RESULT
            ================================================= */

            resultSection.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    resultSection.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );

                },
                80
            );

        }


        /* =====================================================
           GET PREDICTION
        ===================================================== */

        async function getPrediction() {

            setLoading(
                true
            );


            formMessage.textContent =
                "Analyzing your farm conditions...";


            formMessage.className =
                "form-message";


            const payload = {

                N:
                    Number(
                        nitrogen.value
                    ),

                P:
                    Number(
                        phosphorus.value
                    ),

                K:
                    Number(
                        potassium.value
                    ),

                temperature:
                    Number(
                        temperature.value
                    ),

                humidity:
                    Number(
                        humidity.value
                    ),

                ph:
                    Number(
                        ph.value
                    ),

                rainfall:
                    Number(
                        rainfall.value
                    ),

                state:
                    state.value,

                district:
                    district.value

            };


            try {

                const response =
                    await fetch(
                        `${API_URL}/predict`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )

                        }
                    );


                let result = {};


                try {

                    result =
                        await response.json();

                }
                catch (error) {

                    result = {};

                }


                if (
                    !response.ok
                ) {

                    throw new Error(
                        result.detail ||
                        `Prediction failed with status ${response.status}.`
                    );

                }


                if (
                    result.success !== true
                ) {

                    throw new Error(
                        "The backend did not return a successful prediction."
                    );

                }


                renderResult(
                    result
                );


                formMessage.textContent =
                    "Recommendation generated successfully.";


                formMessage.className =
                    "form-message success-message";

            }
            catch (error) {

                console.error(
                    "AGROAI PREDICTION ERROR:",
                    error
                );


                formMessage.textContent =
                    error.message ||
                    "Unable to connect to AgroAI backend.";


                formMessage.className =
                    "form-message error-message";

            }
            finally {

                setLoading(
                    false
                );

            }

        }


        /* =====================================================
           RESET
        ===================================================== */

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                function () {

                    cropForm.reset();


                    district.innerHTML =
                        `
                        <option value="">
                            Select District
                        </option>
                        `;


                    district.disabled =
                        true;


                    fields.forEach(
                        function (field) {

                            clearError(
                                field
                            );

                        }
                    );


                    formMessage.textContent =
                        "";


                    formMessage.className =
                        "form-message";


                    setLoading(
                        false
                    );


                    resultSection.classList.remove(
                        "show"
                    );


                    if (
                        topRecommendations
                    ) {

                        topRecommendations.innerHTML =
                            "";

                    }


                    if (
                        topRecommendationNote
                    ) {

                        topRecommendationNote.textContent =
                            "";

                    }


                    window.scrollTo(
                        {
                            top: 0,
                            behavior: "smooth"
                        }
                    );

                }
            );

        }


        /* =====================================================
           PRINT RESULT
        ===================================================== */

        if (printButton) {

            printButton.addEventListener(
                "click",
                function () {

                    if (
                        !resultSection.classList.contains(
                            "show"
                        )
                    ) {

                        alert(
                            "Please get a crop recommendation first."
                        );

                        return;

                    }


                    window.print();

                }
            );

        }


        /* =====================================================
           SAVE RESULT
        ===================================================== */

        if (saveButton) {

            saveButton.addEventListener(
                "click",
                function () {

                    const saved =
                        localStorage.getItem(
                            "agroai_last_crop_result"
                        );


                    if (!saved) {

                        alert(
                            "Please generate a recommendation first."
                        );

                        return;

                    }


                    saveButton.textContent =
                        "✓ Result Saved";


                    setTimeout(
                        function () {

                            saveButton.textContent =
                                "💾 Save Result";

                        },
                        1600
                    );

                }
            );

        }


        /* =====================================================
           TRY AGAIN
        ===================================================== */

        if (againButton) {

            againButton.addEventListener(
                "click",
                function () {

                    resultSection.classList.remove(
                        "show"
                    );


                    window.scrollTo(
                        {
                            top: 0,
                            behavior: "smooth"
                        }
                    );


                    setTimeout(
                        function () {

                            nitrogen.focus();

                        },
                        400
                    );

                }
            );

        }


        /* =====================================================
           ASK AGROAI
        ===================================================== */

        if (askButton) {

            askButton.addEventListener(
                "click",
                function () {

                    const crop =
                        localStorage.getItem(
                            "agroai_selected_crop"
                        ) || "";


                    const districtName =
                        localStorage.getItem(
                            "agroai_selected_district"
                        ) || "";


                    const query =
                        encodeURIComponent(
                            crop
                                ? `Tell me more about ${formatCropName(crop)} farming in ${districtName || "my district"}.`
                                : "Tell me about suitable farming practices."
                        );


                    window.location.href =
                        `chatbot.html?question=${query}`;

                }
            );

        }


        /* =====================================================
           INITIAL STATE
        ===================================================== */

        if (resultSection) {

            resultSection.classList.remove(
                "show"
            );

        }


        if (district) {

            district.disabled =
                true;

        }


        console.log(
            "🌱 AgroAI Crop Recommendation loaded successfully."
        );

    }
);