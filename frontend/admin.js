/* =========================================================
   AGROAI - ADMIN PANEL JAVASCRIPT

   Dashboard + History + Manage Crops + Analytics
   + Contact Messages
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ADMIN PROTECTION
    ===================================================== */

    const isLoggedIn =
        localStorage.getItem("agroai_logged_in");

    const userRole =
        localStorage.getItem("agroai_role");

    const userEmail =
        localStorage.getItem("agroai_user_email");


    if (
        isLoggedIn !== "true" ||
        (
            userRole !== "admin" &&
            userEmail !== "admin@agroai.com"
        )
    ) {

        window.location.href = "login.html";
        return;

    }


    /* =====================================================
       DATE & TIME
    ===================================================== */

    function updateDateTime() {

        const now = new Date();

        const dateElement =
            document.getElementById("adminDate");

        const timeElement =
            document.getElementById("adminTime");


        if (dateElement) {

            dateElement.textContent =
                now.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                });

        }


        if (timeElement) {

            timeElement.textContent =
                now.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });

        }

    }


    updateDateTime();

    setInterval(updateDateTime, 1000);


    /* =====================================================
       API BASE URL
    ===================================================== */

    const API_URL =
        "http://127.0.0.1:8000";


    /* =====================================================
       CHART VARIABLES
    ===================================================== */

    let cropChart = null;

    let cropShareChart = null;

    let trendChart = null;


    /* =====================================================
       LOAD DASHBOARD
    ===================================================== */

    async function loadDashboard() {

        try {

            const response =
                await fetch(
                    `${API_URL}/admin/dashboard`
                );


            if (!response.ok) {

                throw new Error(
                    "Dashboard request failed"
                );

            }


            const data =
                await response.json();


            /* =============================================
               TOTAL PREDICTIONS
            ============================================= */

            const totalPredictions =
                document.getElementById(
                    "totalPredictions"
                );


            if (totalPredictions) {

                totalPredictions.textContent =
                    data.total_predictions ?? 0;

            }


            /* =============================================
               TOTAL USERS
            ============================================= */

            const totalUsers =
                document.getElementById(
                    "totalUsers"
                );


            if (totalUsers) {

                totalUsers.textContent =
                    data.total_users ?? 0;

            }


            /* =============================================
               MOST PREDICTED CROP
            ============================================= */

            const mostPredictedCrop =
                document.getElementById(
                    "mostPredictedCrop"
                );


            const cropCount =
                document.getElementById(
                    "cropCount"
                );


            let mostCrop = "--";

            let mostCount = 0;


            if (data.most_predicted_crop) {
                console.log("Dashboard API data:", data);
console.log("Most predicted crop:", data.most_predicted_crop);
console.log("Most predicted count:", data.most_crop_count);
                mostCrop =
                    data.most_predicted_crop;

            }


            if (data.most_crop_count !== undefined) {
    mostCount = data.most_crop_count;
}


            if (mostPredictedCrop) {

                mostPredictedCrop.textContent =
                    mostCrop;

            }


            if (cropCount) {

                cropCount.textContent =
                    `${mostCount} predictions`;

            }


            /* =============================================
               AI STATUS
            ============================================= */

            const aiStatus =
                document.getElementById(
                    "aiStatus"
                );


            if (aiStatus) {

                aiStatus.textContent =
                    "Online";

            }

        }

        catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

        }

    }


    /* =====================================================
       LOAD HISTORY
    ===================================================== */

    async function loadHistory() {

        try {

            const response =
                await fetch(
                    `${API_URL}/admin/history`
                );


            if (!response.ok) {

                throw new Error(
                    "History request failed"
                );

            }


            const data =
                await response.json();


            const history =
                data.history || [];


            console.log(
                "Prediction History:",
                history
            );


            /* =============================================
               HISTORY STATS
            ============================================= */

            updateHistoryStats(history);


            /* =============================================
               MAIN HISTORY TABLE
            ============================================= */

            renderHistoryTable(history);


            /* =============================================
               RECENT HISTORY
            ============================================= */

            renderRecentHistory(history);


            /* =============================================
               POPULAR CROPS
            ============================================= */

            renderPopularCrops(history);


            /* =============================================
               THREE ANALYTICS GRAPHS
            ============================================= */

            drawCropBarChart(history);

            drawCropShareChart(history);

            drawPredictionTrendChart(history);

        }

        catch (error) {

            console.error(
                "History Error:",
                error
            );

        }

    }


    /* =====================================================
       UPDATE HISTORY STATS
    ===================================================== */

    function updateHistoryStats(history) {

        const historyTotal =
            document.getElementById(
                "historyTotal"
            );


        const latestPrediction =
            document.getElementById(
                "latestPrediction"
            );


        const uniqueCrops =
            document.getElementById(
                "uniqueCrops"
            );


        if (historyTotal) {

            historyTotal.textContent =
                history.length;

        }


        const cropSet =
            new Set();


        history.forEach(function (item) {

            const crop =
                getCropName(item);


            if (crop) {

                cropSet.add(crop);

            }

        });


        if (uniqueCrops) {

            uniqueCrops.textContent =
                cropSet.size;

        }


        if (latestPrediction) {

            if (history.length > 0) {

                const latest =
                    history[history.length - 1];


                latestPrediction.textContent =
                    getCropName(latest) || "--";

            }

            else {

                latestPrediction.textContent =
                    "--";

            }

        }

    }


    /* =====================================================
       GET CROP NAME
    ===================================================== */

    function getCropName(item) {

        if (!item) {

            return "";

        }


        return (

            item.crop ||

            item.recommended_crop ||

            item.recommendedCrop ||

            item.label ||

            ""

        );

    }


    /* =====================================================
       GET DATE
    ===================================================== */


function getDate(item) {
    if (!item) return "";

    const rawDate =
        item.date ||
        item.datetime ||
        item.dateTime ||
        item.created_at ||
        "";

    if (!rawDate) return "";

    const parsedDate = new Date(rawDate);

    if (Number.isNaN(parsedDate.getTime())) {
        return String(rawDate);
    }

    return parsedDate.toLocaleDateString("en-IN");
}



function getTime(item) {
    if (!item) return "";

    if (item.time) return item.time;

    const rawDate =
        item.datetime ||
        item.dateTime ||
        item.created_at ||
        "";

    if (!rawDate) return "";

    const parsedDate = new Date(rawDate);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}


    /* =====================================================
       HISTORY TABLE
    ===================================================== */

    function renderHistoryTable(history) {

        const tableBody =
            document.getElementById(
                "historyTableBody"
            );


        if (!tableBody) {

            return;

        }


        tableBody.innerHTML = "";


        if (history.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="10">
                        No prediction history available.
                    </td>
                </tr>
            `;

            return;

        }


        history
            .slice()
            .reverse()
            .forEach(function (item, index) {

                const crop =
                    getCropName(item);


                const date =
                    getDate(item);


                const time =
                    getTime(item);



const N = item.nitrogen ?? item.N ?? item.n ?? "-";
const P = item.phosphorus ?? item.P ?? item.p ?? "-";
const K = item.potassium ?? item.K ?? item.k ?? "-";


                const temperature =
                    item.temperature ??
                    "-";


                const humidity =
                    item.humidity ??
                    "-";


                const ph =
                    item.ph ??
                    item.pH ??
                    "-";


                const rainfall =
                    item.rainfall ??
                    "-";


                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${date || "--"}
                        ${time ? `<br>${time}` : ""}
                    </td>

                    <td>
                        ${N}
                    </td>

                    <td>
                        ${P}
                    </td>

                    <td>
                        ${K}
                    </td>

                    <td>
                        ${temperature}
                    </td>

                    <td>
                        ${humidity}
                    </td>

                    <td>
                        ${ph}
                    </td>

                    <td>
                        ${rainfall}
                    </td>

                    <td>
                        <strong>
                            🌾 ${crop || "--"}
                        </strong>
                    </td>
                `;


                tableBody.appendChild(row);

            });

    }


    /* =====================================================
       RECENT HISTORY
    ===================================================== */

    function renderRecentHistory(history) {

        const recentHistory =
            document.getElementById(
                "recentHistory"
            );


        if (!recentHistory) {

            return;

        }


        recentHistory.innerHTML = "";


        if (history.length === 0) {

            recentHistory.innerHTML = `
                <tr>
                    <td colspan="4">
                        No prediction history available.
                    </td>
                </tr>
            `;

            return;

        }


        history
            .slice()
            .reverse()
            .slice(0, 5)
            .forEach(function (item, index) {

                const crop =
                    getCropName(item);


                const date =
                    getDate(item);


                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${date || "--"}
                    </td>

                    <td>

N: ${item.nitrogen ?? item.N ?? item.n ?? "-"}<br>
P: ${item.phosphorus ?? item.P ?? item.p ?? "-"}<br>
K: ${item.potassium ?? item.K ?? item.k ?? "-"}

                    </td>

                    <td>
                        <strong>
                            🌾 ${crop || "--"}
                        </strong>
                    </td>
                `;


                recentHistory.appendChild(row);

            });

    }


    /* =====================================================
       POPULAR CROPS
    ===================================================== */

    function renderPopularCrops(history) {

        const popularCrops =
            document.getElementById(
                "popularCrops"
            );


        if (!popularCrops) {

            return;

        }


        popularCrops.innerHTML = "";


        const cropCounts = {};


        history.forEach(function (item) {

            const crop =
                getCropName(item);


            if (!crop) {

                return;

            }


            cropCounts[crop] =
                (cropCounts[crop] || 0) + 1;

        });


        const sortedCrops =
            Object.entries(cropCounts)
                .sort(function (a, b) {

                    return b[1] - a[1];

                })
                .slice(0, 5);


        if (sortedCrops.length === 0) {

            popularCrops.innerHTML = `
                <div class="empty-state">
                    No crop data available.
                </div>
            `;

            return;

        }


        sortedCrops.forEach(
            function (item, index) {

                const crop =
                    item[0];


                const count =
                    item[1];


                const cropItem =
                    document.createElement(
                        "div"
                    );


                cropItem.className =
                    "popular-crop-item";


                cropItem.innerHTML = `
                    <div>

                        <span class="crop-rank">
                            #${index + 1}
                        </span>

                        <strong>
                            🌾 ${crop}
                        </strong>

                    </div>

                    <span>
                        ${count}
                    </span>
                `;


                popularCrops.appendChild(
                    cropItem
                );

            }
        );

    }


    /* =====================================================
       GRAPH 1
       BAR CHART - MOST RECOMMENDED CROPS
    ===================================================== */

    function drawCropBarChart(history) {

        const canvas =
            document.getElementById(
                "cropChart"
            );


        if (!canvas) {

            return;

        }


        const cropCounts = {};


        history.forEach(function (item) {

            const crop =
                getCropName(item);


            if (!crop) {

                return;

            }


            cropCounts[crop] =
                (cropCounts[crop] || 0) + 1;

        });


        const sorted =
            Object.entries(cropCounts)
                .sort(function (a, b) {

                    return b[1] - a[1];

                });


        const labels =
            sorted.map(function (item) {

                return item[0];

            });


        const values =
            sorted.map(function (item) {

                return item[1];

            });


        if (cropChart) {

            cropChart.destroy();

        }


        cropChart =
            new Chart(
                canvas.getContext("2d"),
                {
                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [

                            {
                                label:
                                    "Recommendations",

                                data: values,

                                borderWidth: 1
                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,


                        plugins: {

                            legend: {

                                display: true

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (context) {

                                            return (
                                                " Recommendations: " +
                                                context.raw
                                            );

                                        }

                                }

                            }

                        },


                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    precision: 0

                                },


                                title: {

                                    display: true,

                                    text:
                                        "Number of Predictions"

                                }

                            },


                            x: {

                                title: {

                                    display: true,

                                    text:
                                        "Crop"

                                }

                            }

                        }

                    }

                }
            );

    }


    /* =====================================================
       GRAPH 2
       DOUGHNUT CHART - CROP RECOMMENDATION SHARE
    ===================================================== */

    function drawCropShareChart(history) {

        const canvas =
            document.getElementById(
                "cropShareChart"
            );


        if (!canvas) {

            return;

        }


        const cropCounts = {};


        history.forEach(function (item) {

            const crop =
                getCropName(item);


            if (!crop) {

                return;

            }


            cropCounts[crop] =
                (cropCounts[crop] || 0) + 1;

        });


        const labels =
            Object.keys(cropCounts);


        const values =
            Object.values(cropCounts);


        if (cropShareChart) {

            cropShareChart.destroy();

        }


        cropShareChart =
            new Chart(
                canvas.getContext("2d"),
                {
                    type: "doughnut",

                    data: {

                        labels: labels,

                        datasets: [

                            {
                                label:
                                    "Crop Share",

                                data: values,

                                borderWidth: 2
                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "58%",


                        plugins: {

                            legend: {

                                position: "right"

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (context) {

                                            const total =
                                                context.dataset.data
                                                    .reduce(
                                                        function (
                                                            sum,
                                                            value
                                                        ) {

                                                            return (
                                                                sum +
                                                                value
                                                            );

                                                        },
                                                        0
                                                    );


                                            const value =
                                                context.raw;


                                            const percentage =
                                                total > 0
                                                    ? (
                                                        value /
                                                        total *
                                                        100
                                                    ).toFixed(1)
                                                    : 0;


                                            return (
                                                " " +
                                                context.label +
                                                ": " +
                                                value +
                                                " (" +
                                                percentage +
                                                "%)"
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }


    /* =====================================================
       GRAPH 3
       LINE CHART - PREDICTION HISTORY TREND
    ===================================================== */

    function drawPredictionTrendChart(history) {

        const canvas =
            document.getElementById(
                "trendChart"
            );


        if (!canvas) {

            return;

        }


        const dateCounts = {};


        history.forEach(function (item) {

            let date =
                getDate(item);


            if (!date) {

                return;

            }


            date =
                String(date);


            dateCounts[date] =
                (dateCounts[date] || 0) + 1;

        });


        const sortedDates =
            Object.keys(dateCounts)
                .sort(function (a, b) {

                    return (
                        new Date(a) -
                        new Date(b)
                    );

                });


        const values =
            sortedDates.map(function (date) {

                return dateCounts[date];

            });


        if (trendChart) {

            trendChart.destroy();

        }


        trendChart =
            new Chart(
                canvas.getContext("2d"),
                {
                    type: "line",

                    data: {

                        labels: sortedDates,

                        datasets: [

                            {
                                label:
                                    "Predictions",

                                data: values,

                                borderWidth: 3,

                                tension: 0.35,

                                fill: false,

                                pointRadius: 4
                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,


                        plugins: {

                            legend: {

                                display: true

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (context) {

                                            return (
                                                " Predictions: " +
                                                context.raw
                                            );

                                        }

                                }

                            }

                        },


                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    precision: 0

                                },


                                title: {

                                    display: true,

                                    text:
                                        "Number of Predictions"

                                }

                            },


                            x: {

                                title: {

                                    display: true,

                                    text:
                                        "Date"

                                }

                            }

                        }

                    }

                }
            );

    }


    /* =====================================================
       LOAD CROPS
    ===================================================== */

    async function loadCrops() {

        try {

            const response =
                await fetch(
                    `${API_URL}/admin/crops`
                );


            if (!response.ok) {

                throw new Error(
                    "Crop request failed"
                );

            }


            const data =
                await response.json();


            const crops =
                data.crops || [];


            renderCrops(crops);

        }

        catch (error) {

            console.error(
                "Load Crops Error:",
                error
            );

        }

    }


    /* =====================================================
       RENDER CROPS
    ===================================================== */

    function renderCrops(crops) {

        const cropList =
            document.getElementById(
                "cropList"
            );


        const cropTotal =
            document.getElementById(
                "cropTotal"
            );


        if (cropTotal) {

            cropTotal.textContent =
                `${crops.length} Crops`;

        }


        if (!cropList) {

            return;

        }


        cropList.innerHTML = "";


        if (crops.length === 0) {

            cropList.innerHTML = `
                <div class="empty-state">
                    No crops available.
                </div>
            `;

            return;

        }



crops.forEach(function (crop) {
    const cropName =
        typeof crop === "string"
            ? crop
            : crop.crop_name;

    if (!cropName) return;

    const item = document.createElement("div");
    item.className = "crop-list-item";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `🌾 ${cropName}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "🗑 Delete";
    deleteButton.addEventListener("click", function () {
        window.deleteCrop(cropName);
    });

    item.appendChild(nameSpan);
    item.appendChild(deleteButton);
    cropList.appendChild(item);
});


    }


    /* =====================================================
       ESCAPE CROP NAME
    ===================================================== */

    function escapeQuotes(value) {

        return String(value)
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'");

    }


    /* =====================================================
       ADD CROP
    ===================================================== */

    window.addCrop =
        async function () {

            const input =
                document.getElementById(
                    "cropName"
                );


            if (!input) {

                return;

            }


            const cropName =
                input.value.trim();


            if (!cropName) {

                alert(
                    "Please enter a crop name."
                );

                input.focus();

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/admin/crops`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },



body: JSON.stringify({
    name: cropName
})


                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "Unable to add crop."
                    );

                }


                alert(
                    data.message ||
                    "Crop added successfully."
                );


                input.value = "";


                loadCrops();

            }

            catch (error) {

                console.error(
                    "Add Crop Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to add crop."
                );

            }

        };


    /* =====================================================
       DELETE CROP
    ===================================================== */

    window.deleteCrop =
        async function (cropName) {

            if (
                !confirm(
                    `Delete "${cropName}"?`
                )
            ) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/admin/crops/${encodeURIComponent(
                            cropName
                        )}`,
                        {
                            method: "DELETE"
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "Unable to delete crop."
                    );

                }


                alert(
                    data.message ||
                    "Crop deleted successfully."
                );


                loadCrops();

            }

            catch (error) {

                console.error(
                    "Delete Crop Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to delete crop."
                );

            }

        };


    /* =====================================================
       CLEAR HISTORY
    ===================================================== */

    window.clearHistory =
        async function () {

            const confirmed =
                confirm(
                    "Are you sure you want to clear all prediction history?"
                );


            if (!confirmed) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/admin/history`,
                        {
                            method: "DELETE"
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "Unable to clear history."
                    );

                }


                alert(
                    data.message ||
                    "Prediction history cleared."
                );


                loadDashboard();

                loadHistory();

            }

            catch (error) {

                console.error(
                    "Clear History Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to clear history."
                );

            }

        };


    /* =====================================================
       CONTACT MESSAGES
    ===================================================== */

    async function loadContactMessages() {

        try {

            const response =
                await fetch(
                    `${API_URL}/admin/contact-messages`
                );


            if (!response.ok) {

                throw new Error(
                    "Contact messages request failed"
                );

            }


            const data =
                await response.json();


            const messages =
                data.messages || [];


            /* =============================================
               UPDATE TOTAL / UNREAD COUNT
            ============================================= */

            const totalMessages =
                document.getElementById(
                    "totalMessages"
                );


            const unreadMessages =
                document.getElementById(
                    "unreadMessages"
                );


            if (totalMessages) {

                totalMessages.textContent =
                    data.total ?? messages.length;

            }


            if (unreadMessages) {

                unreadMessages.textContent =
                    data.unread ?? 0;

            }


            /* =============================================
               MESSAGE LIST
            ============================================= */

            const messagesList =
                document.getElementById(
                    "messagesList"
                );


            if (!messagesList) {

                return;

            }


            messagesList.innerHTML = "";


            if (messages.length === 0) {

                messagesList.innerHTML = `
                    <div class="empty-state">
                        No contact messages available.
                    </div>
                `;

                return;

            }


            /* =============================================
               DISPLAY MESSAGES
            ============================================= */

            messages.forEach(function (message) {

                const messageCard =
                    document.createElement("div");


                messageCard.className =
                    "contact-message-card";


                if (message.status === "unread") {

                    messageCard.classList.add(
                        "unread-message"
                    );

                }


                messageCard.innerHTML = `

                    <div class="contact-message-header">

                        <div>

                            <h3>
                                ${escapeHTML(
                                    message.subject
                                )}
                            </h3>

                            <p>
                                👤
                                ${escapeHTML(
                                    message.name
                                )}
                            </p>

                        </div>


                        <span class="message-date">
                            ${escapeHTML(
                                message.date
                            )}
                        </span>

                    </div>


                    <div class="contact-message-email">

                        📧
                        ${escapeHTML(
                            message.email
                        )}

                    </div>


                    <div class="contact-message-text">

                        ${escapeHTML(
                            message.message
                        )}

                    </div>


                    <div class="contact-message-actions">

                        ${
                            message.status === "unread"

                            ? `

                                <button
                                    type="button"
                                    class="message-read-btn"
                                    onclick="markMessageRead(${message.id})"
                                >
                                    ✓ Mark as Read
                                </button>

                              `

                            : `

                                <span class="message-read-status">
                                    ✓ Read
                                </span>

                              `
                        }


                        <button
                            type="button"
                            class="message-delete-btn"
                            onclick="deleteContactMessage(${message.id})"
                        >
                            🗑 Delete
                        </button>

                    </div>

                `;


                messagesList.appendChild(
                    messageCard
                );

            });

        }

        catch (error) {

            console.error(
                "Contact Messages Error:",
                error
            );


            const messagesList =
                document.getElementById(
                    "messagesList"
                );


            if (messagesList) {

                messagesList.innerHTML = `
                    <div class="empty-state">
                        Unable to load contact messages.
                    </div>
                `;

            }

        }

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent =
            value ?? "";


        return div.innerHTML;

    }


    /* =====================================================
       MARK CONTACT MESSAGE AS READ
    ===================================================== */

    window.markMessageRead =
        async function (messageId) {

            try {

                const response =
                    await fetch(
                        `${API_URL}/admin/contact-messages/${messageId}/read`,
                        {
                            method: "PUT"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to mark message as read."
                    );

                }


                await loadContactMessages();

            }

            catch (error) {

                console.error(
                    "Mark Message Read Error:",
                    error
                );


                alert(
                    "Unable to mark message as read."
                );

            }

        };


    /* =====================================================
       DELETE CONTACT MESSAGE
    ===================================================== */

    window.deleteContactMessage =
        async function (messageId) {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this contact message?"
                );


            if (!confirmed) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/admin/contact-messages/${messageId}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to delete contact message."
                    );

                }


                await loadContactMessages();

            }

            catch (error) {

                console.error(
                    "Delete Contact Message Error:",
                    error
                );


                alert(
                    "Unable to delete contact message."
                );

            }

        };


    /* =====================================================
       LOGOUT
    ===================================================== */

    window.logoutAdmin =
        function () {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {

                return;

            }


            localStorage.removeItem(
                "agroai_logged_in"
            );


            localStorage.removeItem(
                "agroai_role"
            );


            localStorage.removeItem(
                "agroai_user_email"
            );


            window.location.href =
                "login.html";

        };


    /* =====================================================
       NAVIGATION ACTIVE LINK
    ===================================================== */

    const navLinks =
        document.querySelectorAll(
            ".admin-nav a"
        );


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                navLinks.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                if (
                    this.getAttribute("href")
                        .startsWith("#")
                ) {

                    this.classList.add(
                        "active"
                    );

                }

            }
        );

    });


    /* =====================================================
       ENTER KEY FOR ADD CROP
    ===================================================== */

    const cropInput =
        document.getElementById(
            "cropName"
        );


    if (cropInput) {

        cropInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    window.addCrop();

                }

            }
        );

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    loadDashboard();

    loadHistory();

    loadCrops();

    loadContactMessages();

});
