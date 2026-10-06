from fastapi import FastAPI, HTTPException
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
from backend.gemini_chatbot import generate_response

# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv(
    dotenv_path=Path(__file__).resolve().parent / ".env"
)

OPENWEATHER_API_KEY = os.getenv(
    "OPENWEATHER_API_KEY"
)

# =========================================================
# PROJECT PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

FRONTEND_DIR = BASE_DIR / "frontend"
IMAGE_DIR = FRONTEND_DIR / "images"

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

        # -------------------------------------------------
        # MAKE SURE REQUIRED KEYS EXIST
        # -------------------------------------------------

        if "history" not in data:
            data["history"] = []

        if "users" not in data:
            data["users"] = []

        if "crops" not in data:
            data["crops"] = []

        # -------------------------------------------------
        # NEW CONTACT MESSAGES KEY
        # -------------------------------------------------

        if "contact_messages" not in data:

            data["contact_messages"] = []

            save_data(data)

            print(
                "Contact messages section added to database."
            )


        # -------------------------------------------------
        # ADD 31 CROPS TO OLD DATABASE
        # -------------------------------------------------

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


    # -----------------------------------------------------
    # CHECK DUPLICATE EMAIL
    # -----------------------------------------------------

    for existing_user in data["users"]:

        if existing_user["email"].lower() == email:

            raise HTTPException(
                status_code=400,
                detail="An account with this email already exists."
            )


    # -----------------------------------------------------
    # CREATE USER
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # BASIC VALIDATION
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # ADMIN PASSWORD RESET
    # -----------------------------------------------------

    if email == "admin@agroai.com":

        raise HTTPException(
            status_code=400,
            detail="Admin password cannot be changed here."
        )


    # -----------------------------------------------------
    # FIND USER
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # EMAIL NOT FOUND
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # LOAD DATABASE
    # -----------------------------------------------------

    data = load_data()


    # -----------------------------------------------------
    # CREATE MESSAGE
    # -----------------------------------------------------

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


    # -----------------------------------------------------
    # SAVE MESSAGE
    # -----------------------------------------------------

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
        "season": "Kharif", "soil": "Clayey / loamy soil with good water retention",
        "water": "High", "temperature": "20–35 °C", "ph": "5.5–7.0",
        "fertilizer": "Nitrogen-rich balanced fertilizer based on soil testing",
        "sowing": "June–July", "harvesting": "October–November",
        "tips": "Maintain proper moisture, control weeds and monitor pests regularly.",
        "precautions": "Avoid unsuitable waterlogging periods and monitor fungal diseases."
    },
    "maize": {
        "season": "Kharif / Rabi", "soil": "Well-drained loamy soil", "water": "Medium",
        "temperature": "21–30 °C", "ph": "5.5–7.5",
        "fertilizer": "Balanced NPK with split nitrogen application",
        "sowing": "June–July", "harvesting": "September–October",
        "tips": "Maintain spacing, weed control and timely irrigation.",
        "precautions": "Monitor fall armyworm and avoid waterlogging."
    },
    "cotton": {
        "season": "Kharif", "soil": "Deep black soil with good drainage", "water": "Medium",
        "temperature": "21–30 °C", "ph": "5.5–8.0",
        "fertilizer": "Balanced NPK according to soil test",
        "sowing": "June–July", "harvesting": "October–January",
        "tips": "Control weeds and regularly monitor boll development.",
        "precautions": "Monitor sucking pests and bollworms."
    },
    "chickpea": {
        "season": "Rabi", "soil": "Well-drained loamy to black soil", "water": "Low–Medium",
        "temperature": "15–30 °C", "ph": "6.0–8.0",
        "fertilizer": "Moderate phosphorus with balanced nutrients",
        "sowing": "October–November", "harvesting": "February–March",
        "tips": "Avoid excessive irrigation and maintain good drainage.",
        "precautions": "Monitor pod borer and fungal diseases."
    },
    "pigeonpeas": {
        "season": "Kharif", "soil": "Well-drained black or loamy soil", "water": "Medium",
        "temperature": "20–30 °C", "ph": "5.5–7.5",
        "fertilizer": "Balanced fertilizer with phosphorus",
        "sowing": "June–July", "harvesting": "December–January",
        "tips": "Maintain spacing and control weeds.",
        "precautions": "Monitor pod borer and wilt."
    },
    "mungbean": {
        "season": "Kharif / Summer", "soil": "Well-drained loamy soil", "water": "Low–Medium",
        "temperature": "25–35 °C", "ph": "6.0–7.5",
        "fertilizer": "Balanced fertilizer with phosphorus",
        "sowing": "June–July / March–April", "harvesting": "September–October",
        "tips": "Avoid waterlogging and harvest pods at the correct stage.",
        "precautions": "Monitor yellow mosaic virus and sucking pests."
    },
    "blackgram": {
        "season": "Kharif / Rabi", "soil": "Well-drained loamy soil", "water": "Low–Medium",
        "temperature": "25–35 °C", "ph": "6.0–7.5",
        "fertilizer": "Balanced fertilizer based on soil test",
        "sowing": "June–July", "harvesting": "September–October",
        "tips": "Maintain drainage and control weeds.",
        "precautions": "Monitor yellow mosaic virus and pod pests."
    },
    "lentil": {
        "season": "Rabi", "soil": "Well-drained loamy soil", "water": "Low",
        "temperature": "18–30 °C", "ph": "6.0–7.5",
        "fertilizer": "Moderate phosphorus and balanced nutrients",
        "sowing": "October–November", "harvesting": "February–March",
        "tips": "Avoid excessive irrigation and maintain clean fields.",
        "precautions": "Monitor rust and wilt diseases."
    },
    "kidneybeans": {
        "season": "Kharif / Rabi", "soil": "Well-drained loamy soil", "water": "Medium",
        "temperature": "18–25 °C", "ph": "5.5–6.5",
        "fertilizer": "Balanced NPK according to soil test",
        "sowing": "June–July / October–November", "harvesting": "90–120 days",
        "tips": "Use clean seed and maintain good drainage.",
        "precautions": "Avoid excessive nitrogen and waterlogging."
    },
    "mothbeans": {
        "season": "Kharif", "soil": "Sandy loam and light soils", "water": "Low",
        "temperature": "25–35 °C", "ph": "6.0–8.0",
        "fertilizer": "Low to moderate balanced fertilizer",
        "sowing": "June–July", "harvesting": "September–October",
        "tips": "Suitable for relatively dry conditions; conserve soil moisture.",
        "precautions": "Avoid excessive irrigation."
    },
    "muskmelon": {
        "season": "Summer", "soil": "Sandy loam with good drainage", "water": "Medium",
        "temperature": "22–35 °C", "ph": "6.0–7.5",
        "fertilizer": "Balanced NPK with adequate potassium",
        "sowing": "February–March", "harvesting": "April–June",
        "tips": "Use uniform irrigation and maintain field hygiene.",
        "precautions": "Avoid waterlogging and monitor fruit pests."
    },
    "watermelon": {
        "season": "Summer", "soil": "Sandy loam with good drainage", "water": "Medium–High",
        "temperature": "22–35 °C", "ph": "6.0–7.5",
        "fertilizer": "Balanced NPK with adequate potassium",
        "sowing": "February–March", "harvesting": "May–June",
        "tips": "Maintain uniform irrigation during fruit development.",
        "precautions": "Avoid waterlogging and monitor fruit diseases."
    },
    "banana": {
        "season": "Year-round", "soil": "Deep fertile loamy soil with good drainage", "water": "High",
        "temperature": "20–35 °C", "ph": "6.0–7.5",
        "fertilizer": "Regular NPK based on soil test",
        "sowing": "Year-round with suitable irrigation", "harvesting": "9–12 months",
        "tips": "Maintain regular irrigation and remove damaged leaves.",
        "precautions": "Avoid waterlogging and monitor fungal diseases."
    },
    "mango": {
        "season": "Perennial", "soil": "Deep well-drained loamy soil", "water": "Medium",
        "temperature": "24–30 °C", "ph": "5.5–7.5",
        "fertilizer": "Organic manure with balanced NPK",
        "sowing": "Monsoon / suitable planting season", "harvesting": "March–June",
        "tips": "Prune properly and maintain orchard hygiene.",
        "precautions": "Monitor fruit flies and fungal diseases."
    },
    "grapes": {
        "season": "Perennial", "soil": "Well-drained sandy loam to loam", "water": "Medium",
        "temperature": "15–35 °C", "ph": "6.0–7.5",
        "fertilizer": "Balanced nutrients with organic matter",
        "sowing": "Suitable orchard planting season", "harvesting": "January–April",
        "tips": "Use canopy management and controlled irrigation.",
        "precautions": "Monitor powdery mildew and fruit diseases."
    },
    "pomegranate": {
        "season": "Perennial", "soil": "Well-drained loamy to light soils", "water": "Low–Medium",
        "temperature": "25–35 °C", "ph": "6.5–7.5",
        "fertilizer": "Balanced NPK with organic manure",
        "sowing": "Monsoon / suitable orchard season", "harvesting": "August–February",
        "tips": "Use regulated irrigation and maintain orchard sanitation.",
        "precautions": "Monitor bacterial blight and fruit borer."
    },
    "papaya": {
        "season": "Year-round", "soil": "Well-drained fertile loam", "water": "Medium–High",
        "temperature": "21–33 °C", "ph": "6.0–7.0",
        "fertilizer": "Regular balanced NPK and organic matter",
        "sowing": "Year-round in suitable conditions", "harvesting": "8–12 months",
        "tips": "Provide drainage and balanced nutrition.",
        "precautions": "Monitor viral diseases and avoid waterlogging."
    },
    "orange": {
        "season": "Perennial", "soil": "Well-drained loamy soil", "water": "Medium",
        "temperature": "15–30 °C", "ph": "6.0–7.5",
        "fertilizer": "Organic manure plus balanced NPK",
        "sowing": "Suitable orchard planting season", "harvesting": "October–February",
        "tips": "Maintain orchard hygiene and balanced irrigation.",
        "precautions": "Monitor citrus pests and diseases."
    },
    "coconut": {
        "season": "Perennial", "soil": "Well-drained sandy loam / coastal soils", "water": "High",
        "temperature": "20–35 °C", "ph": "5.5–7.5",
        "fertilizer": "Organic manure with balanced NPK",
        "sowing": "Monsoon / suitable planting season", "harvesting": "Year-round after maturity",
        "tips": "Maintain moisture and mulch around palms.",
        "precautions": "Avoid prolonged drought and waterlogging."
    },
    "coffee": {
        "season": "Perennial", "soil": "Rich, well-drained acidic soil", "water": "High",
        "temperature": "15–28 °C", "ph": "5.0–6.5",
        "fertilizer": "Organic matter with balanced nutrients",
        "sowing": "Monsoon planting period", "harvesting": "Season-dependent",
        "tips": "Provide shade, mulch and adequate moisture.",
        "precautions": "Monitor coffee berry disease and pests."
    }
}

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

def get_crop_details(crop):
    key = str(crop).strip().lower()
    return CROP_DETAILS.get(key, {
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
    })

def get_district_info(district):
    return DISTRICT_INFO.get(str(district).strip(), {
        "overview": f"AgroAI district intelligence for {district or 'the selected district'} is based on regional farming context.",
        "major_crops": "Use locally suitable crops based on soil, rainfall and season.",
        "rainfall": "District-specific",
        "climate": "Regional climate",
        "farming_focus": "Soil- and season-based farming",
        "note": "Combine AI recommendations with local agricultural guidance."
    })

def get_top_predictions(input_data):
    prediction = model.predict(input_data)
    recommended_crop = str(prediction[0])
    results = []

    if hasattr(model, "predict_proba") and hasattr(model, "classes_"):
        probabilities = model.predict_proba(input_data)[0]
        classes = model.classes_
        ranked = sorted(
            zip(classes, probabilities),
            key=lambda x: float(x[1]),
            reverse=True
        )
        for crop_name, probability in ranked[:3]:
            results.append({
                "crop": str(crop_name),
                "probability": round(float(probability) * 100, 2)
            })

    if not results:
        results.append({"crop": recommended_crop, "probability": None})

    return recommended_crop, results


# =========================================================
# CROP PREDICTION
# =========================================================

@app.post("/predict")
def predict_crop(data: CropInput):
    try:
        input_data = pd.DataFrame(
            [[
                data.N, data.P, data.K, data.temperature,
                data.humidity, data.ph, data.rainfall
            ]],
            columns=[
                "N", "P", "K", "temperature",
                "humidity", "ph", "rainfall"
            ]
        )

        crop, top_predictions = get_top_predictions(input_data)
        confidence = top_predictions[0].get("probability") if top_predictions else None
        crop_details = get_crop_details(crop)
        district_details = get_district_info(data.district)

        database = load_data()

        history_item = {
            "id": len(database["history"]) + 1,
            "date": datetime.now().strftime("%d-%m-%Y %I:%M:%S %p"),
            "state": data.state,
            "district": data.district,
            "N": data.N,
            "P": data.P,
            "K": data.K,
            "temperature": data.temperature,
            "humidity": data.humidity,
            "ph": data.ph,
            "rainfall": data.rainfall,
            "crop": crop,
            "confidence": confidence
        }

        database["history"].append(history_item)
        save_data(database)

        return {
            "success": True,
            "recommended_crop": crop,
            "confidence": confidence,
            "top_recommendations": top_predictions,
            "farm_data": {
                "state": data.state,
                "district": data.district,
                "N": data.N,
                "P": data.P,
                "K": data.K,
                "temperature": data.temperature,
                "humidity": data.humidity,
                "ph": data.ph,
                "rainfall": data.rainfall
            },
            "crop_information": {
                "season": crop_details["season"],
                "soil": crop_details["soil"],
                "water": crop_details["water"],
                "temperature": crop_details["temperature"],
                "ph": crop_details["ph"],
                "fertilizer": crop_details["fertilizer"],
                "sowing": crop_details["sowing"],
                "harvesting": crop_details["harvesting"],
                "tips": crop_details["tips"],
                "precautions": crop_details["precautions"]
            },
            "district_intelligence": {
                "district": data.district,
                "overview": district_details["overview"],
                "major_crops": district_details["major_crops"],
                "rainfall": district_details["rainfall"],
                "climate": district_details["climate"],
                "farming_focus": district_details["farming_focus"],
                "note": district_details["note"]
            }
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================================================
# FREE LOCAL NLP CHATBOT
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

        answer = generate_response(
            user_message
        )

        if not answer:

            raise Exception(
                "Local chatbot returned an empty response."
            )

        return {
            "success": True,
            "answer": answer
        }

    except Exception as error:

        print(
            "FREE CHATBOT ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Chatbot is currently unavailable."
        )


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

@app.put("/admin/contact-messages/{message_id}/read")
def mark_contact_message_read(message_id: int):

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

@app.delete("/admin/contact-messages/{message_id}")
def delete_contact_message(message_id: int):

    data = load_data()


    original_count = len(
        data["contact_messages"]
    )


    data["contact_messages"] = [

        message

        for message in data["contact_messages"]

        if message.get("id") != message_id

    ]


    if len(data["contact_messages"]) == original_count:

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
# SERVER READY MESSAGE
# =========================================================

print("==============================================")
print("AgroAI Backend is ready.")
print("Contact Message API is available.")
print("==============================================")


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

    location_type: str = "auto"


# =========================================================
# WEATHER LOCATION
# =========================================================

def get_weather_location(
    district: str,
    state: str = "Maharashtra",
    country: str = "IN",
    city: str = "",
    village: str = "",
    location_type: str = "auto"
):

    # -----------------------------------------------------
    # CHECK API KEY
    # -----------------------------------------------------

    if not OPENWEATHER_API_KEY:

        raise HTTPException(
            status_code=500,
            detail=(
                "OpenWeather API key is not configured. "
                "Add OPENWEATHER_API_KEY to backend/.env."
            )
        )


    # -----------------------------------------------------
    # CLEAN INPUT
    # -----------------------------------------------------

    district_name = (
        district or ""
    ).strip()

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


    # -----------------------------------------------------
    # DISTRICT VALIDATION
    # -----------------------------------------------------

    if not district_name:

        raise HTTPException(
            status_code=400,
            detail="District is required."
        )


    # -----------------------------------------------------
    # CREATE SEARCH LOCATION LIST
    # -----------------------------------------------------

    search_locations = []


    if location_type == "village":

        if village_name:

            search_locations.append(
                village_name
            )

        if city_name:

            search_locations.append(
                city_name
            )

        search_locations.append(
            district_name
        )


    elif location_type == "city":

        if city_name:

            search_locations.append(
                city_name
            )

        search_locations.append(
            district_name
        )


    else:

        if village_name:

            search_locations.append(
                village_name
            )

        if city_name:

            search_locations.append(
                city_name
            )

        search_locations.append(
            district_name
        )


    # -----------------------------------------------------
    # REMOVE DUPLICATE LOCATIONS
    # -----------------------------------------------------

    unique_locations = []

    for item in search_locations:

        item_clean = (
            item or ""
        ).strip()


        if not item_clean:

            continue


        already_exists = any(
            item_clean.lower() == existing.lower()
            for existing in unique_locations
        )


        if not already_exists:

            unique_locations.append(
                item_clean
            )


    # -----------------------------------------------------
    # OPENWEATHER GEOCODING
    # -----------------------------------------------------

    for location_name in unique_locations:

        queries = [

            f"{location_name},{state_name},{country_code}",

            f"{location_name},{state_name}",

            f"{location_name},{country_code}",

            location_name

        ]


        for query in queries:

            try:

                response = requests.get(

                    OPENWEATHER_GEO_URL,

                    params={

                        "q": query,

                        "limit": 1,

                        "appid":
                            OPENWEATHER_API_KEY

                    },

                    timeout=10

                )


                response.raise_for_status()


                locations = response.json()


                if not locations:

                    continue


                # -------------------------------------------------
                # FIRST MATCHED LOCATION
                # -------------------------------------------------

                location = locations[0]


                latitude = location.get(
                    "lat"
                )


                longitude = location.get(
                    "lon"
                )


                if (
                    latitude is None
                    or longitude is None
                ):

                    continue


                return {

                    "name":
                        location.get(
                            "name",
                            location_name
                        ),

                    "state":
                        location.get(
                            "state",
                            state_name
                        ),

                    "country":
                        location.get(
                            "country",
                            country_code
                        ),

                    "latitude":
                        latitude,

                    "longitude":
                        longitude,

                    "selected_district":
                        district_name,

                    "selected_city":
                        city_name,

                    "selected_village":
                        village_name

                }


            except requests.RequestException as error:

                print(
                    "OPENWEATHER LOCATION ERROR:",
                    error
                )

                continue


    # -----------------------------------------------------
    # LOCATION NOT FOUND
    # -----------------------------------------------------

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

        # -------------------------------------------------
        # CURRENT WEATHER
        # -------------------------------------------------

        current_response = requests.get(

            OPENWEATHER_CURRENT_URL,

            params=params,

            timeout=10

        )


        current_response.raise_for_status()


        current = (
            current_response.json()
        )


        # -------------------------------------------------
        # 5-DAY FORECAST
        # -------------------------------------------------

        forecast_response = requests.get(

            OPENWEATHER_FORECAST_URL,

            params=params,

            timeout=10

        )


        forecast_response.raise_for_status()


        forecast = (
            forecast_response.json()
        )


    except requests.RequestException as error:

        print(
            "OPENWEATHER DATA ERROR:",
            error
        )


        raise HTTPException(

            status_code=502,

            detail=(
                "Unable to fetch live weather "
                "data from OpenWeather."
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


    # =====================================================
    # PROCESS 5-DAY FORECAST
    # =====================================================

    for item in forecast.get(
        "list",
        []
    ):

        date_text = (
            item.get(
                "dt_txt",
                ""
            ).split(" ")[0]
        )


        if not date_text:

            continue


        weather_list = item.get(
            "weather",
            [{}]
        )


        weather_data = (
            weather_list[0]
            if weather_list
            else {}
        )


        # -------------------------------------------------
        # CREATE DAILY RECORD
        # -------------------------------------------------

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
                    weather_data.get(
                        "description",
                        "Unknown"
                    )

            }

        )


        # -------------------------------------------------
        # RAINFALL
        # -------------------------------------------------

        rain_data = item.get(
            "rain",
            {}
        )


        rain_3h = rain_data.get(
            "3h",
            0
        )


        day["rain_mm"] += float(
            rain_3h or 0
        )


        # -------------------------------------------------
        # RAIN PROBABILITY
        # -------------------------------------------------

        probability = float(

            item.get(
                "pop",
                0
            )

            or 0

        ) * 100


        day["rain_probability"] = max(

            day["rain_probability"],

            probability

        )


        # -------------------------------------------------
        # TEMPERATURE
        # -------------------------------------------------

        main_data = item.get(
            "main",
            {}
        )


        temp = main_data.get(
            "temp"
        )


        if temp is not None:

            temp = float(
                temp
            )


            # ---------------------------------------------
            # MINIMUM TEMPERATURE
            # ---------------------------------------------

            if (
                day["temperature_min"]
                is None
            ):

                day["temperature_min"] = (
                    temp
                )

            else:

                day["temperature_min"] = min(

                    day["temperature_min"],

                    temp

                )


            # ---------------------------------------------
            # MAXIMUM TEMPERATURE
            # ---------------------------------------------

            if (
                day["temperature_max"]
                is None
            ):

                day["temperature_max"] = (
                    temp
                )

            else:

                day["temperature_max"] = max(

                    day["temperature_max"],

                    temp

                )


    # =====================================================
    # DAILY FORECAST
    # =====================================================

    daily_forecast = list(
        daily.values()
    )[:5]


    # =====================================================
    # CURRENT RAIN
    # =====================================================

    current_rain_data = current.get(
        "rain",
        {}
    )


    current_rain = float(

        current_rain_data.get(
            "1h",
            0
        )

        or 0

    )


    # =====================================================
    # UPCOMING RAIN
    # =====================================================

    upcoming_rain = sum(

        float(

            day.get(
                "rain_mm",
                0
            )

            or 0

        )

        for day in daily_forecast

    )


    # =====================================================
    # UPCOMING RAIN PROBABILITY
    # =====================================================

    upcoming_probability = max(

        [

            float(

                day.get(
                    "rain_probability",
                    0
                )

                or 0

            )

            for day in daily_forecast

        ]

        or [0]

    )


    # =====================================================
    # IRRIGATION ADVICE
    # =====================================================

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


    # =====================================================
    # SOWING ADVICE
    # =====================================================

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


    # =====================================================
    # HEAVY RAIN WARNING
    # =====================================================

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


    # =====================================================
    # CURRENT WEATHER DETAILS
    # =====================================================

    current_weather_list = current.get(
        "weather",
        [{}]
    )


    current_weather = (

        current_weather_list[0]

        if current_weather_list

        else {}

    )


    main_data = current.get(
        "main",
        {}
    )


    wind_data = current.get(
        "wind",
        {}
    )


    # =====================================================
    # FINAL WEATHER RESPONSE
    # =====================================================

    return {

        "current": {

            "temperature":
                main_data.get(
                    "temp"
                ),

            "feels_like":
                main_data.get(
                    "feels_like"
                ),

            "humidity":
                main_data.get(
                    "humidity"
                ),

            "pressure":
                main_data.get(
                    "pressure"
                ),

            "wind_speed":
                wind_data.get(
                    "speed"
                ),

            "rain_last_1h":
                current_rain,

            "condition":
                current_weather.get(
                    "main",
                    "Unknown"
                ),

            "description":
                current_weather.get(
                    "description",
                    "Unknown"
                ),

            "icon":
                current_weather.get(
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

    # -----------------------------------------------------
    # GET LOCATION
    # -----------------------------------------------------

    location = get_weather_location(

        district=data.district,

        state=data.state,

        country=data.country,

        city=data.city,

        village=data.village,

        location_type=data.location_type

    )


    # -----------------------------------------------------
    # GET WEATHER
    # -----------------------------------------------------

    current, forecast = get_weather_data(

        location["latitude"],

        location["longitude"]

    )


    # -----------------------------------------------------
    # BUILD WEATHER INTELLIGENCE
    # -----------------------------------------------------

    weather_information = (
        build_weather_intelligence(
            current,
            forecast
        )
    )


    # -----------------------------------------------------
    # FINAL RESPONSE
    # -----------------------------------------------------

    return {

        "success":
            True,

        "location":
            location,

        "weather":
            weather_information

    }

# =========================================================
# SMART IRRIGATION
# =========================================================

class IrrigationInput(BaseModel):
    state: str = "Maharashtra"
    district: str
    country: str = "IN"
    crop: str
    soil_moisture: float
    field_area: float


# Project-level irrigation guidance values.
# These are estimates for the minor project UI, not exact agronomic prescriptions.
CROP_WATER_REQUIREMENT = {
    "rice": {"min_moisture": 55, "water_need": "High", "depth_mm": 8.0},
    "banana": {"min_moisture": 55, "water_need": "High", "depth_mm": 8.0},
    "sugarcane": {"min_moisture": 55, "water_need": "High", "depth_mm": 8.0},
    "coconut": {"min_moisture": 50, "water_need": "High", "depth_mm": 7.0},
    "watermelon": {"min_moisture": 45, "water_need": "Medium-High", "depth_mm": 7.0},
    "papaya": {"min_moisture": 45, "water_need": "Medium-High", "depth_mm": 7.0},
    "tomato": {"min_moisture": 50, "water_need": "Medium-High", "depth_mm": 6.0},
    "potato": {"min_moisture": 50, "water_need": "Medium-High", "depth_mm": 6.0},
    "maize": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 6.0},
    "cotton": {"min_moisture": 40, "water_need": "Medium", "depth_mm": 5.0},
    "wheat": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 5.0},
    "soybean": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 5.0},
    "groundnut": {"min_moisture": 42, "water_need": "Medium", "depth_mm": 5.0},
    "onion": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 5.0},
    "grapes": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 5.0},
    "mango": {"min_moisture": 40, "water_need": "Medium", "depth_mm": 5.0},
    "orange": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 5.0},
    "chilli": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 5.0},
    "sunflower": {"min_moisture": 40, "water_need": "Medium", "depth_mm": 5.0},
    "peas": {"min_moisture": 40, "water_need": "Medium", "depth_mm": 4.5},
    "chickpea": {"min_moisture": 35, "water_need": "Low-Medium", "depth_mm": 4.0},
    "lentil": {"min_moisture": 32, "water_need": "Low", "depth_mm": 4.0},
    "blackgram": {"min_moisture": 38, "water_need": "Low-Medium", "depth_mm": 4.0},
    "mungbean": {"min_moisture": 38, "water_need": "Low-Medium", "depth_mm": 4.0},
    "mothbeans": {"min_moisture": 30, "water_need": "Low", "depth_mm": 3.5},
    "pigeonpeas": {"min_moisture": 40, "water_need": "Medium", "depth_mm": 4.5},
    "kidneybeans": {"min_moisture": 40, "water_need": "Medium", "depth_mm": 4.5},
    "pomegranate": {"min_moisture": 38, "water_need": "Low-Medium", "depth_mm": 4.0},
    "apple": {"min_moisture": 40, "water_need": "Medium", "depth_mm": 5.0},
    "coffee": {"min_moisture": 45, "water_need": "High", "depth_mm": 6.0},
    "jute": {"min_moisture": 45, "water_need": "Medium-High", "depth_mm": 6.0},
    "muskmelon": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 6.0},
    "orange": {"min_moisture": 45, "water_need": "Medium", "depth_mm": 5.0},
}


def calculate_water_quantity(crop_info, soil_moisture, field_area, irrigation_required):
    """Return project-level estimated irrigation quantity.

    1 mm over 1 acre = 4046.86 litres.
    The estimate is reduced when soil moisture is closer to the crop threshold.
    """
    if not irrigation_required:
        return {
            "water_depth_mm": 0.0,
            "water_per_acre_liters": 0.0,
            "total_water_liters": 0.0,
            "daily_water_liters": 0.0,
        }

    base_depth = float(crop_info.get("depth_mm", 5.0))
    required = float(crop_info.get("min_moisture", 40))
    deficit = max(0.0, required - float(soil_moisture))

    # Keep the estimate bounded and proportional to the moisture deficit.
    deficit_factor = min(1.0, max(0.35, deficit / max(required, 1.0)))
    depth_mm = round(base_depth * deficit_factor, 2)

    liters_per_mm_per_acre = 4046.86
    water_per_acre = round(depth_mm * liters_per_mm_per_acre)
    total_water = round(water_per_acre * float(field_area))

    return {
        "water_depth_mm": depth_mm,
        "water_per_acre_liters": water_per_acre,
        "total_water_liters": total_water,
        "daily_water_liters": total_water,
    }


def calculate_irrigation_advice(crop, soil_moisture, current_weather, forecast):
    crop_key = str(crop).strip().lower()
    crop_info = CROP_WATER_REQUIREMENT.get(
        crop_key,
        {"min_moisture": 40, "water_need": "Medium", "depth_mm": 5.0}
    )

    required = float(crop_info["min_moisture"])
    current_rain = float(current_weather.get("rain_last_1h", 0) or 0)
    next_two_days = forecast[:2]
    upcoming_rain = sum(float(day.get("rain_mm", 0) or 0) for day in next_two_days)
    upcoming_probability = max(
        [float(day.get("rain_probability", 0) or 0) for day in next_two_days],
        default=0
    )

    if current_rain > 0:
        status = "NOT RECOMMENDED"
        reason = "Rain is currently occurring, so additional irrigation may cause excess moisture."
        water_advice = "Postpone irrigation and allow the field to use the available rainfall."
        timing = "Recheck soil moisture after the rainfall has stopped."
        warning = "Avoid unnecessary irrigation during active rainfall to reduce waterlogging."
        irrigation_required = False
    elif upcoming_rain >= 20:
        status = "NOT RECOMMENDED"
        reason = f"About {upcoming_rain:.1f} mm rainfall is expected during the next two days."
        water_advice = "Postpone irrigation because significant rainfall is expected."
        timing = "Check soil moisture again after the rainfall."
        warning = "Heavy rainfall may cause waterlogging. Keep field drainage channels clear."
        irrigation_required = False
    elif upcoming_probability >= 60:
        status = "WAIT AND MONITOR"
        reason = f"Rain probability is around {upcoming_probability:.0f}% during the next two days."
        water_advice = "Do not irrigate immediately. Monitor soil moisture and rainfall."
        timing = "Recheck the field later and irrigate only if the soil becomes dry."
        warning = "Rain may naturally provide part of the crop's water requirement."
        irrigation_required = False
    elif soil_moisture >= required + 15:
        status = "NOT RECOMMENDED"
        reason = f"Soil moisture is {soil_moisture:.1f}%, which is already sufficiently high."
        water_advice = "No irrigation is required at the moment."
        timing = "Monitor soil moisture and irrigate only when it falls below the crop requirement."
        warning = "Additional water may increase the risk of waterlogging and root problems."
        irrigation_required = False
    elif soil_moisture < required:
        status = "IRRIGATION RECOMMENDED"
        reason = f"Soil moisture is {soil_moisture:.1f}%, below the selected crop's project guidance threshold of {required:.0f}%."
        water_advice = "Irrigation can be considered now using the estimated crop water requirement."
        timing = "Prefer irrigation during cooler parts of the day, such as early morning or evening."
        warning = "The quantity shown is a project estimate; adjust it for crop stage, soil type and local conditions."
        irrigation_required = True
    else:
        status = "WAIT AND MONITOR"
        reason = f"Soil moisture is {soil_moisture:.1f}%, so immediate irrigation may not be necessary."
        water_advice = "Monitor soil moisture before applying more water."
        timing = "Irrigate when soil moisture approaches the crop's dry threshold."
        warning = "Avoid fixed-interval irrigation when soil moisture is still adequate."
        irrigation_required = False

    return {
        "status": status,
        "reason": reason,
        "water_advice": water_advice,
        "timing": timing,
        "warning": warning,
        "irrigation_required": irrigation_required,
        "recommended_moisture": required,
        "water_requirement": crop_info["water_need"],
    }


@app.post("/irrigation")
def smart_irrigation(data: IrrigationInput):
    try:
        if not data.district.strip():
            raise HTTPException(status_code=400, detail="District is required.")
        if not data.crop.strip():
            raise HTTPException(status_code=400, detail="Crop is required.")
        if not 0 <= data.soil_moisture <= 100:
            raise HTTPException(status_code=400, detail="Soil moisture must be between 0 and 100.")
        if data.field_area <= 0:
            raise HTTPException(status_code=400, detail="Field area must be greater than zero.")

        location = get_weather_location(
            district=data.district,
            state=data.state,
            country=data.country
        )
        current_weather, forecast_data = get_weather_data(
            location["latitude"], location["longitude"]
        )
        weather_information = build_weather_intelligence(
            current_weather, forecast_data
        )
        current = weather_information.get("current", {})
        forecast = weather_information.get("forecast", [])

        irrigation = calculate_irrigation_advice(
            crop=data.crop,
            soil_moisture=float(data.soil_moisture),
            current_weather=current,
            forecast=forecast
        )

        crop_info = CROP_WATER_REQUIREMENT.get(
            data.crop.strip().lower(),
            {"min_moisture": 40, "water_need": "Medium", "depth_mm": 5.0}
        )
        quantities = calculate_water_quantity(
            crop_info,
            float(data.soil_moisture),
            float(data.field_area),
            bool(irrigation["irrigation_required"])
        )

        irrigation.update(quantities)

        return {
            "success": True,
            "location": location,
            "crop": data.crop,
            "field_area": round(float(data.field_area), 2),
            "soil_moisture": round(float(data.soil_moisture), 2),
            "weather": {
                "current": current,
                "forecast": forecast,
            },
            "irrigation": irrigation,
        }

    except HTTPException:
        raise
    except Exception as error:
        print("SMART IRRIGATION ERROR:", error)
        raise HTTPException(
            status_code=500,
            detail="Unable to calculate smart irrigation guidance."
        )
