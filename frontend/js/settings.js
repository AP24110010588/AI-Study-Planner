/*==================================================
AI STUDY PLANNER
SETTINGS MODULE
==================================================*/

const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

/*=====================================
ELEMENTS
=====================================*/

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const language = document.getElementById("language");
const timeZone = document.getElementById("timeZone");
const theme = document.getElementById("theme");
const fontSize = document.getElementById("fontSize");

const studyReminder = document.getElementById("studyReminder");
const emailNotifications = document.getElementById("emailNotifications");
const quizReminder = document.getElementById("quizReminder");
const achievementAlerts = document.getElementById("achievementAlerts");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

/*=====================================
CHECK LOGIN
=====================================*/

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

/*=====================================
LOAD SETTINGS
=====================================*/

async function loadSettings() {

    try {

        const response = await fetch(`${API_URL}/settings`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        fullName.value = data.full_name || "";
        email.value = data.email || "";

        language.value = data.preferences.language || "English";
        timeZone.value = data.preferences.timeZone || "Asia/Kolkata";

        theme.value = data.preferences.theme || "Light";
        fontSize.value = data.preferences.fontSize || "Medium";

        studyReminder.checked =
            data.preferences.notifications.studyReminder;

        emailNotifications.checked =
            data.preferences.notifications.emailNotifications;

        quizReminder.checked =
            data.preferences.notifications.quizReminder;

        achievementAlerts.checked =
            data.preferences.notifications.achievementAlerts;

        applyTheme();

    }

    catch (error) {

        console.error(error);

    }

}

/*=====================================
SAVE SETTINGS
=====================================*/

async function saveSettings() {

    try {

        const response = await fetch(`${API_URL}/settings`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                full_name: fullName.value,

                email: email.value,

                preferences: {

                    language: language.value,

                    timeZone: timeZone.value,

                    theme: theme.value,

                    fontSize: fontSize.value,

                    notifications: {

                        studyReminder: studyReminder.checked,

                        emailNotifications: emailNotifications.checked,

                        quizReminder: quizReminder.checked,

                        achievementAlerts: achievementAlerts.checked

                    }

                }

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Settings saved successfully.");

    }

    catch (error) {

        console.error(error);

    }

}

/*=====================================
RESET
=====================================*/

function resetSettings() {

    if (!confirm("Reset all settings?")) return;

    language.value = "English";
    timeZone.value = "Asia/Kolkata";

    theme.value = "Light";
    fontSize.value = "Medium";

    studyReminder.checked = true;
    emailNotifications.checked = true;
    quizReminder.checked = false;
    achievementAlerts.checked = true;

    applyTheme();

}

/*=====================================
THEME
=====================================*/

function applyTheme() {

    if (theme.value === "Dark") {

        document.body.classList.add("dark-mode");

    } else {

        document.body.classList.remove("dark-mode");

    }

    localStorage.setItem("theme", theme.value);

}

/*=====================================
FONT SIZE
=====================================*/

function applyFontSize() {

    switch (fontSize.value) {

        case "Small":

            document.documentElement.style.fontSize = "14px";

            break;

        case "Large":

            document.documentElement.style.fontSize = "18px";

            break;

        default:

            document.documentElement.style.fontSize = "16px";

    }

}

/*=====================================
EVENTS
=====================================*/

saveBtn.addEventListener("click", saveSettings);

resetBtn.addEventListener("click", resetSettings);

theme.addEventListener("change", applyTheme);

fontSize.addEventListener("change", applyFontSize);

/*=====================================
LOAD PAGE
=====================================*/

window.addEventListener("load", () => {
    

    loadSettings();

    applyTheme();

    applyFontSize();

});