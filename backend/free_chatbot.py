"""
=========================================================
AGROAI - INTELLIGENT LOCAL AGRICULTURE CHATBOT
=========================================================

Features:
- No Ollama
- No OpenAI API
- No external AI API
- Works locally
- English
- Hindi
- Hinglish
- Marathi
- Natural question handling
- Crop detection
- Topic detection
- Multiple questions in one message
- FAQ / knowledge matching
- Farming problem understanding
- Context-aware responses
=========================================================
"""

import re
from difflib import SequenceMatcher


# =========================================================
# CROP KNOWLEDGE BASE
# =========================================================

CROPS = {

    "rice": {
        "aliases": [
            "rice", "paddy", "धान", "भात"
        ],
        "soil": "Clayey to clay-loam soil with good water-holding capacity.",
        "water": "Rice generally requires relatively high water availability, but irrigation should be managed according to soil moisture, rainfall and crop stage.",
        "season": "Rice is commonly grown during the Kharif season in many parts of India.",
        "sowing": "Sowing or transplanting time depends on region, rainfall, variety and local farming practice.",
        "fertilizer": "Rice needs balanced nutrients, especially nitrogen, phosphorus and potassium. Exact fertilizer dose should be based on soil testing and local recommendations.",
        "temperature": "Rice prefers warm growing conditions.",
        "ph": "Rice generally performs well in slightly acidic to neutral soil.",
        "tips": [
            "Maintain proper water management.",
            "Control weeds during early crop growth.",
            "Use balanced nutrients based on soil testing.",
            "Monitor pests and diseases regularly."
        ]
    },

    "wheat": {
        "aliases": [
            "wheat", "गेहूं", "गहू"
        ],
        "soil": "Well-drained loam to clay-loam soil is generally suitable.",
        "water": "Wheat has moderate irrigation requirements and needs adequate moisture during important growth stages.",
        "season": "Wheat is mainly a Rabi crop in India.",
        "sowing": "Wheat is generally sown during the Rabi season. Exact timing varies by region and variety.",
        "fertilizer": "Nitrogen, phosphorus and potassium are important. Exact fertilizer quantity should follow soil testing and local recommendations.",
        "temperature": "Wheat prefers cool conditions during early growth and relatively warmer conditions toward maturity.",
        "ph": "Wheat generally grows well in neutral to slightly alkaline soil.",
        "tips": [
            "Prefer timely sowing.",
            "Maintain proper irrigation.",
            "Control weeds early.",
            "Monitor for rust and insect problems."
        ]
    },

    "maize": {
        "aliases": [
            "maize", "corn", "makka", "मक्का", "मका"
        ],
        "soil": "Well-drained loamy or sandy-loam soil is generally suitable.",
        "water": "Maize needs moderate and regular moisture, especially during critical growth stages.",
        "season": "Maize can be grown in Kharif, Rabi or other seasons depending on region and irrigation.",
        "sowing": "Sowing time depends on the growing season, rainfall, temperature and local variety.",
        "fertilizer": "Maize has significant nutrient requirements, particularly nitrogen, along with phosphorus and potassium.",
        "temperature": "Maize prefers warm growing conditions.",
        "ph": "Maize generally performs well in slightly acidic to neutral soil.",
        "tips": [
            "Avoid waterlogging.",
            "Maintain suitable plant spacing.",
            "Provide adequate nitrogen.",
            "Monitor for stem and leaf pests."
        ]
    },

    "cotton": {
        "aliases": [
            "cotton", "कपास", "कापूस"
        ],
        "soil": "Deep black soil and well-drained loamy soil can be suitable for cotton.",
        "water": "Cotton has moderate water requirements, but irrigation needs vary with soil, rainfall and crop stage.",
        "season": "Cotton is mainly grown as a Kharif crop in India.",
        "sowing": "Cotton sowing generally begins with suitable rainfall and soil moisture during the Kharif season.",
        "fertilizer": "Balanced nitrogen, phosphorus and potassium are required. Soil testing is recommended before deciding the dose.",
        "temperature": "Cotton prefers warm conditions.",
        "ph": "Cotton generally performs well in neutral to slightly alkaline soil.",
        "tips": [
            "Monitor sucking pests regularly.",
            "Maintain good weed management.",
            "Avoid unnecessary irrigation.",
            "Inspect plants for boll and leaf damage."
        ]
    },

    "soybean": {
        "aliases": [
            "soybean", "soya", "सोयाबीन"
        ],
        "soil": "Well-drained loamy to clay-loam soil is generally suitable.",
        "water": "Soybean needs adequate moisture but is sensitive to prolonged waterlogging.",
        "season": "Soybean is mainly grown during the Kharif season.",
        "sowing": "Soybean is generally sown with the onset of suitable monsoon moisture. Exact timing depends on region and variety.",
        "fertilizer": "Phosphorus and potassium are important along with other nutrients. Exact fertilizer recommendations should be based on soil testing.",
        "temperature": "Soybean prefers warm growing conditions.",
        "ph": "Soybean generally performs well in slightly acidic to neutral soil.",
        "tips": [
            "Avoid waterlogging.",
            "Control weeds during early growth.",
            "Monitor yellowing and leaf damage.",
            "Inspect regularly for insect attack."
        ]
    },

    "chickpea": {
        "aliases": [
            "chickpea", "gram", "chana", "चना", "हरभरा"
        ],
        "soil": "Well-drained loam or clay-loam soil is generally suitable.",
        "water": "Chickpea has relatively low to moderate water requirements.",
        "season": "Chickpea is mainly a Rabi crop.",
        "sowing": "Chickpea is commonly sown during the Rabi season. Exact timing varies by region.",
        "fertilizer": "Phosphorus is important along with balanced nutrients based on soil testing.",
        "temperature": "Chickpea prefers cool conditions during much of its growing period.",
        "ph": "Chickpea generally performs well in neutral to slightly alkaline soil.",
        "tips": [
            "Avoid excessive irrigation.",
            "Maintain good drainage.",
            "Monitor for pod and foliage pests.",
            "Prefer timely sowing."
        ]
    },

    "pigeonpea": {
        "aliases": [
            "pigeonpea", "pigeon pea", "tur", "arhar", "तूर", "अरहर"
        ],
        "soil": "Well-drained loamy to black soil can be suitable.",
        "water": "Pigeonpea generally has moderate water requirements and benefits from good drainage.",
        "season": "Pigeonpea is mainly grown during Kharif.",
        "sowing": "Sowing is generally associated with the Kharif season and suitable monsoon moisture.",
        "fertilizer": "Balanced nutrients should be applied according to soil testing.",
        "temperature": "Pigeonpea prefers warm conditions.",
        "ph": "It generally performs well in neutral to slightly alkaline soil.",
        "tips": [
            "Maintain good drainage.",
            "Control weeds.",
            "Monitor pod and flower pests.",
            "Avoid prolonged waterlogging."
        ]
    },

    "mungbean": {
        "aliases": [
            "mungbean", "mung bean", "moong",
            "green gram", "मूंग", "मुग"
        ],
        "soil": "Well-drained sandy-loam to loamy soil is suitable.",
        "water": "Mungbean has low to moderate water requirements.",
        "season": "Mungbean can be grown during Kharif or summer depending on region.",
        "sowing": "Sowing time depends on the selected growing season and local climate.",
        "fertilizer": "Balanced nutrients with attention to phosphorus can support crop growth.",
        "temperature": "Mungbean prefers warm conditions.",
        "ph": "It generally performs well in slightly acidic to neutral soil.",
        "tips": [
            "Avoid waterlogging.",
            "Control weeds during early growth.",
            "Maintain adequate moisture.",
            "Monitor insect damage."
        ]
    },

    "jute": {
        "aliases": [
            "jute", "जूट", "ताग"
        ],
        "soil": "Fertile and moisture-retentive but reasonably well-drained loamy soil is suitable.",
        "water": "Jute requires adequate moisture.",
        "season": "Jute is generally associated with the warm and rainy season.",
        "sowing": "Sowing time depends on region, rainfall and variety.",
        "fertilizer": "Balanced NPK should be used according to soil condition.",
        "temperature": "Jute prefers warm and humid conditions.",
        "ph": "Slightly acidic to neutral soil can be suitable.",
        "tips": [
            "Maintain adequate moisture.",
            "Control weeds.",
            "Use suitable plant spacing.",
            "Monitor crop growth regularly."
        ]
    },

    "sugarcane": {
        "aliases": [
            "sugarcane", "sugar cane", "गन्ना", "ऊस"
        ],
        "soil": "Deep fertile loamy to clay-loam soil with good drainage is generally suitable.",
        "water": "Sugarcane has a relatively high water requirement.",
        "season": "Planting season varies considerably by region and local production system.",
        "sowing": "Planting time depends on regional practice, variety and climate.",
        "fertilizer": "Sugarcane has high nutrient requirements. NPK should be managed using soil testing and local recommendations.",
        "temperature": "Sugarcane prefers warm growing conditions.",
        "ph": "It generally performs well in slightly acidic to neutral soil.",
        "tips": [
            "Maintain irrigation carefully.",
            "Avoid prolonged waterlogging.",
            "Control weeds.",
            "Monitor for stem and leaf pests."
        ]
    },

    "potato": {
        "aliases": [
            "potato", "आलू", "बटाटा"
        ],
        "soil": "Loose, well-drained sandy-loam soil is generally suitable.",
        "water": "Potato requires moderate and fairly uniform soil moisture.",
        "season": "Potato is commonly grown during the Rabi season in many parts of India.",
        "sowing": "Planting time depends on local temperature and growing season.",
        "fertilizer": "Balanced NPK with suitable potassium is important.",
        "temperature": "Potato prefers relatively cool growing conditions.",
        "ph": "Slightly acidic to neutral soil is generally suitable.",
        "tips": [
            "Avoid waterlogging.",
            "Maintain uniform soil moisture.",
            "Use healthy planting material.",
            "Monitor foliage for disease symptoms."
        ]
    },

    "onion": {
        "aliases": [
            "onion", "प्याज", "कांदा"
        ],
        "soil": "Well-drained sandy-loam to loamy soil is suitable.",
        "water": "Onion requires moderate and regular moisture but does not tolerate prolonged waterlogging.",
        "season": "Onion can be grown in different seasons depending on region and production system.",
        "sowing": "Nursery and transplanting time depends on the production season and local conditions.",
        "fertilizer": "Balanced nutrients and suitable micronutrients should be managed based on soil testing.",
        "temperature": "Onion growth depends strongly on variety and temperature conditions.",
        "ph": "Slightly acidic to neutral soil is generally suitable.",
        "tips": [
            "Avoid excessive irrigation.",
            "Maintain good drainage.",
            "Monitor thrips and fungal symptoms.",
            "Maintain suitable spacing."
        ]
    },

    "mango": {
        "aliases": [
            "mango", "आम", "आंबा"
        ],
        "soil": "Deep, well-drained loamy soil is generally suitable.",
        "water": "Young plants need regular moisture; mature trees have different irrigation needs depending on climate and stage.",
        "season": "Mango is a perennial fruit crop.",
        "sowing": "Mango is usually established through grafted planting material rather than ordinary field sowing.",
        "fertilizer": "Organic matter and balanced nutrients should be managed according to tree age and soil condition.",
        "temperature": "Mango prefers warm conditions.",
        "ph": "Mango generally performs well in slightly acidic to neutral soil.",
        "tips": [
            "Maintain proper canopy management.",
            "Monitor pests and diseases.",
            "Provide suitable irrigation.",
            "Use healthy planting material."
        ]
    },

    "banana": {
        "aliases": [
            "banana", "केला", "केळी"
        ],
        "soil": "Deep fertile and well-drained loamy soil is suitable.",
        "water": "Banana has relatively high water requirements and needs regular moisture.",
        "season": "Banana can be planted during suitable periods depending on local climate and irrigation.",
        "sowing": "Banana is generally established using healthy planting material rather than seeds.",
        "fertilizer": "Banana has high nutrient requirements and needs balanced NPK management.",
        "temperature": "Banana prefers warm and humid conditions.",
        "ph": "Slightly acidic to neutral soil is generally suitable.",
        "tips": [
            "Maintain regular irrigation.",
            "Provide good drainage.",
            "Support plants where needed.",
            "Monitor leaves for pest and disease symptoms."
        ]
    },

    "grapes": {
        "aliases": [
            "grapes", "grape", "अंगूर", "द्राक्ष"
        ],
        "soil": "Well-drained sandy-loam to loamy soil is suitable.",
        "water": "Grapes require carefully managed irrigation according to growth stage and production system.",
        "season": "Grapes are a perennial fruit crop.",
        "sowing": "Grapevines are normally established using planting material rather than ordinary seed sowing.",
        "fertilizer": "Balanced nutrients should be applied according to vine growth and soil testing.",
        "temperature": "Grapes require suitable warm growing conditions with proper seasonal management.",
        "ph": "Slightly acidic to neutral soil is generally suitable.",
        "tips": [
            "Manage canopy carefully.",
            "Monitor fungal diseases.",
            "Maintain irrigation discipline.",
            "Use suitable pruning practices."
        ]
    },

    "groundnut": {
        "aliases": [
            "groundnut", "peanut", "मूंगफली", "भुईमूग"
        ],
        "soil": "Well-drained sandy-loam soil is generally suitable.",
        "water": "Groundnut has moderate water requirements and is sensitive to excessive waterlogging.",
        "season": "Groundnut can be grown during Kharif or summer depending on region.",
        "sowing": "Sowing time depends on rainfall, temperature and local season.",
        "fertilizer": "Balanced nutrients with adequate calcium and phosphorus are important.",
        "temperature": "Groundnut prefers warm conditions.",
        "ph": "Slightly acidic to neutral soil is generally suitable.",
        "tips": [
            "Avoid waterlogging.",
            "Maintain suitable soil moisture during pod development.",
            "Monitor leaf diseases.",
            "Use suitable seed material."
        ]
    },

    "mustard": {
        "aliases": [
            "mustard", "सरसों", "मोहरी"
        ],
        "soil": "Well-drained loamy or sandy-loam soil is generally suitable.",
        "water": "Mustard has relatively low to moderate water requirements.",
        "season": "Mustard is mainly a Rabi crop.",
        "sowing": "Mustard is generally sown during the Rabi season, with exact timing depending on region.",
        "fertilizer": "Balanced NPK with adequate sulphur where required is useful.",
        "temperature": "Mustard prefers cool conditions during growth.",
        "ph": "Neutral to slightly alkaline soil can be suitable.",
        "tips": [
            "Prefer timely sowing.",
            "Avoid unnecessary irrigation.",
            "Monitor aphids and other pests.",
            "Maintain weed control."
        ]
    }
}


# =========================================================
# GENERAL KNOWLEDGE
# =========================================================

GENERAL_KNOWLEDGE = {

    "soil": {
        "keywords": [
            "soil", "mitti", "मिट्टी", "जमीन",
            "land", "soil type", "soil suitable"
        ]
    },

    "water": {
        "keywords": [
            "water", "paani", "पानी", "irrigation",
            "sinchai", "सिंचाई", "moisture",
            "watering", "kitna paani"
        ]
    },

    "fertilizer": {
        "keywords": [
            "fertilizer", "fertiliser",
            "fertilizer", "खाद", "खत",
            "khaad", "khat", "npk",
            "urea", "dap", "nutrient"
        ]
    },

    "sowing": {
        "keywords": [
            "sowing", "sow", "planting",
            "plant", "buvai", "बुवाई",
            "perni", "पेरणी", "kab boya",
            "when to sow", "lagaye", "lagana"
        ]
    },

    "season": {
        "keywords": [
            "season", "मौसम", "हंगाम",
            "kharif", "rabi", "zaid",
            "summer", "monsoon",
            "rainy", "winter"
        ]
    },

    "pest": {
        "keywords": [
            "pest", "pests", "insect",
            "insects", "कीट", "कीड़ा",
            "कीड़े", "कीड", "कीडी",
            "insect attack", "pest attack",
            "bugs", "bug"
        ]
    },

    "disease": {
        "keywords": [
            "disease", "diseases",
            "रोग", "रोगाची",
            "infection", "infected",
            "spots", "spot",
            "yellow leaves", "yellowing",
            "leaves yellow", "yellow leaf",
            "पत्ते पीले", "पानं पिवळी",
            "पाने पिवळी", "wilting",
            "curling", "leaf curl"
        ]
    },

    "cultivation": {
        "keywords": [
            "cultivation", "farming",
            "kheti", "खेती", "शेती",
            "crop", "फसल", "पिक",
            "grow", "ugaye", "उगाएं",
            "growing", "farming tips"
        ]
    },

    "harvesting": {
        "keywords": [
            "harvest", "harvesting",
            "कटाई", "काढणी",
            "harvest time", "when harvest",
            "kab kaate", "kab harvest"
        ]
    },

    "temperature": {
        "keywords": [
            "temperature", "temp",
            "taapman", "तापमान",
            "गरमी", "cold",
            "heat", "hot", "cool"
        ]
    },

    "ph": {
        "keywords": [
            "ph", "p.h", "acidity",
            "alkaline", "acidic"
        ]
    },

    "problem": {
        "keywords": [
            "problem", "issue",
            "problem hai", "dikkat",
            "दिक्कत", "समस्या",
            "not growing", "growth slow",
            "growth nahi", "weak",
            "yellow", "dry", "drying",
            "wilting", "spots"
        ]
    }
}


# =========================================================
# LANGUAGE DETECTION
# =========================================================

def detect_language(text):

    text = text.lower()

    devanagari = len(
        re.findall(r"[\u0900-\u097F]", text)
    )

    if devanagari:
        marathi_words = [
            "माझे", "माझी", "माझ्या", "काय",
            "कसे", "कशी", "करावे", "शेती",
            "पिक", "पाणी", "जमीन", "खत",
            "कीड", "रोग", "हंगाम",
            "सोयाबीन", "कापूस", "गहू",
            "तूर", "हरभरा", "कांदा",
            "द्राक्ष", "आंबा", "केळी"
        ]

        hindi_words = [
            "मेरा", "मेरी", "मेरे",
            "क्या", "कैसे", "कैसी",
            "करना", "करें", "खेती",
            "फसल", "पानी", "मिट्टी",
            "खाद", "कीट", "रोग",
            "मौसम", "सोयाबीन",
            "कपास", "गेहूं", "चना",
            "प्याज", "आलू"
        ]

        marathi_score = sum(
            word in text for word in marathi_words
        )

        hindi_score = sum(
            word in text for word in hindi_words
        )

        if marathi_score > hindi_score:
            return "marathi"

        return "hindi"

    hinglish_words = [
        "mera", "meri", "mere",
        "hai", "hain", "kya",
        "kaise", "kaisi",
        "karna", "batao",
        "bataiye", "kheti",
        "fasal", "paani",
        "mitti", "khad",
        "keede", "rog"
    ]

    if any(
        word in text.split()
        for word in hinglish_words
    ):
        return "hinglish"

    return "english"


# =========================================================
# TEXT NORMALIZATION
# =========================================================

def normalize(text):

    if text is None:
        return ""

    text = str(text).lower()

    replacements = {
        "pls": "please",
        "plz": "please",
        "wat": "what",
        "wht": "what",
        "bt": "but",
        "pani": "paani",
        "mitti": "soil",
        "khaad": "fertilizer",
        "khat": "fertilizer",
        "buvai": "sowing",
        "perni": "sowing",
        "fasal": "crop",
        "pike": "crop",
        "pikk": "crop"
    }

    for old, new in replacements.items():
        text = re.sub(
            r"\b" + re.escape(old) + r"\b",
            new,
            text
        )

    text = re.sub(
        r"[!?.,;:()\[\]{}]+",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =========================================================
# CROP DETECTION
# =========================================================

def detect_crop(text):

    text = normalize(text)

    found = []

    for crop, data in CROPS.items():

        for alias in data["aliases"]:

            alias = alias.lower()

            if alias in text:

                found.append(
                    (
                        len(alias),
                        crop
                    )
                )

    if not found:
        return None

    found.sort(
        reverse=True
    )

    return found[0][1]


# =========================================================
# INTENT DETECTION
# =========================================================

def score_intent(text, intent):

    text = normalize(text)

    score = 0

    for keyword in GENERAL_KNOWLEDGE[intent]["keywords"]:

        keyword = keyword.lower()

        if keyword in text:
            score += 1

    return score


def detect_intents(text):

    scores = {}

    for intent in GENERAL_KNOWLEDGE:

        score = score_intent(
            text,
            intent
        )

        if score > 0:
            scores[intent] = score

    return sorted(
        scores,
        key=scores.get,
        reverse=True
    )


# =========================================================
# QUESTION TYPE
# =========================================================

def detect_question_type(text):

    text = normalize(text)

    if any(
        phrase in text
        for phrase in [
            "what is",
            "what are",
            "kya hai",
            "kya hota",
            "meaning",
            "matlab",
            "define"
        ]
    ):
        return "information"

    if any(
        phrase in text
        for phrase in [
            "how",
            "kaise",
            "kase",
            "how to",
            "karna",
            "kya karu",
            "what should i do"
        ]
    ):
        return "how_to"

    if any(
        phrase in text
        for phrase in [
            "when",
            "kab",
            "कब"
        ]
    ):
        return "when"

    if any(
        phrase in text
        for phrase in [
            "which",
            "kaunsa",
            "kaunsi",
            "konsa",
            "कौनसा",
            "कौनसी"
        ]
    ):
        return "which"

    if "why" in text or "kyu" in text or "क्यों" in text:
        return "why"

    return "general"


# =========================================================
# GREETING / HELP / ABOUT
# =========================================================

def special_response(text, language):

    if any(
        x in text
        for x in [
            "hello",
            "hi",
            "hey",
            "hii",
            "namaste",
            "namaskar"
        ]
    ):

        if language == "marathi":
            return (
                "नमस्कार! 🌱 मी AgroAI Assistant आहे.\n\n"
                "तुम्ही पिके, माती, पाणी, खत, "
                "पेरणी, कीड, रोग आणि शेतीबद्दल "
                "प्रश्न विचारू शकता."
            )

        if language == "hindi":
            return (
                "नमस्ते! 🌱 मैं AgroAI Assistant हूँ।\n\n"
                "आप फसल, मिट्टी, पानी, खाद, "
                "बुवाई, कीट, रोग और खेती के बारे में "
                "प्रश्न पूछ सकते हैं।"
            )

        if language == "hinglish":
            return (
                "Namaste! 🌱 Main AgroAI Assistant hoon.\n\n"
                "Aap crop, soil, water, fertilizer, "
                "sowing, pests, diseases aur farming "
                "ke baare mein pooch sakte ho."
            )

        return (
            "Hello! 🌱 I am AgroAI Assistant.\n\n"
            "You can ask me about crops, soil, "
            "water, fertilizer, sowing, pests, "
            "diseases and farming."
        )

    if any(
        x in text
        for x in [
            "thank you",
            "thanks",
            "thank u",
            "dhanyavad",
            "धन्यवाद"
        ]
    ):

        if language == "marathi":
            return "तुमचे स्वागत आहे! 🌱 आणखी काही प्रश्न असल्यास विचारा."

        if language == "hindi":
            return "आपका स्वागत है! 🌱 खेती से जुड़ा कोई और सवाल हो तो पूछिए।"

        if language == "hinglish":
            return "You're welcome! 🌱 Farming se related koi aur question ho to poochho."

        return "You're welcome! 🌱 Feel free to ask another farming question."

    if any(
        x in text
        for x in [
            "bye",
            "goodbye",
            "see you",
            "tata"
        ]
    ):

        if language == "marathi":
            return "धन्यवाद! 🌱 तुमच्या शेतीसाठी शुभेच्छा."

        if language == "hindi":
            return "धन्यवाद! 🌱 आपकी खेती के लिए शुभकामनाएँ।"

        if language == "hinglish":
            return "Thank you! 🌱 Aapki farming ke liye best wishes."

        return "Goodbye! 🌱 Best wishes for your farming."

    if (
        "help" in text
        or "what can you do" in text
        or "kya kar sakte" in text
    ):

        return (
            "🌱 I can help you with:\n\n"
            "🌾 Crop information\n"
            "🌱 Soil requirements\n"
            "💧 Water & irrigation\n"
            "🧪 Fertilizer & nutrients\n"
            "📅 Sowing & seasons\n"
            "🐛 Pest problems\n"
            "🦠 Disease symptoms\n"
            "🌡️ Temperature\n"
            "🚜 General cultivation\n"
            "🌾 Harvesting\n\n"
            "You can ask naturally in English, Hindi, "
            "Hinglish or Marathi."
        )

    if (
        "what is agroai" in text
        or "about agroai" in text
        or "agroai kya hai" in text
    ):

        return (
            "🌱 AgroAI is an agriculture-focused AI-based "
            "platform designed to assist users with crop "
            "recommendation, farming information, weather, "
            "irrigation and agricultural assistance."
        )

    return None


# =========================================================
# CROP SUMMARY
# =========================================================

def crop_summary(crop, language):

    data = CROPS[crop]

    crop_name = crop.title()

    return (
        f"🌾 {crop_name} Information\n\n"
        f"🌱 Soil: {data['soil']}\n\n"
        f"💧 Water: {data['water']}\n\n"
        f"📅 Season: {data['season']}\n\n"
        f"🌱 Sowing: {data['sowing']}\n\n"
        f"🧪 Fertilizer: {data['fertilizer']}\n\n"
        f"🌡️ Temperature: {data['temperature']}\n\n"
        f"💡 Tips:\n"
        + "\n".join(
            "• " + tip
            for tip in data["tips"]
        )
    )


# =========================================================
# TOPIC RESPONSES
# =========================================================

def answer_topic(crop, topic, language):

    if not crop:

        return (
            "🌱 I can give crop-specific information, "
            "but please mention the crop name.\n\n"
            "For example:\n"
            "• What soil is suitable for soybean?\n"
            "• Wheat ko kitna water chahiye?\n"
            "• Cotton ki sowing kab kare?"
        )

    data = CROPS[crop]

    crop_name = crop.title()

    if topic == "soil":

        return (
            f"🌱 **{crop_name} – Soil Requirement**\n\n"
            f"{data['soil']}\n\n"
            "💡 For a more accurate recommendation, "
            "soil testing is useful because soil condition "
            "can vary from field to field."
        )

    if topic == "water":

        return (
            f"💧 **{crop_name} – Water Requirement**\n\n"
            f"{data['water']}\n\n"
            "Irrigation should be adjusted according to "
            "soil moisture, rainfall, weather and crop growth stage."
        )

    if topic == "fertilizer":

        return (
            f"🧪 **{crop_name} – Fertilizer**\n\n"
            f"{data['fertilizer']}\n\n"
            "⚠️ Exact fertilizer quantity should not be decided "
            "without considering soil test results and local "
            "agricultural recommendations."
        )

    if topic == "sowing":

        return (
            f"📅 **{crop_name} – Sowing / Planting**\n\n"
            f"{data['sowing']}\n\n"
            "The exact date can change according to location, "
            "rainfall, temperature and variety."
        )

    if topic == "season":

        return (
            f"📅 **{crop_name} – Growing Season**\n\n"
            f"{data['season']}\n\n"
            "Local climate and irrigation availability can "
            "change the suitable growing period."
        )

    if topic == "temperature":

        return (
            f"🌡️ **{crop_name} – Temperature**\n\n"
            f"{data['temperature']}\n\n"
            "Temperature suitability depends on the crop stage "
            "and local weather conditions."
        )

    if topic == "ph":

        return (
            f"🧪 **{crop_name} – Soil pH**\n\n"
            f"{data['ph']}\n\n"
            "A soil test is the best way to know the actual pH "
            "of your field."
        )

    if topic == "cultivation":

        return crop_summary(
            crop,
            language
        )

    if topic == "harvesting":

        return (
            f"🌾 **{crop_name} – Harvesting**\n\n"
            "Harvest timing depends on crop maturity, variety "
            "and local farming conditions.\n\n"
            "Look for crop-specific maturity signs before harvesting."
        )

    return crop_summary(
        crop,
        language
    )


# =========================================================
# PEST RESPONSE
# =========================================================

def pest_response(crop, language, text):

    crop_name = crop.title() if crop else "your crop"

    symptom_hints = []

    if any(
        x in text
        for x in [
            "leaf", "leaves", "पत्ता",
            "पत्ते", "पान"
        ]
    ):
        symptom_hints.append(
            "Check the leaves for holes, curling, spots, insects or discoloration."
        )

    if any(
        x in text
        for x in [
            "flower", "फूल"
        ]
    ):
        symptom_hints.append(
            "Check flowers for visible insects or feeding damage."
        )

    if any(
        x in text
        for x in [
            "fruit", "फल", "फळ"
        ]
    ):
        symptom_hints.append(
            "Check fruits for holes, scars, rotting or insect damage."
        )

    answer = (
        f"🐛 **{crop_name} – Pest Problem**\n\n"
        "If you are seeing insects or pest damage, first "
        "identify the pest and observe the affected plant part.\n\n"
    )

    if symptom_hints:

        answer += (
            "🔎 Based on your message:\n"
            + "\n".join(
                "• " + x
                for x in symptom_hints
            )
            + "\n\n"
        )

    answer += (
        "⚠️ Avoid choosing a pesticide only from a general "
        "description. Correct pest identification, crop stage "
        "and local recommendations should be considered before "
        "chemical treatment.\n\n"
        "If you tell me the crop, visible insect/symptom and "
        "affected plant part, I can narrow down the possible problem."
    )

    return answer


# =========================================================
# DISEASE / SYMPTOM RESPONSE
# =========================================================

def disease_response(crop, language, text):

    crop_name = crop.title() if crop else "your crop"

    possible_causes = []

    if any(
        x in text
        for x in [
            "yellow",
            "yellowing",
            "पीले",
            "पिवळी",
            "yellow leaves"
        ]
    ):

        possible_causes.extend([
            "Nutrient deficiency",
            "Waterlogging or irrigation-related stress",
            "Root-related problems",
            "Some diseases"
        ])

    if any(
        x in text
        for x in [
            "spot",
            "spots",
            "धब्बे",
            "डाग"
        ]
    ):

        possible_causes.extend([
            "Fungal or bacterial leaf problems",
            "Insect-related damage",
            "Environmental stress"
        ])

    if any(
        x in text
        for x in [
            "curl",
            "curling",
            "मुड़",
            "वाक"
        ]
    ):

        possible_causes.extend([
            "Insect or sucking-pest damage",
            "Environmental stress",
            "Some viral or physiological problems"
        ])

    if any(
        x in text
        for x in [
            "dry",
            "drying",
            "सूख",
            "कोरड"
        ]
    ):

        possible_causes.extend([
            "Water stress",
            "Root problems",
            "Heat stress",
            "Disease or pest damage"
        ])

    answer = (
        f"🦠 **{crop_name} – Plant Problem**\n\n"
    )

    if possible_causes:

        unique_causes = list(
            dict.fromkeys(
                possible_causes
            )
        )

        answer += (
            "Based on the symptoms you mentioned, possible "
            "causes may include:\n\n"
            + "\n".join(
                "• " + x
                for x in unique_causes
            )
            + "\n\n"
        )

    else:

        answer += (
            "The exact cause cannot be identified from the "
            "message alone.\n\n"
        )

    answer += (
        "🔎 Please check:\n"
        "• Which plant part is affected?\n"
        "• Are there spots, insects or discoloration?\n"
        "• Is the soil too wet or too dry?\n"
        "• When did the symptoms start?\n"
        "• Are new leaves or old leaves affected?\n\n"
        "⚠️ An exact disease diagnosis should not be made "
        "without sufficient symptoms or a clear image."
    )

    return answer


# =========================================================
# MULTI TOPIC RESPONSE
# =========================================================

def multi_topic_response(crop, intents, language):

    if not crop:

        return answer_topic(
            None,
            intents[0] if intents else "cultivation",
            language
        )

    data = CROPS[crop]

    crop_name = crop.title()

    sections = []

    if "soil" in intents:
        sections.append(
            f"🌱 Soil\n{data['soil']}"
        )

    if "water" in intents:
        sections.append(
            f"💧 Water\n{data['water']}"
        )

    if "fertilizer" in intents:
        sections.append(
            f"🧪 Fertilizer\n{data['fertilizer']}"
        )

    if "sowing" in intents:
        sections.append(
            f"📅 Sowing\n{data['sowing']}"
        )

    if "season" in intents:
        sections.append(
            f"🌾 Season\n{data['season']}"
        )

    if "temperature" in intents:
        sections.append(
            f"🌡️ Temperature\n{data['temperature']}"
        )

    if "ph" in intents:
        sections.append(
            f"🧪 Soil pH\n{data['ph']}"
        )

    if "cultivation" in intents:
        sections.append(
            "💡 Farming Tips\n"
            + "\n".join(
                "• " + x
                for x in data["tips"]
            )
        )

    if "harvesting" in intents:
        sections.append(
            "🌾 Harvesting\n"
            "Harvest when the crop reaches the appropriate "
            "maturity stage for the variety and local conditions."
        )

    if not sections:
        return crop_summary(
            crop,
            language
        )

    return (
        f"🌾 **{crop_name} – AgroAI Guidance**\n\n"
        + "\n\n".join(sections)
    )


# =========================================================
# FOLLOW-UP / CONTEXT
# =========================================================

LAST_CROP = None


def get_context_crop(text):

    global LAST_CROP

    crop = detect_crop(text)

    if crop:

        LAST_CROP = crop

        return crop

    return LAST_CROP


# =========================================================
# MAIN RESPONSE ENGINE
# =========================================================

def generate_response(
    message,
    crop_details=None
):

    if not message:

        return (
            "🌱 Please ask a question about farming, "
            "crops, soil, water, fertilizer, pests, "
            "diseases or cultivation."
        )

    raw_text = str(message)

    text = normalize(
        raw_text
    )

    if not text:

        return (
            "🌱 Please enter a valid farming question."
        )

    language = detect_language(
        raw_text
    )

    # -----------------------------------------------------
    # SPECIAL RESPONSES
    # -----------------------------------------------------

    special = special_response(
        text,
        language
    )

    if special:

        return special

    # -----------------------------------------------------
    # CROP FROM MESSAGE
    # -----------------------------------------------------

    crop = get_context_crop(
        raw_text
    )

    # -----------------------------------------------------
    # CROP FROM EXTERNAL CONTEXT
    # -----------------------------------------------------

    if not crop and crop_details:

        if isinstance(
            crop_details,
            str
        ):

            crop = detect_crop(
                crop_details
            )

        elif isinstance(
            crop_details,
            dict
        ):

            possible_crop = (
                crop_details.get("crop")
                or crop_details.get("crop_name")
                or crop_details.get("name")
            )

            if possible_crop:

                crop = detect_crop(
                    str(possible_crop)
                )

    # -----------------------------------------------------
    # INTENTS
    # -----------------------------------------------------

    intents = detect_intents(
        raw_text
    )

    # -----------------------------------------------------
    # PROBLEM / DISEASE
    # -----------------------------------------------------

    if (
        "disease" in intents
        or "problem" in intents
    ):

        return disease_response(
            crop,
            language,
            text
        )

    # -----------------------------------------------------
    # PEST
    # -----------------------------------------------------

    if "pest" in intents:

        return pest_response(
            crop,
            language,
            text
        )

    # -----------------------------------------------------
    # MULTIPLE TOPICS
    # -----------------------------------------------------

    useful_intents = [
        x for x in intents
        if x not in [
            "problem"
        ]
    ]

    if len(useful_intents) >= 2:

        return multi_topic_response(
            crop,
            useful_intents,
            language
        )

    # -----------------------------------------------------
    # SINGLE TOPIC
    # -----------------------------------------------------

    if useful_intents:

        return answer_topic(
            crop,
            useful_intents[0],
            language
        )

    # -----------------------------------------------------
    # CROP ONLY
    # -----------------------------------------------------

    if crop:

        return crop_summary(
            crop,
            language
        )

    # -----------------------------------------------------
    # GENERAL FARMING QUESTION
    # -----------------------------------------------------

    if any(
        phrase in text
        for phrase in [
            "farming",
            "खेती",
            "शेती",
            "agriculture",
            "farming tips",
            "kheti kaise"
        ]
    ):

        return (
            "🚜 **General Farming Guidance**\n\n"
            "Good crop management normally involves:\n\n"
            "🌱 Suitable soil\n"
            "💧 Proper irrigation\n"
            "🧪 Balanced nutrients\n"
            "🌾 Timely sowing\n"
            "🐛 Pest monitoring\n"
            "🦠 Disease monitoring\n"
            "🌿 Weed management\n"
            "🌾 Timely harvesting\n\n"
            "Tell me the crop name and your specific "
            "problem for more focused guidance."
        )

    # -----------------------------------------------------
    # UNKNOWN QUESTION
    # -----------------------------------------------------

    return (
        "🌱 I could not understand the exact farming topic "
        "from your question.\n\n"
        "You can ask naturally, for example:\n\n"
        "• Soybean ke leaves yellow ho rahe hain, kya karu?\n"
        "• What soil is suitable for cotton?\n"
        "• Wheat ki sowing kab karni chahiye?\n"
        "• How much water does rice need?\n"
        "• Which fertilizer is useful for maize?\n"
        "• माझ्या सोयाबीनच्या पानांवर डाग आहेत, काय करू?\n\n"
        "🌱 You don't need to use an exact FAQ sentence."
    )


# =========================================================
# LOCAL TEST
# =========================================================

if __name__ == "__main__":

    print("=" * 60)
    print("AGROAI INTELLIGENT LOCAL CHATBOT")
    print("Ollama: NOT USED")
    print("External API: NOT USED")
    print("=" * 60)

    test_questions = [

        "Hello",

        "What soil is suitable for rice?",

        "Mere soybean ke leaves yellow ho rahe hain kya karu?",

        "Cotton ke plants par insects aa gaye hain",

        "Soybean ke liye soil kaisi honi chahiye aur kitna water chahiye?",

        "Wheat ki sowing kab karni chahiye?",

        "Which fertilizer is suitable for maize?",

        "Mujhe rice ki complete farming information chahiye",

        "सोयाबीनसाठी योग्य माती कोणती?",

        "माझ्या कापसावर कीड आली आहे, काय करू?",

        "What can you do?",

        "Thank you"
    ]

    for question in test_questions:

        print("\nUSER:")
        print(question)

        print("\nAGROAI:")
        print(
            generate_response(question)
        )

        print("\n" + "-" * 60)