/* =========================================================
   FARMNEXA-AI CHATBOT
   Complete Working Version
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const chatForm =
        document.getElementById("chatForm");

    const chatInput =
        document.getElementById("chatInput");

    const sendButton =
        document.getElementById("sendButton");

    const chatMessages =
        document.getElementById("chatMessages");

    const typingIndicator =
        document.getElementById("typingIndicator");

    const clearChatButton =
        document.getElementById("clearChatButton");

    const screenshotChatButton =
        document.getElementById("screenshotChatButton");

    const micButton =
        document.getElementById("micButton");

    const loginNav =
        document.getElementById("loginNav");

    const logoutNav =
        document.getElementById("logoutNav");

    const faqQuestions =
        document.querySelectorAll(".faq-question");


    /* =====================================================
       API
    ===================================================== */

    const API_URL =
        "http://127.0.0.1:8000/chat";


    /* =====================================================
       CHAT MEMORY
    ===================================================== */

    let conversationHistory = [];


    /* =====================================================
       LOGIN / LOGOUT
    ===================================================== */

    function isLoggedIn() {

        const possibleKeys = [
            "agroai_logged_in",
            "isLoggedIn",
            "loggedIn",
            "userLoggedIn"
        ];

        for (const key of possibleKeys) {

            const value =
                localStorage.getItem(key);

            if (
                value === "true" ||
                value === "1" ||
                value === "yes"
            ) {
                return true;
            }
        }

        return false;
    }


    function updateAuthUI() {

        const loggedIn =
            isLoggedIn();

        if (loggedIn) {

            if (loginNav) {
                loginNav.classList.add("hidden");
            }

            if (logoutNav) {
                logoutNav.classList.remove("hidden");
            }

        } else {

            if (loginNav) {
                loginNav.classList.remove("hidden");
            }

            if (logoutNav) {
                logoutNav.classList.add("hidden");
            }
        }
    }


    updateAuthUI();


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutNav) {

        logoutNav.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "agroai_logged_in"
                );

                localStorage.removeItem(
                    "isLoggedIn"
                );

                localStorage.removeItem(
                    "loggedIn"
                );

                localStorage.removeItem(
                    "userLoggedIn"
                );

                localStorage.removeItem(
                    "agroai_user"
                );

                localStorage.removeItem(
                    "loggedUser"
                );

                window.location.href =
                    "index.html";
            }
        );
    }


    /* =====================================================
       TIME
    ===================================================== */

    function getTime() {

        const now =
            new Date();

        return now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            String(text);

        return div.innerHTML;
    }


    /* =====================================================
       FORMAT AI TEXT
    ===================================================== */

    function formatAIText(text) {

        let safe =
            escapeHTML(text);

        safe = safe.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );

        safe = safe.replace(
            /\n/g,
            "<br>"
        );

        return safe;
    }


    /* =====================================================
       SCROLL
    ===================================================== */

    function scrollToBottom() {

        if (!chatMessages) {
            return;
        }

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    /* =====================================================
       ADD USER MESSAGE
    ===================================================== */

    function addUserMessage(message) {

        const row =
            document.createElement("div");

        row.className =
            "message-row user-row";


        const content =
            document.createElement("div");

        content.className =
            "message-content";


        const bubble =
            document.createElement("div");

        bubble.className =
            "message-bubble";


        const text =
            document.createElement("div");

        text.className =
            "message-text";

        text.textContent =
            message;


        const time =
            document.createElement("div");

        time.className =
            "message-time";

        time.textContent =
            getTime();


        bubble.appendChild(text);

        content.appendChild(bubble);

        content.appendChild(time);

        row.appendChild(content);

        chatMessages.appendChild(row);

        scrollToBottom();
    }


    /* =====================================================
       LANGUAGE DETECTION
    ===================================================== */

    function detectLanguage(text) {

        const value =
            String(text)
                .toLowerCase()
                .trim();


        /* Devanagari */

        if (/[\u0900-\u097F]/.test(value)) {

            const marathiWords = [
                "आहे",
                "काय",
                "कसे",
                "कशी",
                "कुठे",
                "मला",
                "पिक",
                "शेती",
                "पाणी",
                "खत",
                "माती",
                "हवे",
                "करावे",
                "करायचे"
            ];

            for (const word of marathiWords) {

                if (value.includes(word)) {
                    return "mr";
                }
            }

            return "hi";
        }


        /* Hinglish */

        const hinglishWords = [
            "hai",
            "hain",
            "kya",
            "kaise",
            "kaisa",
            "kaisi",
            "mujhe",
            "mera",
            "meri",
            "ke",
            "liye",
            "chahiye",
            "paani",
            "pani",
            "khat",
            "fasal",
            "fasal",
            "mitti",
            "sinchai",
            "karu",
            "kare"
        ];


        for (const word of hinglishWords) {

            const pattern =
                new RegExp(
                    "\\b" +
                    word +
                    "\\b",
                    "i"
                );

            if (pattern.test(value)) {
                return "hinglish";
            }
        }


        return "en";
    }


    /* =====================================================
       ADD AI MESSAGE
    ===================================================== */

    function addAIMessage(message) {

        const row =
            document.createElement("div");

        row.className =
            "message-row bot-row";


        /* =================================================
           AI AVATAR
        ================================================= */

        const avatar =
            document.createElement("div");

        avatar.className =
            "small-avatar";


        const avatarImage =
            document.createElement("img");


        /* =================================================
           FARMNEXA-AI LOGO
           FIXED LOGO PATH
        ================================================= */

        avatarImage.src =
            "./farmnexa-ai-logo.png";

        avatarImage.alt =
            "FarmNexa-AI";


        avatar.appendChild(
            avatarImage
        );


        /* =================================================
           CONTENT
        ================================================= */

        const content =
            document.createElement("div");

        content.className =
            "message-content";


        const bubble =
            document.createElement("div");

        bubble.className =
            "message-bubble";


        const text =
            document.createElement("div");

        text.className =
            "message-text";

        text.innerHTML =
            formatAIText(message);


        /* =================================================
           ACTION BUTTONS
        ================================================= */

        const actions =
            document.createElement("div");

        actions.className =
            "ai-actions";


        /* =================================================
           COPY BUTTON
        ================================================= */

        const copyButton =
            document.createElement("button");

        copyButton.type =
            "button";

        copyButton.className =
            "ai-action-btn";

        copyButton.title =
            "Copy";

        copyButton.textContent =
            "📋";


        copyButton.addEventListener(
            "click",
            async function () {

                try {

                    await navigator.clipboard.writeText(
                        message
                    );

                    copyButton.textContent =
                        "✓";

                    setTimeout(
                        function () {

                            copyButton.textContent =
                                "📋";

                        },
                        1200
                    );

                } catch (error) {

                    copyButton.textContent =
                        "!";
                }
            }
        );


        /* =================================================
           LISTEN BUTTON
        ================================================= */

        const listenButton =
            document.createElement("button");

        listenButton.type =
            "button";

        listenButton.className =
            "ai-action-btn";

        listenButton.title =
            "Listen";

        listenButton.textContent =
            "🔊";


        listenButton.addEventListener(
            "click",
            function () {

                if (
                    !("speechSynthesis" in window)
                ) {
                    return;
                }


                window.speechSynthesis.cancel();


                const speech =
                    new SpeechSynthesisUtterance(
                        message
                    );


                const language =
                    detectLanguage(message);


                if (language === "mr") {

                    speech.lang =
                        "mr-IN";

                } else if (language === "hi") {

                    speech.lang =
                        "hi-IN";

                } else {

                    speech.lang =
                        "en-IN";
                }


                speech.rate =
                    0.95;


                window.speechSynthesis.speak(
                    speech
                );
            }
        );


        actions.appendChild(
            copyButton
        );

        actions.appendChild(
            listenButton
        );


        /* =================================================
           TIME
        ================================================= */

        const time =
            document.createElement("div");

        time.className =
            "message-time";

        time.textContent =
            getTime();


        /* =================================================
           APPEND
        ================================================= */

        bubble.appendChild(text);

        content.appendChild(bubble);

        content.appendChild(actions);

        content.appendChild(time);

        row.appendChild(avatar);

        row.appendChild(content);

        chatMessages.appendChild(row);

        scrollToBottom();
    }


    /* =====================================================
       TYPING
    ===================================================== */

    function showTyping() {

        if (!typingIndicator) {
            return;
        }

        typingIndicator.classList.remove(
            "hidden"
        );

        scrollToBottom();
    }


    function hideTyping() {

        if (!typingIndicator) {
            return;
        }

        typingIndicator.classList.add(
            "hidden"
        );
    }


    /* =====================================================
       LOCAL FARMNEXA-AI KNOWLEDGE ENGINE
    ===================================================== */

    function localAgroAI(question) {

        const original =
            String(question).trim();

        const q =
            original.toLowerCase();


        const language =
            detectLanguage(original);


        /* =================================================
           FOLLOW-UP: WHY
        ================================================= */

        if (
            /^(why|why\?|kyo|kyu|kyun|kyu\?|क्यों|का|का\?)$/i.test(q)
        ) {

            const previousUser =
                [...conversationHistory]
                    .reverse()
                    .find(
                        item =>
                            item.role === "user" &&
                            item.message !== original
                    );


            if (previousUser) {

                if (language === "hi") {

                    return "क्योंकि यह आपके खेत की परिस्थितियों और फसल की आवश्यकताओं पर निर्भर करता है।";

                }

                if (language === "mr") {

                    return "कारण हे तुमच्या शेतातील परिस्थिती आणि पिकाच्या गरजांवर अवलंबून असते.";

                }

                if (language === "hinglish") {

                    return "Kyunki ye aapke farm conditions aur crop ki requirements par depend karta hai.";

                }

                return "Because it depends on your farm conditions and the crop's requirements.";
            }


            return "Please tell me what you would like to know why about.";
        }


        /* =================================================
           GREETING
        ================================================= */

        if (
            /^(hi|hello|hey|hii|namaste|namaskar|नमस्ते|नमस्कार)$/i.test(q)
        ) {

            if (language === "hi") {
                return "नमस्ते! 🌱 मैं FarmNexa-AI हूँ। खेती से जुड़ा आपका सवाल पूछिए.";
            }

            if (language === "mr") {
                return "नमस्कार! 🌱 मी FarmNexa-AI आहे. शेतीशी संबंधित तुमचा प्रश्न विचारा.";
            }

            if (language === "hinglish") {
                return "Hello! 🌱 Main FarmNexa-AI hoon. Farming se related apna question poochiye.";
            }

            return "Hello! 🌱 I'm FarmNexa-AI. Ask me anything about farming.";
        }


        /* =================================================
           BLACK SOIL
        ================================================= */

        if (
            q.includes("black soil") ||
            q.includes("black मिट्टी") ||
            q.includes("काली मिट्टी") ||
            q.includes("काळी माती") ||
            q.includes("black mati")
        ) {

            if (language === "hi") {
                return "काली मिट्टी में कपास, सोयाबीन, अरहर और कुछ अनाज अच्छी तरह उगाए जा सकते हैं।";
            }

            if (language === "mr") {
                return "काळ्या मातीत कापूस, सोयाबीन, तूर आणि काही तृणधान्ये चांगली येतात.";
            }

            if (language === "hinglish") {
                return "Black soil mein cotton, soybean, pigeonpea aur kuch cereals achhe rahte hain.";
            }

            return "Black soil is suitable for crops such as cotton, soybean, pigeonpea and some cereals.";
        }


        /* =================================================
           NPK
        ================================================= */

        if (
            q.includes("npk") ||
            q.includes("nitrogen") ||
            q.includes("phosphorus") ||
            q.includes("potassium")
        ) {

            if (language === "hi") {
                return "NPK में Nitrogen, Phosphorus और Potassium होते हैं। ये पौधों की वृद्धि, जड़ विकास और फसल की गुणवत्ता के लिए महत्वपूर्ण हैं।";
            }

            if (language === "mr") {
                return "NPK मध्ये नायट्रोजन, फॉस्फरस आणि पोटॅशियम असतात. हे पिकाच्या वाढीसाठी आणि उत्पादनासाठी महत्त्वाचे आहेत.";
            }

            if (language === "hinglish") {
                return "NPK mein Nitrogen, Phosphorus aur Potassium hote hain. Ye crop growth aur production ke liye important hain.";
            }

            return "NPK stands for Nitrogen, Phosphorus and Potassium. They are important for crop growth, root development and yield.";
        }


        /* =================================================
           RICE FERTILIZER
        ================================================= */

        if (
            q.includes("rice") &&
            (
                q.includes("fertilizer") ||
                q.includes("fertiliser") ||
                q.includes("खत") ||
                q.includes("khat")
            )
        ) {

            if (language === "hi") {
                return "चावल के लिए संतुलित NPK उर्वरक उपयोग करें। सही मात्रा मिट्टी की जाँच और फसल की अवस्था के अनुसार तय करें।";
            }

            if (language === "mr") {
                return "भातासाठी संतुलित NPK खत वापरा. योग्य मात्रा माती परीक्षण आणि पिकाच्या अवस्थेनुसार ठरवा.";
            }

            if (language === "hinglish") {
                return "Rice ke liye balanced NPK fertilizer use karein. Exact quantity soil test aur crop stage ke according decide karein.";
            }

            return "For rice, use balanced NPK fertilizer. The exact quantity should be based on soil testing and crop stage.";
        }


        /* =================================================
           WATER / IRRIGATION
        ================================================= */

        if (
            q.includes("water") ||
            q.includes("irrigation") ||
            q.includes("पानी") ||
            q.includes("पाणी") ||
            q.includes("pani") ||
            q.includes("sinchai") ||
            q.includes("सिंचाई")
        ) {

            if (language === "hi") {
                return "सिंचाई की आवश्यकता फसल, मिट्टी, मौसम और growth stage पर निर्भर करती है। अधिक पानी देने से बचें।";
            }

            if (language === "mr") {
                return "सिंचनाची गरज पीक, माती, हवामान आणि पिकाच्या अवस्थेवर अवलंबून असते. जास्त पाणी देणे टाळा.";
            }

            if (language === "hinglish") {
                return "Irrigation crop, soil, weather aur growth stage par depend karti hai. Overwatering se bachna chahiye.";
            }

            return "Irrigation needs depend on the crop, soil, weather and growth stage. Avoid overwatering.";
        }


        /* =================================================
           WHEAT
        ================================================= */

        if (
            q.includes("wheat") ||
            q.includes("गेहूं") ||
            q.includes("गहू")
        ) {

            if (language === "hi") {
                return "गेहूं सामान्यतः रबी फसल है और इसे अच्छी जल निकासी वाली मिट्टी तथा नियंत्रित सिंचाई पसंद है।";
            }

            if (language === "mr") {
                return "गहू ही प्रामुख्याने रब्बी पीक आहे. त्यासाठी चांगला निचरा असलेली माती आणि नियंत्रित सिंचन आवश्यक असते.";
            }

            if (language === "hinglish") {
                return "Wheat ek Rabi crop hai. Iske liye well-drained soil aur controlled irrigation important hai.";
            }

            return "Wheat is mainly a Rabi crop and generally performs well in well-drained soil with controlled irrigation.";
        }


        /* =================================================
           COTTON
        ================================================= */

        if (
            q.includes("cotton") ||
            q.includes("कपास") ||
            q.includes("कापूस")
        ) {

            if (language === "hi") {
                return "कपास के लिए अच्छी जल निकासी वाली मिट्टी, पर्याप्त गर्मी और संतुलित पोषण आवश्यक है।";
            }

            if (language === "mr") {
                return "कापसासाठी चांगला निचरा असलेली माती, उबदार हवामान आणि संतुलित पोषण आवश्यक आहे.";
            }

            if (language === "hinglish") {
                return "Cotton ke liye well-drained soil, warm climate aur balanced nutrients important hain.";
            }

            return "Cotton generally needs well-drained soil, warm conditions and balanced nutrient management.";
        }


        /* =================================================
           SOIL pH
        ================================================= */

        if (
            q.includes("soil ph") ||
            q.includes("ph of soil") ||
            q.includes("मिट्टी का ph") ||
            q.includes("मातीचा ph")
        ) {

            if (language === "hi") {
                return "मिट्टी का pH पोषक तत्वों की उपलब्धता को प्रभावित करता है। अधिकांश फसलों के लिए हल्की अम्लीय से तटस्थ मिट्टी उपयुक्त होती है।";
            }

            if (language === "mr") {
                return "मातीचा pH पोषकद्रव्यांची उपलब्धता प्रभावित करतो. अनेक पिकांसाठी किंचित आम्लीय ते तटस्थ माती योग्य असते.";
            }

            if (language === "hinglish") {
                return "Soil pH nutrients ki availability ko affect karta hai. Bahut si crops ke liye slightly acidic se neutral soil suitable hoti hai.";
            }

            return "Soil pH affects nutrient availability. Many crops perform well in slightly acidic to neutral soil.";
        }


        /* =================================================
           PEST CONTROL
        ================================================= */

        if (
            q.includes("pest") ||
            q.includes("pests") ||
            q.includes("कीट") ||
            q.includes("कीटों") ||
            q.includes("किड") ||
            q.includes("किडी")
        ) {

            if (language === "hi") {
                return "कीट नियंत्रण के लिए फसल की नियमित निगरानी करें, शुरुआती लक्षण पहचानें और जरूरत होने पर अनुशंसित नियंत्रण उपाय अपनाएँ।";
            }

            if (language === "mr") {
                return "किड नियंत्रणासाठी पिकाची नियमित पाहणी करा, सुरुवातीची लक्षणे ओळखा आणि गरजेनुसार योग्य नियंत्रण उपाय करा.";
            }

            if (language === "hinglish") {
                return "Pest control ke liye crop ko regularly monitor karein, early symptoms identify karein aur zarurat par recommended control methods use karein.";
            }

            return "Monitor the crop regularly, identify early symptoms and use recommended pest-control measures when needed.";
        }


        /* =================================================
           DISEASE
        ================================================= */

        if (
            q.includes("disease") ||
            q.includes("diseases") ||
            q.includes("बीमारी") ||
            q.includes("रोग") ||
            q.includes("रोगां")
        ) {

            if (language === "hi") {
                return "पत्तियों के रंग, धब्बे, मुड़ना और पौधे की वृद्धि में बदलाव देखें। सही रोग पहचान के लिए स्पष्ट पत्ते की तस्वीर उपयोगी होती है।";
            }

            if (language === "mr") {
                return "पानांचा रंग, डाग, वाकणे आणि वाढीतील बदल तपासा. योग्य रोग ओळखण्यासाठी पानाचा स्पष्ट फोटो उपयुक्त ठरतो.";
            }

            if (language === "hinglish") {
                return "Leaves ka color, spots, curling aur growth changes check karein. Accurate disease identification ke liye clear leaf image useful hoti hai.";
            }

            return "Check leaf color, spots, curling and growth changes. A clear leaf image can help with more accurate disease identification.";
        }


        /* =================================================
           FERTILIZER GENERAL
        ================================================= */

        if (
            q.includes("fertilizer") ||
            q.includes("fertiliser") ||
            q.includes("खाद") ||
            q.includes("उर्वरक") ||
            q.includes("खत") ||
            q.includes("khat")
        ) {

            if (language === "hi") {
                return "उर्वरक का चुनाव फसल और मिट्टी की पोषक स्थिति पर निर्भर करता है। soil test के आधार पर संतुलित पोषण देना बेहतर है।";
            }

            if (language === "mr") {
                return "खताची निवड पीक आणि मातीतील पोषकद्रव्यांवर अवलंबून असते. माती परीक्षणावर आधारित संतुलित पोषण देणे योग्य आहे.";
            }

            if (language === "hinglish") {
                return "Fertilizer crop aur soil nutrients par depend karta hai. Soil test ke basis par balanced nutrition dena better hai.";
            }

            return "Fertilizer choice depends on the crop and soil nutrient status. Balanced nutrition based on soil testing is recommended.";
        }


        /* =================================================
           TEMPERATURE
        ================================================= */

        if (
            q.includes("temperature") ||
            q.includes("तापमान") ||
            q.includes("tapman")
        ) {

            if (language === "hi") {
                return "फसल के लिए उपयुक्त तापमान फसल की किस्म और growth stage पर निर्भर करता है।";
            }

            if (language === "mr") {
                return "पिकासाठी योग्य तापमान पिकाची जात आणि वाढीच्या अवस्थेवर अवलंबून असते.";
            }

            if (language === "hinglish") {
                return "Suitable temperature crop ki variety aur growth stage par depend karta hai.";
            }

            return "Suitable temperature depends on the crop variety and its growth stage.";
        }


        /* =================================================
           RAINFALL
        ================================================= */

        if (
            q.includes("rainfall") ||
            q.includes("rain") ||
            q.includes("बारिश") ||
            q.includes("पाऊस") ||
            q.includes("paus")
        ) {

            if (language === "hi") {
                return "बारिश की आवश्यकता फसल, मिट्टी और मौसम पर निर्भर करती है। अत्यधिक पानी से जलभराव हो सकता है।";
            }

            if (language === "mr") {
                return "पावसाची गरज पीक, माती आणि हवामानावर अवलंबून असते. जास्त पावसामुळे पाणी साचू शकते.";
            }

            if (language === "hinglish") {
                return "Rainfall requirement crop, soil aur weather par depend karti hai. Excess water se waterlogging ho sakti hai.";
            }

            return "Rainfall requirements depend on the crop, soil and weather. Excess water can cause waterlogging.";
        }


        /* =================================================
           CROP RECOMMENDATION
        ================================================= */

        if (
            q.includes("which crop") ||
            q.includes("suitable crop") ||
            q.includes("best crop") ||
            q.includes("kaunsi fasal") ||
            q.includes("konsi fasal") ||
            q.includes("कौन सी फसल") ||
            q.includes("कौनसी फसल")
        ) {

            if (language === "hi") {
                return "उपयुक्त फसल बताने के लिए मिट्टी, NPK, तापमान, humidity, pH और rainfall की जानकारी जरूरी है। Crop Recommendation page पर ये values भरें।";
            }

            if (language === "mr") {
                return "योग्य पीक सांगण्यासाठी माती, NPK, तापमान, humidity, pH आणि rainfall ची माहिती आवश्यक आहे. Crop Recommendation पेजवर ही माहिती भरा.";
            }

            if (language === "hinglish") {
                return "Suitable crop batane ke liye soil, NPK, temperature, humidity, pH aur rainfall details chahiye. Crop Recommendation page par ye values enter karein.";
            }

            return "For a suitable crop recommendation, soil, NPK, temperature, humidity, pH and rainfall information are needed. Enter these values on the Crop Recommendation page.";
        }


        /* =================================================
           HELP
        ================================================= */

        if (
            q.includes("help") ||
            q.includes("what can you do") ||
            q.includes("aap kya kar") ||
            q.includes("आप क्या कर")
        ) {

            if (language === "hi") {
                return "मैं crops, soil, NPK, irrigation, fertilizer, pests और basic farming questions में मदद कर सकता हूँ।";
            }

            if (language === "mr") {
                return "मी पिके, माती, NPK, सिंचन, खत, किडी आणि शेतीशी संबंधित मूलभूत प्रश्नांमध्ये मदत करू शकतो.";
            }

            if (language === "hinglish") {
                return "Main crops, soil, NPK, irrigation, fertilizer, pests aur basic farming questions mein help kar sakta hoon.";
            }

            return "I can help with crops, soil, NPK, irrigation, fertilizer, pests and basic farming questions.";
        }


        /* =================================================
           DEFAULT RESPONSE
        ================================================= */

        if (language === "hi") {
            return "मैं इस farming question के लिए उपलब्ध जानकारी के आधार पर मदद कर सकता हूँ। कृपया अपना सवाल थोड़ा specific बताएं।";
        }

        if (language === "mr") {
            return "या शेतीशी संबंधित प्रश्नासाठी मला थोडी अधिक specific माहिती द्या, म्हणजे मी योग्य उत्तर देऊ शकेन.";
        }

        if (language === "hinglish") {
            return "Main is farming question mein help kar sakta hoon. Please question thoda specific batayein.";
        }

        return "I can help with farming-related questions. Please make your question a little more specific.";
    }


    /* =====================================================
       BACKEND CHAT
    ===================================================== */

    async function getBackendAnswer(message) {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


        let data = null;

        try {

            data =
                await response.json();

        } catch (error) {

            data = null;
        }


        if (!response.ok) {

            throw new Error(
                data &&
                data.detail
                    ? data.detail
                    : "Backend unavailable."
            );
        }


        if (
            !data ||
            !data.success ||
            !data.answer
        ) {

            throw new Error(
                "Invalid backend response."
            );
        }


        return data.answer;
    }


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    async function sendMessage(message) {

        message =
            String(message).trim();


        if (!message) {
            return;
        }


        /* Prevent duplicate request */

        if (
            sendButton &&
            sendButton.disabled
        ) {
            return;
        }


        addUserMessage(message);


        conversationHistory.push({
            role: "user",
            message: message
        });


        if (chatInput) {
            chatInput.value = "";
        }


        autoResize();


        if (sendButton) {
            sendButton.disabled = true;
        }


        showTyping();


        let answer = null;


        try {

            /* =============================================
               TRY BACKEND FIRST
            ============================================= */

            answer =
                await getBackendAnswer(
                    message
                );


        } catch (error) {

            console.warn(
                "Backend AI unavailable. Using local FarmNexa-AI engine.",
                error
            );


            /* =============================================
               LOCAL FALLBACK
            ============================================= */

            answer =
                localAgroAI(
                    message
                );
        }


        hideTyping();


        if (!answer) {

            answer =
                localAgroAI(
                    message
                );
        }


        conversationHistory.push({
            role: "assistant",
            message: answer
        });


        addAIMessage(
            answer
        );


        if (sendButton) {
            sendButton.disabled = false;
        }


        if (chatInput) {
            chatInput.focus();
        }
    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    if (chatForm) {

        chatForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (!chatInput) {
                    return;
                }

                sendMessage(
                    chatInput.value
                );
            }
        );
    }


    /* =====================================================
       ENTER KEY
    ===================================================== */

    if (chatInput) {

        chatInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();


                    if (
                        !sendButton ||
                        !sendButton.disabled
                    ) {

                        sendMessage(
                            chatInput.value
                        );
                    }

                    return;
                }


                /* Shift + Enter = new line */
            }
        );
    }


    /* =====================================================
       AUTO RESIZE
    ===================================================== */

    function autoResize() {

        if (!chatInput) {
            return;
        }


        chatInput.style.height =
            "auto";


        chatInput.style.height =
            Math.min(
                chatInput.scrollHeight,
                150
            ) + "px";
    }


    if (chatInput) {

        chatInput.addEventListener(
            "input",
            autoResize
        );
    }


    /* =====================================================
       FAQ BUTTONS
    ===================================================== */

    faqQuestions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const question =
                        button.dataset.question;


                    if (!question) {
                        return;
                    }


                    sendMessage(
                        question
                    );
                }
            );
        }
    );


    /* =====================================================
       CLEAR CHAT
    ===================================================== */

    if (clearChatButton) {

        clearChatButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    window.confirm(
                        "Clear the chat?"
                    );


                if (!confirmed) {
                    return;
                }


                conversationHistory = [];


                chatMessages.innerHTML =
                    "";


                addAIMessage(
                    "Hello! I'm FarmNexa-AI. How can I help you with farming today?"
                );
            }
        );
    }


    /* =====================================================
       PRINT CHAT
    ===================================================== */

    if (screenshotChatButton) {

        screenshotChatButton.addEventListener(
            "click",
            function () {

                window.print();
            }
        );
    }


    /* =====================================================
       MICROPHONE
    ===================================================== */

    let recognition = null;


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (SpeechRecognition && micButton) {

        recognition =
            new SpeechRecognition();


        recognition.continuous =
            false;


        recognition.interimResults =
            false;


        recognition.lang =
            "en-IN";


        recognition.onstart =
            function () {

                micButton.classList.add(
                    "recording"
                );
            };


        recognition.onend =
            function () {

                micButton.classList.remove(
                    "recording"
                );
            };


        recognition.onresult =
            function (event) {

                const transcript =
                    event.results[0][0].transcript;


                chatInput.value =
                    transcript;


                autoResize();


                chatInput.focus();
            };


        recognition.onerror =
            function () {

                micButton.classList.remove(
                    "recording"
                );
            };


        micButton.addEventListener(
            "click",
            function () {

                try {

                    recognition.start();

                } catch (error) {

                    console.log(
                        "Microphone already active."
                    );
                }
            }
        );

    } else if (micButton) {

        micButton.addEventListener(
            "click",
            function () {

                alert(
                    "Voice input is not supported in this browser."
                );
            }
        );
    }


    /* =====================================================
       INITIAL FOCUS
    ===================================================== */

    if (chatInput) {
        chatInput.focus();
    }

});