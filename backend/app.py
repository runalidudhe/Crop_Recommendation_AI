from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime
import json
import joblib
import pandas as pd
import os
import requests
from dotenv import load_dotenv
from openai import OpenAI


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv(
    dotenv_path=Path(__file__).resolve().parent / ".env"
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)


# =========================================================
# PROJECT PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

FRONTEND_DIR = BASE_DIR / "frontend"
IMAGE_DIR = FRONTEND_DIR / "images"

# Disease Detection uploaded images are kept separately from
# the website crop images. This is only the upload/validation
# stage; the actual AI disease model will be connected later.
DISEASE_UPLOAD_DIR = BASE_DIR / "disease_uploads"
DISEASE_UPLOAD_DIR.mkdir(exist_ok=True)

ML_DIR = BASE_DIR / "ml_model"
MODEL_PATH = ML_DIR / "crop_recommendation_model.pkl"

DATABASE_DIR = BASE_DIR / "database"
DATABASE_DIR.mkdir(exist_ok=True)

ADMIN_DATA_FILE = DATABASE_DIR / "admin_data.json"


# =========================================================
# DEFAULT 31 CROPS
# =========================================================

DEFAULT_CROPS = [
    "apple",
    "banana",
    "blackgram",
    "chickpea",
    "chilli",
    "coconut",
    "coffee",
    "cotton",
    "grapes",
    "groundnut",
    "jute",
    "kidneybeans",
    "lentil",
    "maize",
    "mango",
    "mothbeans",
    "mungbean",
    "muskmelon",
    "onion",
    "orange",
    "papaya",
    "peas",
    "pigeonpeas",
    "pomegranate",
    "potato",
    "rice",
    "sugarcane",
    "sunflower",
    "tomato",
    "watermelon",
    "wheat"
]


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="AgroAI API",
    description="AgroAI Smart Agriculture Backend",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =========================================================
# IMAGE FOLDER
# =========================================================

print("IMAGE FOLDER:")
print(IMAGE_DIR)

print("FOLDER EXISTS:", IMAGE_DIR.exists())

if IMAGE_DIR.exists():

    app.mount(
        "/images",
        StaticFiles(directory=str(IMAGE_DIR)),
        name="images"
    )

    print("Images folder mounted successfully.")

else:

    print("WARNING: Images folder not found.")


# =========================================================
# LOAD ML MODEL
# =========================================================

if not MODEL_PATH.exists():

    raise FileNotFoundError(
        f"ML model not found: {MODEL_PATH}"
    )

model = joblib.load(MODEL_PATH)

print("ML model loaded successfully.")


# =========================================================
# DATABASE FILE
# =========================================================

def create_database_file():

    if not ADMIN_DATA_FILE.exists():

        initial_data = {
            "history": [],
            "users": [],
            "crops": DEFAULT_CROPS.copy(),
            "contact_messages": [],
            "default_crops_loaded": True
        }

        ADMIN_DATA_FILE.write_text(
            json.dumps(
                initial_data,
                indent=4
            ),
            encoding="utf-8"
        )

        print(
            "Database created with 31 default crops."
        )


create_database_file()


# =========================================================
# DATABASE HELPERS
# =========================================================

def load_data():

    try:

        data = json.loads(
            ADMIN_DATA_FILE.read_text(
                encoding="utf-8"
            )
        )

        if "history" not in data:
            data["history"] = []

        if "users" not in data:
            data["users"] = []

        if "crops" not in data:
            data["crops"] = []

        if "contact_messages" not in data:

            data["contact_messages"] = []

            save_data(data)

            print(
                "Contact messages section added to database."
            )

        if "default_crops_loaded" not in data:

            data["crops"] = DEFAULT_CROPS.copy()

            data["default_crops_loaded"] = True

            save_data(data)

            print(
                "31 default crops added to existing database."
            )

        return data

    except Exception as error:

        print(
            "Database read error:",
            error
        )

        data = {
            "history": [],
            "users": [],
            "crops": DEFAULT_CROPS.copy(),
            "contact_messages": [],
            "default_crops_loaded": True
        }

        save_data(data)

        return data


def save_data(data):

    ADMIN_DATA_FILE.write_text(
        json.dumps(
            data,
            indent=4
        ),
        encoding="utf-8"
    )


# =========================================================
# ROOT API
# =========================================================

@app.get("/")
def home():

    return {
        "message": "AgroAI Backend API is running",
        "status": "online"
    }


# =========================================================
# SIGNUP
# =========================================================

class SignupInput(BaseModel):

    name: str
    email: str
    password: str


@app.post("/signup")
def signup(user: SignupInput):

    name = user.name.strip()
    email = user.email.strip().lower()
    password = user.password

    if name == "":

        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    if email == "":

        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    if password == "":

        raise HTTPException(
            status_code=400,
            detail="Password is required"
        )

    data = load_data()

    for existing_user in data["users"]:

        if existing_user["email"].lower() == email:

            raise HTTPException(
                status_code=400,
                detail="An account with this email already exists."
            )

    new_user = {

        "id": len(data["users"]) + 1,

        "name": name,

        "email": email,

        "password": password,

        "created_at": datetime.now().strftime(
            "%d-%m-%Y %I:%M:%S %p"
        )

    }

    data["users"].append(new_user)

    save_data(data)

    return {

        "success": True,

        "message": "Account created successfully",

        "user": {

            "id": new_user["id"],

            "name": new_user["name"],

            "email": new_user["email"]

        }

    }


# =========================================================
# LOGIN
# =========================================================

class LoginInput(BaseModel):

    email: str
    password: str


@app.post("/login")
def login(user: LoginInput):

    email = user.email.strip().lower()

    password = user.password

    # =====================================================
    # ADMIN LOGIN
    # =====================================================

    if (
        email == "admin@agroai.com"
        and password == "Admin@123"
    ):

        return {

            "success": True,

            "message": "Admin login successful",

            "role": "admin",

            "redirect": "admin.html"

        }

    # =====================================================
    # USER LOGIN
    # =====================================================

    data = load_data()

    for existing_user in data["users"]:

        if (
            existing_user["email"].lower() == email
            and existing_user["password"] == password
        ):

            return {

                "success": True,

                "message": "Login successful",

                "role": "user",

                "redirect": "index.html",

                "user": {

                    "id": existing_user["id"],

                    "name": existing_user["name"],

                    "email": existing_user["email"]

                }

            }

    raise HTTPException(
        status_code=401,
        detail="Invalid email or password"
    )


# =========================================================
# FORGOT PASSWORD
# =========================================================

class ForgotPasswordInput(BaseModel):

    email: str
    new_password: str


@app.post("/forgot-password")
def forgot_password(data_input: ForgotPasswordInput):

    email = data_input.email.strip().lower()

    new_password = data_input.new_password

    if email == "":

        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    if new_password == "":

        raise HTTPException(
            status_code=400,
            detail="New password is required"
        )

    if email == "admin@agroai.com":

        raise HTTPException(
            status_code=400,
            detail="Admin password cannot be changed here."
        )

    data = load_data()

    for existing_user in data["users"]:

        if existing_user["email"].lower() == email:

            existing_user["password"] = new_password

            save_data(data)

            return {

                "success": True,

                "message":
                    "Password reset successfully."

            }

    raise HTTPException(
        status_code=404,
        detail="No account found with this email."
    )


# =========================================================
# CONTACT MESSAGE INPUT
# =========================================================

class ContactMessageInput(BaseModel):

    name: str
    email: str
    subject: str
    message: str


# =========================================================
# CONTACT MESSAGE - SAVE
# =========================================================

@app.post("/contact")
def submit_contact_message(data_input: ContactMessageInput):

    name = data_input.name.strip()
    email = data_input.email.strip().lower()
    subject = data_input.subject.strip()
    message = data_input.message.strip()

    if name == "":

        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    if email == "":

        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    if subject == "":

        raise HTTPException(
            status_code=400,
            detail="Subject is required"
        )

    if message == "":

        raise HTTPException(
            status_code=400,
            detail="Message is required"
        )

    data = load_data()

    new_message = {

        "id":
            len(data["contact_messages"]) + 1,

        "name":
            name,

        "email":
            email,

        "subject":
            subject,

        "message":
            message,

        "date":
            datetime.now().strftime(
                "%d-%m-%Y %I:%M:%S %p"
            ),

        "status":
            "unread"

    }

    data["contact_messages"].append(
        new_message
    )

    save_data(data)

    print(
        "NEW CONTACT MESSAGE:",
        new_message
    )

    return {

        "success": True,

        "message":
            "Your message has been submitted successfully.",

        "contact_message": {

            "id":
                new_message["id"],

            "name":
                new_message["name"],

            "subject":
                new_message["subject"],

            "date":
                new_message["date"]

        }

    }


# =========================================================
# CROP INPUT
# =========================================================

class CropInput(BaseModel):

    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

    state: str = "Maharashtra"

    district: str = ""


# =========================================================
# CROP INFORMATION
# =========================================================

CROP_DETAILS = {

    "rice": {
        "season": "Kharif",
        "soil": "Clayey / loamy soil with good water retention",
        "water": "High",
        "temperature": "20–35 °C",
        "ph": "5.5–7.0",
        "fertilizer": "Nitrogen-rich balanced fertilizer based on soil testing",
        "sowing": "June–July",
        "harvesting": "October–November",
        "tips": "Maintain proper moisture, control weeds and monitor pests regularly.",
        "precautions": "Avoid unsuitable waterlogging periods and monitor fungal diseases."
    },

    "maize": {
        "season": "Kharif / Rabi",
        "soil": "Well-drained loamy soil",
        "water": "Medium",
        "temperature": "21–30 °C",
        "ph": "5.5–7.5",
        "fertilizer": "Balanced NPK with split nitrogen application",
        "sowing": "June–July",
        "harvesting": "September–October",
        "tips": "Maintain spacing, weed control and timely irrigation.",
        "precautions": "Monitor fall armyworm and avoid waterlogging."
    },

    "cotton": {
        "season": "Kharif",
        "soil": "Deep black soil with good drainage",
        "water": "Medium",
        "temperature": "21–30 °C",
        "ph": "5.5–8.0",
        "fertilizer": "Balanced NPK according to soil test",
        "sowing": "June–July",
        "harvesting": "October–January",
        "tips": "Control weeds and regularly monitor boll development.",
        "precautions": "Monitor sucking pests and bollworms."
    },

    "chickpea": {
        "season": "Rabi",
        "soil": "Well-drained loamy to black soil",
        "water": "Low–Medium",
        "temperature": "15–30 °C",
        "ph": "6.0–8.0",
        "fertilizer": "Moderate phosphorus with balanced nutrients",
        "sowing": "October–November",
        "harvesting": "February–March",
        "tips": "Avoid excessive irrigation and maintain good drainage.",
        "precautions": "Monitor pod borer and fungal diseases."
    },

    "pigeonpeas": {
        "season": "Kharif",
        "soil": "Well-drained black or loamy soil",
        "water": "Medium",
        "temperature": "20–30 °C",
        "ph": "5.5–7.5",
        "fertilizer": "Balanced fertilizer with phosphorus",
        "sowing": "June–July",
        "harvesting": "December–January",
        "tips": "Maintain spacing and control weeds.",
        "precautions": "Monitor pod borer and wilt."
    },

    "mungbean": {
        "season": "Kharif / Summer",
        "soil": "Well-drained loamy soil",
        "water": "Low–Medium",
        "temperature": "25–35 °C",
        "ph": "6.0–7.5",
        "fertilizer": "Balanced fertilizer with phosphorus",
        "sowing": "June–July / March–April",
        "harvesting": "September–October",
        "tips": "Avoid waterlogging and harvest pods at the correct stage.",
        "precautions": "Monitor yellow mosaic virus and sucking pests."
    },

    "blackgram": {
        "season": "Kharif / Rabi",
        "soil": "Well-drained loamy soil",
        "water": "Low–Medium",
        "temperature": "25–35 °C",
        "ph": "6.0–7.5",
        "fertilizer": "Balanced fertilizer based on soil test",
        "sowing": "June–July",
        "harvesting": "September–October",
        "tips": "Maintain drainage and control weeds.",
        "precautions": "Monitor yellow mosaic virus and pod pests."
    },

    "lentil": {
        "season": "Rabi",
        "soil": "Well-drained loamy soil",
        "water": "Low",
        "temperature": "18–30 °C",
        "ph": "6.0–7.5",
        "fertilizer": "Moderate phosphorus and balanced nutrients",
        "sowing": "October–November",
        "harvesting": "February–March",
        "tips": "Avoid excessive irrigation and maintain clean fields.",
        "precautions": "Monitor rust and wilt diseases."
    },

    "kidneybeans": {
        "season": "Kharif / Rabi",
        "soil": "Well-drained loamy soil",
        "water": "Medium",
        "temperature": "18–25 °C",
        "ph": "5.5–6.5",
        "fertilizer": "Balanced NPK according to soil test",
        "sowing": "June–July / October–November",
        "harvesting": "90–120 days",
        "tips": "Use clean seed and maintain good drainage.",
        "precautions": "Avoid excessive nitrogen and waterlogging."
    },

    "mothbeans": {
        "season": "Kharif",
        "soil": "Sandy loam and light soils",
        "water": "Low",
        "temperature": "25–35 °C",
        "ph": "6.0–8.0",
        "fertilizer": "Low to moderate balanced fertilizer",
        "sowing": "June–July",
        "harvesting": "September–October",
        "tips": "Suitable for relatively dry conditions; conserve soil moisture.",
        "precautions": "Avoid excessive irrigation."
    },

    "muskmelon": {
        "season": "Summer",
        "soil": "Sandy loam with good drainage",
        "water": "Medium",
        "temperature": "22–35 °C",
        "ph": "6.0–7.5",
        "fertilizer": "Balanced NPK with adequate potassium",
        "sowing": "February–March",
        "harvesting": "April–June",
        "tips": "Use uniform irrigation and maintain field hygiene.",
        "precautions": "Avoid waterlogging and monitor fruit pests."
    },

    "watermelon": {
        "season": "Summer",
        "soil": "Sandy loam with good drainage",
        "water": "Medium–High",
        "temperature": "22–35 °C",
        "ph": "6.0–7.5",
        "fertilizer": "Balanced NPK with adequate potassium",
        "sowing": "February–March",
        "harvesting": "May–June",
        "tips": "Maintain uniform irrigation during fruit development.",
        "precautions": "Avoid waterlogging and monitor fruit diseases."
    },

    "banana": {
        "season": "Year-round",
        "soil": "Deep fertile loamy soil with good drainage",
        "water": "High",
        "temperature": "20–35 °C",
        "ph": "6.0–7.5",
        "fertilizer": "Regular NPK based on soil test",
        "sowing": "Year-round with suitable irrigation",
        "harvesting": "9–12 months",
        "tips": "Maintain regular irrigation and remove damaged leaves.",
        "precautions": "Avoid waterlogging and monitor fungal diseases."
    },

    "mango": {
        "season": "Perennial",
        "soil": "Deep well-drained loamy soil",
        "water": "Medium",
        "temperature": "24–30 °C",
        "ph": "5.5–7.5",
        "fertilizer": "Organic manure with balanced NPK",
        "sowing": "Monsoon / suitable planting season",
        "harvesting": "March–June",
        "tips": "Prune properly and maintain orchard hygiene.",
        "precautions": "Monitor fruit flies and fungal diseases."
    },

    "grapes": {
        "season": "Perennial",
        "soil": "Well-drained sandy loam to loam",
        "water": "Medium",
        "temperature": "15–35 °C",
        "ph": "6.0–7.5",
        "fertilizer": "Balanced nutrients with organic matter",
        "sowing": "Suitable orchard planting season",
        "harvesting": "January–April",
        "tips": "Use canopy management and controlled irrigation.",
        "precautions": "Monitor powdery mildew and fruit diseases."
    },

    "pomegranate": {
        "season": "Perennial",
        "soil": "Well-drained loamy to light soils",
        "water": "Low–Medium",
        "temperature": "25–35 °C",
        "ph": "6.5–7.5",
        "fertilizer": "Balanced NPK with organic manure",
        "sowing": "Monsoon / suitable orchard season",
        "harvesting": "August–February",
        "tips": "Use regulated irrigation and maintain orchard sanitation.",
        "precautions": "Monitor bacterial blight and fruit borer."
    },

    "papaya": {
        "season": "Year-round",
        "soil": "Well-drained fertile loam",
        "water": "Medium–High",
        "temperature": "21–33 °C",
        "ph": "6.0–7.0",
        "fertilizer": "Regular balanced NPK and organic matter",
        "sowing": "Year-round in suitable conditions",
        "harvesting": "8–12 months",
        "tips": "Provide drainage and balanced nutrition.",
        "precautions": "Monitor viral diseases and avoid waterlogging."
    },

    "orange": {
        "season": "Perennial",
        "soil": "Well-drained loamy soil",
        "water": "Medium",
        "temperature": "15–30 °C",
        "ph": "6.0–7.5",
        "fertilizer": "Organic manure plus balanced NPK",
        "sowing": "Suitable orchard planting season",
        "harvesting": "October–February",
        "tips": "Maintain orchard hygiene and balanced irrigation.",
        "precautions": "Monitor citrus pests and diseases."
    },

    "coconut": {
        "season": "Perennial",
        "soil": "Well-drained sandy loam / coastal soils",
        "water": "High",
        "temperature": "20–35 °C",
        "ph": "5.5–7.5",
        "fertilizer": "Organic manure with balanced NPK",
        "sowing": "Monsoon / suitable planting season",
        "harvesting": "Year-round after maturity",
        "tips": "Maintain moisture and mulch around palms.",
        "precautions": "Avoid prolonged drought and waterlogging."
    },

    "coffee": {
        "season": "Perennial",
        "soil": "Rich, well-drained acidic soil",
        "water": "High",
        "temperature": "15–28 °C",
        "ph": "5.0–6.5",
        "fertilizer": "Organic matter with balanced nutrients",
        "sowing": "Monsoon planting period",
        "harvesting": "Season-dependent",
        "tips": "Provide shade, mulch and adequate moisture.",
        "precautions": "Monitor coffee berry disease and pests."
    }
}


# =========================================================
# DISTRICT INFORMATION
# =========================================================

DISTRICT_INFO = {

    "Yavatmal": {
        "overview": "Important Vidarbha agricultural district with black soil and strong Kharif farming.",
        "major_crops": "Cotton, soybean, pigeonpea, sorghum",
        "rainfall": "Approx. 900–1100 mm",
        "climate": "Hot tropical / semi-arid",
        "farming_focus": "Cotton, pulses and oilseeds",
        "note": "Moisture conservation, timely sowing and efficient water management are important."
    },

    "Nagpur": {
        "overview": "Major agricultural district with diverse soils and seasonal rainfall.",
        "major_crops": "Orange, cotton, soybean, rice, wheat",
        "rainfall": "Approx. 1000–1200 mm",
        "climate": "Tropical wet and dry",
        "farming_focus": "Horticulture, cotton, soybean and cereals",
        "note": "Irrigation planning and soil-test-based nutrient management are useful."
    },

    "Akola": {
        "overview": "Major Vidarbha farming region known for black cotton soil.",
        "major_crops": "Cotton, soybean, pigeonpea, sorghum",
        "rainfall": "Approx. 700–900 mm",
        "climate": "Hot and semi-arid",
        "farming_focus": "Cotton, soybean and pulses",
        "note": "Moisture conservation and efficient rainfall utilization are important."
    },

    "Amravati": {
        "overview": "Agricultural district with important black-soil areas and seasonal farming.",
        "major_crops": "Cotton, soybean, pigeonpea, wheat",
        "rainfall": "Approx. 700–1100 mm",
        "climate": "Tropical wet and dry",
        "farming_focus": "Cotton, pulses and oilseeds",
        "note": "Timely sowing and moisture management support Kharif crops."
    },

    "Chhatrapati Sambhajinagar": {
        "overview": "A diverse agricultural district with dry and semi-arid farming conditions.",
        "major_crops": "Cotton, soybean, pulses, maize",
        "rainfall": "Approx. 600–800 mm",
        "climate": "Semi-arid",
        "farming_focus": "Pulses, cotton and water-efficient crops",
        "note": "Rainwater conservation and drought-aware crop selection are important."
    },

    "Pune": {
        "overview": "Agriculture varies from irrigated farming to rainfed areas across the district.",
        "major_crops": "Sugarcane, onion, vegetables, cereals",
        "rainfall": "Region-dependent",
        "climate": "Tropical / semi-arid to wetter western areas",
        "farming_focus": "Horticulture, vegetables and irrigated crops",
        "note": "Local rainfall and irrigation availability should guide crop selection."
    },

    "Nashik": {
        "overview": "Important horticultural district with diverse soils and agro-climatic zones.",
        "major_crops": "Grapes, onion, vegetables, maize",
        "rainfall": "Region-dependent",
        "climate": "Tropical semi-arid",
        "farming_focus": "Horticulture and onion",
        "note": "Irrigation scheduling and orchard disease monitoring are important."
    }
}


# =========================================================
# CROP HELPERS
# =========================================================

def get_crop_details(crop):

    key = str(crop).strip().lower()

    return CROP_DETAILS.get(
        key,
        {
            "season": "Crop-specific",
            "soil": "Use well-drained soil suitable for the selected crop",
            "water": "Crop-specific",
            "temperature": "Crop-specific",
            "ph": "Crop-specific",
            "fertilizer": "Use soil-test-based fertilizer recommendation",
            "sowing": "Follow locally recommended sowing period",
            "harvesting": "Depends on crop variety and season",
            "tips": "Monitor soil moisture, weeds, pests and crop health regularly.",
            "precautions": "Consider local weather and agricultural expert guidance."
        }
    )


def get_district_info(district):

    return DISTRICT_INFO.get(
        str(district).strip(),
        {
            "overview":
                f"AgroAI district intelligence for {district or 'the selected district'} is based on regional farming context.",

            "major_crops":
                "Use locally suitable crops based on soil, rainfall and season.",

            "rainfall":
                "District-specific",

            "climate":
                "Regional climate",

            "farming_focus":
                "Soil- and season-based farming",

            "note":
                "Combine AI recommendations with local agricultural guidance."
        }
    )


# =========================================================
# TOP CROP PREDICTIONS
# =========================================================

def get_top_predictions(input_data):

    prediction = model.predict(input_data)

    recommended_crop = str(prediction[0])

    results = []

    # -----------------------------------------------------
    # MODEL PROBABILITY SUPPORT
    # -----------------------------------------------------

    if (
        hasattr(model, "predict_proba")
        and hasattr(model, "classes_")
    ):

        probabilities = model.predict_proba(
            input_data
        )[0]

        classes = model.classes_

        ranked = sorted(
            zip(classes, probabilities),
            key=lambda x: float(x[1]),
            reverse=True
        )

        # -------------------------------------------------
        # IMPORTANT:
        # Only positive probability crops are considered.
        # This prevents meaningless zero-probability
        # alternatives from appearing.
        # -------------------------------------------------

        positive_predictions = [
            (crop_name, probability)
            for crop_name, probability in ranked
            if float(probability) > 0
        ]

        for crop_name, probability in positive_predictions[:3]:

            results.append(
                {
                    "crop": str(crop_name),
                    "probability": round(
                        float(probability) * 100,
                        2
                    )
                }
            )

    # -----------------------------------------------------
    # FALLBACK
    # -----------------------------------------------------

    if not results:

        results.append(
            {
                "crop": recommended_crop,
                "probability": None
            }
        )

    return recommended_crop, results


# =========================================================
# CROP PREDICTION
# =========================================================

@app.post("/predict")
def predict_crop(data: CropInput):

    try:

        input_data = pd.DataFrame(
            [[
                data.N,
                data.P,
                data.K,
                data.temperature,
                data.humidity,
                data.ph,
                data.rainfall
            ]],
            columns=[
                "N",
                "P",
                "K",
                "temperature",
                "humidity",
                "ph",
                "rainfall"
            ]
        )

        crop, top_predictions = get_top_predictions(
            input_data
        )

        confidence = (
            top_predictions[0].get("probability")
            if top_predictions
            else None
        )

        crop_details = get_crop_details(crop)

        district_details = get_district_info(
            data.district
        )

        database = load_data()

        history_item = {

            "id":
                len(database["history"]) + 1,

            "date":
                datetime.now().strftime(
                    "%d-%m-%Y %I:%M:%S %p"
                ),

            "state":
                data.state,

            "district":
                data.district,

            "N":
                data.N,

            "P":
                data.P,

            "K":
                data.K,

            "temperature":
                data.temperature,

            "humidity":
                data.humidity,

            "ph":
                data.ph,

            "rainfall":
                data.rainfall,

            "crop":
                crop,

            "confidence":
                confidence

        }

        database["history"].append(
            history_item
        )

        save_data(database)

        return {

            "success": True,

            "recommended_crop":
                crop,

            "confidence":
                confidence,

            "top_recommendations":
                top_predictions,

            "farm_data": {

                "state":
                    data.state,

                "district":
                    data.district,

                "N":
                    data.N,

                "P":
                    data.P,

                "K":
                    data.K,

                "temperature":
                    data.temperature,

                "humidity":
                    data.humidity,

                "ph":
                    data.ph,

                "rainfall":
                    data.rainfall

            },

            "crop_information": {

                "season":
                    crop_details["season"],

                "soil":
                    crop_details["soil"],

                "water":
                    crop_details["water"],

                "temperature":
                    crop_details["temperature"],

                "ph":
                    crop_details["ph"],

                "fertilizer":
                    crop_details["fertilizer"],

                "sowing":
                    crop_details["sowing"],

                "harvesting":
                    crop_details["harvesting"],

                "tips":
                    crop_details["tips"],

                "precautions":
                    crop_details["precautions"]

            },

            "district_intelligence": {

                "district":
                    data.district,

                "overview":
                    district_details["overview"],

                "major_crops":
                    district_details["major_crops"],

                "rainfall":
                    district_details["rainfall"],

                "climate":
                    district_details["climate"],

                "farming_focus":
                    district_details["farming_focus"],

                "note":
                    district_details["note"]

            }

        }

    except Exception as error:

        print(
            "CROP PREDICTION ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================================================
# PLANT DISEASE DETECTION - STEP 1
# IMAGE UPLOAD + VALIDATION
# =========================================================

@app.post("/disease-detect")
async def disease_detect(
    crop: str,
    district: str,
    symptoms: str = "",
    image: UploadFile = File(...)
):

    crop_name = crop.strip()
    district_name = district.strip()
    symptoms_text = symptoms.strip()

    if not crop_name:
        raise HTTPException(
            status_code=400,
            detail="Crop is required."
        )

    if not district_name:
        raise HTTPException(
            status_code=400,
            detail="District is required."
        )

    if not image.filename:
        raise HTTPException(
            status_code=400,
            detail="Please upload an image."
        )

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png"
    }

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG and PNG images are allowed."
        )

    image_bytes = await image.read()

    max_size = 10 * 1024 * 1024

    if len(image_bytes) > max_size:
        raise HTTPException(
            status_code=400,
            detail="Image size must not exceed 10 MB."
        )

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    if image.content_type == "image/png":
        extension = ".png"
    else:
        extension = ".jpg"

    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S_%f"
    )

    safe_filename = (
        f"disease_{timestamp}{extension}"
    )

    file_path = DISEASE_UPLOAD_DIR / safe_filename

    try:

        file_path.write_bytes(image_bytes)

    except Exception as error:

        print(
            "DISEASE IMAGE SAVE ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to save the uploaded image."
        )

    print("DISEASE IMAGE RECEIVED:")
    print("Crop:", crop_name)
    print("District:", district_name)
    print("Symptoms:", symptoms_text)
    print("Image:", safe_filename)

    return {
        "success": True,
        "message": "Disease image uploaded successfully.",
        "crop": crop_name,
        "district": district_name,
        "symptoms": symptoms_text,
        "image": {
            "filename": safe_filename,
            "content_type": image.content_type,
            "size": len(image_bytes)
        },
        "status": "Image ready for AI disease analysis."
    }


# =========================================================
# WEATHER INTELLIGENCE
# =========================================================

OPENWEATHER_GEO_URL = (
    "https://api.openweathermap.org/geo/1.0/direct"
)

OPENWEATHER_CURRENT_URL = (
    "https://api.openweathermap.org/data/2.5/weather"
)

OPENWEATHER_FORECAST_URL = (
    "https://api.openweathermap.org/data/2.5/forecast"
)


# =========================================================
# WEATHER INPUT
# =========================================================

class WeatherInput(BaseModel):

    district: str

    state: str = "Maharashtra"

    country: str = "IN"

    city: str = ""

    village: str = ""


# =========================================================
# WEATHER LOCATION
# =========================================================

def get_weather_location(
    district: str,
    state: str = "Maharashtra",
    country: str = "IN",
    city: str = "",
    village: str = ""
):
    """
    Weather location resolver.

    Location flow:
        Village -> City -> District -> State -> Country

    Examples:

    City:
        Umarkhed -> Yavatmal -> Maharashtra -> IN

    Village:
        VillageName -> Umarkhed -> Yavatmal -> Maharashtra -> IN

    If an exact village is not available in OpenWeather,
    the function falls back to the City and then District.

    IMPORTANT:
    The user's selected location is always preserved in
    the returned response.
    """

    # =========================================================
    # 1. CHECK OPENWEATHER API KEY
    # =========================================================

    if not OPENWEATHER_API_KEY:

        raise HTTPException(
            status_code=500,
            detail=(
                "OpenWeather API key is not configured. "
                "Add OPENWEATHER_API_KEY to backend/.env."
            )
        )

    # =========================================================
    # 2. CLEAN INPUT
    # =========================================================

    district_name = (district or "").strip()

    state_name = (
        state or "Maharashtra"
    ).strip()

    country_code = (
        country or "IN"
    ).strip().upper()

    city_name = (
        city or ""
    ).strip()

    village_name = (
        village or ""
    ).strip()

    # =========================================================
    # 3. DISTRICT REQUIRED
    # =========================================================

    if not district_name:

        raise HTTPException(
            status_code=400,
            detail="District is required."
        )

    # =========================================================
    # 4. BUILD SEARCH FLOW
    #
    # PRIORITY:
    #
    # Village + City + District + State + Country
    # Village + District + State + Country
    # Village + Country
    #
    # City + District + State + Country
    # City + District + Country
    # City + Country
    #
    # District + State + Country
    # District + Country
    # =========================================================

    search_locations = []

    # ---------------------------------------------------------
    # VILLAGE SEARCH
    # ---------------------------------------------------------

    if village_name:

        if city_name:

            search_locations.append(
                (
                    "village_city",
                    village_name,
                    f"{village_name},{city_name},{district_name},{state_name},{country_code}"
                )
            )

        search_locations.append(
            (
                "village_district",
                village_name,
                f"{village_name},{district_name},{state_name},{country_code}"
            )
        )

        search_locations.append(
            (
                "village_state",
                village_name,
                f"{village_name},{state_name},{country_code}"
            )
        )

        search_locations.append(
            (
                "village_country",
                village_name,
                f"{village_name},{country_code}"
            )
        )

    # ---------------------------------------------------------
    # CITY SEARCH
    # ---------------------------------------------------------

    if city_name:

        search_locations.append(
            (
                "city_district",
                city_name,
                f"{city_name},{district_name},{state_name},{country_code}"
            )
        )

        search_locations.append(
            (
                "city_state",
                city_name,
                f"{city_name},{state_name},{country_code}"
            )
        )

        search_locations.append(
            (
                "city_country",
                city_name,
                f"{city_name},{country_code}"
            )
        )

    # ---------------------------------------------------------
    # DISTRICT SEARCH
    # ---------------------------------------------------------

    search_locations.append(
        (
            "district_state",
            district_name,
            f"{district_name},{state_name},{country_code}"
        )
    )

    search_locations.append(
        (
            "district_country",
            district_name,
            f"{district_name},{country_code}"
        )
    )

    # =========================================================
    # 5. REMOVE DUPLICATE QUERIES
    # =========================================================

    unique_search_locations = []

    already_added = set()

    for location_type, location_name, query in search_locations:

        query_key = query.lower()

        if query_key not in already_added:

            already_added.add(query_key)

            unique_search_locations.append(
                (
                    location_type,
                    location_name,
                    query
                )
            )

    # =========================================================
    # 6. TRY LOCATIONS ONE BY ONE
    # =========================================================

    last_error = None

    for location_type, location_name, query in unique_search_locations:

        print(
            "=================================================="
        )

        print(
            "OPENWEATHER SEARCH TYPE:",
            location_type
        )

        print(
            "OPENWEATHER SEARCH LOCATION:",
            query
        )

        try:

            response = requests.get(
                OPENWEATHER_GEO_URL,
                params={
                    "q": query,
                    "limit": 1,
                    "appid": OPENWEATHER_API_KEY
                },
                timeout=10
            )

            print(
                "OPENWEATHER STATUS:",
                response.status_code
            )

            print(
                "OPENWEATHER RESPONSE:",
                response.text
            )

            # -------------------------------------------------
            # LOCATION NOT FOUND
            # -------------------------------------------------

            if response.status_code == 404:

                print(
                    "LOCATION NOT FOUND:"
                )

                print(
                    query
                )

                print(
                    "Trying next fallback..."
                )

                continue

            # -------------------------------------------------
            # OTHER HTTP ERROR
            # -------------------------------------------------

            response.raise_for_status()

            # -------------------------------------------------
            # CONVERT RESPONSE TO JSON
            # -------------------------------------------------

            locations = response.json()

            # -------------------------------------------------
            # EMPTY RESULT
            # -------------------------------------------------

            if not locations:

                print(
                    "OPENWEATHER EMPTY RESULT:",
                    query
                )

                print(
                    "Trying next fallback..."
                )

                continue

            # =================================================
            # 7. LOCATION FOUND
            # =================================================

            location = locations[0]

            latitude = location.get(
                "lat"
            )

            longitude = location.get(
                "lon"
            )

            # -------------------------------------------------
            # COORDINATES CHECK
            # -------------------------------------------------

            if latitude is None or longitude is None:

                print(
                    "LOCATION FOUND BUT COORDINATES ARE MISSING:"
                )

                print(
                    query
                )

                continue

            # =================================================
            # 8. DETERMINE DISPLAY LOCATION
            # =================================================

            # If village was selected and exact village
            # was found, village becomes the main display name.

            if (
                location_type.startswith("village")
                and village_name
            ):

                display_name = village_name

            elif city_name:

                display_name = city_name

            else:

                display_name = district_name

            # =================================================
            # 9. PRINT SUCCESS
            # =================================================

            print(
                "=================================================="
            )

            print(
                "OPENWEATHER LOCATION FOUND"
            )

            print(
                "SEARCH TYPE:",
                location_type
            )

            print(
                "SEARCH NAME:",
                location_name
            )

            print(
                "DISPLAY NAME:",
                display_name
            )

            print(
                "LATITUDE:",
                latitude
            )

            print(
                "LONGITUDE:",
                longitude
            )

            print(
                "=================================================="
            )

            # =================================================
            # 10. RETURN LOCATION
            # =================================================

            return {

                # -------------------------------------------------
                # ACTUAL WEATHER LOCATION FOUND BY OPENWEATHER
                # -------------------------------------------------

                "name": location.get(
                    "name",
                    location_name
                ),

                "state": location.get(
                    "state",
                    state_name
                ),

                "country": location.get(
                    "country",
                    country_code
                ),

                "latitude": latitude,

                "longitude": longitude,

                # -------------------------------------------------
                # USER SELECTED LOCATION
                # -------------------------------------------------

                "selected_state": state_name,

                "selected_district": district_name,

                "selected_city": city_name,

                "selected_village": village_name,

                # -------------------------------------------------
                # PRIMARY DISPLAY LOCATION
                # -------------------------------------------------

                "display_location": display_name,

                # -------------------------------------------------
                # WEATHER SEARCH INFORMATION
                # -------------------------------------------------

                "searched_location": location_name,

                "searched_location_type": location_type,

                "searched_query": query,

                # -------------------------------------------------
                # WHETHER FALLBACK WAS USED
                # -------------------------------------------------

                "exact_location_found": (
                    (
                        location_type == "village_city"
                        or location_type == "village_district"
                        or location_type == "village_state"
                        or location_type == "village_country"
                    )
                    if village_name
                    else (
                        location_type == "city_district"
                        or location_type == "city_state"
                        or location_type == "city_country"
                    )
                    if city_name
                    else (
                        location_type == "district_state"
                        or location_type == "district_country"
                    )
                )
            }

        except requests.RequestException as error:

            last_error = error

            print(
                "=================================================="
            )

            print(
                "OPENWEATHER REQUEST ERROR:"
            )

            print(
                repr(error)
            )

            if getattr(error, "response", None) is not None:

                print(
                    "OPENWEATHER ERROR STATUS:",
                    error.response.status_code
                )

                print(
                    "OPENWEATHER ERROR RESPONSE:",
                    error.response.text
                )

            print(
                "Trying next fallback..."
            )

            print(
                "=================================================="
            )

            continue

    # =========================================================
    # 11. ALL SEARCHES FAILED
    # =========================================================

    print(
        "=================================================="
    )

    print(
        "OPENWEATHER LOCATION SEARCH FAILED"
    )

    print(
        "Village:",
        village_name
    )

    print(
        "City:",
        city_name
    )

    print(
        "District:",
        district_name
    )

    print(
        "State:",
        state_name
    )

    print(
        "Country:",
        country_code
    )

    print(
        "Last error:",
        repr(last_error)
    )

    print(
        "=================================================="
    )

    raise HTTPException(
        status_code=404,
        detail=(
            "Weather location could not be found. "
            "Please check the City/Village and District."
        )
    )


# =========================================================
# GET LIVE WEATHER DATA
# =========================================================

def get_weather_data(
    latitude: float,
    longitude: float
):

    params = {

        "lat":
            latitude,

        "lon":
            longitude,

        "appid":
            OPENWEATHER_API_KEY,

        "units":
            "metric"

    }

    try:

        current_response = requests.get(
            OPENWEATHER_CURRENT_URL,
            params=params,
            timeout=10
        )

        current_response.raise_for_status()

        current = current_response.json()

        forecast_response = requests.get(
            OPENWEATHER_FORECAST_URL,
            params=params,
            timeout=10
        )

        forecast_response.raise_for_status()

        forecast = forecast_response.json()

    except requests.RequestException as error:

        print(
            "OPENWEATHER DATA ERROR:",
            error
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to fetch live weather data "
                "from OpenWeather."
            )
        )

    return current, forecast


# =========================================================
# BUILD WEATHER INTELLIGENCE
# =========================================================

def build_weather_intelligence(
    current,
    forecast
):

    daily = {}

    # -----------------------------------------------------
    # PROCESS FORECAST
    # -----------------------------------------------------

    for item in forecast.get("list", []):

        date_text = (
            item.get("dt_txt", "")
            .split(" ")[0]
        )

        if not date_text:
            continue

        weather_list = item.get(
            "weather",
            [{}]
        )

        weather_description = (
            weather_list[0].get(
                "description",
                "Unknown"
            )
            if weather_list
            else "Unknown"
        )

        day = daily.setdefault(
            date_text,
            {
                "date":
                    date_text,

                "rain_mm":
                    0.0,

                "rain_probability":
                    0.0,

                "temperature_min":
                    None,

                "temperature_max":
                    None,

                "weather":
                    weather_description

            }
        )

        # -------------------------------------------------
        # RAIN
        # -------------------------------------------------

        day["rain_mm"] += float(
            item.get(
                "rain",
                {}
            ).get(
                "3h",
                0
            )
            or 0
        )

        # -------------------------------------------------
        # RAIN PROBABILITY
        # -------------------------------------------------

        day["rain_probability"] = max(
            day["rain_probability"],
            float(
                item.get(
                    "pop",
                    0
                )
                or 0
            ) * 100
        )

        # -------------------------------------------------
        # TEMPERATURE
        # -------------------------------------------------

        temp = (
            item.get(
                "main",
                {}
            ).get(
                "temp"
            )
        )

        if temp is not None:

            temp = float(temp)

            if day["temperature_min"] is None:

                day["temperature_min"] = temp

            else:

                day["temperature_min"] = min(
                    day["temperature_min"],
                    temp
                )

            if day["temperature_max"] is None:

                day["temperature_max"] = temp

            else:

                day["temperature_max"] = max(
                    day["temperature_max"],
                    temp
                )

    # -----------------------------------------------------
    # FIRST 5 DAYS
    # -----------------------------------------------------

    daily_forecast = list(
        daily.values()
    )[:5]

    # -----------------------------------------------------
    # FORECAST WARNINGS
    # -----------------------------------------------------

    for day in daily_forecast:

        day["rain_mm"] = round(
            day["rain_mm"],
            2
        )

        day["rain_probability"] = round(
            day["rain_probability"],
            2
        )

        if (
            day["temperature_min"]
            is not None
        ):

            day["temperature_min"] = round(
                day["temperature_min"],
                1
            )

        if (
            day["temperature_max"]
            is not None
        ):

            day["temperature_max"] = round(
                day["temperature_max"],
                1
            )

        if day["rain_mm"] >= 20:

            day["rain_warning"] = (
                "Heavy rain possible. "
                "Avoid unnecessary irrigation "
                "and check field drainage."
            )

        elif day["rain_probability"] >= 60:

            day["rain_warning"] = (
                "Rain is likely. Monitor soil "
                "moisture before irrigation."
            )

        else:

            day["rain_warning"] = (
                "No major rain warning from "
                "the forecast."
            )

    # -----------------------------------------------------
    # CURRENT RAIN
    # -----------------------------------------------------

    current_rain = float(
        current.get(
            "rain",
            {}
        ).get(
            "1h",
            0
        )
        or 0
    )

    # -----------------------------------------------------
    # UPCOMING RAIN
    # -----------------------------------------------------

    upcoming_rain = sum(
        day["rain_mm"]
        for day in daily_forecast[:2]
    )

    upcoming_probability = max(
        [
            day["rain_probability"]
            for day in daily_forecast[:2]
        ],
        default=0
    )

    # -----------------------------------------------------
    # IRRIGATION ADVICE
    # -----------------------------------------------------

    if (
        current_rain > 0
        or upcoming_rain >= 10
        or upcoming_probability >= 60
    ):

        irrigation = (
            "Reduce or postpone irrigation and "
            "check soil moisture first because "
            "rain is expected."
        )

    else:

        irrigation = (
            "No significant rain signal is visible "
            "in the forecast. Irrigate according to "
            "soil moisture and crop requirement."
        )

    # -----------------------------------------------------
    # SOWING ADVICE
    # -----------------------------------------------------

    if upcoming_rain >= 20:

        sowing = (
            "Rain may interfere with field operations. "
            "Avoid unnecessary sowing immediately "
            "before heavy rainfall and ensure proper "
            "drainage."
        )

    elif upcoming_probability >= 50:

        sowing = (
            "Rain is possible. Plan sowing after "
            "checking field moisture and local "
            "soil condition."
        )

    else:

        sowing = (
            "Weather forecast shows no major rain "
            "warning. Sowing can be planned according "
            "to crop season and soil readiness."
        )

    # -----------------------------------------------------
    # HEAVY RAIN WARNING
    # -----------------------------------------------------

    if upcoming_rain >= 20:

        heavy = (
            "Heavy rain warning: significant rainfall "
            "is possible in the forecast."
        )

    else:

        heavy = (
            "No major heavy-rain warning from "
            "the available forecast."
        )

    # -----------------------------------------------------
    # FINAL WEATHER DATA
    # -----------------------------------------------------

    return {

        "current": {

            "temperature":
                current.get(
                    "main",
                    {}
                ).get(
                    "temp"
                ),

            "feels_like":
                current.get(
                    "main",
                    {}
                ).get(
                    "feels_like"
                ),

            "humidity":
                current.get(
                    "main",
                    {}
                ).get(
                    "humidity"
                ),

            "pressure":
                current.get(
                    "main",
                    {}
                ).get(
                    "pressure"
                ),

            "wind_speed":
                current.get(
                    "wind",
                    {}
                ).get(
                    "speed"
                ),

            "rain_last_1h":
                current_rain,

            "condition":
                current.get(
                    "weather",
                    [{}]
                )[0].get(
                    "main",
                    "Unknown"
                ),

            "description":
                current.get(
                    "weather",
                    [{}]
                )[0].get(
                    "description",
                    "Unknown"
                ),

            "icon":
                current.get(
                    "weather",
                    [{}]
                )[0].get(
                    "icon"
                )

        },

        "forecast":
            daily_forecast,

        "farming_advice": {

            "irrigation":
                irrigation,

            "sowing":
                sowing,

            "heavy_rain_warning":
                heavy

        }

    }


# =========================================================
# WEATHER API
# =========================================================

@app.post("/weather")
def weather_intelligence(
    data: WeatherInput
):

    location = get_weather_location(

        district=data.district,

        state=data.state,

        country=data.country,

        city=data.city,

        village=data.village

    )

    current, forecast = get_weather_data(

        location["latitude"],

        location["longitude"]

    )

    weather_information = (
        build_weather_intelligence(
            current,
            forecast
        )
    )

    return {

        "success": True,

        "location":
            location,

        "weather":
            weather_information

    }


# =========================================================
# AI CHATBOT
# =========================================================

class ChatInput(BaseModel):

    message: str


@app.post("/chat")
def agroai_chat(data: ChatInput):

    user_message = data.message.strip()

    if user_message == "":

        raise HTTPException(
            status_code=400,
            detail="Message is required"
        )

    try:

        system_prompt = """

You are AgroAI, an intelligent AI Farming Assistant.

Answer agriculture and farming questions accurately,
practically, and in an easy-to-understand way.

Supported crops:

rice, maize, chickpea, kidneybeans, pigeonpeas,
mothbeans, mungbean, blackgram, lentil,
pomegranate, banana, mango, grapes, watermelon,
muskmelon, apple, orange, papaya, coconut,
cotton, jute, coffee, chilli, groundnut, onion,
peas, potato, sugarcane, sunflower, tomato,
wheat, barley.

You can answer questions about:

- all supported crops
- crop selection and suitability
- soil types and soil suitability
- black, red, alluvial, sandy and clay soil
- NPK and fertilizers
- irrigation and water management
- seeds and seed treatment
- sowing
- cultivation
- harvesting
- pests and diseases
- crop nutrition and crop care
- farming techniques
- weather-related farming guidance
- general agriculture

LANGUAGE RULE:

English question -> English answer.
Hindi question -> Hindi answer.
Hinglish question -> Hinglish answer.
Marathi question -> Marathi answer.

Do not unnecessarily change the user's language.

STYLE:

Give useful, practical and concise answers.

For a crop-specific question, focus on that crop.

When relevant, explain soil, water, nutrients,
cultivation and precautions.

"""

        response = client.responses.create(

            model="gpt-5.6-luna",

            instructions=system_prompt,

            input=user_message

        )

        answer = response.output_text.strip()

        return {

            "success": True,

            "answer": answer

        }

    except Exception as error:

        print(
            "AI CHAT ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="AI service is currently unavailable."
        )


# =========================================================
# SMART IRRIGATION
# =========================================================

class IrrigationInput(BaseModel):

    district: str

    state: str = "Maharashtra"

    country: str = "IN"

    crop: str

    soil_moisture: float

    field_area: float


# =========================================================
# SMART IRRIGATION CALCULATION
# =========================================================

def calculate_irrigation_advice(
    crop: str,
    soil_moisture: float,
    current_weather: dict,
    forecast: list
):

    crop_key = crop.strip().lower()

    high_water_crops = {

        "rice",
        "banana",
        "sugarcane",
        "coconut",
        "watermelon",
        "papaya"

    }

    medium_water_crops = {

        "maize",
        "cotton",
        "wheat",
        "tomato",
        "potato",
        "onion",
        "groundnut",
        "grapes",
        "mango",
        "orange",
        "chilli",
        "sunflower",
        "peas"

    }

    low_water_crops = {

        "chickpea",
        "lentil",
        "blackgram",
        "mungbean",
        "mothbeans",
        "pigeonpeas",
        "kidneybeans",
        "pomegranate"

    }

    if crop_key in high_water_crops:

        dry_limit = 45
        comfortable_limit = 70

    elif crop_key in low_water_crops:

        dry_limit = 30
        comfortable_limit = 60

    else:

        dry_limit = 35
        comfortable_limit = 65

    current_rain = float(
        current_weather.get(
            "rain_last_1h",
            0
        )
        or 0
    )

    upcoming_rain = sum(

        float(
            day.get(
                "rain_mm",
                0
            )
            or 0
        )

        for day in forecast[:2]

    )

    upcoming_probability = max(

        [

            float(
                day.get(
                    "rain_probability",
                    0
                )
                or 0
            )

            for day in forecast[:2]

        ],

        default=0

    )

    status = "IRRIGATION RECOMMENDED"

    reason = ""

    water_advice = ""

    timing = ""

    warning = ""

    if current_rain > 0:

        status = "NOT RECOMMENDED"

        reason = (
            "Rain is currently occurring, so "
            "additional irrigation may cause "
            "excess moisture."
        )

        water_advice = (
            "Postpone irrigation and allow the "
            "field to use the available rainfall."
        )

        timing = (
            "Recheck soil moisture after the "
            "rainfall has stopped."
        )

        warning = (
            "Avoid over-irrigation and monitor "
            "the field for waterlogging."
        )

    elif upcoming_rain >= 20:

        status = "NOT RECOMMENDED"

        reason = (
            f"About {upcoming_rain:.1f} mm rainfall "
            "is expected during the next two days."
        )

        water_advice = (
            "Postpone irrigation because significant "
            "rainfall is expected."
        )

        timing = (
            "Check soil moisture again after "
            "the rainfall."
        )

        warning = (
            "Heavy rainfall may cause waterlogging. "
            "Keep field drainage channels clear."
        )

    elif upcoming_probability >= 60:

        status = "WAIT AND MONITOR"

        reason = (
            f"Rain probability is around "
            f"{upcoming_probability:.0f}%, so irrigation "
            "should be delayed until rainfall conditions "
            "become clearer."
        )

        water_advice = (
            "Do not irrigate immediately. Monitor "
            "soil moisture and rainfall."
        )

        timing = (
            "Recheck the field later and irrigate "
            "only if the soil becomes dry."
        )

        warning = (
            "Rain may naturally provide part of "
            "the crop's water requirement."
        )

    elif soil_moisture >= comfortable_limit:

        status = "NOT RECOMMENDED"

        reason = (
            f"Soil moisture is {soil_moisture:.1f}%, "
            "which is already sufficiently high."
        )

        water_advice = (
            "No irrigation is required at the moment."
        )

        timing = (
            "Monitor soil moisture and irrigate only "
            "when it falls below the crop requirement."
        )

        warning = (
            "Additional water may increase the risk "
            "of waterlogging and root problems."
        )

    elif soil_moisture >= dry_limit:

        status = "WAIT AND MONITOR"

        reason = (
            f"Soil moisture is {soil_moisture:.1f}%, "
            "so immediate irrigation may not be necessary."
        )

        water_advice = (
            "Monitor soil moisture before applying "
            "more water."
        )

        timing = (
            "Irrigate when soil moisture approaches "
            "the crop's dry threshold."
        )

        warning = (
            "Avoid fixed-interval irrigation when "
            "soil moisture is still adequate."
        )

    else:

        status = "IRRIGATION RECOMMENDED"

        reason = (
            f"Soil moisture is only "
            f"{soil_moisture:.1f}%, which indicates "
            "that the crop may need water."
        )

        water_advice = (
            "Irrigation can be considered now, "
            "using the crop's recommended water requirement."
        )

        timing = (
            "Prefer irrigation during cooler parts "
            "of the day, such as early morning or evening."
        )

        warning = (
            "Apply water according to soil condition "
            "and avoid excessive irrigation."
        )

    return {

        "status":
            status,

        "reason":
            reason,

        "water_advice":
            water_advice,

        "timing":
            timing,

        "warning":
            warning

    }


# =========================================================
# IRRIGATION API
# =========================================================

@app.post("/irrigation")
def smart_irrigation(
    data: IrrigationInput
):

    try:

        if not data.district.strip():

            raise HTTPException(
                status_code=400,
                detail="District is required."
            )

        if not data.crop.strip():

            raise HTTPException(
                status_code=400,
                detail="Crop is required."
            )

        if (
            data.soil_moisture < 0
            or data.soil_moisture > 100
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Soil moisture must be between "
                    "0 and 100."
                )
            )

        if data.field_area <= 0:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Field area must be greater than zero."
                )
            )

        location = get_weather_location(

            data.district,

            data.state,

            data.country

        )

        current_weather, forecast_data = (
            get_weather_data(
                location["latitude"],
                location["longitude"]
            )
        )

        weather_information = (
            build_weather_intelligence(
                current_weather,
                forecast_data
            )
        )

        current = (
            weather_information["current"]
        )

        forecast = (
            weather_information["forecast"]
        )

        irrigation = calculate_irrigation_advice(

            crop=data.crop,

            soil_moisture=data.soil_moisture,

            current_weather=current,

            forecast=forecast

        )

        return {

            "success": True,

            "location":
                location,

            "crop":
                data.crop,

            "field_area":
                data.field_area,

            "soil_moisture":
                data.soil_moisture,

            "weather": {

                "current":
                    current,

                "forecast":
                    forecast

            },

            "irrigation":
                irrigation

        }

    except HTTPException:

        raise

    except Exception as error:

        print(
            "SMART IRRIGATION ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to calculate irrigation advice."
            )
        )


# =========================================================
# ADVANCED SMART IRRIGATION
# =========================================================

CROP_WATER_REQUIREMENT = {

    "rice": {
        "category": "High",
        "daily_mm": 6.0,
        "description": "Rice requires comparatively high water availability."
    },

    "wheat": {
        "category": "Medium",
        "daily_mm": 4.0,
        "description": "Wheat requires moderate irrigation with proper soil moisture."
    },

    "maize": {
        "category": "Medium",
        "daily_mm": 4.5,
        "description": "Maize needs regular moisture, especially during important growth stages."
    },

    "cotton": {
        "category": "Medium",
        "daily_mm": 4.0,
        "description": "Cotton requires balanced irrigation and should not remain waterlogged."
    },

    "soybean": {
        "category": "Medium",
        "daily_mm": 4.0,
        "description": "Soybean needs adequate moisture but excessive water can damage roots."
    },

    "chickpea": {
        "category": "Low",
        "daily_mm": 2.5,
        "description": "Chickpea generally requires lower irrigation compared with rice."
    },

    "pigeon peas": {
        "category": "Low",
        "daily_mm": 2.5,
        "description": "Pigeon pea is relatively drought tolerant and needs controlled irrigation."
    },

    "blackgram": {
        "category": "Low",
        "daily_mm": 2.5,
        "description": "Blackgram needs moderate-to-low water and good drainage."
    },

    "mungbean": {
        "category": "Low",
        "daily_mm": 2.5,
        "description": "Mungbean requires controlled moisture and should not be over-irrigated."
    },

    "groundnut": {
        "category": "Medium",
        "daily_mm": 3.5,
        "description": "Groundnut needs adequate moisture, especially during flowering and pod development."
    },

    "sugarcane": {
        "category": "Very High",
        "daily_mm": 7.0,
        "description": "Sugarcane has a high water requirement."
    },

    "tomato": {
        "category": "Medium",
        "daily_mm": 4.0,
        "description": "Tomato needs consistent moisture without waterlogging."
    },

    "onion": {
        "category": "Medium",
        "daily_mm": 3.5,
        "description": "Onion requires regular but controlled irrigation."
    },

    "potato": {
        "category": "Medium",
        "daily_mm": 4.0,
        "description": "Potato needs consistent soil moisture for healthy tuber development."
    },

    "sunflower": {
        "category": "Low",
        "daily_mm": 3.0,
        "description": "Sunflower has moderate drought tolerance but benefits from adequate moisture."
    },

    "banana": {
        "category": "High",
        "daily_mm": 6.0,
        "description": "Banana requires frequent moisture because of its high water demand."
    },

    "mango": {
        "category": "Low",
        "daily_mm": 2.5,
        "description": "Established mango trees generally require controlled irrigation."
    },

    "grapes": {
        "category": "Medium",
        "daily_mm": 4.0,
        "description": "Grapes need carefully managed irrigation to maintain crop quality."
    },

    "orange": {
        "category": "Medium",
        "daily_mm": 3.5,
        "description": "Orange requires balanced irrigation with good drainage."
    },

    "pomegranate": {
        "category": "Low",
        "daily_mm": 2.5,
        "description": "Pomegranate is relatively drought tolerant and excessive irrigation should be avoided."
    }
}


# =========================================================
# ADVANCED WATER CALCULATION
# =========================================================

def get_advanced_crop_water_data(
    crop_name,
    field_area
):

    crop_key = crop_name.strip().lower()

    crop_data = CROP_WATER_REQUIREMENT.get(
        crop_key,
        {
            "category": "Medium",
            "daily_mm": 4.0,
            "description": "Moderate water requirement crop."
        }
    )

    # 1 mm over 1 acre ≈ 4046.86 litres

    litres_per_acre_per_day = (
        crop_data["daily_mm"]
        * 4046.86
    )

    total_litres_per_day = (
        litres_per_acre_per_day
        * field_area
    )

    return {

        "water_category":
            crop_data["category"],

        "daily_water_mm":
            round(
                crop_data["daily_mm"],
                2
            ),

        "estimated_water_litres_per_acre":
            round(
                litres_per_acre_per_day
            ),

        "estimated_water_litres_total":
            round(
                total_litres_per_day
            ),

        "water_requirement_note":
            crop_data["description"]

    }


# =========================================================
# ADVANCED IRRIGATION API
# =========================================================

@app.post("/irrigation-advanced")
def advanced_irrigation(
    data: IrrigationInput
):

    if not data.district.strip():

        raise HTTPException(
            status_code=400,
            detail="District is required."
        )

    if not data.crop.strip():

        raise HTTPException(
            status_code=400,
            detail="Crop is required."
        )

    if (
        data.soil_moisture < 0
        or data.soil_moisture > 100
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Soil moisture must be between "
                "0 and 100."
            )
        )

    if data.field_area <= 0:

        raise HTTPException(
            status_code=400,
            detail="Field area must be greater than 0."
        )

    # -----------------------------------------------------
    # REAL WEATHER
    # -----------------------------------------------------

    location = get_weather_location(

        data.district,

        data.state,

        data.country

    )

    current_weather, forecast = (
        get_weather_data(
            location["latitude"],
            location["longitude"]
        )
    )

    weather_data = (
        build_weather_intelligence(
            current_weather,
            forecast
        )
    )

    current = weather_data["current"]

    forecast_data = weather_data["forecast"]

    # -----------------------------------------------------
    # CROP WATER REQUIREMENT
    # -----------------------------------------------------

    water_data = get_advanced_crop_water_data(

        data.crop,

        data.field_area

    )

    # -----------------------------------------------------
    # RAINFALL ANALYSIS
    # -----------------------------------------------------

    next_two_days = forecast_data[:2]

    rain_next_2_days = sum(

        float(
            day.get(
                "rain_mm",
                0
            )
            or 0
        )

        for day in next_two_days

    )

    max_rain_probability = max(

        [

            float(
                day.get(
                    "rain_probability",
                    0
                )
                or 0
            )

            for day in next_two_days

        ],

        default=0

    )

    current_rain = float(

        current.get(
            "rain_last_1h",
            0
        )
        or 0

    )

    moisture = float(
        data.soil_moisture
    )

    crop_category = (
        water_data["water_category"]
    )

    if crop_category == "Very High":

        dry_limit = 50

        comfortable_limit = 72

    elif crop_category == "High":

        dry_limit = 45

        comfortable_limit = 70

    elif crop_category == "Low":

        dry_limit = 30

        comfortable_limit = 60

    else:

        dry_limit = 35

        comfortable_limit = 65

    # -----------------------------------------------------
    # ADVANCED DECISION
    # -----------------------------------------------------

    if current_rain > 0:

        status = "NOT RECOMMENDED"

        reason = (
            "Rain is currently occurring. Irrigation "
            "can be postponed to avoid unnecessary "
            "water application."
        )

        timing = (
            "Wait until the current rainfall stops "
            "and soil moisture is checked."
        )

        water_action = 0

        warning = (
            "Avoid irrigation during active rainfall "
            "because it may cause waterlogging and "
            "unnecessary water use."
        )

    elif rain_next_2_days >= 20:

        status = "NOT RECOMMENDED"

        reason = (
            f"Approximately {rain_next_2_days:.1f} mm "
            "rainfall is expected during the next "
            "two days."
        )

        timing = (
            "Postpone irrigation and monitor "
            "field moisture."
        )

        water_action = 0

        warning = (
            "Significant rainfall is expected. Check "
            "field drainage and avoid unnecessary irrigation."
        )

    elif max_rain_probability >= 60:

        status = "WAIT AND MONITOR"

        reason = (
            f"Rain probability is high "
            f"({max_rain_probability:.0f}%) during "
            "the next two days."
        )

        timing = (
            "Monitor rainfall and soil moisture "
            "before irrigating."
        )

        water_action = round(
            water_data[
                "estimated_water_litres_total"
            ] * 0.5
        )

        warning = (
            "Rain may reduce the irrigation requirement. "
            "Do not apply the full estimated amount immediately."
        )

    elif moisture >= comfortable_limit:

        status = "NOT RECOMMENDED"

        reason = (
            f"Soil moisture is already comfortable "
            f"at {moisture:.1f}% for this crop."
        )

        timing = (
            "No immediate irrigation required."
        )

        water_action = 0

        warning = (
            "Avoid over-irrigation because sufficient "
            "soil moisture is already available."
        )

    elif moisture >= dry_limit:

        status = "WAIT AND MONITOR"

        reason = (
            f"Soil moisture is {moisture:.1f}%, "
            "which is acceptable but should be monitored."
        )

        timing = (
            "Irrigate later if soil moisture "
            "continues to decrease."
        )

        water_action = round(
            water_data[
                "estimated_water_litres_total"
            ] * 0.5
        )

        warning = (
            "Use controlled irrigation if moisture "
            "falls further."
        )

    else:

        status = "IRRIGATION RECOMMENDED"

        reason = (
            f"Soil moisture is low at "
            f"{moisture:.1f}% for the selected "
            f"{data.crop} crop."
        )

        timing = (
            "Irrigate during early morning or evening."
        )

        water_action = (
            water_data[
                "estimated_water_litres_total"
            ]
        )

        warning = (
            "Apply water gradually and avoid "
            "prolonged waterlogging."
        )

    return {

        "success": True,

        "location":
            location,

        "crop":
            data.crop,

        "field_area":
            data.field_area,

        "soil_moisture":
            data.soil_moisture,

        "weather": {

            "current":
                current,

            "forecast":
                forecast_data

        },

        "irrigation": {

            "status":
                status,

            "reason":
                reason,

            "water_advice": (
                f"Estimated irrigation water: "
                f"{water_action:,} litres for "
                f"{data.field_area:g} acre(s)."
            ),

            "timing":
                timing,

            "warning":
                warning,

            "water_category":
                water_data[
                    "water_category"
                ],

            "daily_water_mm":
                water_data[
                    "daily_water_mm"
                ],

            "estimated_water_litres_per_acre":
                water_data[
                    "estimated_water_litres_per_acre"
                ],

            "estimated_water_litres_total":
                water_data[
                    "estimated_water_litres_total"
                ],

            "recommended_water_litres":
                water_action,

            "water_requirement_note":
                water_data[
                    "water_requirement_note"
                ],

            "next_2_days_rain_mm":
                round(
                    rain_next_2_days,
                    2
                ),

            "next_2_days_rain_probability":
                round(
                    max_rain_probability
                )

        }

    }


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@app.get("/admin/dashboard")
def admin_dashboard():

    data = load_data()

    history = data["history"]

    users = data["users"]

    crop_count = {}

    for item in history:

        crop = item.get("crop")

        if crop:

            crop_count[crop] = (
                crop_count.get(crop, 0) + 1
            )

    most_predicted_crop = "--"

    most_crop_count = 0

    for crop, count in crop_count.items():

        if count > most_crop_count:

            most_crop_count = count

            most_predicted_crop = crop

    return {

        "success": True,

        "total_predictions":
            len(history),

        "total_users":
            len(users),

        "most_predicted_crop":
            most_predicted_crop,

        "most_crop_count":
            most_crop_count,

        "unique_crops":
            len(crop_count),

        "ai_status":
            "Online"

    }


# =========================================================
# ADMIN HISTORY - GET
# =========================================================

@app.get("/admin/history")
def admin_history():

    data = load_data()

    return {

        "success": True,

        "history":
            data["history"],

        "total":
            len(data["history"])

    }


# =========================================================
# ADMIN HISTORY - DELETE
# =========================================================

@app.delete("/admin/history")
def delete_history():

    data = load_data()

    data["history"] = []

    save_data(data)

    return {

        "success": True,

        "message":
            "Prediction history cleared successfully"

    }


# =========================================================
# ADMIN USERS
# =========================================================

@app.get("/admin/users")
def admin_users():

    data = load_data()

    safe_users = []

    for user in data["users"]:

        safe_users.append({

            "id":
                user.get("id"),

            "name":
                user.get("name"),

            "email":
                user.get("email"),

            "created_at":
                user.get("created_at")

        })

    return {

        "success": True,

        "users":
            safe_users,

        "total_users":
            len(safe_users)

    }


# =========================================================
# ADMIN CROPS - GET
# =========================================================

@app.get("/admin/crops")
def get_crops():

    data = load_data()

    return {

        "success": True,

        "crops":
            data["crops"],

        "total_crops":
            len(data["crops"])

    }


# =========================================================
# CROP NAME MODEL
# =========================================================

class CropName(BaseModel):

    name: str


# =========================================================
# ADMIN CROPS - ADD
# =========================================================

@app.post("/admin/crops")
def add_crop(crop: CropName):

    name = crop.name.strip()

    if name == "":

        raise HTTPException(
            status_code=400,
            detail="Crop name is required"
        )

    data = load_data()

    for existing_crop in data["crops"]:

        if existing_crop.lower() == name.lower():

            raise HTTPException(
                status_code=400,
                detail="Crop already exists"
            )

    data["crops"].append(name)

    save_data(data)

    return {

        "success": True,

        "message":
            "Crop added successfully",

        "crop":
            name

    }


# =========================================================
# ADMIN CROPS - DELETE
# =========================================================

@app.delete("/admin/crops/{crop_name}")
def delete_crop(crop_name: str):

    data = load_data()

    original_count = len(
        data["crops"]
    )

    data["crops"] = [

        crop

        for crop in data["crops"]

        if crop.lower() != crop_name.lower()

    ]

    if len(data["crops"]) == original_count:

        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )

    save_data(data)

    return {

        "success": True,

        "message":
            "Crop deleted successfully"

    }


# =========================================================
# ADMIN CONTACT MESSAGES - GET
# =========================================================

@app.get("/admin/contact-messages")
def get_contact_messages():

    data = load_data()

    messages = data["contact_messages"]

    # Newest messages first

    messages = list(
        reversed(messages)
    )

    unread_count = 0

    for item in messages:

        if item.get("status") == "unread":

            unread_count += 1

    return {

        "success": True,

        "messages":
            messages,

        "total":
            len(messages),

        "unread":
            unread_count

    }


# =========================================================
# ADMIN CONTACT MESSAGE - MARK AS READ
# =========================================================

@app.put(
    "/admin/contact-messages/{message_id}/read"
)
def mark_contact_message_read(
    message_id: int
):

    data = load_data()

    for message in data["contact_messages"]:

        if message.get("id") == message_id:

            message["status"] = "read"

            save_data(data)

            return {

                "success": True,

                "message":
                    "Contact message marked as read."

            }

    raise HTTPException(
        status_code=404,
        detail="Contact message not found"
    )


# =========================================================
# ADMIN CONTACT MESSAGE - DELETE
# =========================================================

@app.delete(
    "/admin/contact-messages/{message_id}"
)
def delete_contact_message(
    message_id: int
):

    data = load_data()

    original_count = len(
        data["contact_messages"]
    )

    data["contact_messages"] = [

        message

        for message in data["contact_messages"]

        if message.get("id") != message_id

    ]

    if (
        len(data["contact_messages"])
        == original_count
    ):

        raise HTTPException(
            status_code=404,
            detail="Contact message not found"
        )

    save_data(data)

    return {

        "success": True,

        "message":
            "Contact message deleted successfully"

    }


# =========================================================
# ADMIN CONTACT MESSAGES - CLEAR ALL
# =========================================================

@app.delete("/admin/contact-messages")
def delete_all_contact_messages():

    data = load_data()

    data["contact_messages"] = []

    save_data(data)

    return {

        "success": True,

        "message":
            "All contact messages cleared successfully"

    }


# =========================================================
# SERVER READY
# =========================================================

print(
    "=============================================="
)

print(
    "AgroAI Backend is ready."
)

print(
    "Weather API supports District + City + Village."
)

print(
    "Crop Recommendation API is available."
)

print(
    "Smart Irrigation API is available."
)

print(
    "Advanced Irrigation API is available."
)

print(
    "Contact Message API is available."
)

print(
    "=============================================="
)