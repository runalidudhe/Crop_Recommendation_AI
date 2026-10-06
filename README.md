\# 🌾 FarmNexa-AI – Crop Recommendation and Intelligent Farming Assistant



FarmNexa-AI is an intelligent web-based farming assistance platform designed to help farmers make better agricultural decisions using Machine Learning, Artificial Intelligence, weather intelligence, and smart irrigation guidance.

## 📌 Project Description



FarmNexa-AI combines modern web technologies with Machine Learning and Artificial Intelligence to create a smart farming assistance platform.



The Crop Recommendation module analyzes:



\- Nitrogen (N)

\- Phosphorus (P)

\- Potassium (K)

\- Temperature

\- Humidity

\- Soil pH

\- Rainfall



Based on these parameters, the Machine Learning model predicts a suitable crop.



The platform also includes weather intelligence, smart irrigation, AI farming assistance, user authentication, and agricultural information.

## ✨ Key Features



\- 🌱 AI-based Crop Recommendation

\- 🌦️ Real-Time Weather Information

\- 📅 Five-Day Weather Forecast

\- 💧 Smart Irrigation Guidance

\- 🤖 AI Farming Assistant

\- 🔐 User Registration and Login

\- 📊 Farming Information and Guidance

\- 📱 Responsive and User-Friendly Interface

\- 🔄 API-based Data Processing

\- 🧠 Machine Learning Prediction



\## 🛠️ Technologies Used



\### Frontend

\- HTML5

\- CSS3

\- JavaScript



\### Backend

\- Python

\- FastAPI



\### Artificial Intelligence \& Machine Learning

\- Machine Learning

\- AI-based Farming Assistant

\- Crop Recommendation Model



\### Other Technologies

\- Weather API

\- Database

\- Git \& GitHub

\- Visual Studio Code

## 🎯 Project Objectives



The main objectives of FarmNexa-AI are:



1\. To provide intelligent crop recommendations using Machine Learning.

2\. To help farmers understand current and forecasted weather conditions.

3\. To provide smart irrigation guidance based on field and weather conditions.

4\. To provide an AI-powered assistant for farming-related queries.

5\. To reduce dependency on manual agricultural decision-making.

6\. To provide a simple and user-friendly digital farming platform.

7\. To demonstrate the practical use of AI and Machine Learning in agriculture.



\## 🧩 System Workflow



The basic workflow of FarmNexa-AI is:



User → Frontend → FastAPI Backend → AI/ML \& APIs → Processing → Result → User



The system accepts farming-related inputs from the user, processes them through the appropriate AI, Machine Learning model or external API, and displays useful agricultural recommendations and information.



\## 📂 Main Modules



\- User Authentication

\- Crop Recommendation

\- Weather Intelligence

\- Smart Irrigation

\- AI Farming Assistant

\- Agricultural Information

\- Contact Us

## 🖥️ Project Structure



The project is organized into different components for better development and maintenance.



```text

Crop\_Recommendation\_AI/

│

├── backend/

├── frontend/

├── ml\_model/

├── database/

├── .gitignore

└── README.md
```

## 🌱 Crop Recommendation Module



The Crop Recommendation module is one of the main features of FarmNexa-AI.



The user provides the following soil and environmental parameters:



\- Nitrogen (N)

\- Phosphorus (P)

\- Potassium (K)

\- Temperature

\- Humidity

\- Soil pH

\- Rainfall



The input values are validated and sent to the backend. The Machine Learning model processes the values and predicts a suitable crop based on the learned agricultural patterns.



\### Crop Recommendation Workflow



```text

N, P, K

&#x20;  ↓

Temperature \& Humidity

&#x20;  ↓

Soil pH \& Rainfall

&#x20;  ↓

Input Validation

&#x20;  ↓

Machine Learning Model

&#x20;  ↓

Crop Prediction

&#x20;  ↓

Recommended Crop

```



\## 🌦️ Weather Intelligence



The Weather module provides useful weather information for farming decisions.



It includes:



\- Current temperature

\- Feels-like temperature

\- Humidity

\- Rain information

\- Wind speed

\- Atmospheric pressure

\- Weather condition

\- Five-day forecast

\- Rain probability

\- Forecast rainfall



Weather information can help farmers plan irrigation, crop activities and other agricultural operations.



\## 💧 Smart Irrigation



The Smart Irrigation module provides intelligent guidance about water requirements.



The module considers information such as:



\- Selected crop

\- Field area

\- Soil moisture

\- Current weather conditions

\- Rainfall conditions



The system provides useful information such as:



\- Daily water requirement

\- Water requirement per acre

\- Total field water requirement

\- Irrigation depth

\- Irrigation status

\- Water-saving guidance



This helps farmers make better irrigation decisions and avoid unnecessary water usage.



\## 🤖 AI Farming Assistant



FarmNexa-AI includes an AI-powered farming assistant for agriculture-related queries.



The assistant can provide guidance related to:



\- Crops

\- Fertilizers

\- Soil

\- Irrigation

\- Farming practices

\- Crop problems

\- Pests and diseases

\- General agricultural information



The AI assistant is designed to provide quick and accessible farming-related information through a conversational interface.



\## 🔄 System Architecture



The overall architecture of FarmNexa-AI follows a client-server and AI/ML-based design.



```text

&#x20;                ┌──────────────────┐

&#x20;                │      FARMER      │

&#x20;                └────────┬─────────┘

&#x20;                         │

&#x20;                         ▼

&#x20;                ┌──────────────────┐

&#x20;                │    FRONTEND      │

&#x20;                │ HTML/CSS/JS      │

&#x20;                └────────┬─────────┘

&#x20;                         │

&#x20;                         ▼

&#x20;                ┌──────────────────┐

&#x20;                │ FASTAPI BACKEND  │

&#x20;                │  REST APIs       │

&#x20;                └────────┬─────────┘

&#x20;                         │

&#x20;         ┌───────────────┼────────────────┐

&#x20;         ▼               ▼                ▼

&#x20;  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐

&#x20;  │ ML MODEL    │ │ WEATHER API │ │ AI ASSISTANT│

&#x20;  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘

&#x20;         │               │                │

&#x20;         └───────────────┼────────────────┘

&#x20;                         ▼

&#x20;                ┌──────────────────┐

&#x20;                │  RESULT /        │

&#x20;                │  FARM GUIDANCE   │

&#x20;                └──────────────────┘

```



\## ⚙️ Implementation



The project follows a modular implementation approach.



\### Frontend Implementation



The frontend is developed using HTML5, CSS3 and JavaScript.



It provides:



\- Navigation

\- Forms

\- Dashboard

\- Crop recommendation interface

\- Weather interface

\- Irrigation interface

\- AI assistant interface

\- Contact interface

\- Form validation

\- Result display



\### Backend Implementation



Python with FastAPI is used for backend development.



The backend handles:



\- API requests

\- User authentication

\- Input validation

\- ML model communication

\- Weather API communication

\- AI assistant communication

\- Response processing



\### Machine Learning Implementation



The crop recommendation system accepts seven important parameters and passes them to the trained Machine Learning model.



```text

User Input

&#x20;   ↓

Validation

&#x20;   ↓

Feature Preparation

&#x20;   ↓

ML Model

&#x20;   ↓

Prediction

&#x20;   ↓

Recommended Crop

```



\## 🔐 Authentication



The application provides user registration and login functionality.



The authentication module helps manage:



\- User registration

\- Login

\- User credentials

\- Session/user information

\- Access to application features



Sensitive configuration values such as API keys should be stored in environment variables and should not be uploaded to GitHub.



\## 📸 Screenshots



Screenshots of the working project can be added to this section.



\### 🏠 Home Page



Add the screenshot of the main FarmNexa-AI homepage here.



`!\[FarmNexa-AI Home Page](screenshots/home.png)`



\### 🔐 Login and Signup



Add screenshots of the Login and Create Account pages here.



`!\[Login Page](screenshots/login.png)`



`!\[Signup Page](screenshots/signup.png)`



\### 📊 Dashboard



Add the dashboard screenshot here.



`!\[Dashboard](screenshots/dashboard.png)`



\### 🌱 Crop Recommendation



Add the crop recommendation form and result screenshots here.



`!\[Crop Recommendation](screenshots/crop-recommendation.png)`



\### 🌦️ Weather



Add the weather module screenshot here.



`!\[Weather Module](screenshots/weather.png)`



\### 💧 Smart Irrigation



Add the irrigation module screenshot here.



`!\[Smart Irrigation](screenshots/irrigation.png)`



\### 🤖 AI Farming Assistant



Add the AI assistant screenshot here.



`!\[AI Farming Assistant](screenshots/ai-assistant.png)`



\## 🧪 Testing



The main functional modules were tested during development.



| Test Case | Function | Expected Result | Status |

|---|---|---|---|

| TC-01 | Create Account | Account created successfully | PASS |

| TC-02 | Login | User authenticated successfully | PASS |

| TC-03 | Crop Prediction | Suitable crop displayed | PASS |

| TC-04 | Recommendation | Recommendation displayed | PASS |

| TC-05 | Weather | Weather information loaded | PASS |

| TC-06 | Forecast | Forecast displayed | PASS |

| TC-07 | Irrigation | Irrigation guidance displayed | PASS |

| TC-08 | AI Assistant | AI response returned | PASS |

| TC-09 | Contact | Message submitted | PASS |

| TC-10 | Invalid Input | Validation message displayed | PASS |



\## 🚀 Installation and Setup



\### 1. Clone the Repository



```bash

git clone https://github.com/runalidudhe/Crop\_Recommendation\_AI.git

```



\### 2. Open the Project



```bash

cd Crop\_Recommendation\_AI

```



\### 3. Create Virtual Environment



```bash

python -m venv venv

```



\### 4. Activate Virtual Environment



Windows PowerShell:



```powershell

.\\venv\\Scripts\\Activate.ps1

```



\### 5. Install Required Packages



Install the required Python packages according to the project's backend configuration.



\### 6. Configure Environment Variables



Create a `.env` file for private configuration such as API keys.



Example:



```env

WEATHER\_API\_KEY=your\_weather\_api\_key

AI\_API\_KEY=your\_ai\_api\_key

```



\*\*Never upload real API keys or passwords to GitHub.\*\*



\## 🎯 Project Objectives



FarmNexa-AI was developed with the following objectives:



\- To apply Artificial Intelligence in agriculture.

\- To use Machine Learning for crop recommendation.

\- To provide weather-based agricultural information.

\- To support smart irrigation decisions.

\- To provide an AI-based farming assistant.

\- To create a simple and accessible digital farming platform.

\- To demonstrate practical application of modern web technologies.



\## 🔮 Future Scope



FarmNexa-AI can be further enhanced with:



\- 🌿 Plant disease detection using images

\- 📈 Crop yield prediction

\- 💰 Crop profit estimation

\- 🛒 Agricultural market price information

\- 🌾 Fertilizer recommendation

\- 📅 Crop calendar and reminders

\- 📡 IoT-based soil sensors

\- 🚿 Automatic irrigation control

\- 🗣️ Voice-based farming assistant

\- 🌐 Marathi and Hindi language support

\- 📱 Android/mobile application

\- ☁️ Cloud deployment

\- 🛰️ Satellite-based crop monitoring

\- 📊 Advanced farming analytics

\- 🔔 Weather and farming alerts



\## 📚 Learning Outcomes



Through the development of FarmNexa-AI, the following technical concepts were applied:



\- Web Development

\- Frontend Development

\- Backend Development

\- REST API Development

\- Python Programming

\- FastAPI

\- Machine Learning

\- Artificial Intelligence

\- Database Management

\- API Integration

\- Git and GitHub

\- Software Testing

\- Project Documentation



\## 👩‍💻 Project Information



\*\*Project Title:\*\*  

FarmNexa-AI – Crop Recommendation and Intelligent Farming Assistant



\*\*Student:\*\*  

Runali Dipak Dudhe



\*\*Course:\*\*  

Bachelor of Computer Application (Computer Science)



\*\*College:\*\*  

Gopikabai Sitaram Gawande College, Umarkhed



\*\*Academic Year:\*\*  

2026–2027



\## 📖 References



\- Python Documentation

\- FastAPI Documentation

\- Scikit-learn Documentation

\- MDN Web Documentation

\- JavaScript Documentation

\- Weather API Documentation

\- Generative AI Documentation

\- Agricultural Machine Learning datasets and research resources

\- HTML and CSS Web Standards



\## 📄 License



This project has been developed for academic and educational purposes as part of the Bachelor of Computer Application project work.



\---



\## 🌾 FarmNexa-AI



\*\*Crop Recommendation and Intelligent Farming Assistant\*\*



\*AI • Machine Learning • Weather Intelligence • Smart Irrigation • Digital Farming\*




