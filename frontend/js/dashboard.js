/* ============================================================
   AI STUDY PLANNER
   dashboard.js
   Part 1
============================================================ */

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../pages/login.html";
}

/* ============================================================
   GLOBAL VARIABLES
============================================================ */

let dashboardData = {};
let weeklyChart = null;

/* ============================================================
   DOM ELEMENTS
============================================================ */

const userName = document.getElementById("userName");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileImage = document.getElementById("profileImage");
const currentDate = document.getElementById("currentDate");

const loadingOverlay = document.getElementById("loadingOverlay");

/* Statistics */

const totalSubjects = document.getElementById("totalSubjects");
const todayTasks = document.getElementById("todayTasks");
const totalNotes = document.getElementById("totalNotes");

const statsStudyHours =
    document.getElementById("statsStudyHours");

const statsStudyStreak =
    document.getElementById("statsStudyStreak");

const flashcardCount =
    document.getElementById("flashcardCount");

const quizScore =
    document.getElementById("quizScore");

const productivityScore =
    document.getElementById("productivityScore");

/* Achievement Cards */

const achievementStudyHours =
    document.getElementById("achievementStudyHours");

const achievementStudyStreak =
    document.getElementById("achievementStudyStreak");

const completedSubjects =
    document.getElementById("completedSubjects");

const quizAccuracy =
    document.getElementById("quizAccuracy");

/* Goal */

const goalPercent =
    document.getElementById("goalPercent");

const goalHours =
    document.getElementById("goalHours");

const goalRemaining =
    document.getElementById("goalRemaining");

/* Containers */

const plannerList =
    document.getElementById("plannerList");

const todayEvents =
    document.getElementById("todayEvents");

const recentNotes =
    document.getElementById("recentNotes");

const subjectsContainer =
    document.getElementById("subjectsContainer");

const recentActivity =
    document.getElementById("recentActivity");

const aiRecommendations =
    document.getElementById("aiRecommendations");
const eventList = document.getElementById("eventList");

const notesList = document.getElementById("notesList");
/* ============================================================
   INITIALIZE
============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

    showLoader();

    updateCurrentDate();

    await loadDashboard();

    hideLoader();
loadCalendar();

 loadNotes();
});

/* ============================================================
   LOAD COMPLETE DASHBOARD
============================================================ */

async function loadDashboard() {

    try {

        const response = await fetch(
            `${API_URL}/dashboard`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        if (!result.success) {

            throw new Error("Dashboard load failed");

        }

       dashboardData = result.dashboard;

loadUser();

loadStatistics();

loadPlanner();

loadCalendar();

loadNotes();

loadSubjects();

updateGoalProgress();

loadAnalytics();

loadAIRecommendations();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load dashboard.");

    }

}

/* ============================================================
   USER INFO
============================================================ */

function loadUser() {

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    userName.textContent =
        user.name || "Student";

    profileName.textContent =
        user.name || "Student";

    profileEmail.textContent =
        user.email || "";

    if (user.avatar) {

        profileImage.src = user.avatar;

    }

}

/* ============================================================
   DASHBOARD STATISTICS
============================================================ */
function loadStatistics() {

    if (!dashboardData) return;

    totalSubjects.textContent =
        dashboardData.totalSubjects || 0;

    todayTasks.textContent =
        dashboardData.todayTasks.length || 0;

    totalNotes.textContent =
        dashboardData.totalNotes || 0;

    statsStudyHours.textContent =
        `${dashboardData.studyTime} hrs`;

    statsStudyStreak.textContent =
        dashboardData.studyStreak || 0;

    flashcardCount.textContent =
        dashboardData.flashcardCount || 0;

    quizScore.textContent =
        `${dashboardData.quizScore || 0}%`;

    productivityScore.textContent =
        `${dashboardData.productivityScore || 0}%`;

    if (achievementStudyHours)
        achievementStudyHours.textContent =
            `${dashboardData.achievements.totalStudyHours} hrs`;

    if (achievementStudyStreak)
        achievementStudyStreak.textContent =
            dashboardData.studyStreak;

    if (completedSubjects)
        completedSubjects.textContent =
            dashboardData.totalSubjects;

    if (quizAccuracy)
        quizAccuracy.textContent =
            `${dashboardData.quizScore}%`;

    if (goalPercent)
        goalPercent.textContent =
            `${dashboardData.goalCompletion}%`;

    if (goalHours)
        goalHours.textContent =
            `${dashboardData.studyTime} hrs`;

    if (goalRemaining)
        goalRemaining.textContent =
            `${Math.max(
                0,
                8 - dashboardData.studyTime
            ).toFixed(1)} hrs`;

}
/* ============================================================
   DATE
============================================================ */

function updateCurrentDate() {

    const options = {

        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"

    };

    currentDate.textContent =
        new Date().toLocaleDateString(
            "en-US",
            options
        );

}

/* ============================================================
   LOADER
============================================================ */

function showLoader() {

    if (loadingOverlay)
        loadingOverlay.style.display = "flex";

}

function hideLoader() {

    if (loadingOverlay)
        loadingOverlay.style.display = "none";

}
function loadPlanner() {

    if (!dashboardData) return;

    const plannerContainer = document.getElementById("plannerList");

    if (!plannerContainer) return;

    plannerContainer.innerHTML = "";

    if (!dashboardData.todayTasks || dashboardData.todayTasks.length === 0) {

        plannerContainer.innerHTML = `
            <div class="empty-state">
                No study tasks for today.
            </div>
        `;

        return;
    }

    dashboardData.todayTasks.forEach(task => {

        plannerContainer.innerHTML += `
            <div class="planner-card">

                <h4>${task.title}</h4>

                <p>${task.description || ""}</p>

                <small>
                    ${task.start_time} - ${task.end_time}
                </small>

            </div>
        `;

    });

}

/* ============================================================
   CALENDAR
============================================================ */
function loadCalendar() {

    if (!dashboardData) return;

    const calendarContainer =
        document.getElementById("calendarEvents");

    if (!calendarContainer) return;

    calendarContainer.innerHTML = "";

    if (!dashboardData.upcoming.length) {

        calendarContainer.innerHTML =
            "<p>No upcoming events.</p>";

        return;

    }

    dashboardData.upcoming.forEach(event => {

        calendarContainer.innerHTML += `

            <div class="calendar-card">

                <strong>${event.title}</strong>

                <br>

                ${event.event_date}

            </div>

        `;

    });

}

/* ============================================================
   RECENT NOTES
============================================================ */
function loadNotes() {

    if (!dashboardData) return;

    const notesContainer =
        document.getElementById("recentNotes");

    if (!notesContainer) return;

    notesContainer.innerHTML = "";

    if (!dashboardData.notes.length) {

        notesContainer.innerHTML =
            "<p>No notes found.</p>";

        return;

    }

    dashboardData.notes.forEach(note => {

        notesContainer.innerHTML += `

            <div class="note-card">

                <h4>${note.title}</h4>

                <p>

                    ${(note.content || "").substring(0,100)}

                </p>

            </div>

        `;

    });

}

/* ============================================================
   SUBJECTS
============================================================ */
function loadSubjects() {

    if (!dashboardData) return;

    const subjectContainer =
        document.getElementById("subjectProgress");

    if (!subjectContainer) return;

    subjectContainer.innerHTML = "";

    dashboardData.subjects.forEach(subject => {

        subjectContainer.innerHTML += `

            <div class="subject-card">

                <h4>${subject.name}</h4>

            </div>

        `;

    });

}

/* ============================================================
   GOAL PROGRESS
============================================================ */
function updateGoalProgress() {

    if (!dashboardData) return;

    const progressBar =
        document.getElementById("goalProgressBar");

    if (progressBar) {

        progressBar.style.width =
            `${dashboardData.goalCompletion}%`;

    }

}
/* ============================================================
   LOAD COMPLETE LEFT PANEL
============================================================ */

function initializeDashboardModules() {

    loadPlanner();

    loadCalendar();

    loadNotes();

    loadSubjects();

    updateGoalProgress();

}

/* ============================================================
   WEEKLY ANALYTICS (Chart.js)
============================================================ */
function loadAnalytics() {

    if (!dashboardData) return;

    console.log("Weekly Hours");

    console.log(
        dashboardData.weeklyStudyHours
    );

}

/* ============================================================
   AI RECOMMENDATIONS
============================================================ */
function loadAIRecommendations() {

    if (!dashboardData) return;

    const aiBox =
        document.getElementById("aiRecommendations");

    if (!aiBox) return;

    aiBox.innerHTML = `

        <ul>

            <li>
                You have
                ${dashboardData.todayTasks.length}
                tasks today.
            </li>

            <li>
                Study streak:
                ${dashboardData.studyStreak}
                days
            </li>

            <li>
                Quiz accuracy:
                ${dashboardData.quizScore}%
            </li>

            <li>
                Productivity:
                ${dashboardData.productivityScore}%
            </li>

        </ul>

    `;

}
/* ============================================================
   RECENT ACTIVITY
============================================================ */

function loadRecentActivity() {

    if (!recentActivity) return;

    recentActivity.innerHTML = "";

    const activities =
        dashboardData.recentActivity || [];

    if (activities.length === 0) {

        recentActivity.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-clock-rotate-left"></i>

                <p>No recent activity.</p>

            </div>

        `;

        return;

    }

    activities.forEach(activity => {

        recentActivity.innerHTML += `

            <div class="activity-item">

                <i class="fa-solid fa-check-circle"></i>

                <div>

                    <strong>

                        ${activity.title}

                    </strong>

                    <p>

                        ${activity.date || ""}

                    </p>

                </div>

            </div>

        `;

    });

}

/* ============================================================
   THEME TOGGLE
============================================================ */

const themeToggle =
    document.getElementById("themeToggle");

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(

            "theme",

            document.body.classList.contains("dark")
                ? "dark"
                : "light"

        );

    });

}

window.addEventListener("load", () => {

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

    }

});

/* ============================================================
   SEARCH
============================================================ */

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value =
            this.value.toLowerCase();

        document.querySelectorAll(".dashboard-card").forEach(card => {

            const text =
                card.innerText.toLowerCase();

            card.style.display =
                text.includes(value)
                    ? ""
                    : "none";

        });

    });

}

/* ============================================================
   LOGOUT
============================================================ */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href =
            "../pages/login.html";

    });

}

/* ============================================================
   EVENT LISTENERS
============================================================ */

const refreshAI =
    document.getElementById("refreshAI");

if (refreshAI) {

    refreshAI.addEventListener(

        "click",

        loadAIRecommendations

    );

}

/* ============================================================
   FINAL INITIALIZATION
============================================================ */

function initializeDashboard() {

    loadAnalytics();

    loadAIRecommendations();

    loadRecentActivity();

}

/* ============================================================
   UPDATE loadDashboard()
============================================================ */

/*
At the end of loadDashboard(), after:

loadUser();
loadStatistics();
initializeDashboardModules();

add ONE MORE LINE:

initializeDashboard();

Final order:

loadUser();
loadStatistics();
initializeDashboardModules();
initializeDashboard();
*/
/* =========================================
   SUBJECT MODAL
========================================= */

const addSubjectBtn = document.getElementById("addSubjectBtn");
const subjectModal = document.getElementById("subjectModal");
const closeModal = document.getElementById("closeModal");

if (addSubjectBtn) {

    addSubjectBtn.addEventListener("click", () => {

        subjectModal.style.display = "flex";

    });

}

if (closeModal) {

    closeModal.addEventListener("click", () => {

        subjectModal.style.display = "none";

    });

}

window.addEventListener("click", (e) => {

    if (e.target === subjectModal) {

        subjectModal.style.display = "none";

    }

});

const subjectForm = document.getElementById("subjectForm");

if (subjectForm) {

    subjectForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const subject_name =
            document.getElementById("subjectName").value;

        const progress =
            document.getElementById("subjectProgress").value;

        const color =
            document.getElementById("subjectColor").value;

        try {

            const response = await fetch(`${API_URL}/subjects`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    subject_name,

                    progress,

                    color

                })

            });

            const result = await response.json();

            if (result.success) {

                alert("Subject Added Successfully");

                subjectModal.style.display = "none";

                subjectForm.reset();

                loadDashboard();

            } else {

                alert(result.message);

            }

        } catch (err) {

            console.error(err);

            alert("Unable to add subject.");

        }

    });

}

async function loadCalendar() {

    if (!eventList) return;

    try {

        const response = await fetch(`${API_URL}/calendar`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!data.success) {

            eventList.innerHTML = `
                <div class="empty-state">
                    <p>Unable to load events.</p>
                </div>
            `;

            return;
        }

        eventList.innerHTML = "";

        const today = new Date();

        const upcomingEvents = data.events
            .filter(event => new Date(event.event_date) >= today)
            .sort((a,b)=>new Date(a.event_date)-new Date(b.event_date))
            .slice(0,5);

        if(upcomingEvents.length===0){

            eventList.innerHTML=`
                <div class="empty-state">
                    <i class="fa-solid fa-calendar-xmark"></i>
                    <p>No upcoming events.</p>
                </div>
            `;

            return;
        }

        upcomingEvents.forEach(event=>{

            eventList.innerHTML+=`

            <div class="event-item">

                <div>

                    <strong>${event.title}</strong>

                    <span>${event.event_date}</span>

                </div>

                <span>

                    ${event.start_time}

                </span>

            </div>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

 loadNotes();