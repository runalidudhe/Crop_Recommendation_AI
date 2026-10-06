/* =========================================================
   AGROAI - CROP RECOMMENDATION
   COMPLETE CLEAN JAVASCRIPT
   PART 1 / 4
========================================================= */

const API_URL = "http://127.0.0.1:8000";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       FORM ELEMENTS
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


    /* =====================================================
       BUTTONS
    ===================================================== */

    const predictButton =
        document.getElementById("predictButton");

    const predictIcon =
        document.getElementById("predictIcon");

    const predictText =
        document.getElementById("predictText");

    const resetButton =
        document.getElementById("resetButton");

    const printButton =
        document.getElementById("printButton");

    const saveButton =
        document.getElementById("saveButton");

    const againButton =
        document.getElementById("againButton");

    const askButton =
        document.getElementById("askButton");


    /* =====================================================
       MESSAGE / RESULT
    ===================================================== */

    const formMessage =
        document.getElementById("formMessage");

    const resultSection =
        document.getElementById("resultSection");


    /* =====================================================
       IMAGES
    ===================================================== */

    const cropImage =
        document.getElementById("cropImage");

    const imageFallback =
        document.getElementById("imageFallback");


    /* =====================================================
       TOP RECOMMENDATIONS
    ===================================================== */

    const topRecommendations =
        document.getElementById("topRecommendations");

    const topRecommendationNote =
        document.getElementById("topRecommendationNote");


    /* =====================================================
       DATE / TIME
    ===================================================== */

    const dateElement =
        document.getElementById("date");

    const timeElement =
        document.getElementById("time");


    /* =====================================================
       DISTRICT TITLE
    ===================================================== */

    const districtTitle =
        document.getElementById("districtTitle");


    /* =====================================================
       RESULT ELEMENTS
    ===================================================== */

    const recommendedCrop =
        document.getElementById("recommendedCrop");

    const confidenceValue =
        document.getElementById("confidenceValue");

    const resultState =
        document.getElementById("resultState");

    const resultDistrict =
        document.getElementById("resultDistrict");

    const resultNitrogen =
        document.getElementById("resultNitrogen");

    const resultPhosphorus =
        document.getElementById("resultPhosphorus");

    const resultPotassium =
        document.getElementById("resultPotassium");

    const resultTemperature =
        document.getElementById("resultTemperature");

    const resultHumidity =
        document.getElementById("resultHumidity");

    const resultPh =
        document.getElementById("resultPh");

    const resultRainfall =
        document.getElementById("resultRainfall");


    /* =====================================================
       CROP INFORMATION
    ===================================================== */

    const cropSeason =
        document.getElementById("cropSeason");

    const cropSoil =
        document.getElementById("cropSoil");

    const cropWater =
        document.getElementById("cropWater");

    const cropTemperature =
        document.getElementById("cropTemperature");

    const cropPh =
        document.getElementById("cropPh");

    const cropFertilizer =
        document.getElementById("cropFertilizer");

    const cropSowing =
        document.getElementById("cropSowing");

    const cropHarvesting =
        document.getElementById("cropHarvesting");

    const cropTips =
        document.getElementById("farmingTips");

    const cropPrecautions =
        document.getElementById("precautions");


    /* =====================================================
       DISTRICT INFORMATION OUTPUT
    ===================================================== */

    const districtOverview =
        document.getElementById("districtOverview");

    const districtMajorCrops =
        document.getElementById("districtMajorCrops");

    const districtRainfall =
        document.getElementById("districtRainfall");

    const districtClimate =
        document.getElementById("districtClimate");

    const districtFarmingFocus =
        document.getElementById("districtFarmingFocus");

    const districtNote =
        document.getElementById("districtNote");


    /* =====================================================
       DISTRICT FARMING INTELLIGENCE
    ===================================================== */

    const DISTRICT_INFORMATION = {

        Ahmednagar: {
            overview:
                "Major semi-arid agricultural district with cereals, pulses, onion, sugarcane and horticulture.",
            major_crops:
                "Bajra, jowar, wheat, onion, sugarcane, soybean, gram and horticultural crops",
            rainfall:
                "Approx. 500–700 mm annually",
            climate:
                "Semi-arid tropical climate with hot summers and seasonal monsoon",
            farming_focus:
                "Cereals, pulses, onion, sugarcane, dairy-linked farming and water-efficient agriculture",
            note:
                "Soil testing, efficient irrigation and moisture conservation are important because rainfall is seasonal and variable."
        },

        Akola: {
            overview:
                "Important Vidarbha agricultural district with extensive cotton, soybean and pulse cultivation.",
            major_crops:
                "Cotton, soybean, tur, gram, wheat, jowar and other pulses",
            rainfall:
                "Approx. 700–900 mm annually",
            climate:
                "Hot tropical climate with a pronounced monsoon season",
            farming_focus:
                "Cotton, soybean, pulses, cereals and soil-test-based nutrient management",
            note:
                "Timely sowing, moisture conservation and balanced fertilizer use are useful for rainfed farming."
        },

        Amravati: {
            overview:
                "Major Vidarbha agricultural district with cotton, soybean, pulses and orange horticulture.",
            major_crops:
                "Cotton, soybean, tur, gram, wheat, jowar and oranges",
            rainfall:
                "Approx. 700–1000 mm annually",
            climate:
                "Tropical wet-and-dry climate with hot summers and seasonal monsoon",
            farming_focus:
                "Cotton, soybean, pulses, cereals and orange horticulture",
            note:
                "Rainwater conservation, timely sowing and integrated pest management support farm productivity."
        },

        Aurangabad: {
            overview:
                "Agricultural district with cereals, pulses, cotton, maize and horticultural production.",
            major_crops:
                "Cotton, soybean, maize, jowar, wheat, gram, pulses and horticultural crops",
            rainfall:
                "Approx. 600–800 mm annually",
            climate:
                "Semi-arid tropical climate with hot summers and seasonal monsoon",
            farming_focus:
                "Cotton, soybean, cereals, pulses, horticulture and efficient irrigation",
            note:
                "Moisture conservation and irrigation planning are important in the relatively dry agricultural environment."
        },

        Beed: {
            overview:
                "Predominantly dry agricultural district of Marathwada where crops depend strongly on seasonal rainfall.",
            major_crops:
                "Bajra, jowar, soybean, cotton, tur, gram, wheat and sugarcane",
            rainfall:
                "Approx. 600–800 mm annually",
            climate:
                "Hot and semi-arid tropical climate",
            farming_focus:
                "Rainfed cereals, pulses, soybean, cotton and water-efficient farming",
            note:
                "Rainwater harvesting, drought management and efficient irrigation are important for stable production."
        },

        Bhandara: {
            overview:
                "Relatively high-rainfall eastern Vidarbha district with strong rice cultivation.",
            major_crops:
                "Rice, soybean, tur, wheat, gram, vegetables and horticultural crops",
            rainfall:
                "Approx. 1100–1300 mm annually",
            climate:
                "Tropical wet-and-dry climate with a substantial monsoon",
            farming_focus:
                "Rice-based farming, pulses, soybean, vegetables and water management",
            note:
                "Drainage, water control in paddy fields and balanced nutrient management are important."
        },

        Buldhana: {
            overview:
                "Western Vidarbha agricultural district with cotton, soybean, pulses and cereals as important crops.",
            major_crops:
                "Cotton, soybean, tur, gram, jowar, wheat and maize",
            rainfall:
                "Approx. 700–900 mm annually",
            climate:
                "Hot tropical climate with seasonal monsoon rainfall",
            farming_focus:
                "Cotton, soybean, pulses, cereals and rainfed agriculture",
            note:
                "Timely sowing, soil testing and moisture conservation help manage rainfall variability."
        },

        Chandrapur: {
            overview:
                "Eastern Vidarbha district with warm climate and agriculture supported by monsoon rainfall and irrigation.",
            major_crops:
                "Rice, cotton, soybean, tur, wheat, gram and vegetables",
            rainfall:
                "Approx. 950–1100 mm annually",
            climate:
                "Hot tropical wet-and-dry climate",
            farming_focus:
                "Rice, cotton, soybean, pulses, cereals and irrigation management",
            note:
                "Good drainage, balanced nutrients and timely crop protection are useful during humid monsoon periods."
        },

        Dhule: {
            overview:
                "North Maharashtra agricultural district with dryland farming and irrigated horticulture.",
            major_crops:
                "Cotton, millet, wheat, gram, maize, soybean, onion and horticultural crops",
            rainfall:
                "Approx. 500–700 mm annually",
            climate:
                "Hot semi-arid tropical climate",
            farming_focus:
                "Cotton, cereals, pulses, onion and water-efficient horticulture",
            note:
                "Efficient irrigation and moisture conservation are important because rainfall is limited and seasonal."
        },

        Gadchiroli: {
            overview:
                "Forest-rich eastern Maharashtra district with relatively high rainfall and substantial rice cultivation.",
            major_crops:
                "Rice, soybean, tur, black gram, green gram, maize and vegetables",
            rainfall:
                "Approx. 1200–1400 mm annually",
            climate:
                "Tropical humid-to-subhumid climate with a strong monsoon",
            farming_focus:
                "Rice, pulses, soybean, vegetables and sustainable rainfed farming",
            note:
                "Drainage, erosion control and moisture management are important in high-rainfall areas."
        },

        Gondia: {
            overview:
                "Rice-dominant eastern Vidarbha district with substantial monsoon rainfall.",
            major_crops:
                "Rice, soybean, tur, wheat, gram, vegetables and horticultural crops",
            rainfall:
                "Approx. 1200–1400 mm annually",
            climate:
                "Tropical humid and wet-dry climate with a strong monsoon",
            farming_focus:
                "Rice-based farming, pulses, soybean, vegetables and water management",
            note:
                "Field drainage, proper water control and balanced fertilization are useful for paddy-based farming."
        },

        Hingoli: {
            overview:
                "Agricultural district of northern Marathwada with important cereal, cotton, pulse and turmeric cultivation.",
            major_crops:
                "Jowar, cotton, soybean, tur, gram, green gram, black gram and turmeric",
            rainfall:
                "Approx. 790–900 mm annually",
            climate:
                "Hot and dry tropical climate with seasonal monsoon rainfall",
            farming_focus:
                "Cereals, pulses, cotton, soybean and turmeric cultivation",
            note:
                "Timely sowing, soil testing, moisture management and suitable irrigation planning are useful."
        },

        Jalgaon: {
            overview:
                "Major north Maharashtra agricultural district widely associated with banana along with cotton and cereals.",
            major_crops:
                "Banana, cotton, maize, jowar, wheat, pulses and horticultural crops",
            rainfall:
                "Approx. 650–800 mm annually",
            climate:
                "Hot semi-arid tropical climate with seasonal monsoon",
            farming_focus:
                "Banana horticulture, cotton, maize, cereals and irrigation-based farming",
            note:
                "Efficient drip irrigation, nutrient management and wind protection are important for banana."
        },

        Jalna: {
            overview:
                "Semi-arid Marathwada district where cotton, soybean, pulses and horticulture are widely cultivated.",
            major_crops:
                "Cotton, soybean, jowar, tur, gram, maize, wheat and horticultural crops",
            rainfall:
                "Approx. 650–800 mm annually",
            climate:
                "Hot semi-arid tropical climate",
            farming_focus:
                "Cotton, soybean, pulses, cereals and horticulture",
            note:
                "Moisture conservation and efficient irrigation are important for reliable crop production."
        },

        Kolhapur: {
            overview:
                "Diverse agricultural district with high-rainfall western areas and irrigated farming in the plains.",
            major_crops:
                "Sugarcane, rice, soybean, groundnut, jowar, vegetables and horticultural crops",
            rainfall:
                "Approx. 900–2500 mm depending on location",
            climate:
                "Tropical climate ranging from wet western zones to comparatively drier eastern areas",
            farming_focus:
                "Sugarcane, rice, horticulture, dairy-linked agriculture and irrigated farming",
            note:
                "Drainage, water management and balanced fertilizer application are important across varying local conditions."
        },

        Latur: {
            overview:
                "Important Marathwada agricultural district with soybean, pulses and cereals as major crops.",
            major_crops:
                "Soybean, tur, gram, jowar, wheat, cotton and sugarcane in irrigated areas",
            rainfall:
                "Approx. 700–900 mm annually",
            climate:
                "Hot semi-arid tropical climate",
            farming_focus:
                "Soybean, pulses, cereals, cotton and efficient irrigation",
            note:
                "Timely sowing, moisture conservation and soil-test-based nutrient management are useful."
        },

        "Mumbai City": {
            overview:
                "Predominantly urban district where conventional field agriculture is limited and urban food production is more relevant.",
            major_crops:
                "Leafy vegetables, herbs, nursery plants and protected-cultivation crops",
            rainfall:
                "Approx. 2000–2500 mm annually",
            climate:
                "Warm humid coastal tropical climate with heavy southwest monsoon",
            farming_focus:
                "Urban horticulture, terrace gardening, nurseries and protected cultivation",
            note:
                "Drainage and protected growing systems are important because monsoon rainfall can be heavy."
        },

        "Mumbai Suburban": {
            overview:
                "Predominantly urban district with limited conventional agriculture and greater scope for urban horticulture.",
            major_crops:
                "Leafy vegetables, herbs, nursery plants and protected-cultivation vegetables",
            rainfall:
                "Approx. 2000–2500 mm annually",
            climate:
                "Warm humid coastal tropical climate with heavy monsoon rainfall",
            farming_focus:
                "Urban farming, terrace gardens, nurseries and protected cultivation",
            note:
                "Use well-drained growing media and controlled irrigation during heavy monsoon periods."
        },

        Nagpur: {
            overview:
                "Major central Vidarbha agricultural district known for orange horticulture along with cotton, soybean and cereals.",
            major_crops:
                "Orange, cotton, soybean, rice, wheat, gram, jowar and vegetables",
            rainfall:
                "Approx. 900–1000 mm annually",
            climate:
                "Tropical wet-and-dry climate with hot summers and seasonal monsoon",
            farming_focus:
                "Orange horticulture, cotton, soybean, cereals, pulses and irrigation planning",
            note:
                "Soil testing, irrigation scheduling and orchard moisture management are useful for sustainable production."
        },

        Nanded: {
            overview:
                "Southeastern Marathwada district with a mixed rainfed and irrigated agricultural system.",
            major_crops:
                "Soybean, cotton, tur, jowar, wheat, gram, sugarcane and horticultural crops",
            rainfall:
                "Approx. 850–1000 mm annually",
            climate:
                "Hot tropical wet-and-dry climate",
            farming_focus:
                "Soybean, cotton, pulses, cereals, sugarcane and horticulture",
            note:
                "Timely sowing, soil testing and efficient water use help manage seasonal variability."
        },

        Nandurbar: {
            overview:
                "Diverse agricultural district from plains to hilly tribal areas with rainfed and irrigated farming.",
            major_crops:
                "Cotton, maize, jowar, wheat, pulses, soybean, banana and vegetables",
            rainfall:
                "Approx. 600–900 mm annually",
            climate:
                "Hot tropical to semi-arid climate with local variation",
            farming_focus:
                "Cotton, maize, cereals, pulses, banana and smallholder horticulture",
            note:
                "Water conservation, soil management and locally suitable crop planning are important across varied terrain."
        },

        Nashik: {
            overview:
                "Major horticultural district with important grape, onion and vegetable production along with cereals and pulses.",
            major_crops:
                "Grapes, onion, tomato, wheat, soybean, maize, vegetables and pomegranate",
            rainfall:
                "Approx. 600–1000 mm annually",
            climate:
                "Semi-arid to subhumid tropical climate with cooler conditions in some elevated areas",
            farming_focus:
                "Grapes, onion, vegetables, pomegranate, cereals and precision irrigation",
            note:
                "Drip irrigation, disease management and nutrient scheduling are important for horticultural crops."
        },

        Osmanabad: {
            overview:
                "Dryland agricultural district of Marathwada with strong dependence on seasonal rainfall.",
            major_crops:
                "Soybean, jowar, tur, gram, wheat, cotton, maize and oilseeds",
            rainfall:
                "Approx. 600–800 mm annually",
            climate:
                "Hot semi-arid tropical climate",
            farming_focus:
                "Soybean, cereals, pulses, cotton and drought-resilient agriculture",
            note:
                "Rainwater harvesting, moisture conservation and efficient irrigation are important in dry periods."
        },

        Palghar: {
            overview:
                "Coastal and hilly agricultural district with rice, horticulture and plantation-based farming.",
            major_crops:
                "Rice, vegetables, fruits, coconut, mango, chikoo and other horticultural crops",
            rainfall:
                "Approx. 1800–2500 mm annually",
            climate:
                "Warm humid coastal tropical climate with heavy monsoon",
            farming_focus:
                "Rice, horticulture, plantation crops, vegetables and rainfed farming",
            note:
                "Drainage, soil conservation and crop planning for heavy monsoon rainfall are important."
        },

        Parbhani: {
            overview:
                "Major Marathwada agricultural district with cotton, soybean, sorghum and pulses as important crops.",
            major_crops:
                "Soybean, cotton, jowar, tur, gram, wheat, maize and other pulses",
            rainfall:
                "Approx. 750–900 mm annually",
            climate:
                "Hot semi-arid tropical climate with seasonal monsoon",
            farming_focus:
                "Soybean, cotton, cereals, pulses and rainfed agriculture",
            note:
                "Timely sowing, balanced fertilizer use and moisture conservation support crop stability."
        },

        Pune: {
            overview:
                "Highly varied agricultural district from dry eastern zones to wetter western areas, supporting cereals, sugarcane and horticulture.",
            major_crops:
                "Sugarcane, jowar, bajra, wheat, onion, grapes, vegetables and horticultural crops",
            rainfall:
                "Approx. 500–1500 mm depending on location",
            climate:
                "Tropical climate ranging from semi-arid east to wetter western highlands",
            farming_focus:
                "Sugarcane, horticulture, vegetables, cereals and precision irrigation",
            note:
                "Crop planning should consider local variation in rainfall, elevation and irrigation availability."
        },

        Raigad: {
            overview:
                "Coastal Maharashtra district with high rainfall and agriculture based on rice, horticulture and plantation crops.",
            major_crops:
                "Rice, mango, coconut, vegetables, pulses and plantation crops",
            rainfall:
                "Approx. 2000–3000 mm annually",
            climate:
                "Warm humid coastal tropical climate",
            farming_focus:
                "Rice, mango, coconut, vegetables and horticulture",
            note:
                "Drainage, soil conservation and management of high monsoon rainfall are important."
        },

        Ratnagiri: {
            overview:
                "High-rainfall Konkan district strongly associated with mango, coconut, cashew and rice cultivation.",
            major_crops:
                "Mango, rice, coconut, cashew, kokum and vegetables",
            rainfall:
                "Approx. 2500–3500 mm annually",
            climate:
                "Warm humid coastal tropical climate with very heavy southwest monsoon",
            farming_focus:
                "Alphonso mango, cashew, coconut, rice and horticulture",
            note:
                "Good drainage, orchard soil conservation and monsoon disease management are important."
        },

        Sangli: {
            overview:
                "Diverse agricultural district and important sugarcane and grape-growing region.",
            major_crops:
                "Sugarcane, grapes, turmeric, jowar, soybean, groundnut and vegetables",
            rainfall:
                "Approx. 500–800 mm annually",
            climate:
                "Semi-arid tropical climate with wetter conditions toward the western part",
            farming_focus:
                "Sugarcane, grapes, turmeric, cereals and irrigated horticulture",
            note:
                "Efficient irrigation and disease management are important for high-value crops."
        },

        Satara: {
            overview:
                "Geographically varied district ranging from dry eastern areas to high-rainfall western hills.",
            major_crops:
                "Sugarcane, jowar, bajra, wheat, rice, strawberry, vegetables and horticultural crops",
            rainfall:
                "Approx. 600–2500 mm depending on location",
            climate:
                "Tropical climate with dry eastern and high-rainfall western zones",
            farming_focus:
                "Sugarcane, cereals, strawberry, vegetables and diversified horticulture",
            note:
                "Local rainfall and elevation should be considered when selecting crops and irrigation schedules."
        },

        Sindhudurg: {
            overview:
                "High-rainfall Konkan district with strong horticultural and plantation agriculture.",
            major_crops:
                "Rice, mango, coconut, cashew, kokum, vegetables and plantation crops",
            rainfall:
                "Approx. 2500–3500 mm annually",
            climate:
                "Warm humid coastal tropical climate",
            farming_focus:
                "Mango, cashew, coconut, rice and diversified horticulture",
            note:
                "Drainage, soil conservation and monsoon disease management are important."
        },

        Solapur: {
            overview:
                "Dry agricultural district with major dryland crops and important irrigated horticulture.",
            major_crops:
                "Jowar, bajra, wheat, pulses, sugarcane, grapes, pomegranate and onion",
            rainfall:
                "Approx. 450–650 mm annually",
            climate:
                "Hot semi-arid tropical climate",
            farming_focus:
                "Dryland cereals, pulses, pomegranate, grapes, sugarcane and water-efficient farming",
            note:
                "Water conservation, drip irrigation and drought-resilient crop planning are especially important."
        },

        Thane: {
            overview:
                "Urbanizing district with limited conventional farming but peri-urban and hilly agricultural zones.",
            major_crops:
                "Rice, vegetables, fruits, coconut and horticultural crops",
            rainfall:
                "Approx. 1800–2500 mm annually",
            climate:
                "Warm humid coastal tropical climate with monsoon rainfall",
            farming_focus:
                "Rice, peri-urban vegetables, horticulture and plantation crops",
            note:
                "Drainage, protected cultivation and efficient use of limited agricultural land are useful."
        },

        Wardha: {
            overview:
                "Central Vidarbha agricultural district with cotton and soybean among important crops.",
            major_crops:
                "Cotton, soybean, tur, wheat, gram, jowar and vegetables",
            rainfall:
                "Approx. 800–1000 mm annually",
            climate:
                "Hot tropical wet-and-dry climate",
            farming_focus:
                "Cotton, soybean, pulses, cereals and rainfed farming",
            note:
                "Moisture conservation, timely sowing and integrated pest management are useful."
        },

        Washim: {
            overview:
                "Dryland western Vidarbha district where soybean, cotton and pulses are important.",
            major_crops:
                "Soybean, cotton, tur, gram, jowar, wheat and maize",
            rainfall:
                "Approx. 700–900 mm annually",
            climate:
                "Hot semi-arid to tropical wet-and-dry climate",
            farming_focus:
                "Soybean, cotton, pulses, cereals and soil moisture conservation",
            note:
                "Timely sowing, soil testing and water conservation help manage seasonal rainfall variation."
        },

        Yavatmal: {
            overview:
                "Major Vidarbha agricultural district with extensive cotton and soybean cultivation.",
            major_crops:
                "Cotton, soybean, tur, jowar, wheat, gram and other pulses",
            rainfall:
                "Approx. 900–1100 mm annually",
            climate:
                "Hot tropical wet-and-dry climate",
            farming_focus:
                "Cotton, soybean, pulses, cereals and rainfed agriculture",
            note:
                "Timely sowing, integrated pest management, soil testing and moisture conservation are important."
        }

    };


    /* =====================================================
       DISTRICT ALIASES
    ===================================================== */

    const DISTRICT_ALIASES = {

        ahilyanagar:
            "Ahmednagar",

        ahmednagar:
            "Ahmednagar",

        chhatrapatisambhajinagar:
            "Aurangabad",

        dharashiv:
            "Osmanabad",

        osmanabad:
            "Osmanabad"

    };


    /* =====================================================
       MAHARASHTRA DISTRICTS
    ===================================================== */

    const MAHARASHTRA_DISTRICTS =
        Object.keys(
            DISTRICT_INFORMATION
        );


    /* =====================================================
       CLEAN DISTRICT KEY
    ===================================================== */

    function cleanKey(value) {

        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[_-]/g, " ")
            .replace(/\s+/g, " ");

    }


    /* =====================================================
       RESOLVE DISTRICT KEY
    ===================================================== */

    function districtKey(value) {

        const key =
            cleanKey(value);

        return (
            DISTRICT_ALIASES[key] ||
            MAHARASHTRA_DISTRICTS.find(
                function (districtName) {

                    return (
                        cleanKey(districtName) === key
                    );

                }
            ) ||
            "Nagpur"
        );

    }


    /* =====================================================
       VALID VALUE
    ===================================================== */

    function validValue(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return false;

        }

        const text =
            String(value).trim();

        return (
            text !== "" &&
            text !== "—" &&
            text !== "-" &&
            text !== "District-specific" &&
            text !== "Regional climate" &&
            text !== "Regional climate." &&
            text !==
                "Use locally suitable crops based on soil, rainfall and season." &&
            text !==
                "Soil- and season-based farming"
        );

    }


    /* =====================================================
       DISTRICT DROPDOWN
    ===================================================== */

    if (
        district &&
        district.tagName === "SELECT"
    ) {

        district.innerHTML =
            `
                <option value="">
                    Select District
                </option>
            `;

        MAHARASHTRA_DISTRICTS.forEach(
            function (districtName) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    districtName;

                option.textContent =
                    districtName;

                district.appendChild(
                    option
                );

            }
        );

    }


    /* =====================================================
       STATE → DISTRICT
    ===================================================== */

    if (
        state &&
        district
    ) {

        function updateDistrictDropdown() {

            const selectedState =
                String(
                    state.value || ""
                )
                    .trim()
                    .toLowerCase();

            const isMaharashtra =
                selectedState ===
                "maharashtra";


            if (
                isMaharashtra
            ) {

                district.disabled =
                    false;

                district.style.cursor =
                    "pointer";

            } else {

                district.disabled =
                    true;

                district.value =
                    "";

            }

        }


        state.addEventListener(
            "change",
            updateDistrictDropdown
        );


        updateDistrictDropdown();

    }


    /* =====================================================
       FORM MESSAGE
    ===================================================== */

    function showMessage(
        message,
        type
    ) {

        if (!formMessage) {

            return;

        }

        formMessage.textContent =
            message;

        formMessage.className =
            "form-message";


        if (type) {

            formMessage.classList.add(
                type
            );

        }

    }


    function clearMessage() {

        if (!formMessage) {

            return;

        }

        formMessage.textContent =
            "";

        formMessage.className =
            "form-message";

    }


    /* =====================================================
       NUMBER HELPER
    ===================================================== */

    function getNumber(element) {

        if (!element) {

            return NaN;

        }

        return Number(
            element.value
        );

    }


    /* =====================================================
       VALIDATE FIELD
    ===================================================== */

    function validateField(
        element,
        label,
        min,
        max
    ) {

        if (!element) {

            return true;

        }

        const value =
            element.value.trim();


        if (
            value === ""
        ) {

            showMessage(
                `${label} is required.`,
                "error"
            );

            element.focus();

            return false;

        }


        const number =
            Number(value);


        if (
            !Number.isFinite(number)
        ) {

            showMessage(
                `${label} must be a valid number.`,
                "error"
            );

            element.focus();

            return false;

        }


        if (
            number < min ||
            number > max
        ) {

            showMessage(
                `${label} must be between ${min} and ${max}.`,
                "error"
            );

            element.focus();

            return false;

        }


        return true;

    }


    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    function validateForm() {

        clearMessage();


        if (
            state &&
            state.value.trim() === ""
        ) {

            showMessage(
                "Please select your state.",
                "error"
            );

            state.focus();

            return false;

        }


        if (
            district &&
            district.value.trim() === ""
        ) {

            showMessage(
                "Please select your district.",
                "error"
            );

            district.focus();

            return false;

        }


        if (
            !validateField(
                nitrogen,
                "Nitrogen",
                0,
                140
            )
        ) {

            return false;

        }


        if (
            !validateField(
                phosphorus,
                "Phosphorus",
                0,
                145
            )
        ) {

            return false;

        }


        if (
            !validateField(
                potassium,
                "Potassium",
                0,
                205
            )
        ) {

            return false;

        }


        if (
            !validateField(
                temperature,
                "Temperature",
                -10,
                60
            )
        ) {

            return false;

        }


        if (
            !validateField(
                humidity,
                "Humidity",
                0,
                100
            )
        ) {

            return false;

        }


        if (
            !validateField(
                ph,
                "pH",
                0,
                14
            )
        ) {

            return false;

        }


        if (
            !validateField(
                rainfall,
                "Rainfall",
                0,
                3000
            )
        ) {

            return false;

        }


        return true;

    }


    /* =====================================================
       ENTER → NEXT FIELD
    ===================================================== */

    const inputFields = [

        state,
        district,
        nitrogen,
        phosphorus,
        potassium,
        temperature,
        humidity,
        ph,
        rainfall

    ].filter(Boolean);


    inputFields.forEach(
        function (field, index) {

            field.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key !== "Enter"
                    ) {

                        return;

                    }

                    event.preventDefault();


                    const nextField =
                        inputFields[
                            index + 1
                        ];


                    if (
                        nextField
                    ) {

                        nextField.focus();

                    } else if (
                        cropForm
                    ) {

                        cropForm.requestSubmit();

                    }

                }
            );

        }
    );


    /* =====================================================
       FORMAT CROP NAME
    ===================================================== */

    function formatCropName(crop) {

        if (
            crop === null ||
            crop === undefined
        ) {

            return "";

        }

        return String(crop)
            .trim()
            .replace(
                /[_-]+/g,
                " "
            )
            .replace(
                /\s+/g,
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
       CROP IMAGE PATH
    ===================================================== */

    function getCropImagePath(crop) {

        const name =
            String(crop)
                .trim()
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "_"
                )
                .replace(
                    /-/g,
                    "_"
                );

        return `${API_URL}/images/${name}.jpg`;

    }
        /* =====================================================
       MAIN CROP IMAGE
    ===================================================== */

    function setMainCropImage(crop) {

        if (!cropImage) {

            return;

        }


        if (imageFallback) {

            imageFallback.style.display =
                "none";

        }


        cropImage.style.display =
            "block";


        cropImage.src =
            getCropImagePath(crop);


        cropImage.alt =
            `${formatCropName(crop)} crop`;


        cropImage.onerror =
            function () {

                cropImage.style.display =
                    "none";


                if (imageFallback) {

                    imageFallback.style.display =
                        "flex";

                }

            };

    }


    /* =====================================================
       TOP RECOMMENDATION IMAGE
    ===================================================== */

    function setRecommendationImage(
        image,
        crop
    ) {

        if (!image) {

            return;

        }


        const fallback =
            image.parentElement
                ?.querySelector(
                    ".top-crop-image-fallback"
                );


        image.src =
            getCropImagePath(crop);


        image.alt =
            `${formatCropName(crop)} crop`;


        image.onerror =
            function () {

                image.style.display =
                    "none";


                if (fallback) {

                    fallback.style.display =
                        "flex";

                }

            };

    }


    /* =====================================================
       RENDER TOP 3 RECOMMENDATIONS
    ===================================================== */

    function renderTopRecommendations(
        recommendations
    ) {

        if (!topRecommendations) {

            return;

        }


        topRecommendations.innerHTML =
            "";


        if (topRecommendationNote) {

            topRecommendationNote.textContent =
                "";

        }


        if (
            !Array.isArray(
                recommendations
            ) ||
            recommendations.length === 0
        ) {

            if (topRecommendationNote) {

                topRecommendationNote.textContent =
                    "The model did not return additional recommendation scores.";

            }

            return;

        }


        const valid =
            recommendations
                .filter(
                    function (item) {

                        if (
                            !item ||
                            !item.crop
                        ) {

                            return false;

                        }


                        const probability =
                            Number(
                                item.probability
                            );


                        return (
                            Number.isFinite(
                                probability
                            ) &&
                            probability > 0
                        );

                    }
                )
                .slice(
                    0,
                    3
                );


        if (
            valid.length === 0
        ) {

            if (topRecommendationNote) {

                topRecommendationNote.textContent =
                    "The model did not return positive recommendation scores.";

            }

            return;

        }


        valid.forEach(
            function (item, index) {

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
                        ${String(
                            index + 1
                        ).padStart(
                            2,
                            "0"
                        )}
                    </div>

                    <div class="top-crop-image-wrapper">

                        <img
                            class="top-crop-image"
                            alt="${cropName}"
                        >

                        <div
                            class="top-crop-image-fallback"
                            style="display:flex;"
                        >
                            🌱
                        </div>

                    </div>

                    <div class="top-crop-content">

                        <span class="top-crop-position">

                            ${
                                index === 0
                                    ? "BEST MATCH"
                                    : "MODEL ALTERNATIVE"

                            }

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
                `The model returned ${
                    valid.length
                } result${
                    valid.length === 1
                        ? ""
                        : "s"
                }. No artificial crops were added.`;

        }

    }


    /* =====================================================
       CROP TIPS
    ===================================================== */

    const CROP_TIPS = {

        rice:
            "Maintain suitable field moisture, control weeds early and monitor pests regularly.",

        maize:
            "Maintain proper spacing, weed control and moisture during critical growth stages.",

        chickpea:
            "Use well-drained fields, timely sowing and avoid unnecessary irrigation.",

        kidneybeans:
            "Maintain uniform moisture and good spacing for air circulation.",

        pigeonpeas:
            "Maintain drainage and monitor pod pests during flowering and pod formation.",

        mothbeans:
            "Use moisture efficiently and maintain weed control during early growth.",

        mungbean:
            "Keep the field weed-free and avoid standing water.",

        blackgram:
            "Maintain drainage and control weeds during early crop growth.",

        lentil:
            "Maintain moderate soil moisture and avoid unnecessary irrigation.",

        pomegranate:
            "Use regulated irrigation, canopy management and orchard sanitation.",

        banana:
            "Use regular irrigation, mulching and suitable drainage.",

        mango:
            "Maintain orchard sanitation, suitable irrigation and canopy management.",

        grapes:
            "Use drip irrigation, canopy management and careful disease monitoring.",

        watermelon:
            "Maintain regular moisture and good drainage during fruit development.",

        muskmelon:
            "Provide good sunlight, drainage and controlled irrigation.",

        apple:
            "Maintain pruning, irrigation and orchard disease management.",

        orange:
            "Use drip irrigation where suitable and maintain orchard sanitation.",

        papaya:
            "Maintain uniform moisture and good drainage.",

        coconut:
            "Maintain moisture, mulch around palms and ensure drainage.",

        cotton:
            "Maintain proper spacing, weed control and regular pest scouting.",

        jute:
            "Maintain adequate soil moisture and control weeds during early growth.",

        coffee:
            "Maintain shade, soil moisture, drainage and regular pest and disease monitoring.",

        wheat:
            "Maintain timely sowing and irrigation at critical growth stages.",

        sugarcane:
            "Use efficient irrigation, weed management and balanced nutrient application.",

        groundnut:
            "Maintain loose soil and avoid excess moisture around pegging and maturity.",

        potato:
            "Maintain uniform moisture and earthing-up during crop growth.",

        tomato:
            "Use staking where suitable, maintain irrigation and monitor disease symptoms.",

        onion:
            "Maintain uniform moisture and stop irrigation suitably before harvest.",

        chilli:
            "Maintain regular irrigation and monitor sucking pests.",

        peas:
            "Provide suitable support for climbing types and maintain moderate moisture.",

        sunflower:
            "Ensure good sunlight, timely weed control and moisture at critical stages.",

        barley:
            "Maintain timely sowing and moderate irrigation."

    };


    /* =====================================================
       CROP PRECAUTIONS
    ===================================================== */

    const CROP_PRECAUTIONS = {

        rice:
            "Avoid uncontrolled waterlogging, excessive nitrogen and delayed pest management.",

        maize:
            "Avoid prolonged waterlogging and monitor stem borers and other pests.",

        chickpea:
            "Avoid waterlogging and monitor pod borer and wilt symptoms.",

        kidneybeans:
            "Avoid waterlogging and monitor fungal diseases.",

        pigeonpeas:
            "Avoid prolonged waterlogging and excessive nitrogen application.",

        mothbeans:
            "Avoid excessive irrigation and poorly drained fields.",

        mungbean:
            "Avoid waterlogging and monitor yellow mosaic and sucking pests.",

        blackgram:
            "Avoid prolonged waterlogging and monitor sucking pests.",

        lentil:
            "Avoid waterlogging and monitor wilt and rust symptoms.",

        pomegranate:
            "Avoid waterlogging and monitor bacterial, fungal and insect problems.",

        banana:
            "Avoid prolonged waterlogging and monitor wilt, Sigatoka and insect pests.",

        mango:
            "Avoid excess irrigation during flowering and monitor pests and fungal diseases.",

        grapes:
            "Avoid excess humidity in the canopy and over-irrigation near maturity.",

        watermelon:
            "Avoid waterlogging and excessive irrigation near maturity.",

        muskmelon:
            "Avoid waterlogging and excessive nitrogen during fruiting.",

        apple:
            "Avoid unsuitable warm locations and monitor fungal diseases.",

        orange:
            "Avoid waterlogging and monitor citrus pests, nutrient deficiencies and diseases.",

        papaya:
            "Avoid waterlogging and monitor viral diseases and mites.",

        coconut:
            "Avoid prolonged waterlogging and monitor rhinoceros beetle and other pests.",

        cotton:
            "Monitor bollworms and sucking pests and avoid excessive nitrogen.",

        jute:
            "Avoid prolonged uncontrolled waterlogging and monitor fungal problems.",

        coffee:
            "Avoid prolonged waterlogging, excessive direct heat and poor drainage.",

        wheat:
            "Avoid excess irrigation and monitor rust and other fungal diseases.",

        sugarcane:
            "Avoid prolonged waterlogging and monitor borers, red rot and other diseases.",

        groundnut:
            "Avoid waterlogging and monitor leaf spots and pod diseases.",

        potato:
            "Avoid waterlogging and monitor late blight and tuber diseases.",

        tomato:
            "Avoid prolonged leaf wetness and monitor wilt, blight and insect pests.",

        onion:
            "Avoid excess nitrogen and waterlogging and monitor thrips and fungal diseases.",

        chilli:
            "Avoid waterlogging and monitor viral, fungal and insect problems.",

        peas:
            "Avoid waterlogging and monitor powdery mildew and pod pests.",

        sunflower:
            "Avoid waterlogging and monitor head and leaf diseases.",

        barley:
            "Avoid excessive irrigation and monitor rust and other fungal diseases."

    };


    /* =====================================================
       SAFE TEXT
    ===================================================== */

    function safeText(
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
       SET TEXT
    ===================================================== */

    function setText(
        element,
        value,
        fallback = "—"
    ) {

        if (!element) {

            return;

        }


        element.textContent =
            validValue(value)
                ? value
                : fallback;

    }


    /* =====================================================
       RENDER RESULT
    ===================================================== */

    function renderResult(data) {

        if (
            !data ||
            data.success !== true
        ) {

            return;

        }


        const crop =
            data.recommended_crop;


        const confidence =
            Number(
                data.confidence
            );


        const farm =
            data.farm_data || {};


        const cropInfo =
            data.crop_information || {};


        const districtInfo =
            data.district_intelligence || {};


        /* =================================================
           MAIN RECOMMENDATION
        ================================================= */

        if (recommendedCrop) {

            recommendedCrop.textContent =
                formatCropName(
                    crop
                );

        }


        if (confidenceValue) {

            confidenceValue.textContent =
                Number.isFinite(
                    confidence
                )
                    ? `${confidence}%`
                    : "—";

        }


        /* =================================================
           MAIN IMAGE
        ================================================= */

        setMainCropImage(
            crop
        );


        /* =================================================
           FARM DATA
        ================================================= */

        setText(
            resultState,
            farm.state
        );

        setText(
            resultDistrict,
            farm.district
        );

        setText(
            resultNitrogen,
            farm.N
        );

        setText(
            resultPhosphorus,
            farm.P
        );

        setText(
            resultPotassium,
            farm.K
        );

        setText(
            resultTemperature,
            farm.temperature
        );

        setText(
            resultHumidity,
            farm.humidity
        );

        setText(
            resultPh,
            farm.ph
        );

        setText(
            resultRainfall,
            farm.rainfall
        );


        /* =================================================
           CROP INFORMATION
        ================================================= */

        setText(
            cropSeason,
            cropInfo.season
        );

        setText(
            cropSoil,
            cropInfo.soil
        );

        setText(
            cropWater,
            cropInfo.water
        );

        setText(
            cropTemperature,
            cropInfo.temperature
        );

        setText(
            cropPh,
            cropInfo.ph
        );

        setText(
            cropFertilizer,
            cropInfo.fertilizer
        );

        setText(
            cropSowing,
            cropInfo.sowing
        );

        setText(
            cropHarvesting,
            cropInfo.harvesting
        );


        /* =================================================
           TIPS / PRECAUTIONS
        ================================================= */

        const cropKeyForFallback =
            String(crop || "")
                .trim()
                .toLowerCase()
                .replace(
                    /[ _-]+/g,
                    ""
                );


        const fallbackTips =
            CROP_TIPS[
                cropKeyForFallback
            ] ||
            "Maintain suitable soil moisture, balanced nutrition, weed control and regular crop monitoring.";


        const fallbackPrecautions =
            CROP_PRECAUTIONS[
                cropKeyForFallback
            ] ||
            "Avoid unsuitable water conditions and monitor crop pests and diseases regularly.";


        if (cropTips) {

            cropTips.textContent =
                validValue(
                    cropInfo.tips
                )
                    ? cropInfo.tips
                    : fallbackTips;

        }


        if (cropPrecautions) {

            cropPrecautions.textContent =
                validValue(
                    cropInfo.precautions
                )
                    ? cropInfo.precautions
                    : fallbackPrecautions;

        }


        /* =================================================
           DISTRICT INFORMATION
        ================================================= */

        const districtName =
            String(
                farm.district ||
                (
                    district
                        ? district.value
                        : ""
                ) ||
                ""
            ).trim();


        const resolvedDistrict =
            districtKey(
                districtName
            );


        const localDistrict =
            DISTRICT_INFORMATION[
                resolvedDistrict
            ] ||
            DISTRICT_INFORMATION.Nagpur;


        if (districtTitle) {

            districtTitle.textContent =
                `${districtName || resolvedDistrict}, ${
                    farm.state ||
                    "Maharashtra"
                }`;

        }


        setText(
            districtOverview,
            validValue(
                districtInfo.overview
            )
                ? districtInfo.overview
                : localDistrict.overview,
            localDistrict.overview
        );


        setText(
            districtMajorCrops,
            validValue(
                districtInfo.major_crops
            )
                ? districtInfo.major_crops
                : localDistrict.major_crops,
            localDistrict.major_crops
        );


        setText(
            districtRainfall,
            validValue(
                districtInfo.rainfall
            )
                ? districtInfo.rainfall
                : localDistrict.rainfall,
            localDistrict.rainfall
        );


        setText(
            districtClimate,
            validValue(
                districtInfo.climate
            )
                ? districtInfo.climate
                : localDistrict.climate,
            localDistrict.climate
        );


        setText(
            districtFarmingFocus,
            validValue(
                districtInfo.farming_focus
            )
                ? districtInfo.farming_focus
                : localDistrict.farming_focus,
            localDistrict.farming_focus
        );


        setText(
            districtNote,
            validValue(
                districtInfo.note
            )
                ? districtInfo.note
                : localDistrict.note,
            localDistrict.note
        );


        /* =================================================
           TOP 3
        ================================================= */

        renderTopRecommendations(
            data.top_recommendations
        );


        /* =================================================
           SAVE RESULT
        ================================================= */

        try {

            localStorage.setItem(
                "agroai_last_result",
                JSON.stringify(data)
            );


            localStorage.setItem(
                "agroai_selected_crop",
                String(
                    crop || ""
                )
            );


            localStorage.setItem(
                "agroai_selected_district",
                String(
                    farm.district || ""
                )
            );

        } catch (error) {

            console.warn(
                "Unable to save result:",
                error
            );

        }
                /* =================================================
           SHOW RESULT
        ================================================= */

        if (resultSection) {

            resultSection.style.display =
                "";

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
                100
            );

        }

    }


    /* =====================================================
       LOADING STATE
    ===================================================== */

    function setLoading(loading) {

        if (!predictButton) {

            return;

        }


        predictButton.disabled =
            loading;


        if (predictIcon) {

            predictIcon.textContent =
                loading
                    ? "⏳"
                    : "🌱";

        }


        if (predictText) {

            predictText.textContent =
                loading
                    ? "Analyzing..."
                    : "Get Recommendation";

        }

    }


    /* =====================================================
       GET PREDICTION
    ===================================================== */

    async function getPrediction() {

        if (
            !validateForm()
        ) {

            return;

        }


        setLoading(true);

        clearMessage();


        const payload = {

            state:
                state
                    ? state.value.trim()
                    : "",

            district:
                district
                    ? district.value.trim()
                    : "",

            N:
                getNumber(
                    nitrogen
                ),

            P:
                getNumber(
                    phosphorus
                ),

            K:
                getNumber(
                    potassium
                ),

            temperature:
                getNumber(
                    temperature
                ),

            humidity:
                getNumber(
                    humidity
                ),

            ph:
                getNumber(
                    ph
                ),

            rainfall:
                getNumber(
                    rainfall
                )

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


            let result;


            try {

                result =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "Invalid response received from AgroAI server."
                );

            }


            if (
                !response.ok
            ) {

                throw new Error(
                    result.detail ||
                    "Prediction request failed."
                );

            }


            if (
                result.success !== true
            ) {

                throw new Error(
                    result.message ||
                    "The model could not generate a recommendation."
                );

            }


            renderResult(
                result
            );


            showMessage(
                "Crop recommendation generated successfully.",
                "success"
            );

        } catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to connect to AgroAI backend.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    if (cropForm) {

        cropForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                getPrediction();

            }
        );

    }


    /* =====================================================
       RESET FORM
    ===================================================== */

    function resetForm() {

        if (cropForm) {

            cropForm.reset();

        }


        clearMessage();


        /* ---------------------------------------------
           DISTRICT RESET
        --------------------------------------------- */

        if (
            state &&
            district
        ) {

            district.value =
                "";

            district.disabled =
                true;

        }


        /* ---------------------------------------------
           RESULT RESET
        --------------------------------------------- */

        if (resultSection) {

            resultSection.classList.remove(
                "show"
            );

            resultSection.style.display =
                "none";

        }


        /* ---------------------------------------------
           MAIN IMAGE RESET
        --------------------------------------------- */

        if (cropImage) {

            cropImage.removeAttribute(
                "src"
            );

            cropImage.style.display =
                "none";

        }


        if (imageFallback) {

            imageFallback.style.display =
                "flex";

        }


        /* ---------------------------------------------
           TOP RECOMMENDATIONS RESET
        --------------------------------------------- */

        if (topRecommendations) {

            topRecommendations.innerHTML =
                "";

        }


        if (topRecommendationNote) {

            topRecommendationNote.textContent =
                "";

        }

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                resetForm();

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

                resetForm();


                if (cropForm) {

                    cropForm.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );

                }

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

                try {

                    const savedResult =
                        localStorage.getItem(
                            "agroai_last_result"
                        );


                    if (!savedResult) {

                        showMessage(
                            "Generate a recommendation first.",
                            "error"
                        );

                        return;

                    }


                    const blob =
                        new Blob(
                            [
                                savedResult
                            ],
                            {
                                type:
                                    "application/json"
                            }
                        );


                    const url =
                        URL.createObjectURL(
                            blob
                        );


                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        url;


                    link.download =
                        "AgroAI_Crop_Recommendation.json";


                    document.body.appendChild(
                        link
                    );


                    link.click();


                    link.remove();


                    URL.revokeObjectURL(
                        url
                    );


                    showMessage(
                        "Recommendation saved successfully.",
                        "success"
                    );

                } catch (error) {

                    console.error(
                        "Save error:",
                        error
                    );


                    showMessage(
                        "Unable to save recommendation.",
                        "error"
                    );

                }

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
                    );


                const districtName =
                    localStorage.getItem(
                        "agroai_selected_district"
                    );


                let question =
                    "Tell me about this crop recommendation.";


                if (crop) {

                    question =
                        `Tell me more about ${
                            formatCropName(
                                crop
                            )
                        }`;


                    if (districtName) {

                        question +=
                            ` farming in ${districtName}.`;

                    }

                }


                localStorage.setItem(
                    "agroai_chat_question",
                    question
                );


                window.location.href =
                    "chatbot.html";

            }
        );

    }


    /* =====================================================
       LIVE DATE / TIME
    ===================================================== */

    function updateDateTime() {

        const now =
            new Date();


        if (dateElement) {

            dateElement.textContent =
                now.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        if (timeElement) {

            timeElement.textContent =
                now.toLocaleTimeString(
                    "en-GB",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                    }
                );

        }

    }


    updateDateTime();


    setInterval(
        updateDateTime,
        1000
    );


    /* =====================================================
       LOAD SAVED RESULT
    ===================================================== */

    function loadSavedResult() {

        try {

            const saved =
                localStorage.getItem(
                    "agroai_last_result"
                );


            if (!saved) {

                return;

            }


            const data =
                JSON.parse(
                    saved
                );


            if (
                data &&
                data.success === true
            ) {

                /*
                   Saved result is intentionally
                   not displayed automatically.
                */

            }

        } catch (error) {

            console.warn(
                "Saved result could not be read:",
                error
            );

        }

    }


    loadSavedResult();


    /* =====================================================
       NUMBER INPUT CLEANUP
    ===================================================== */

    const numericFields = [

        nitrogen,
        phosphorus,
        potassium,
        temperature,
        humidity,
        ph,
        rainfall

    ].filter(Boolean);


    numericFields.forEach(
        function (field) {

            field.addEventListener(
                "input",
                function () {

                    if (
                        formMessage &&
                        formMessage.classList.contains(
                            "error"
                        )
                    ) {

                        clearMessage();

                    }

                }
            );

        }
    );


    /* =====================================================
       CLEAR MESSAGE ON SELECT CHANGE
    ===================================================== */

    [
        state,
        district

    ]
        .filter(Boolean)
        .forEach(
            function (field) {

                field.addEventListener(
                    "change",
                    function () {

                        clearMessage();

                    }
                );

            }
        );


    /* =====================================================
       BACKEND CONNECTION CHECK
    ===================================================== */

    async function checkBackendConnection() {

        try {

            await fetch(
                `${API_URL}/docs`,
                {
                    method: "GET"
                }
            );


            return true;

        } catch (error) {

            console.warn(
                "AgroAI backend is not reachable.",
                error
            );


            return false;

        }

    }


    checkBackendConnection();


    /* =====================================================
       END DOM READY
    ===================================================== */

});
/* =========================================================
   AGROAI CROP.JS
   FINAL STRUCTURE CHECK
========================================================= */

/*
   IMPORTANT:

   1. DOMContentLoaded → OPENED in Part 1
   2. DOMContentLoaded → CLOSED in Part 3
   3. renderTopRecommendations() → ONLY ONE
   4. safeText() → ONLY ONE
   5. setText() → ONLY ONE
   6. renderResult() → ONLY ONE
   7. setLoading() → ONLY ONE
   8. getPrediction() → ONLY ONE
   9. resetForm() → ONLY ONE
   10. district dropdown → ENABLED for Maharashtra
   11. Top 3 → ONLY positive model scores
   12. 0% crops → NOT displayed
   13. District intelligence → district-wise fallback
   14. Crop tips → crop-wise fallback
   15. Crop precautions → crop-wise fallback
   16. Enter → next field
   17. Last Enter → prediction
   18. Print → window.print()
   19. Save → JSON download
   20. Ask AgroAI → chatbot.html
   21. Date/time → live update
*/