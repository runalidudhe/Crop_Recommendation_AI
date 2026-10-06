/* =========================================================
   AGROAI WEATHER INTELLIGENCE
   Complete Weather Frontend
   Maharashtra - 36 Districts A-Z
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           API
        ================================================= */

        const API_URL =
            "http://127.0.0.1:8000";



        /* =================================================
           ELEMENTS
        ================================================= */

        const state =
            document.getElementById("state");

        const district =
            document.getElementById("district");

        const city =
            document.getElementById("city");

        const village =
            document.getElementById("village");

        const cityList =
            document.getElementById("cityList");

        const villageList =
            document.getElementById("villageList");

        const locationType =
            document.getElementById("locationType");

        const form =
            document.getElementById("weatherForm");

        const button =
            document.getElementById("weatherBtn");

        const buttonText =
            document.getElementById("btnText");

        const loader =
            document.getElementById("loader");

        const errorBox =
            document.getElementById("errorMessage");

        const result =
            document.getElementById("weatherResult");



        /* =================================================
           MAHARASHTRA DISTRICTS
           36 DISTRICTS - A TO Z
        ================================================= */

        const districtData = {

            Maharashtra: {

                "Ahilyanagar": [
                    "Ahilyanagar",
                    "Kopargaon",
                    "Sangamner",
                    "Shrirampur",
                    "Rahuri"
                ],

                "Akola": [
                    "Akola",
                    "Akot",
                    "Balapur",
                    "Murtizapur",
                    "Barshitakli",
                    "Telhara"
                ],

                "Amravati": [
                    "Amravati",
                    "Achalpur",
                    "Anjangaon",
                    "Chandur Railway",
                    "Morshi",
                    "Daryapur",
                    "Warud"
                ],

                "Bhandara": [
                    "Bhandara",
                    "Tumsar",
                    "Pauni",
                    "Mohadi",
                    "Sakoli",
                    "Lakhani"
                ],

                "Beed": [
                    "Beed",
                    "Georai",
                    "Majalgaon",
                    "Ambajogai",
                    "Kaij",
                    "Parli",
                    "Ashti"
                ],

                "Buldhana": [
                    "Buldhana",
                    "Khamgaon",
                    "Malkapur",
                    "Shegaon",
                    "Mehkar"
                ],

                "Chandrapur": [
                    "Chandrapur",
                    "Ballarpur",
                    "Warora",
                    "Rajura",
                    "Brahmapuri"
                ],

                "Chhatrapati Sambhajinagar": [
                    "Chhatrapati Sambhajinagar",
                    "Paithan",
                    "Sillod",
                    "Kannad",
                    "Vaijapur"
                ],

                "Dharashiv": [
                    "Dharashiv",
                    "Tuljapur",
                    "Omerga",
                    "Kalamb",
                    "Paranda"
                ],

                "Dhule": [
                    "Dhule",
                    "Shirpur",
                    "Sakri",
                    "Shindkheda"
                ],

                "Gadchiroli": [
                    "Gadchiroli",
                    "Aheri",
                    "Armori",
                    "Desaiganj"
                ],

                "Gondia": [
                    "Gondia",
                    "Tirora",
                    "Goregaon",
                    "Amgaon"
                ],

                "Hingoli": [
                    "Hingoli",
                    "Kalamnuri",
                    "Basmath",
                    "Sengaon"
                ],

                "Jalgaon": [
                    "Jalgaon",
                    "Bhusawal",
                    "Chalisgaon",
                    "Amalner",
                    "Pachora"
                ],

                "Jalna": [
                    "Jalna",
                    "Ambad",
                    "Bhokardan",
                    "Partur",
                    "Ghansawangi"
                ],

                "Kolhapur": [
                    "Kolhapur",
                    "Ichalkaranji",
                    "Kagal",
                    "Gadhinglaj",
                    "Panhala"
                ],

                "Latur": [
                    "Latur",
                    "Udgir",
                    "Nilanga",
                    "Ausa",
                    "Ahmedpur"
                ],

                "Mumbai City": [
                    "Mumbai"
                ],

                "Mumbai Suburban": [
                    "Mumbai",
                    "Andheri",
                    "Borivali",
                    "Bandra",
                    "Kurla"
                ],

                "Nagpur": [
                    "Nagpur",
                    "Kamptee",
                    "Hingna",
                    "Umred",
                    "Katol",
                    "Ramtek",
                    "Saoner",
                    "Kalmeshwar"
                ],

                "Nanded": [
                    "Nanded",
                    "Deglur",
                    "Dharmabad",
                    "Kinwat",
                    "Mudkhed"
                ],

                "Nandurbar": [
                    "Nandurbar",
                    "Shahada",
                    "Taloda",
                    "Akkalkuwa"
                ],

                "Nashik": [
                    "Nashik",
                    "Malegaon",
                    "Sinnar",
                    "Igatpuri",
                    "Yeola",
                    "Niphad"
                ],

                "Palghar": [
                    "Palghar",
                    "Vasai",
                    "Virar",
                    "Dahanu",
                    "Boisar"
                ],

                "Parbhani": [
                    "Parbhani",
                    "Jintur",
                    "Manwath",
                    "Gangakhed",
                    "Pathri"
                ],

                "Pune": [
                    "Pune",
                    "Pimpri-Chinchwad",
                    "Baramati",
                    "Lonavala",
                    "Shirur",
                    "Junnar"
                ],

                "Raigad": [
                    "Alibag",
                    "Panvel",
                    "Karjat",
                    "Pen",
                    "Uran"
                ],

                "Ratnagiri": [
                    "Ratnagiri",
                    "Chiplun",
                    "Dapoli",
                    "Rajapur",
                    "Khed"
                ],

                "Sangli": [
                    "Sangli",
                    "Miraj",
                    "Tasgaon",
                    "Islampur",
                    "Jat"
                ],

                "Satara": [
                    "Satara",
                    "Karad",
                    "Wai",
                    "Phaltan",
                    "Mahabaleshwar"
                ],

                "Sindhudurg": [
                    "Oros",
                    "Sawantwadi",
                    "Kudal",
                    "Malvan",
                    "Kankavli"
                ],

                "Solapur": [
                    "Solapur",
                    "Barshi",
                    "Akkalkot",
                    "Pandharpur",
                    "Mangalvedhe"
                ],

                "Thane": [
                    "Thane",
                    "Kalyan",
                    "Dombivli",
                    "Bhiwandi",
                    "Ulhasnagar"
                ],

                "Wardha": [
                    "Wardha",
                    "Hinganghat",
                    "Arvi",
                    "Deoli",
                    "Pulgaon"
                ],

                "Washim": [
                    "Washim",
                    "Karanja",
                    "Risod",
                    "Malegaon"
                ],

                "Yavatmal": [
                    "Yavatmal",
                    "Umarkhed",
                    "Pusad",
                    "Wani",
                    "Darwha",
                    "Digras"
                ]

            }

        };



        /* =================================================
           LOAD DISTRICTS
        ================================================= */

        function loadDistricts() {

            district.innerHTML =
                `<option value="">
                    Select District
                </option>`;

            city.value = "";
            village.value = "";

            cityList.innerHTML = "";
            villageList.innerHTML = "";

            city.disabled = true;
            village.disabled = true;

            const selectedState =
                state.value.trim();


            if (
                !selectedState ||
                !districtData[selectedState]
            ) {

                district.disabled = true;

                return;
            }


            district.disabled = false;


            Object
                .keys(
                    districtData[selectedState]
                )
                .sort(
                    (a, b) =>
                        a.localeCompare(
                            b,
                            "en",
                            {
                                sensitivity:
                                    "base"
                            }
                        )
                )
                .forEach(
                    name => {

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



        /* =================================================
           LOAD CITY / VILLAGE
        ================================================= */

        function loadCities() {

            const selectedState =
                state.value.trim();

            const selectedDistrict =
                district.value.trim();


            city.value = "";
            village.value = "";

            cityList.innerHTML = "";
            villageList.innerHTML = "";


            if (
                !selectedState ||
                !selectedDistrict
            ) {

                city.disabled = true;
                village.disabled = true;

                return;
            }


            city.disabled = false;
            village.disabled = false;


            const locations =
                districtData[
                    selectedState
                ]?.[
                    selectedDistrict
                ] || [];


            locations.forEach(
                locationName => {

                    const cityOption =
                        document.createElement(
                            "option"
                        );

                    cityOption.value =
                        locationName;

                    cityList.appendChild(
                        cityOption
                    );


                    const villageOption =
                        document.createElement(
                            "option"
                        );

                    villageOption.value =
                        locationName;

                    villageList.appendChild(
                        villageOption
                    );

                }
            );
        }



        /* =================================================
           STATE CHANGE
        ================================================= */

        state.addEventListener(
            "change",
            loadDistricts
        );



        /* =================================================
           DISTRICT CHANGE
        ================================================= */

        district.addEventListener(
            "change",
            loadCities
        );



        /* =================================================
           ERROR
        ================================================= */

        function showError(
            message
        ) {

            errorBox.textContent =
                message;

            errorBox.style.display =
                "block";
        }


        function hideError() {

            errorBox.textContent =
                "";

            errorBox.style.display =
                "none";
        }



        /* =================================================
           LOADING
        ================================================= */

        function setLoading(
            loading
        ) {

            button.disabled =
                loading;


            if (loading) {

                buttonText.textContent =
                    "Getting Weather...";

                loader.style.display =
                    "inline-block";

            } else {

                buttonText.textContent =
                    "☁️ Check Weather";

                loader.style.display =
                    "none";
            }
        }



        /* =================================================
           LOGIN STATE
        ================================================= */

        function updateAuth() {

            const loggedIn =
                localStorage.getItem(
                    "agroai_logged_in"
                ) === "true";


            const loginLink =
                document.getElementById(
                    "loginLink"
                );

            const signupLink =
                document.getElementById(
                    "signupLink"
                );

            const logoutBtn =
                document.getElementById(
                    "logoutBtn"
                );


            if (loggedIn) {

                if (loginLink) {
                    loginLink.style.display =
                        "none";
                }

                if (signupLink) {
                    signupLink.style.display =
                        "none";
                }

                if (logoutBtn) {
                    logoutBtn.style.display =
                        "block";
                }

            } else {

                if (loginLink) {
                    loginLink.style.display =
                        "block";
                }

                if (signupLink) {
                    signupLink.style.display =
                        "block";
                }

                if (logoutBtn) {
                    logoutBtn.style.display =
                        "none";
                }

            }
        }


        updateAuth();



        /* =================================================
           LOGOUT
        ================================================= */

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                () => {

                    localStorage.removeItem(
                        "agroai_logged_in"
                    );

                    localStorage.removeItem(
                        "agroai_role"
                    );

                    localStorage.removeItem(
                        "loggedInUser"
                    );

                    sessionStorage.removeItem(
                        "loggedInUser"
                    );


                    window.location.href =
                        "index.html";
                }
            );
        }



        /* =================================================
           WEATHER FORM
        ================================================= */

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                hideError();


                const selectedState =
                    state.value.trim();

                const selectedDistrict =
                    district.value.trim();

                const selectedCity =
                    city.value.trim();

                const selectedVillage =
                    village.value.trim();

                const searchType =
                    locationType.value;



                /* -----------------------------------------
                   STATE VALIDATION
                ------------------------------------------ */

                if (!selectedState) {

                    showError(
                        "Please select your state."
                    );

                    state.focus();

                    return;
                }



                /* -----------------------------------------
                   DISTRICT VALIDATION
                ------------------------------------------ */

                if (!selectedDistrict) {

                    showError(
                        "Please select your district."
                    );

                    district.focus();

                    return;
                }



                /* -----------------------------------------
                   LOCATION
                ------------------------------------------ */

                let searchedLocation = "";


                if (
                    searchType ===
                    "village"
                ) {

                    searchedLocation =
                        selectedVillage ||
                        selectedCity ||
                        selectedDistrict;

                } else if (
                    searchType ===
                    "city"
                ) {

                    searchedLocation =
                        selectedCity ||
                        selectedDistrict;

                } else {

                    searchedLocation =
                        selectedCity ||
                        selectedVillage ||
                        selectedDistrict;
                }



                if (!searchedLocation) {

                    showError(
                        "Please enter or select a city or village."
                    );

                    city.focus();

                    return;
                }



                /* -----------------------------------------
                   START LOADING
                ------------------------------------------ */

                setLoading(true);



                try {

                    const response =
                        await fetch(
                            `${API_URL}/weather`,
                            {
                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        district:
                                            selectedDistrict,

                                        state:
                                            selectedState,

                                        country:
                                            "IN",

                                        city:
                                            selectedCity,

                                        village:
                                            selectedVillage,

                                        location_type:
                                            searchType

                                    })
                            }
                        );



                    let data;


                    try {

                        data =
                            await response.json();

                    } catch {

                        throw new Error(
                            "Invalid response received from server."
                        );
                    }



                    if (!response.ok) {

                        throw new Error(
                            data.detail ||
                            `Weather service failed (${response.status}).`
                        );
                    }



                    if (!data.success) {

                        throw new Error(
                            "Weather information unavailable."
                        );
                    }



                    displayWeather(
                        data,
                        selectedState,
                        selectedDistrict,
                        selectedCity,
                        selectedVillage,
                        searchedLocation
                    );


                } catch (error) {

                    console.error(
                        "WEATHER ERROR:",
                        error
                    );


                    const message =
                        String(
                            error.message ||
                            ""
                        ).toLowerCase();


                    if (
                        message.includes(
                            "failed to fetch"
                        )
                    ) {

                        showError(
                            "AgroAI server is not connected. Please make sure FastAPI is running on port 8000."
                        );

                    } else {

                        showError(
                            error.message ||
                            "Unable to load weather."
                        );
                    }


                } finally {

                    setLoading(false);
                }

            }
        );



        /* =================================================
           DISPLAY WEATHER
        ================================================= */

        function displayWeather(
            data,
            selectedState,
            selectedDistrict,
            selectedCity,
            selectedVillage,
            searchedLocation
        ) {

            const location =
                data.location || {};

            const weather =
                data.weather || {};

            const current =
                weather.current || {};



            const resultDistrict =
                location.selected_district ||
                selectedDistrict;


            const resultCity =
                location.selected_city ||
                selectedCity;


            const resultVillage =
                location.selected_village ||
                selectedVillage;


            const displayLocation =
                resultVillage ||
                resultCity ||
                resultDistrict ||
                searchedLocation;



            /* -----------------------------------------
               LOCATION
            ------------------------------------------ */

            document.getElementById(
                "locationName"
            ).textContent =
                displayLocation;


            let locationDetails = "";


            if (resultVillage) {

                locationDetails =
                    `${resultVillage}, ${resultDistrict} District, ${selectedState}`;

            } else if (resultCity) {

                locationDetails =
                    `${resultCity}, ${resultDistrict} District, ${selectedState}`;

            } else {

                locationDetails =
                    `${resultDistrict} District, ${selectedState}`;
            }


            document.getElementById(
                "locationState"
            ).textContent =
                locationDetails;



            /* -----------------------------------------
               TEMPERATURE
            ------------------------------------------ */

            const temperature =
                Number(
                    current.temperature || 0
                );


            document.getElementById(
                "currentTemperature"
            ).textContent =
                `${Math.round(temperature)}°C`;



            /* -----------------------------------------
               FEELS LIKE
            ------------------------------------------ */

            const feelsLike =
                Number(
                    current.feels_like || 0
                );


            document.getElementById(
                "feelsLike"
            ).textContent =
                `${Math.round(feelsLike)}°C`;



            /* -----------------------------------------
               HUMIDITY
            ------------------------------------------ */

            document.getElementById(
                "humidity"
            ).textContent =
                `${Number(
                    current.humidity || 0
                )}%`;



            /* -----------------------------------------
               WIND
            ------------------------------------------ */

            document.getElementById(
                "windSpeed"
            ).textContent =
                `${Number(
                    current.wind_speed || 0
                ).toFixed(1)} m/s`;



            /* -----------------------------------------
               PRESSURE
            ------------------------------------------ */

            document.getElementById(
                "pressure"
            ).textContent =
                `${Number(
                    current.pressure || 0
                )} hPa`;



            /* -----------------------------------------
               CONDITION
            ------------------------------------------ */

            const condition =
                String(
                    current.condition || ""
                );

            const description =
                String(
                    current.description || ""
                );


            document.getElementById(
                "currentCondition"
            ).textContent =
                condition ||
                "Current Conditions";


            document.getElementById(
                "currentDescription"
            ).textContent =
                description;



            /* -----------------------------------------
               WEATHER ICON
            ------------------------------------------ */

            const currentIcon =
                document.getElementById(
                    "currentIcon"
                );


            if (
                currentIcon &&
                current.icon
            ) {

                currentIcon.src =
                    `https://openweathermap.org/img/wn/${current.icon}@2x.png`;

                currentIcon.alt =
                    description ||
                    condition ||
                    "Current weather";
            }



            /* -----------------------------------------
               RAIN
            ------------------------------------------ */

            const rain =
                Number(
                    current.rain_last_1h || 0
                );


            const currentRain =
                document.getElementById(
                    "currentRain"
                );


            const lowerCondition =
                condition.toLowerCase();


            const isRain =
                lowerCondition.includes(
                    "rain"
                ) ||
                lowerCondition.includes(
                    "drizzle"
                ) ||
                lowerCondition.includes(
                    "thunderstorm"
                ) ||
                rain > 0.05;


            if (currentRain) {

                currentRain.textContent =
                    isRain
                        ? `${rain.toFixed(2)} mm`
                        : "No rain";
            }



            /* -----------------------------------------
               FARMING STATUS
            ------------------------------------------ */

            let farmingStatus =
                "Suitable";


            if (
                lowerCondition.includes(
                    "thunderstorm"
                )
            ) {

                farmingStatus =
                    "Caution";

            } else if (
                rain > 10
            ) {

                farmingStatus =
                    "Wet Conditions";

            } else if (
                temperature >= 38
            ) {

                farmingStatus =
                    "Hot Conditions";
            }


            document.getElementById(
                "farmingStatus"
            ).textContent =
                farmingStatus;



            /* -----------------------------------------
               FARMING ADVICE
            ------------------------------------------ */

            const advice =
                weather.farming_advice ||
                {};


            document.getElementById(
                "irrigationAdvice"
            ).textContent =
                advice.irrigation ||
                "Check soil moisture before irrigation.";


            document.getElementById(
                "sowingAdvice"
            ).textContent =
                advice.sowing ||
                "Check upcoming weather before field operations.";



            /* -----------------------------------------
               WARNING
            ------------------------------------------ */

            const forecast =
                weather.forecast || [];


            const heavyRain =
                forecast.some(
                    day =>
                        Number(
                            day.rain_mm || 0
                        ) >= 20
                );


            const rainLikely =
                forecast.some(
                    day =>
                        Number(
                            day.rain_probability ||
                            0
                        ) >= 60
                        &&
                        Number(
                            day.rain_mm || 0
                        ) > 0.5
                );


            const warning =
                document.getElementById(
                    "heavyRainWarning"
                );


            if (warning) {

                if (heavyRain) {

                    warning.textContent =
                        advice.heavy_rain_warning ||
                        "Heavy rainfall may occur. Check field drainage.";

                } else if (
                    rainLikely ||
                    isRain
                ) {

                    warning.textContent =
                        advice.heavy_rain_warning ||
                        "Rain is expected. Monitor soil moisture and field conditions.";

                } else {

                    warning.textContent =
                        "No significant weather warning at this time.";
                }
            }



            /* -----------------------------------------
               FORECAST
            ------------------------------------------ */

            displayForecast(
                forecast
            );



            /* -----------------------------------------
               SHOW RESULT
            ------------------------------------------ */

            result.classList.remove(
                "hidden"
            );


            result.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "start"
            });

        }



        /* =================================================
           FORECAST
        ================================================= */

        function displayForecast(
            forecast
        ) {

            const container =
                document.getElementById(
                    "forecastContainer"
                );


            if (!container) {
                return;
            }


            container.innerHTML =
                "";



            if (
                !forecast ||
                !forecast.length
            ) {

                container.innerHTML = `
                    <div
                        style="
                            grid-column:1/-1;
                            padding:20px;
                            text-align:center;
                            color:#718078;
                            font-size:12px;
                        "
                    >
                        Forecast information is currently unavailable.
                    </div>
                `;

                return;
            }



            forecast
                .slice(
                    0,
                    5
                )
                .forEach(
                    day => {


                        const date =
                            new Date(
                                day.date
                            );


                        const dateText =
                            Number.isNaN(
                                date.getTime()
                            )
                                ? String(
                                    day.date ||
                                    "Forecast"
                                )
                                : date.toLocaleDateString(
                                    "en-IN",
                                    {
                                        weekday:
                                            "short",

                                        day:
                                            "numeric",

                                        month:
                                            "short"
                                    }
                                );



                        const weatherText =
                            String(
                                day.weather ||
                                ""
                            );


                        const lower =
                            weatherText.toLowerCase();



                        let icon =
                            "01d";


                        if (
                            lower.includes(
                                "thunderstorm"
                            )
                            ||
                            lower.includes(
                                "thunder"
                            )
                        ) {

                            icon =
                                "11d";

                        } else if (
                            lower.includes(
                                "rain"
                            )
                            ||
                            lower.includes(
                                "drizzle"
                            )
                        ) {

                            icon =
                                "10d";

                        } else if (
                            lower.includes(
                                "cloud"
                            )
                        ) {

                            icon =
                                "03d";

                        } else if (
                            lower.includes(
                                "mist"
                            )
                            ||
                            lower.includes(
                                "fog"
                            )
                            ||
                            lower.includes(
                                "haze"
                            )
                        ) {

                            icon =
                                "50d";
                        }



                        const rain =
                            Number(
                                day.rain_mm ||
                                0
                            );


                        const probability =
                            Number(
                                day.rain_probability ||
                                0
                            );



                        const rainText =
                            rain > 0.05
                                ? `🌧️ ${rain.toFixed(1)} mm`
                                : "☁️ No significant rain";



                        let warning =
                            "No significant rain expected.";


                        if (
                            rain >= 20
                        ) {

                            warning =
                                "⚠️ Heavy rain possible. Check drainage.";

                        } else if (
                            rain > 0.05 &&
                            probability >= 60
                        ) {

                            warning =
                                "🌧️ Rain likely. Monitor soil moisture.";

                        } else if (
                            rain > 0.05
                        ) {

                            warning =
                                "Rain possible. Plan field work carefully.";
                        }



                        const card =
                            document.createElement(
                                "div"
                            );


                        card.className =
                            "forecast-card";


                        card.innerHTML = `

                            <div class="forecast-date">
                                ${escapeHTML(
                                    dateText
                                )}
                            </div>


                            <img
                                src="https://openweathermap.org/img/wn/${icon}@2x.png"
                                alt="${escapeHTML(
                                    weatherText ||
                                    "Weather"
                                )}"
                            >


                            <div class="forecast-weather">
                                ${escapeHTML(
                                    weatherText ||
                                    "Weather"
                                )}
                            </div>


                            <div class="forecast-temp">

                                ${Math.round(
                                    Number(
                                        day.temperature_min ||
                                        0
                                    )
                                )}°C

                                —

                                ${Math.round(
                                    Number(
                                        day.temperature_max ||
                                        0
                                    )
                                )}°C

                            </div>


                            <div class="forecast-rain">
                                ${escapeHTML(
                                    rainText
                                )}
                            </div>


                            <div class="forecast-rain">
                                💧 ${probability}%
                            </div>


                            <div class="forecast-warning">
                                ${escapeHTML(
                                    warning
                                )}
                            </div>

                        `;


                        container.appendChild(
                            card
                        );

                    }
                );
        }



        /* =================================================
           ESCAPE HTML
        ================================================= */

        function escapeHTML(
            value
        ) {

            return String(
                value ?? ""
            )
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                )
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#039;"
                );
        }



        /* =================================================
           CHECK ANOTHER LOCATION
        ================================================= */

        const checkAnotherBtn =
            document.getElementById(
                "checkAnotherBtn"
            );


        if (checkAnotherBtn) {

            checkAnotherBtn.addEventListener(
                "click",
                () => {


                    state.value =
                        "";


                    district.innerHTML =
                        `
                        <option value="">
                            Select State First
                        </option>
                        `;


                    district.disabled =
                        true;


                    city.value =
                        "";

                    village.value =
                        "";


                    city.disabled =
                        true;

                    village.disabled =
                        true;


                    cityList.innerHTML =
                        "";

                    villageList.innerHTML =
                        "";


                    locationType.value =
                        "auto";


                    result.classList.add(
                        "hidden"
                    );


                    hideError();


                    window.scrollTo({
                        top:
                            0,

                        behavior:
                            "smooth"
                    });

                }
            );
        }


    }
);