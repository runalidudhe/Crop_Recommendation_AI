"use strict";

/* =========================================================
   AGROAI CHATBOT
   CLEAN SINGLE FILE
   English + Hindi + Hinglish + Marathi
========================================================= */

const AgroAI = (() => {

    /* =====================================================
       CROPS
    ===================================================== */

    const CROPS = [

        "rice",
        "maize",
        "chickpea",
        "kidneybeans",
        "pigeonpeas",
        "mothbeans",
        "mungbean",
        "blackgram",
        "lentil",
        "pomegranate",
        "banana",
        "mango",
        "grapes",
        "watermelon",
        "muskmelon",
        "apple",
        "orange",
        "papaya",
        "coconut",
        "cotton",
        "jute",
        "coffee",
        "barley",
        "chilli",
        "groundnut",
        "onion",
        "peas",
        "potato",
        "sugarcane",
        "sunflower",
        "tomato",
        "wheat"

    ];


    /* =====================================================
       CROP DISPLAY NAMES
    ===================================================== */

    const CROP_NAMES = {

        rice: "Rice",
        maize: "Maize",
        chickpea: "Chickpea",
        kidneybeans: "Kidney Beans",
        pigeonpeas: "Pigeon Pea",
        mothbeans: "Moth Bean",
        mungbean: "Mung Bean",
        blackgram: "Black Gram",
        lentil: "Lentil",
        pomegranate: "Pomegranate",
        banana: "Banana",
        mango: "Mango",
        grapes: "Grapes",
        watermelon: "Watermelon",
        muskmelon: "Muskmelon",
        apple: "Apple",
        orange: "Orange",
        papaya: "Papaya",
        coconut: "Coconut",
        cotton: "Cotton",
        jute: "Jute",
        coffee: "Coffee",
        barley: "Barley",
        chilli: "Chilli",
        groundnut: "Groundnut",
        onion: "Onion",
        peas: "Peas",
        potato: "Potato",
        sugarcane: "Sugarcane",
        sunflower: "Sunflower",
        tomato: "Tomato",
        wheat: "Wheat"

    };


    /* =====================================================
       CROP ALIASES
    ===================================================== */

    const ALIASES = {

        rice: [
            "rice",
            "paddy",
            "tandul",
            "धान"
        ],

        maize: [
            "maize",
            "corn",
            "makka",
            "मक्का"
        ],

        chickpea: [
            "chickpea",
            "chana",
            "gram",
            "चना",
            "harbhara",
            "हरभरा"
        ],

        kidneybeans: [
            "kidney bean",
            "rajma",
            "राजमा"
        ],

        pigeonpeas: [
            "pigeon pea",
            "tur",
            "toor",
            "arhar",
            "तूर",
            "अरहर"
        ],

        mothbeans: [
            "moth bean",
            "matki",
            "मटकी"
        ],

        mungbean: [
            "mung bean",
            "moong",
            "green gram",
            "मूंग"
        ],

        blackgram: [
            "black gram",
            "urad",
            "उड़द"
        ],

        lentil: [
            "lentil",
            "masoor",
            "मसूर"
        ],

        pomegranate: [
            "pomegranate",
            "anar",
            "अनार"
        ],

        banana: [
            "banana",
            "kela",
            "केला"
        ],

        mango: [
            "mango",
            "aam",
            "आम"
        ],

        grapes: [
            "grapes",
            "grape",
            "angoor",
            "अंगूर",
            "द्राक्ष"
        ],

        watermelon: [
            "watermelon",
            "तरबूज"
        ],

        muskmelon: [
            "muskmelon",
            "kharbuja",
            "खरबूजा"
        ],

        apple: [
            "apple",
            "सेब"
        ],

        orange: [
            "orange",
            "santra",
            "संतरा"
        ],

        papaya: [
            "papaya",
            "पपीता"
        ],

        coconut: [
            "coconut",
            "नारियल"
        ],

        cotton: [
            "cotton",
            "kapas",
            "कपास"
        ],

        jute: [
            "jute",
            "जूट"
        ],

        coffee: [
            "coffee",
            "कॉफी"
        ],

        barley: [
            "barley",
            "jau",
            "जौ"
        ],

        chilli: [
            "chilli",
            "chili",
            "mirchi",
            "मिर्च"
        ],

        groundnut: [
            "groundnut",
            "peanut",
            "shengdana",
            "मूंगफली"
        ],

        onion: [
            "onion",
            "kanda",
            "कांदा",
            "प्याज"
        ],

        peas: [
            "peas",
            "matar",
            "मटर"
        ],

        potato: [
            "potato",
            "aloo",
            "आलू",
            "batata",
            "बटाटा"
        ],

        sugarcane: [
            "sugarcane",
            "ganna",
            "गन्ना",
            "oos",
            "ऊस"
        ],

        sunflower: [
            "sunflower",
            "सूरजमुखी"
        ],

        tomato: [
            "tomato",
            "tamatar",
            "टमाटर"
        ],

        wheat: [
            "wheat",
            "gehun",
            "गेहूं",
            "gahu",
            "गहू"
        ]

    };


    /* =====================================================
       CROP INFORMATION
    ===================================================== */

    const DATA = {

        rice: {

            soil:
                "Clay loam to loam with good water-holding capacity. Slightly acidic to neutral soil is generally suitable.",

            water:
                "Keep moisture adequate during establishment. Avoid uncontrolled standing water for the whole season. Irrigation depends on the rice production system.",

            fert:
                "Use a soil-test-based NPK plan. Nitrogen is usually split into multiple applications rather than applied all at once.",

            pest:
                "Common issues include stem borer, leaf folder and planthoppers. Use field scouting, balanced nitrogen and integrated pest management.",

            disease:
                "Blast, bacterial leaf blight and sheath blight can occur. Use healthy seed, proper spacing, field sanitation and resistant varieties where available.",

            harvest:
                "Harvest when most grains have matured and panicles have changed colour. Avoid excessive delay to reduce shattering and grain loss."

        },


        maize: {

            soil:
                "Well-drained fertile loam or sandy loam with good organic matter.",

            water:
                "Maintain steady moisture during germination, flowering and grain filling. Avoid drought stress and waterlogging.",

            fert:
                "Apply nitrogen in split doses and base phosphorus and potassium on soil-test results.",

            pest:
                "Fall armyworm and stem borers can damage maize. Scout early and use integrated pest management.",

            disease:
                "Leaf blights and stalk rots are possible. Use clean seed, crop rotation and tolerant varieties.",

            harvest:
                "Harvest when husks dry and kernels reach physiological maturity."

        },


        chickpea: {

            soil:
                "Well-drained loam to sandy loam. Avoid prolonged waterlogging.",

            water:
                "Chickpea generally needs moderate water. Avoid excess irrigation, especially near maturity.",

            fert:
                "Phosphorus and balanced nutrition are important. Use Rhizobium inoculation where recommended and follow soil-test results.",

            pest:
                "Pod borer is a major pest. Regular scouting and integrated pest management are important.",

            disease:
                "Wilt and root diseases can occur. Use healthy seed, crop rotation and resistant varieties.",

            harvest:
                "Harvest when plants dry and pods turn brown. Dry seed properly before storage."

        },


        kidneybeans: {

            soil:
                "Well-drained fertile loam or sandy loam. Avoid standing water.",

            water:
                "Provide uniform moisture during flowering and pod filling.",

            fert:
                "Use soil-test-based phosphorus, potassium and nitrogen. Excessive nitrogen can delay maturity.",

            pest:
                "Aphids, bean beetles and pod pests may occur. Scout regularly.",

            disease:
                "Anthracnose, rust and bacterial diseases can occur. Use clean seed and good air circulation.",

            harvest:
                "Harvest when pods dry and seeds reach full size. Avoid harvesting during wet conditions."

        },


        pigeonpeas: {

            soil:
                "Well-drained loam to black soil with good drainage.",

            water:
                "Moderate irrigation is usually enough. Avoid waterlogging.",

            fert:
                "Balanced phosphorus and potassium with limited, soil-test-based nitrogen is preferred.",

            pest:
                "Pod borer and pod fly are important pests. Monitor flowering and pod formation.",

            disease:
                "Wilt and sterility mosaic can occur. Use resistant material and manage crop residues.",

            harvest:
                "Harvest when most pods are mature and brown. Dry seed thoroughly."

        },


        mothbeans: {

            soil:
                "Light, well-drained soils are suitable and the crop tolerates dry conditions.",

            water:
                "Low to moderate water requirement. Avoid excessive irrigation.",

            fert:
                "Use soil-test-based balanced nutrition. Phosphorus can support root and reproductive development.",

            pest:
                "Pod borers, aphids and mites may occur. Scout plants regularly.",

            disease:
                "Root rot and leaf diseases can occur under stress or poor drainage.",

            harvest:
                "Harvest when most pods are mature and dry."

        },


        mungbean: {

            soil:
                "Well-drained loam to sandy loam is suitable.",

            water:
                "Provide moisture at establishment and flowering. Avoid waterlogging.",

            fert:
                "Use Rhizobium inoculation and soil-test-based phosphorus and potassium.",

            pest:
                "Whitefly, thrips and pod borers can occur.",

            disease:
                "Yellow mosaic and powdery mildew may occur. Control vectors and use healthy seed.",

            harvest:
                "Harvest mature pods in more than one picking if maturity is uneven."

        },


        blackgram: {

            soil:
                "Well-drained loam or sandy loam with moderate fertility.",

            water:
                "Moderate irrigation. Avoid excess water.",

            fert:
                "Balanced phosphorus and potassium with soil-test-based nitrogen.",

            pest:
                "Whitefly, aphids and pod borers can be important.",

            disease:
                "Yellow mosaic and leaf diseases may occur. Use healthy seed and manage insect vectors.",

            harvest:
                "Harvest when pods turn black and dry, before excessive shattering."

        },


        lentil: {

            soil:
                "Well-drained loam to clay loam. Avoid waterlogging.",

            water:
                "Moderate water requirement with moisture during flowering and pod filling.",

            fert:
                "Phosphorus and sulfur may be important depending on soil status. Use a soil test.",

            pest:
                "Pod borers and aphids may occur.",

            disease:
                "Rust, wilt and root diseases can occur. Use rotation and healthy seed.",

            harvest:
                "Harvest when lower pods are mature and plants turn yellow-brown."

        },


        banana: {

            soil:
                "Deep fertile loam with high organic matter and good drainage.",

            water:
                "Banana needs regular moisture. Irrigate frequently in hot, dry weather while preventing waterlogging.",

            fert:
                "Use a balanced, potassium-rich nutrition program based on soil and plant age.",

            pest:
                "Rhizome weevil, aphids and thrips may occur.",

            disease:
                "Panama wilt, sigatoka and bunch diseases can occur. Use clean planting material and sanitation.",

            harvest:
                "Harvest bunches at mature green stage according to market distance and variety."

        },


        mango: {

            soil:
                "Deep well-drained loam is preferred. Avoid hardpan and waterlogging.",

            water:
                "Young trees need regular irrigation. Mature trees generally need irrigation according to soil moisture and fruit development.",

            fert:
                "Use compost plus balanced NPK according to tree age and soil or leaf analysis.",

            pest:
                "Mango hopper, mealybug and fruit fly are common concerns.",

            disease:
                "Powdery mildew and anthracnose can occur. Manage canopy humidity and use recommended protection.",

            harvest:
                "Harvest at mature green stage when fruit has developed proper size and shape for the variety."

        },


        grapes: {

            soil:
                "Deep well-drained loam or sandy loam with good drainage.",

            water:
                "Irrigation should be controlled and adjusted to growth stage. Avoid excess moisture near ripening.",

            fert:
                "Use soil and leaf testing for balanced nitrogen, potassium, calcium and micronutrients.",

            pest:
                "Thrips, mealybugs and mites may occur.",

            disease:
                "Powdery mildew, downy mildew and bunch rots are major concerns. Canopy management is essential.",

            harvest:
                "Harvest bunches when berries reach the desired maturity, colour and soluble solids for the market."

        },


        watermelon: {

            soil:
                "Sandy loam to loam, warm and well-drained soil.",

            water:
                "Regular moisture is important during fruit development. Reduce excessive irrigation close to harvest.",

            fert:
                "Use compost and soil-test-based NPK. Potassium is important for fruit development.",

            pest:
                "Aphids, whiteflies and fruit flies may occur.",

            disease:
                "Downy mildew, powdery mildew and damping-off can occur. Avoid prolonged leaf wetness.",

            harvest:
                "Harvest when the tendril nearest the fruit dries and other maturity signs are present."

        },


        muskmelon: {

            soil:
                "Warm, fertile, well-drained sandy loam to loam.",

            water:
                "Maintain uniform moisture during fruit development and avoid waterlogging.",

            fert:
                "Balanced NPK with adequate potassium. Use soil testing.",

            pest:
                "Aphids, whiteflies and fruit flies can damage crops.",

            disease:
                "Powdery mildew, downy mildew and damping-off may occur.",

            harvest:
                "Harvest when aroma, netting, colour and maturity stage match the variety and market requirement."

        },


        apple: {

            soil:
                "Deep well-drained loam with good organic matter and suitable pH for the rootstock.",

            water:
                "Provide consistent moisture during active growth and fruit development. Avoid waterlogging.",

            fert:
                "Use soil and leaf testing. Nitrogen should be balanced to avoid excessive vegetative growth.",

            pest:
                "Aphids, mites and fruit borers can occur.",

            disease:
                "Apple scab, powdery mildew and fire blight may occur depending on region.",

            harvest:
                "Harvest according to variety maturity, firmness, colour and intended storage period."

        },


        orange: {

            soil:
                "Well-drained loam to sandy loam. Avoid saline or waterlogged sites.",

            water:
                "Regular irrigation during fruit development, adjusted to soil moisture and weather.",

            fert:
                "Use balanced NPK plus micronutrients according to soil and leaf testing.",

            pest:
                "Citrus psylla, leaf miner, aphids and scale insects can occur.",

            disease:
                "Citrus canker and greening-related decline are important concerns. Use healthy planting material and sanitation.",

            harvest:
                "Harvest when fruit reaches variety-specific colour, size and maturity."

        },


        papaya: {

            soil:
                "Deep fertile well-drained soil. Drainage is especially important.",

            water:
                "Provide regular moisture but never allow prolonged waterlogging.",

            fert:
                "Frequent balanced nutrition with adequate potassium is generally useful. Follow soil testing.",

            pest:
                "Papaya mealybug, mites and aphids may occur.",

            disease:
                "Papaya ringspot and root diseases can be serious. Use healthy seedlings and vector management.",

            harvest:
                "Harvest at mature green or colour-break stage according to market distance."

        },


        coconut: {

            soil:
                "Deep well-drained sandy loam to loam. Suitable coastal soils can be managed with proper drainage.",

            water:
                "Regular irrigation is important in dry periods, especially for young palms.",

            fert:
                "Use organic manure plus balanced NPK and potassium according to soil and palm age.",

            pest:
                "Rhinoceros beetle and red palm weevil are important pests.",

            disease:
                "Bud rot and stem-related diseases may occur under favourable conditions.",

            harvest:
                "Harvest mature nuts at the appropriate interval for the intended use."

        },


        cotton: {

            soil:
                "Deep fertile black soil or well-drained loam depending on region.",

            water:
                "Avoid severe moisture stress at flowering and boll development. Avoid prolonged waterlogging.",

            fert:
                "Nitrogen, phosphorus and potassium should be based on soil testing and crop demand. Split nitrogen where recommended.",

            pest:
                "Pink bollworm, whitefly and sucking pests require regular monitoring.",

            disease:
                "Wilt, boll rot and leaf diseases can occur. Use resistant varieties and field sanitation.",

            harvest:
                "Pick fully opened, dry bolls at regular intervals to maintain fibre quality."

        },


        jute: {

            soil:
                "Fertile alluvial loam with good moisture-holding capacity and drainage.",

            water:
                "Needs adequate moisture during growth but should not remain waterlogged for long periods.",

            fert:
                "Balanced NPK based on soil testing. Nitrogen supports vegetative growth.",

            pest:
                "Jute hairy caterpillar and stem pests may occur.",

            disease:
                "Stem and root diseases can develop under poor field sanitation.",

            harvest:
                "Harvest at suitable plant maturity before excessive fibre coarsening."

        },


        coffee: {

            soil:
                "Deep, fertile, well-drained loam rich in organic matter and slightly acidic conditions.",

            water:
                "Regular moisture is important. Mulch helps conserve soil moisture during dry periods.",

            fert:
                "Split balanced fertilizer applications based on soil and leaf analysis.",

            pest:
                "Coffee berry borer and white stem borer are major pests.",

            disease:
                "Coffee leaf rust and berry diseases can occur. Shade and canopy management matter.",

            harvest:
                "Pick ripe red cherries selectively for better quality."

        },


        barley: {

            soil:
                "Well-drained loam to sandy loam. Avoid prolonged waterlogging.",

            water:
                "Moderate irrigation, especially around establishment and grain filling where rainfall is insufficient.",

            fert:
                "Use soil-test-based nitrogen, phosphorus and potassium. Avoid excessive nitrogen for lodging-prone crops.",

            pest:
                "Aphids and armyworms can occur.",

            disease:
                "Rusts and powdery mildew may occur. Use clean seed and tolerant varieties.",

            harvest:
                "Harvest when grains are mature and moisture is suitable for safe threshing."

        },


        chilli: {

            soil:
                "Well-drained fertile loam or sandy loam rich in organic matter.",

            water:
                "Maintain regular moisture during flowering and fruiting. Avoid waterlogging.",

            fert:
                "Balanced NPK with adequate potassium and micronutrients based on soil testing.",

            pest:
                "Thrips, mites and aphids are common.",

            disease:
                "Leaf curl, damping-off and fungal leaf diseases may occur. Use healthy seedlings and vector management.",

            harvest:
                "Pick fruits at the required green or red maturity stage."

        },


        groundnut: {

            soil:
                "Light, loose, well-drained sandy loam is ideal for peg and pod development.",

            water:
                "Provide moisture during flowering and pod filling. Avoid waterlogging.",

            fert:
                "Calcium, phosphorus and potassium are important. Use soil testing and gypsum where locally recommended.",

            pest:
                "Aphids, leaf miner and tobacco caterpillar may occur.",

            disease:
                "Leaf spot and rust can occur. Rotate crops and use healthy seed.",

            harvest:
                "Harvest when a high proportion of pods are mature and kernels are fully developed."

        },


        onion: {

            soil:
                "Friable, well-drained sandy loam to loam with good organic matter.",

            water:
                "Frequent light irrigation during bulb development. Stop or reduce irrigation before harvest according to local practice.",

            fert:
                "Balanced nutrition with adequate sulfur and potassium based on soil test.",

            pest:
                "Thrips and onion pests may occur depending on region.",

            disease:
                "Purple blotch, downy mildew and basal rot can occur.",

            harvest:
                "Harvest when tops bend and bulbs mature. Cure bulbs properly before storage."

        },


        peas: {

            soil:
                "Well-drained loam or sandy loam with good organic matter.",

            water:
                "Keep soil evenly moist during flowering and pod filling.",

            fert:
                "Avoid excessive nitrogen. Use phosphorus, potassium and inoculation based on soil testing.",

            pest:
                "Aphids and pod pests can occur.",

            disease:
                "Powdery mildew, rust and root diseases may occur.",

            harvest:
                "Harvest green peas when pods are filled but still tender, or dry peas when fully mature."

        },


        potato: {

            soil:
                "Loose, well-drained sandy loam or loam that allows tuber expansion.",

            water:
                "Maintain even moisture during tuber initiation and bulking. Avoid waterlogging.",

            fert:
                "Potassium is important for tuber quality. Use soil-test-based NPK.",

            pest:
                "Potato tuber moth, aphids and beetles may occur.",

            disease:
                "Late blight, early blight and bacterial wilt can be serious.",

            harvest:
                "Harvest when vines mature and skins set, following variety and market requirements."

        },


        sugarcane: {

            soil:
                "Deep fertile loam to clay loam with good drainage and water-holding capacity.",

            water:
                "High water requirement. Irrigate according to soil, weather and growth stage while avoiding waterlogging.",

            fert:
                "Nitrogen, phosphorus and potassium should be split according to soil test and crop stage.",

            pest:
                "Early shoot borer, top borer and termites may occur.",

            disease:
                "Red rot, smut and wilt can occur. Use healthy seed cane and sanitation.",

            harvest:
                "Harvest when cane reaches maturity and expected sugar content is high."

        },


        sunflower: {

            soil:
                "Well-drained loam to sandy loam. Sensitive to waterlogging.",

            water:
                "Moderate irrigation with attention during flowering and seed filling.",

            fert:
                "Balanced NPK plus sulfur and micronutrients when deficient.",

            pest:
                "Head borer and sucking pests may occur.",

            disease:
                "Downy mildew, Alternaria and rust can occur.",

            harvest:
                "Harvest when the back of the head turns yellow-brown and seeds reach maturity."

        },


        tomato: {

            soil:
                "Fertile well-drained loam or sandy loam with good organic matter.",

            water:
                "Regular moisture is important. Avoid wet-dry extremes and waterlogging.",

            fert:
                "Use soil-test-based balanced NPK with adequate potassium during fruiting.",

            pest:
                "Fruit borer, whiteflies, aphids and thrips are common.",

            disease:
                "Early blight, late blight, bacterial wilt and leaf curl can occur.",

            harvest:
                "Harvest at green mature, breaker or red stage depending on market distance."

        },


        wheat: {

            soil:
                "Well-drained fertile loam to clay loam is generally suitable.",

            water:
                "Critical stages include crown-root initiation, flowering and grain filling. Irrigation should be based on soil moisture and local climate.",

            fert:
                "Nitrogen should generally be split. Phosphorus and potassium should follow soil-test recommendations.",

            pest:
                "Aphids, termites and armyworms may occur.",

            disease:
                "Rusts, powdery mildew and loose smut can occur. Use clean or tolerant seed and rotate crops.",

            harvest:
                "Harvest when grains are hard and crop moisture is suitable for threshing."

        }

    };


    /* =====================================================
       GENERAL ANSWERS
    ===================================================== */

    const GENERAL = {

        soil:
            "Start with a soil test for pH, organic carbon and available N, P and K. Improve organic matter with well-decomposed compost, maintain good drainage and avoid repeated over-tillage.",

        fertilizer:
            "Choose fertilizer according to the crop requirement and soil-test results. Nitrogen supports vegetative growth, phosphorus supports roots and early development, and potassium supports water regulation, strength and quality. Avoid applying a high dose only because a fertilizer is popular.",

        npk:
            "NPK means nitrogen (N), phosphorus (P) and potassium (K). The correct ratio depends on crop, soil test, growth stage and expected yield. A soil test is better than using one fixed NPK ratio for every field.",

        irrigation:
            "Irrigate according to crop stage, soil moisture, weather and drainage. Check the soil before watering and avoid both prolonged dryness and standing water.",

        seed:
            "Choose certified or quality seed suitable for your region and season. Check germination, purity, disease-free status, variety, seed treatment and expiry or lot information.",

        pest:
            "Use integrated pest management. Inspect the crop regularly, identify the pest correctly, conserve beneficial insects and use a locally recommended treatment only when necessary.",

        disease:
            "Use healthy planting material, crop rotation, proper spacing, field sanitation and resistant varieties where available. Avoid unnecessary spraying; first identify the disease and its cause.",

        cultivation:
            "Good cultivation starts with suitable crop and season selection, soil preparation, quality seed, correct spacing, balanced nutrition, timely irrigation and regular crop scouting.",

        harvesting:
            "Harvest at the crop's maturity stage rather than simply by calendar date. Use clean tools, avoid mechanical injury and dry or cure produce properly before storage.",

        weather:
            "Weather strongly affects irrigation, disease pressure, spraying and harvest timing. Check a reliable local forecast before irrigation, spraying or harvesting.",

        market:
            "Market guidance should consider local mandi prices, quality grade, harvest timing, storage life, transport cost and buyer demand. Current prices should always be verified from a local market or official source."

    };


    /* =====================================================
       DOM VARIABLES
    ===================================================== */

    let messagesBox = null;

    let input = null;

    let sendButton = null;

    let micButton = null;

    let clearButton = null;

    let screenshotButton = null;

    let recognition = null;

    let listening = false;

    let speaking = false;

    let messageBusy = false;


    /* =====================================================
       HELPERS
    ===================================================== */

    function nowTime() {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        ).format(new Date());

    }


    function escapeHTML(value) {

        return String(value)
            .replace(
                /[&<>"']/g,
                function (character) {

                    const map = {

                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#039;"

                    };

                    return map[character];

                }
            );

    }


    function normalize(value) {

        return String(value || "")
            .toLowerCase()
            .normalize("NFKC")
            .replace(
                /[!?.,;:(){}\[\]"'`’“”]/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }


    /* =====================================================
       TYPO + MEANING MATCHING
    ===================================================== */

    function squashRepeatedLetters(value) {

        return String(value || "")
            .replace(
                /([a-z])\1{2,}/g,
                "$1$1"
            )
            .trim();

    }


    function levenshtein(
        a,
        b
    ) {

        a =
            String(a || "");

        b =
            String(b || "");


        const previous =
            Array.from(
                {
                    length:
                        b.length + 1
                },
                function (_, index) {

                    return index;

                }
            );


        for (
            let i = 1;
            i <= a.length;
            i++
        ) {

            const current =
                [i];


            for (
                let j = 1;
                j <= b.length;
                j++
            ) {

                const insert =
                    current[j - 1] + 1;

                const remove =
                    previous[j] + 1;

                const replace =
                    previous[j - 1] +
                    (
                        a[i - 1] === b[j - 1]
                            ? 0
                            : 1
                    );


                current[j] =
                    Math.min(
                        insert,
                        remove,
                        replace
                    );

            }


            for (
                let j = 0;
                j < current.length;
                j++
            ) {

                previous[j] =
                    current[j];

            }

        }


        return previous[b.length];

    }


    function fuzzyWordMatch(
        word,
        target
    ) {

        const a =
            squashRepeatedLetters(
                normalize(word)
            );

        const b =
            squashRepeatedLetters(
                normalize(target)
            );


        if (
            !a ||
            !b
        ) {

            return false;

        }


        if (
            a === b
        ) {

            return true;

        }


        if (
            a.length < 4 ||
            b.length < 4
        ) {

            return false;

        }


        const distance =
            levenshtein(
                a,
                b
            );


        const limit =
            Math.max(
                1,
                Math.floor(
                    Math.max(
                        a.length,
                        b.length
                    ) * 0.25
                )
            );


        return distance <= limit;

    }


    function phraseMeaningMatch(
        question,
        phrase
    ) {

        const q =
            normalize(question);

        const p =
            normalize(phrase);


        if (
            !q ||
            !p
        ) {

            return false;

        }


        if (
            q.includes(p)
        ) {

            return true;

        }


        const questionWords =
            q.split(" ")
                .filter(Boolean);

        const phraseWords =
            p.split(" ")
                .filter(Boolean);


        if (
            phraseWords.length === 0
        ) {

            return false;

        }


        let matched =
            0;


        phraseWords.forEach(
            function (phraseWord) {

                const found =
                    questionWords.some(
                        function (questionWord) {

                            return fuzzyWordMatch(
                                questionWord,
                                phraseWord
                            );

                        }
                    );


                if (
                    found
                ) {

                    matched++;

                }

            }
        );


        return (
            matched ===
            phraseWords.length
        );

    }


    function contains(
        text,
        words
    ) {

        const q =
            normalize(text);


        return words.some(
            function (word) {

                return (
                    q.includes(
                        normalize(word)
                    )
                );

            }
        );

    }


    /* =====================================================
       PART 1 END
       DO NOT ADD `})();` HERE
    ===================================================== */


        /* =====================================================
       LANGUAGE DETECTION
    ===================================================== */

    function detectLanguage(question) {

        const raw =
            String(question || "");

        const q =
            normalize(raw);


        if (
            /[\u0900-\u097F]/.test(raw)
        ) {

            if (
                /(काय|कसा|कशी|कसे|आहे|मला|माझ्या|शेत|पाणी|खत|पीक|रोग|किड|माती|सिंचन|पेरणी)/.test(raw)
            ) {

                return "marathi";

            }


            return "hindi";

        }


        if (
            /(kya|kaise|kaisa|kaisi|meri|mere|mujhe|ke liye|chahiye|batao|bata|hai|hain|karu|karna|kitna|kitni|kab|paani|mitti|khet|fasal|khaad|rog|keede|sinchai|beej|bowaai)/.test(q)
        ) {

            return "hinglish";

        }


        return "english";

    }


    /* =====================================================
       CROP DETECTION
    ===================================================== */

    function detectCrop(question) {

        const q =
            normalize(question);


        for (
            const crop of CROPS
        ) {

            const aliases =
                ALIASES[crop] || [crop];


            if (
                contains(
                    q,
                    aliases
                )
            ) {

                return crop;

            }


            const words =
                q.split(" ")
                    .filter(Boolean);


            for (
                const alias of aliases
            ) {

                const aliasWords =
                    normalize(alias)
                        .split(" ")
                        .filter(Boolean);


                if (
                    aliasWords.length === 1
                ) {

                    const matched =
                        words.some(
                            function (word) {

                                return fuzzyWordMatch(
                                    word,
                                    aliasWords[0]
                                );

                            }
                        );


                    if (
                        matched
                    ) {

                        return crop;

                    }

                }

            }

        }


        return null;

    }


    /* =====================================================
       INTENT DETECTION
    ===================================================== */

    function detectIntent(question) {

        const q =
            normalize(question);


        if (
            contains(
                q,
                [
                    "hello",
                    "hi",
                    "hey",
                    "namaste",
                    "नमस्ते",
                    "नमस्कार"
                ]
            )
        ) {

            return "greeting";

        }


        if (
            contains(
                q,
                [
                    "bye",
                    "goodbye",
                    "see you",
                    "thank you",
                    "thanks",
                    "धन्यवाद",
                    "धन्य",
                    "ठीक है"
                ]
            )
        ) {

            return "goodbye";

        }


        if (
            contains(
                q,
                [
                    "soil",
                    "mitti",
                    "माती",
                    "मिट्टी",
                    "soil type",
                    "which soil"
                ]
            )
        ) {

            return "soil";

        }


        if (
            contains(
                q,
                [
                    "fertilizer",
                    "fertiliser",
                    "fertilizer dose",
                    "खत",
                    "खाद",
                    "fertilizer kaise",
                    "fertilizer kitna"
                ]
            )
        ) {

            return "fertilizer";

        }


        if (
            contains(
                q,
                [
                    "npk",
                    "nitrogen",
                    "phosphorus",
                    "potassium",
                    "n p k"
                ]
            )
        ) {

            return "npk";

        }


        if (
            contains(
                q,
                [
                    "irrigation",
                    "irrigate",
                    "water requirement",
                    "watering",
                    "paani",
                    "पाणी",
                    "सिंचन",
                    "पानी"
                ]
            )
        ) {

            return "irrigation";

        }


        if (
            contains(
                q,
                [
                    "seed",
                    "seeds",
                    "beej",
                    "बीज",
                    "बियाणे"
                ]
            )
        ) {

            return "seed";

        }


        if (
            contains(
                q,
                [
                    "pest",
                    "pests",
                    "insect",
                    "insects",
                    "keeda",
                    "keede",
                    "कीड",
                    "किडे",
                    "कीट"
                ]
            )
        ) {

            return "pest";

        }


        if (
            contains(
                q,
                [
                    "disease",
                    "diseases",
                    "रोग",
                    "बीमारी",
                    "disease control"
                ]
            )
        ) {

            return "disease";

        }


        if (
            contains(
                q,
                [
                    "cultivation",
                    "farming",
                    "farming method",
                    "cultivation method",
                    "how to grow",
                    "खेती",
                    "शेती",
                    "लागवड"
                ]
            )
        ) {

            return "cultivation";

        }


        if (
            contains(
                q,
                [
                    "harvest",
                    "harvesting",
                    "harvest time",
                    "कटाई",
                    "कापणी"
                ]
            )
        ) {

            return "harvesting";

        }


        if (
            contains(
                q,
                [
                    "weather",
                    "forecast",
                    "rain",
                    "rainfall",
                    "temperature",
                    "मौसम",
                    "पाऊस",
                    "हवामान"
                ]
            )
        ) {

            return "weather";

        }


        if (
            contains(
                q,
                [
                    "market",
                    "mandi",
                    "price",
                    "market price",
                    "भाव",
                    "बाजार"
                ]
            )
        ) {

            return "market";

        }


        return "general";

    }


    /* =====================================================
       LANGUAGE-SPECIFIC GENERAL ANSWERS
    ===================================================== */

    function getGeneralAnswer(
        intent,
        language
    ) {

        if (
            intent === "greeting"
        ) {

            if (
                language === "hindi"
            ) {

                return "नमस्ते! मैं AgroAI हूँ। आप फसल, मिट्टी, सिंचाई, खाद, बीज, कीट और रोगों के बारे में पूछ सकते हैं।";

            }


            if (
                language === "marathi"
            ) {

                return "नमस्कार! मी AgroAI आहे. तुम्ही पीक, माती, सिंचन, खत, बियाणे, किडी आणि रोगांबद्दल विचारू शकता.";

            }


            if (
                language === "hinglish"
            ) {

                return "Namaste! Main AgroAI hoon. Aap crop, mitti, irrigation, fertilizer, seeds, pests aur diseases ke baare mein pooch sakte ho.";

            }


            return "Hello! I’m AgroAI. Ask me about crops, soil, irrigation, fertilizers, seeds, pests or diseases.";

        }


        if (
            intent === "goodbye"
        ) {

            if (
                language === "hindi"
            ) {

                return "धन्यवाद! खेती से जुड़ा कोई भी सवाल हो तो आप फिर पूछ सकते हैं।";

            }


            if (
                language === "marathi"
            ) {

                return "धन्यवाद! शेतीशी संबंधित कोणताही प्रश्न असेल तर पुन्हा विचारा.";

            }


            if (
                language === "hinglish"
            ) {

                return "Thank you! Farming se related koi bhi question ho to kabhi bhi pooch sakte ho.";

            }


            return "You’re welcome! You can ask me any farming-related question anytime.";

        }


        if (
            language === "hindi"
        ) {

            const answers = {

                soil:
                    "मिट्टी के लिए सबसे पहले soil test करवाना अच्छा रहता है। pH, organic matter और NPK की स्थिति देखकर फसल और खाद की योजना बनाएं।",

                fertilizer:
                    "खाद की मात्रा फसल, मिट्टी और growth stage पर निर्भर करती है। Soil test के आधार पर NPK और micronutrients दें और nitrogen को जरूरत के अनुसार split doses में दें।",

                npk:
                    "NPK का मतलब Nitrogen, Phosphorus और Potassium है। सही मात्रा हर फसल और मिट्टी के लिए अलग होती है, इसलिए soil test के अनुसार उपयोग करना बेहतर है।",

                irrigation:
                    "सिंचाई फसल की जरूरत, मिट्टी की नमी, मौसम और growth stage के अनुसार करें। बहुत ज्यादा पानी देने से root problems और nutrient loss हो सकता है।",

                seed:
                    "अच्छी quality और आपके क्षेत्र के लिए suitable certified seed चुनें। Germination, variety और disease-free status जरूर जांचें।",

                pest:
                    "कीट दिखाई देने पर पहले सही पहचान करें। Regular scouting, साफ खेत और integrated pest management अपनाएं। जरूरत होने पर ही recommended pesticide का उपयोग करें।",

                disease:
                    "रोग की सही पहचान करना जरूरी है। Healthy seed, proper spacing, field sanitation और resistant varieties का उपयोग करें।",

                cultivation:
                    "अच्छी खेती के लिए सही फसल और मौसम चुनें, मिट्टी तैयार करें, quality seed लगाएं और समय पर खाद, सिंचाई और pest monitoring करें।",

                harvesting:
                    "कटाई crop maturity के अनुसार करें। बहुत जल्दी या बहुत देर से harvesting करने पर quality और yield प्रभावित हो सकती है।",

                weather:
                    "मौसम के अनुसार irrigation, spraying और harvesting की planning करें। बारिश की संभावना होने पर spraying और harvesting का समय सावधानी से चुनें।",

                market:
                    "फसल बेचने से पहले local mandi price, quality grade, transport cost और demand की जानकारी जांचें।"

            };


            return (
                answers[intent] ||
                "आप अपने सवाल में फसल का नाम, मिट्टी, पानी या खेती की स्थिति बताएं। इससे मैं ज्यादा उपयोगी जानकारी दे सकता हूँ।"
            );

        }


        if (
            language === "marathi"
        ) {

            const answers = {

                soil:
                    "मातीसाठी सर्वप्रथम soil test करणे उपयुक्त आहे. pH, organic matter आणि NPK तपासून पीक व खत व्यवस्थापन ठरवा.",

                fertilizer:
                    "खताचे प्रमाण पीक, माती आणि वाढीच्या अवस्थेनुसार ठरते. Soil test नुसार NPK आणि आवश्यक micronutrients वापरा.",

                npk:
                    "NPK म्हणजे Nitrogen, Phosphorus आणि Potassium. योग्य प्रमाण प्रत्येक पिकासाठी आणि मातीसाठी वेगळे असते.",

                irrigation:
                    "सिंचन करताना पिकाची अवस्था, मातीतील ओलावा आणि हवामान लक्षात घ्या. जास्त पाणी देणे टाळा.",

                seed:
                    "आपल्या भागासाठी योग्य आणि चांगल्या गुणवत्तेचे certified बियाणे निवडा. Germination आणि रोगमुक्तता तपासा.",

                pest:
                    "किडीची योग्य ओळख करा आणि नियमित crop scouting करा. Integrated pest management वापरा.",

                disease:
                    "रोगाची योग्य ओळख महत्त्वाची आहे. निरोगी बियाणे, योग्य अंतर, स्वच्छ शेत आणि resistant varieties वापरा.",

                cultivation:
                    "यशस्वी शेतीसाठी योग्य पीक व हंगाम निवडा, माती तयार करा आणि वेळेवर खत, सिंचन व कीड नियंत्रण करा.",

                harvesting:
                    "पीक पूर्ण maturity वर आल्यावर कापणी करा. योग्य वेळी कापणी केल्यास उत्पादनाची गुणवत्ता चांगली राहते.",

                weather:
                    "हवामानानुसार सिंचन, फवारणी आणि कापणीचे नियोजन करा. पावसाची शक्यता असल्यास विशेष काळजी घ्या.",

                market:
                    "पीक विकण्यापूर्वी स्थानिक बाजारभाव, गुणवत्ता, वाहतूक खर्च आणि मागणी तपासा."

            };


            return (
                answers[intent] ||
                "तुमच्या प्रश्नासोबत पिकाचे नाव, माती, पाणी किंवा शेतीची परिस्थिती सांगा. त्यामुळे मी अधिक योग्य माहिती देऊ शकतो."
            );

        }


        if (
            language === "hinglish"
        ) {

            const answers = {

                soil:
                    "Mitti ke liye sabse pehle soil test karwana best hai. pH, organic matter aur NPK dekhkar crop aur fertilizer plan karo.",

                fertilizer:
                    "Fertilizer ki quantity crop, soil aur growth stage par depend karti hai. Soil test ke according NPK use karo aur nitrogen ko zarurat ke hisaab se split doses mein do.",

                npk:
                    "NPK ka matlab Nitrogen, Phosphorus aur Potassium hai. Har crop ke liye requirement alag hoti hai, isliye soil test ke basis par use karna better hai.",

                irrigation:
                    "Irrigation crop stage, mitti ki moisture aur weather ke according karo. Overwatering se roots aur nutrients dono ko problem ho sakti hai.",

                seed:
                    "Apne area aur season ke liye suitable certified ya good-quality seeds choose karo. Germination aur disease-free status check karo.",

                pest:
                    "Pest dikhe to pehle uski correct identification karo. Regular scouting aur integrated pest management follow karo.",

                disease:
                    "Disease ka correct identification important hai. Healthy seed, proper spacing, sanitation aur resistant varieties use karo.",

                cultivation:
                    "Achhi farming ke liye right crop aur season choose karo, soil prepare karo aur timely fertilizer, irrigation aur pest monitoring karo.",

                harvesting:
                    "Harvest crop maturity ke according karo. Bahut early ya late harvesting se quality aur yield affect ho sakti hai.",

                weather:
                    "Weather ke according irrigation, spraying aur harvesting plan karo. Rain forecast check karke field operations decide karo.",

                market:
                    "Crop sell karne se pehle local mandi price, quality, transport cost aur demand check karo."

            };


            return (
                answers[intent] ||
                "Aap question mein crop ka naam, mitti, paani ya farming condition batao. Isse main better answer de paunga."
            );

        }


        return (
            GENERAL[intent] ||
            "Please mention the crop, soil, irrigation or farming condition so I can give you more specific guidance."
        );

    }


    /* =====================================================
       CROP-SPECIFIC ANSWER
    ===================================================== */

    function getCropAnswer(
        cropName,
        intent,
        language
    ) {

        if (
            !cropName ||
            !DATA[cropName]
        ) {

            return null;

        }


        const crop =
            DATA[cropName];


        const name =
            CROP_NAMES[cropName];


        if (
            language === "hindi"
        ) {

            if (
                intent === "soil"
            ) {

                return `${name} के लिए उपयुक्त मिट्टी: ${crop.soil}`;

            }


            if (
                intent === "irrigation"
            ) {

                return `${name} की सिंचाई: ${crop.water}`;

            }


            if (
                intent === "fertilizer" ||
                intent === "npk"
            ) {

                return `${name} के लिए खाद और पोषण: ${crop.fert}`;

            }


            if (
                intent === "pest"
            ) {

                return `${name} में सामान्य कीट: ${crop.pest}`;

            }


            if (
                intent === "disease"
            ) {

                return `${name} में रोग प्रबंधन: ${crop.disease}`;

            }


            if (
                intent === "harvesting"
            ) {

                return `${name} की कटाई: ${crop.harvest}`;

            }

        }


        if (
            language === "marathi"
        ) {

            if (
                intent === "soil"
            ) {

                return `${name} साठी योग्य माती: ${crop.soil}`;

            }


            if (
                intent === "irrigation"
            ) {

                return `${name} साठी सिंचन: ${crop.water}`;

            }


            if (
                intent === "fertilizer" ||
                intent === "npk"
            ) {

                return `${name} साठी खत व्यवस्थापन: ${crop.fert}`;

            }


            if (
                intent === "pest"
            ) {

                return `${name} मधील सामान्य किडी: ${crop.pest}`;

            }


            if (
                intent === "disease"
            ) {

                return `${name} रोग व्यवस्थापन: ${crop.disease}`;

            }


            if (
                intent === "harvesting"
            ) {

                return `${name} ची कापणी: ${crop.harvest}`;

            }

        }


        if (
            language === "hinglish"
        ) {

            if (
                intent === "soil"
            ) {

                return `${name} ke liye suitable soil: ${crop.soil}`;

            }


            if (
                intent === "irrigation"
            ) {

                return `${name} ki irrigation: ${crop.water}`;

            }


            if (
                intent === "fertilizer" ||
                intent === "npk"
            ) {

                return `${name} ke liye fertilizer aur nutrition: ${crop.fert}`;

            }


            if (
                intent === "pest"
            ) {

                return `${name} mein common pests: ${crop.pest}`;

            }


            if (
                intent === "disease"
            ) {

                return `${name} mein disease management: ${crop.disease}`;

            }


            if (
                intent === "harvesting"
            ) {

                return `${name} ki harvesting: ${crop.harvest}`;

            }

        }


        if (
            intent === "soil"
        ) {

            return `Suitable soil for ${name}: ${crop.soil}`;

        }


        if (
            intent === "irrigation"
        ) {

            return `Irrigation for ${name}: ${crop.water}`;

        }


        if (
            intent === "fertilizer" ||
            intent === "npk"
        ) {

            return `Fertilizer and nutrition for ${name}: ${crop.fert}`;

        }


        if (
            intent === "pest"
        ) {

            return `Common pests in ${name}: ${crop.pest}`;

        }


        if (
            intent === "disease"
        ) {

            return `Disease management for ${name}: ${crop.disease}`;

        }


        if (
            intent === "harvesting"
        ) {

            return `Harvesting ${name}: ${crop.harvest}`;

        }


        return null;

    }


    /* =====================================================
       LOCAL ANSWER ENGINE
    ===================================================== */

    function getLocalAnswer(
        question
    ) {

        const language =
            detectLanguage(
                question
            );


        const crop =
            detectCrop(
                question
            );


        const intent =
            detectIntent(
                question
            );


        if (
            crop &&
            intent !== "greeting" &&
            intent !== "goodbye"
        ) {

            const cropAnswer =
                getCropAnswer(
                    crop,
                    intent,
                    language
                );


            if (
                cropAnswer
            ) {

                return cropAnswer;

            }

        }


        return getGeneralAnswer(
            intent,
            language
        );

    }


    /* =====================================================
       CROP CONTEXT
    ===================================================== */

    function updateCropContext(
        question
    ) {

        const detected =
            detectCrop(
                question
            );


        if (
            detected
        ) {

            lastCrop =
                detected;

        }


        return lastCrop;

    }


    function resolveCrop(
        question
    ) {

        const detected =
            detectCrop(
                question
            );


        if (
            detected
        ) {

            lastCrop =
                detected;


            return detected;

        }


        const q =
            normalize(
                question
            );


        const contextWords = [

            "this",
            "that",
            "it",
            "same crop",
            "this crop",
            "ye",
            "yeh",
            "is",
            "isko",
            "usko",
            "उसे",
            "इसे",
            "हे",
            "हे पीक"

        ];


        if (
            lastCrop &&
            contextWords.some(
                function (word) {

                    return q.includes(
                        normalize(word)
                    );

                }
            )
        ) {

            return lastCrop;

        }


        return null;

    }


    /* =====================================================
       PART 2 END
       DO NOT ADD `})();` HERE
    ===================================================== */


        /* =====================================================
       MAIN ANSWER ENGINE
    ===================================================== */

    async function generateAnswer(
        question
    ) {

        const language =
            detectLanguage(
                question
            );

        const crop =
            resolveCrop(
                question
            );

        const intent =
            detectIntent(
                question
            );


        /*
         * Greetings and goodbye are handled locally.
         */

        if (
            intent === "greeting" ||
            intent === "goodbye"
        ) {

            return getGeneralAnswer(
                intent,
                language
            );

        }


        /*
         * First try the local crop knowledge.
         * This keeps common farming questions
         * useful even if the backend is unavailable.
         */

        if (
            crop
        ) {

            const cropAnswer =
                getCropAnswer(
                    crop,
                    intent,
                    language
                );


            if (
                cropAnswer
            ) {

                return cropAnswer;

            }

        }


        /*
         * Send the question to FastAPI.
         */

        try {

            const contextCrop =
                crop
                    ? CROP_NAMES[crop]
                    : (
                        lastCrop
                            ? CROP_NAMES[lastCrop]
                            : "none"
                    );


            const languageInstruction = {

                english:
                    "Answer completely in English.",

                hindi:
                    "उत्तर पूरी तरह हिंदी में दें।",

                hinglish:
                    "Answer in natural Hinglish using simple Roman Hindi.",

                marathi:
                    "उत्तर पूर्णपणे मराठीत द्या।"

            };


            const prompt =
                `
You are AgroAI, an AI farming assistant.

User question:
${question}

Detected language:
${language}

Language instruction:
${languageInstruction[language]}

Current crop context:
${contextCrop}

Important rules:

1. Answer the user's actual question directly.
2. Use the same language as the user's question.
3. Do not randomly change the language.
4. If the user asks a follow-up using "this", "that", "it", "ye", "isko", "उसे", "इसे", "हे", etc., use the current crop context.
5. Understand common spelling mistakes and informal farming language.
6. Give practical farming guidance.
7. Do not invent crop facts.
8. If a specific pesticide, fertilizer dose or chemical treatment is requested, mention that exact dose can depend on crop stage, soil and local recommendations.
9. Keep the answer clear and well structured.
10. Use headings or bullet points when they make the answer easier to understand.
`;


            const response =
                await fetch(
                    CHAT_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                message:
                                    prompt
                            })
                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Chat API request failed"
                );

            }


            const data =
                await response.json();


            if (
                data &&
                typeof data.answer === "string" &&
                data.answer.trim()
            ) {

                return data.answer.trim();

            }


            if (
                data &&
                typeof data.response === "string" &&
                data.response.trim()
            ) {

                return data.response.trim();

            }


            if (
                data &&
                typeof data.message === "string" &&
                data.message.trim()
            ) {

                return data.message.trim();

            }


            /*
             * If backend does not return a usable answer,
             * use local knowledge.
             */

            return getLocalAnswer(
                question
            );

        }

        catch (
            error
        ) {

            console.warn(
                "AgroAI backend unavailable:",
                error
            );


            return getLocalAnswer(
                question
            );

        }

    }


    /* =====================================================
       MESSAGE HISTORY
    ===================================================== */

    function saveHistory() {

        try {

            localStorage.setItem(
                HISTORY_KEY,
                JSON.stringify(
                    chatHistory
                )
            );

        }

        catch (
            error
        ) {

            console.warn(
                "Unable to save chat history:",
                error
            );

        }

    }


    function loadHistory() {

        try {

            const saved =
                localStorage.getItem(
                    HISTORY_KEY
                );


            if (
                !saved
            ) {

                chatHistory = [];

                return;

            }


            const parsed =
                JSON.parse(
                    saved
                );


            if (
                Array.isArray(parsed)
            ) {

                chatHistory =
                    parsed.slice(
                        -MAX_HISTORY
                    );

            }

            else {

                chatHistory = [];

            }

        }

        catch (
            error
        ) {

            console.warn(
                "Unable to load chat history:",
                error
            );

            chatHistory = [];

        }

    }


    /* =====================================================
       MESSAGE RENDERING
    ===================================================== */

    function addMessage(
        text,
        sender = "bot",
        save = true
    ) {

        if (
            !messagesBox
        ) {

            return;

        }


        const row =
            document.createElement(
                "div"
            );


        row.className =
            sender === "user"
                ? "message-row user-row"
                : "message-row bot-row";


        const avatar =
            document.createElement(
                "div"
            );


        avatar.className =
            "small-avatar";


        avatar.textContent =
            sender === "user"
                ? "You"
                : "AI";


        const content =
            document.createElement(
                "div"
            );


        content.className =
            "message-content";


        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "message-bubble";


        const textElement =
            document.createElement(
                "div"
            );


        textElement.className =
            "message-text";


        /*
         * Escape HTML so user/backend text
         * cannot inject HTML into the chat.
         */

        textElement.innerHTML =
            escapeHTML(
                String(text || "")
            ).replace(
                /\n/g,
                "<br>"
            );


        const time =
            document.createElement(
                "div"
            );


        time.className =
            "message-time";


        time.textContent =
            nowTime();


        bubble.appendChild(
            textElement
        );


        content.appendChild(
            bubble
        );


        content.appendChild(
            time
        );


        row.appendChild(
            avatar
        );


        row.appendChild(
            content
        );


        messagesBox.appendChild(
            row
        );


        messagesBox.scrollTop =
            messagesBox.scrollHeight;


        if (
            save
        ) {

            chatHistory.push(
                {
                    sender:
                        sender,

                    text:
                        String(
                            text || ""
                        ),

                    time:
                        new Date()
                            .toISOString()
                }
            );


            chatHistory =
                chatHistory.slice(
                    -MAX_HISTORY
                );


            saveHistory();

        }

    }


    /* =====================================================
       TYPING INDICATOR
    ===================================================== */

    function showTyping() {

        const indicator =
            document.getElementById(
                "typingIndicator"
            );


        if (
            indicator
        ) {

            indicator.classList.remove(
                "hidden"
            );

        }


        if (
            messagesBox
        ) {

            messagesBox.scrollTop =
                messagesBox.scrollHeight;

        }

    }


    function hideTyping() {

        const indicator =
            document.getElementById(
                "typingIndicator"
            );


        if (
            indicator
        ) {

            indicator.classList.add(
                "hidden"
            );

        }

    }


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    async function sendMessage(
        customMessage = null
    ) {

        if (
            messageBusy
        ) {

            return;

        }


        const message =
            customMessage !== null
                ? String(
                    customMessage
                ).trim()
                : (
                    input
                        ? input.value.trim()
                        : ""
                );


        if (
            !message
        ) {

            return;

        }


        if (
            input &&
            customMessage === null
        ) {

            input.value = "";

        }


        /*
         * Update crop context before
         * generating the answer.
         */

        updateCropContext(
            message
        );


        addMessage(
            message,
            "user"
        );


        messageBusy = true;


        if (
            sendButton
        ) {

            sendButton.disabled =
                true;

        }


        showTyping();


        try {

            const answer =
                await generateAnswer(
                    message
                );


            hideTyping();


            addMessage(
                answer,
                "bot"
            );


            /*
             * Speak only when speech output
             * has been enabled by the user.
             */

            if (
                speaking
            ) {

                speakText(
                    answer
                );

            }

        }

        catch (
            error
        ) {

            hideTyping();


            console.error(
                "AgroAI send error:",
                error
            );


            addMessage(
                getLocalAnswer(
                    message
                ),
                "bot"
            );

        }

        finally {

            messageBusy =
                false;


            if (
                sendButton
            ) {

                sendButton.disabled =
                    false;

            }


            if (
                input
            ) {

                input.focus();

            }

        }

    }


    /* =====================================================
       CLEAR CHAT
    ===================================================== */

    function clearChat() {

        if (
            !messagesBox
        ) {

            return;

        }


        messagesBox.innerHTML =
            "";


        chatHistory =
            [];


        lastCrop =
            null;


        localStorage.removeItem(
            HISTORY_KEY
        );


        addMessage(
            "Hello! I’m AgroAI. Ask me anything about farming, crops, soil, irrigation, fertilizers, seeds, pests or diseases.",
            "bot",
            false
        );

    }


    /* =====================================================
       LOAD SAVED MESSAGES
    ===================================================== */

    function renderHistory() {

        if (
            !messagesBox
        ) {

            return;

        }


        messagesBox.innerHTML =
            "";


        if (
            chatHistory.length === 0
        ) {

            addMessage(
                "Hello! I’m AgroAI. Ask me anything about farming, crops, soil, irrigation, fertilizers, seeds, pests or diseases.",
                "bot",
                false
            );


            return;

        }


        chatHistory.forEach(
            function (item) {

                if (
                    !item ||
                    !item.text
                ) {

                    return;

                }


                addMessage(
                    item.text,
                    item.sender || "bot",
                    false
                );

            }
        );


        /*
         * Recover crop context from
         * the previous conversation.
         */

        for (
            let i =
                chatHistory.length - 1;
            i >= 0;
            i--
        ) {

            const text =
                chatHistory[i] &&
                chatHistory[i].text;


            if (
                text
            ) {

                const crop =
                    detectCrop(
                        text
                    );


                if (
                    crop
                ) {

                    lastCrop =
                        crop;

                    break;

                }

            }

        }

    }


    /* =====================================================
       SPEECH OUTPUT
    ===================================================== */

    function speakText(
        text
    ) {

        if (
            !(
                "speechSynthesis"
                in window
            )
        ) {

            return;

        }


        if (
            !text
        ) {

            return;

        }


        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                String(text)
            );


        const language =
            detectLanguage(
                text
            );


        if (
            language === "hindi"
        ) {

            utterance.lang =
                "hi-IN";

        }

        else if (
            language === "marathi"
        ) {

            utterance.lang =
                "mr-IN";

        }

        else {

            utterance.lang =
                "en-IN";

        }


        utterance.rate =
            0.95;


        utterance.pitch =
            1;


        window.speechSynthesis.speak(
            utterance
        );

    }


    /* =====================================================
       PART 3 END
       DO NOT ADD `})();` HERE
    ===================================================== */

        /* =====================================================
       VOICE INPUT / MICROPHONE
    ===================================================== */

    function setupRecognition() {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (
            !SpeechRecognition
        ) {

            if (
                micButton
            ) {

                micButton.disabled =
                    true;

                micButton.title =
                    "Speech recognition is not supported in this browser.";

            }

            return;

        }


        recognition =
            new SpeechRecognition();


        recognition.continuous =
            false;


        recognition.interimResults =
            false;


        recognition.maxAlternatives =
            1;


        recognition.lang =
            "en-IN";


        recognition.onstart =
            function () {

                listening =
                    true;


                if (
                    micButton
                ) {

                    micButton.classList.add(
                        "active"
                    );

                    micButton.textContent =
                        "⏹️";

                }

            };


        recognition.onresult =
            function (event) {

                const result =
                    event.results &&
                    event.results[0] &&
                    event.results[0][0];


                if (
                    !result
                ) {

                    return;

                }


                const text =
                    String(
                        result.transcript || ""
                    ).trim();


                if (
                    !text
                ) {

                    return;

                }


                if (
                    input
                ) {

                    input.value =
                        text;

                    input.focus();

                }

            };


        recognition.onerror =
            function (event) {

                console.warn(
                    "Speech recognition error:",
                    event.error
                );


                listening =
                    false;


                if (
                    micButton
                ) {

                    micButton.classList.remove(
                        "active"
                    );

                    micButton.textContent =
                        "🎤";

                }

            };


        recognition.onend =
            function () {

                listening =
                    false;


                if (
                    micButton
                ) {

                    micButton.classList.remove(
                        "active"
                    );

                    micButton.textContent =
                        "🎤";

                }

            };

    }


    function toggleMicrophone() {

        if (
            !recognition
        ) {

            setupRecognition();

        }


        if (
            !recognition
        ) {

            alert(
                "Voice input is not supported in this browser."
            );

            return;

        }


        if (
            listening
        ) {

            try {

                recognition.stop();

            }

            catch (
                error
            ) {

                console.warn(
                    error
                );

            }

            return;

        }


        const language =
            detectLanguage(
                input
                    ? input.value
                    : ""
            );


        if (
            language === "hindi"
        ) {

            recognition.lang =
                "hi-IN";

        }

        else if (
            language === "marathi"
        ) {

            recognition.lang =
                "mr-IN";

        }

        else {

            recognition.lang =
                "en-IN";

        }


        try {

            recognition.start();

        }

        catch (
            error
        ) {

            console.warn(
                "Microphone could not start:",
                error
            );

        }

    }


    /* =====================================================
       FAQ / QUICK QUESTION SETUP
    ===================================================== */

    function setupFAQButtons() {

        const buttons =
            document.querySelectorAll(
                ".faq-question, .quick-question"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        const question =
                            button.dataset.question ||
                            button.getAttribute(
                                "data-question"
                            ) ||
                            button.textContent
                                .replace(
                                    /\s+/g,
                                    " "
                                )
                                .trim();


                        if (
                            question
                        ) {

                            sendMessage(
                                question
                            );

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       LOGIN / LOGOUT
    ===================================================== */

    function setupAuth() {

        const loginNav =
            document.getElementById(
                "loginNav"
            );


        const logoutNav =
            document.getElementById(
                "logoutNav"
            );


        const loginLink =
            document.getElementById(
                "loginLink"
            );


        let currentUser =
            null;


        const possibleKeys = [
            "agroai_user",
            "loggedInUser",
            "currentUser",
            "user"
        ];


        for (
            const key of possibleKeys
        ) {

            const stored =
                localStorage.getItem(
                    key
                );


            if (
                stored
            ) {

                try {

                    const parsed =
                        JSON.parse(
                            stored
                        );


                    if (
                        parsed &&
                        typeof parsed === "object"
                    ) {

                        currentUser =
                            parsed;

                        break;

                    }

                }

                catch (
                    error
                ) {

                    currentUser = {
                        name:
                            stored
                    };

                    break;

                }

            }

        }


        if (
            currentUser
        ) {

            if (
                loginNav
            ) {

                loginNav.style.display =
                    "none";

            }


            if (
                logoutNav
            ) {

                logoutNav.style.display =
                    "";

            }

        }

        else {

            if (
                loginNav
            ) {

                loginNav.style.display =
                    "";

            }


            if (
                logoutNav
            ) {

                logoutNav.style.display =
                    "none";

            }

        }


        logoutNav?.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                [
                    "agroai_user",
                    "loggedInUser",
                    "currentUser",
                    "user"
                ].forEach(
                    function (key) {

                        localStorage.removeItem(
                            key
                        );

                    }
                );


                window.location.href =
                    "login.html";

            }
        );


        loginLink?.addEventListener(
            "click",
            function () {

                window.location.href =
                    "login.html";

            }
        );

    }


    /* =====================================================
       INITIAL CHAT MESSAGE
    ===================================================== */

    function showInitialMessage() {

        if (
            !messagesBox
        ) {

            return;

        }


        if (
            messagesBox.children.length > 0
        ) {

            return;

        }


        addMessage(
            "Hello! I’m AgroAI. Ask me about crops, soil, irrigation, fertilizers, seeds, pests or diseases.",
            "bot",
            false
        );

    }


    /* =====================================================
       MAIN INITIALIZATION
    ===================================================== */

    function init() {

        messagesBox =
            document.getElementById(
                "chatMessages"
            );


        input =
            document.getElementById(
                "chatInput"
            );


        sendButton =
            document.getElementById(
                "sendButton"
            );


        micButton =
            document.getElementById(
                "micButton"
            );


        clearButton =
            document.getElementById(
                "clearChatButton"
            );


        screenshotButton =
            document.getElementById(
                "screenshotChatButton"
            );


        if (
            !messagesBox ||
            !input
        ) {

            console.error(
                "AgroAI chatbot elements were not found."
            );

            return;

        }


        loadHistory();


        renderHistory();


        /*
         * SEND BUTTON
         */

        sendButton?.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                sendMessage();

            }
        );


        /*
         * ENTER KEY
         */

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );


        /*
         * TEXTAREA AUTO RESIZE
         */

        input.addEventListener(
            "input",
            function () {

                input.style.height =
                    "45px";


                input.style.height =
                    Math.min(
                        input.scrollHeight,
                        110
                    ) + "px";

            }
        );


        /*
         * MICROPHONE
         */

        setupRecognition();


        micButton?.addEventListener(
            "click",
            toggleMicrophone
        );


        /*
         * CLEAR CHAT
         */

        clearButton?.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                clearChat();

            }
        );


        /*
         * PRINT CHAT
         */

        screenshotButton?.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                printChat();

            }
        );


        /*
         * FAQ / QUICK QUESTIONS
         */

        setupFAQButtons();


        /*
         * AUTHENTICATION
         */

        setupAuth();


        /*
         * INITIAL MESSAGE
         */

        showInitialMessage();


        input.focus();

    }


    /* =====================================================
       PRINT CHAT
    ===================================================== */

    function printChat() {

        if (
            !messagesBox
        ) {

            return;

        }


        const chatText =
            messagesBox.innerText.trim();


        if (
            !chatText
        ) {

            return;

        }


        const printWindow =
            window.open(
                "",
                "_blank"
            );


        if (
            !printWindow
        ) {

            alert(
                "Please allow pop-ups to print the chat."
            );

            return;

        }


        printWindow.document.write(
            `
            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    AgroAI Chat
                </title>

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                >

                <style>

                    body {

                        font-family:
                            Arial,
                            sans-serif;

                        padding:
                            30px;

                        line-height:
                            1.6;

                        color:
                            #17351f;

                        background:
                            #ffffff;

                    }


                    h1 {

                        color:
                            #176b3a;

                        margin-bottom:
                            8px;

                    }


                    .date {

                        color:
                            #666;

                        font-size:
                            13px;

                        margin-bottom:
                            25px;

                    }


                    .chat {

                        white-space:
                            pre-wrap;

                    }


                    @media print {

                        body {

                            padding:
                                15px;

                        }

                    }

                </style>

            </head>


            <body>

                <h1>
                    AgroAI Farming Assistant 🌱
                </h1>

                <div class="date">
                    AgroAI Chat
                </div>

                <div class="chat">
                    ${escapeHTML(chatText)}
                </div>

            </body>

            </html>
            `
        );


        printWindow.document.close();


        setTimeout(
            function () {

                printWindow.focus();

                printWindow.print();

            },
            300
        );

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    return {

        init,

        sendMessage,

        clearChat,

        generateAnswer,

        detectLanguage,

        detectCrop,

        detectIntent,

        resolveCrop,

        speakText

    };


})();


/* =========================================================
   START AGROAI
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        AgroAI.init();

    }
);


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.AgroAI =
    AgroAI;