/* ==========================================================
   AI STUDY PLANNER
   dashboard.js
   PART 1
========================================================== */

/* ================================
   API CONFIGURATION
================================ */

const API_URL = "https://ai-study-planner-3nt2.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../pages/login.html";
}

/* ================================
   GLOBAL VARIABLES
================================ */

let dashboardData = {};
let userData = {};

/* ================================
   DOM ELEMENTS
================================ */

// Header

const userName = document.getElementById("userName");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileImage = document.getElementById("profileImage");
const currentDate = document.getElementById("currentDate");

// Loader

const loadingOverlay = document.getElementById("loadingOverlay");

// Statistics

const totalSubjects = document.getElementById("totalSubjects");
const todayTasks = document.getElementById("todayTasks");
const totalNotes = document.getElementById("totalNotes");
const statsStudyHours = document.getElementById("statsStudyHours");
const statsStudyStreak = document.getElementById("statsStudyStreak");
const flashcardCount = document.getElementById("flashcardCount");

// Goal

const goalPercent = document.getElementById("goalPercent");
const goalHours = document.getElementById("goalHours");
const goalRemaining = document.getElementById("goalRemaining");
const goalProgressCircle = document.getElementById("goalProgressCircle");

// Achievement

const achievementStudyHours = document.getElementById("achievementStudyHours");
const achievementStudyStreak = document.getElementById("achievementStudyStreak");
const completedSubjects = document.getElementById("completedSubjects");
const quizAccuracy = document.getElementById("quizAccuracy");

/* ================================
   SHOW LOADER
================================ */

function showLoader() {

    if (loadingOverlay) {

        loadingOverlay.style.display = "flex";

    }

}

/* ================================
   HIDE LOADER
================================ */

function hideLoader() {

    if (loadingOverlay) {

        loadingOverlay.style.display = "none";

    }

}

/* ================================
   CURRENT DATE
================================ */

function updateCurrentDate() {

    if (!currentDate) return;

    currentDate.textContent = new Date().toLocaleDateString(

        "en-US",

        {

            weekday: "long",

            year: "numeric",

            month: "long",

            day: "numeric"

        }

    );

}

/* ================================
   LOAD USER
================================ */

function loadUser() {

    userData = JSON.parse(localStorage.getItem("user")) || {};

    if (userName)
        userName.textContent = userData.name || "Student";

    if (profileName)
        profileName.textContent = userData.name || "Student";

    if (profileEmail)
        profileEmail.textContent = userData.email || "";

    if (profileImage && userData.avatar) {

        profileImage.src = userData.avatar;

    }

}

/* ================================
   LOAD DASHBOARD
================================ */

async function loadDashboard() {

    try {

        showLoader();

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

            throw new Error(result.message);

        }

        dashboardData = result.dashboard;

        loadUser();

        loadStatistics();

        // Part 2 Functions

        loadPlanner();

        loadCalendar();

        loadNotes();

        loadSubjects();

        updateGoalProgress();

        loadAIRecommendations();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load dashboard.");

    }

    finally {

        hideLoader();

    }

}

/* ================================
   DASHBOARD STATISTICS
================================ */

function loadStatistics() {

    if (!dashboardData) return;

    const tasks = dashboardData.todayTasks || [];

    const notes = dashboardData.notes || [];

    totalSubjects.textContent =
        dashboardData.totalSubjects || 0;

    todayTasks.textContent =
        tasks.length;

    totalNotes.textContent =
        dashboardData.totalNotes || notes.length;

    statsStudyHours.textContent =
        `${dashboardData.studyTime || 0} hrs`;

    statsStudyStreak.textContent =
        dashboardData.studyStreak || 0;

    flashcardCount.textContent =
        dashboardData.flashcardCount || 0;

    if (achievementStudyHours) {

        achievementStudyHours.textContent =
            `${dashboardData.studyTime || 0} hrs`;

    }

    if (achievementStudyStreak) {

        achievementStudyStreak.textContent =
            dashboardData.studyStreak || 0;

    }

    if (completedSubjects) {

        completedSubjects.textContent =
            dashboardData.totalSubjects || 0;

    }

    if (quizAccuracy) {

        quizAccuracy.textContent =
            `${dashboardData.quizScore || 0}%`;

    }

}

/* ================================
   INITIALIZE
================================ */

document.addEventListener("DOMContentLoaded", () => {

    updateCurrentDate();

    loadDashboard();

});

/* ==========================================================
   PART 2
   PLANNER
   CALENDAR
   NOTES
   SUBJECTS
   GOAL PROGRESS
==========================================================*/

/* ================================
   TODAY'S PLANNER
================================ */

function loadPlanner() {

    const plannerContainer = document.getElementById("plannerList");

    if (!plannerContainer) return;

    plannerContainer.innerHTML = "";

    const tasks = dashboardData.todayTasks || [];

    if (tasks.length === 0) {

        plannerContainer.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-calendar-xmark"></i>

                <p>No tasks scheduled today.</p>

            </div>

        `;

        return;

    }

    tasks.forEach(task => {

        plannerContainer.innerHTML += `

            <div class="planner-card">

                <h4>${task.title}</h4>

                <p>${task.description || ""}</p>

                <small>

                    ${task.study_date || ""}

                    ${task.start_time || ""}

                    -

                    ${task.end_time || ""}

                </small>

            </div>

        `;

    });

}

/* ================================
   CALENDAR EVENTS
================================ */

async function loadCalendar() {

    const container = document.getElementById("todayEvents");

    if (!container) return;

    container.innerHTML = "";

    try {

        const response = await fetch(

            `${API_URL}/calendar`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if (!result.success) {

            container.innerHTML = `

                <div class="empty-state">

                    <p>No calendar events.</p>

                </div>

            `;

            return;

        }

        const events = result.events || [];

        if (events.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <p>No upcoming events.</p>

                </div>

            `;

            return;

        }

        events.slice(0,5).forEach(event => {

            container.innerHTML += `

                <div class="event-item">

                    <div>

                        <strong>${event.title}</strong>

                        <p>${event.event_date}</p>

                    </div>

                    <span>

                        ${event.start_time || ""}

                    </span>

                </div>

            `;

        });

    }

    catch (err) {

        console.error(err);

        container.innerHTML = `

            <div class="empty-state">

                <p>Unable to load events.</p>

            </div>

        `;

    }

}

/* ================================
   RECENT NOTES
================================ */

function loadNotes() {

    const container = document.getElementById("recentNotes");

    if (!container) return;

    container.innerHTML = "";

    const notes = dashboardData.notes || [];

    if (notes.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-note-sticky"></i>

                <p>No Notes Found.</p>

            </div>

        `;

        return;

    }

    notes.slice(0,5).forEach(note => {

        container.innerHTML += `

            <div class="note-card">

                <h4>${note.title}</h4>

                <p>

                    ${(note.content || "").substring(0,120)}

                </p>

            </div>

        `;

    });

}

/* ================================
   SUBJECT PROGRESS
================================ */

function loadSubjects() {

    const container = document.getElementById("subjectsContainer");

    if (!container) return;

    container.innerHTML = "";

    const subjects = dashboardData.subjects || [];

    if (subjects.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <p>No Subjects Added.</p>

            </div>

        `;

        return;

    }

    subjects.forEach(subject => {

        container.innerHTML += `

            <div class="subject-card">

                <div class="subject-top">

                    <strong>

                        ${subject.subject_name || subject.name}

                    </strong>

                    <span>

                        ${subject.progress || 0}%

                    </span>

                </div>

                <div class="progress-bar">

                    <div

                        class="progress-fill"

                        style="width:${subject.progress || 0}%">

                    </div>

                </div>

            </div>

        `;

    });

}

/* ================================
   GOAL PROGRESS
================================ */

function updateGoalProgress() {

    const percent = dashboardData.goalCompletion || 0;

    if (goalPercent)

        goalPercent.textContent = `${percent}%`;

    if (goalHours)

        goalHours.textContent =

            `${dashboardData.studyTime || 0} hrs`;

    if (goalRemaining)

        goalRemaining.textContent =

            `${Math.max(0,8-(dashboardData.studyTime||0)).toFixed(1)} hrs`;

    if (goalProgressCircle) {

        const radius = 65;

        const circumference =

            2 * Math.PI * radius;

        goalProgressCircle.style.strokeDasharray = circumference;

        goalProgressCircle.style.strokeDashoffset =

            circumference -

            (percent / 100) * circumference;

    }

}

/* ==========================================================
   PART 3
   AI ASSISTANT
   SUBJECT MODAL
   SEARCH
   THEME
   LOGOUT
==========================================================*/

/* ================================
   AI RECOMMENDATIONS
================================ */

function loadAIRecommendations() {

    const container =
        document.getElementById("aiRecommendations");

    if (!container) return;

    const tasks = dashboardData.todayTasks || [];

    container.innerHTML = `

        <div class="ai-card">

            <h3>📚 Today's AI Suggestions</h3>

            <ul>

                <li>

                    You have
                    <strong>${tasks.length}</strong>
                    task(s) today.

                </li>

                <li>

                    Study Streak:
                    <strong>${dashboardData.studyStreak || 0}</strong>
                    days

                </li>

                <li>

                    Total Subjects:
                    <strong>${dashboardData.totalSubjects || 0}</strong>

                </li>

                <li>

                    Flashcards:
                    <strong>${dashboardData.flashcardCount || 0}</strong>

                </li>

                <li>

                    Keep your study streak alive today 🚀

                </li>

            </ul>

        </div>

    `;

}

/* ================================
   REFRESH AI
================================ */

const refreshAI =
document.getElementById("refreshAI");

if(refreshAI){

    refreshAI.addEventListener("click",()=>{

        loadAIRecommendations();

    });

}

/* ================================
   SUBJECT MODAL
================================ */

const addSubjectBtn =
document.getElementById("addSubjectBtn");

const subjectModal =
document.getElementById("subjectModal");

const closeModal =
document.getElementById("closeModal");

if(addSubjectBtn){

    addSubjectBtn.onclick=()=>{

        subjectModal.style.display="flex";

    }

}

if(closeModal){

    closeModal.onclick=()=>{

        subjectModal.style.display="none";

    }

}

window.onclick=(e)=>{

    if(e.target===subjectModal){

        subjectModal.style.display="none";

    }

}

/* ================================
   SAVE SUBJECT
================================ */

const subjectForm =
document.getElementById("subjectForm");

if(subjectForm){

subjectForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const subject_name=
document.getElementById("subjectName").value;

const progress=
document.getElementById("subjectProgress").value;

const color=
document.getElementById("subjectColor").value;

try{

const response=await fetch(

`${API_URL}/subjects`,

{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${token}`

},

body:JSON.stringify({

subject_name,

progress,

color

})

}

);

const result=await response.json();

if(result.success){

alert("Subject Added Successfully");

subjectModal.style.display="none";

subjectForm.reset();

loadDashboard();

}else{

alert(result.message);

}

}catch(err){

console.error(err);

alert("Unable to add subject.");

}

});

}

/* ================================
   SEARCH
================================ */

const searchInput =
document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

document.querySelectorAll(".dashboard-card")

.forEach(card=>{

const text=

card.innerText.toLowerCase();

card.style.display=

text.includes(value)

?

""

:

"none";

});

});

}

/* ================================
   DARK MODE
================================ */

const themeToggle=
document.getElementById("themeToggle");

if(themeToggle){

themeToggle.onclick=()=>{

document.body.classList.toggle("dark");

localStorage.setItem(

"theme",

document.body.classList.contains("dark")

?

"dark"

:

"light"

);

}

}

window.addEventListener("load",()=>{

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}

});

/* ================================
   LOGOUT
================================ */

const logoutBtn=
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=()=>{

localStorage.removeItem("token");

localStorage.removeItem("user");

window.location.href="../pages/login.html";

}

}

/* ================================
   NOTIFICATIONS
================================ */

const notificationBtn=
document.getElementById("notificationBtn");

const notificationPanel=
document.getElementById("notificationPanel");

const closeNotifications=
document.getElementById("closeNotifications");

if(notificationBtn){

notificationBtn.onclick=()=>{

notificationPanel.classList.toggle("show");

}

}

if(closeNotifications){

closeNotifications.onclick=()=>{

notificationPanel.classList.remove("show");

}

}

/* ==========================================================
   PART 4
   FINAL INITIALIZATION
==========================================================*/

/* ================================
   INITIALIZE ALL MODULES
================================ */

function initializeDashboard() {

    updateCurrentDate();

    loadUser();

    loadStatistics();

    loadPlanner();

    loadCalendar();

    loadNotes();

    loadSubjects();

    updateGoalProgress();

    loadAIRecommendations();

}

/* ================================
   SAFE LOADER
================================ */

async function startDashboard() {

    try {

        showLoader();

        await loadDashboard();

    }

    catch (err) {

        console.error(err);

    }

    finally {

        hideLoader();

    }

}

/* ================================
   AUTO REFRESH
================================ */

setInterval(() => {

    loadStatistics();

    loadPlanner();

    loadCalendar();

    loadNotes();

    loadSubjects();

    updateGoalProgress();

}, 60000);

/* ================================
   WINDOW LOAD
================================ */

window.addEventListener("DOMContentLoaded", async () => {

    await startDashboard();

});

/* ================================
   WINDOW FOCUS
================================ */

window.addEventListener("focus", () => {

    loadDashboard();

});

/* ================================
   CONNECTION CHECK
================================ */

window.addEventListener("offline", () => {

    alert("Internet connection lost.");

});

window.addEventListener("online", () => {

    loadDashboard();

});

/* ================================
   ESC CLOSE MODAL
================================ */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        if (subjectModal) {

            subjectModal.style.display = "none";

        }

        if (notificationPanel) {

            notificationPanel.classList.remove("show");

        }

    }

});

/* ================================
   IMAGE FALLBACK
================================ */

if (profileImage) {

    profileImage.onerror = () => {

        profileImage.src =
            "../assets/images/default-avatar.png";

    };

}

/* ================================
   GLOBAL ERROR HANDLER
================================ */

window.onerror = function (

    message,

    source,

    line,

    column,

    error

) {

    console.error(

        "Dashboard Error:",

        message,

        source,

        line,

        column,

        error

    );

};

/* ================================
   DASHBOARD READY
================================ */

console.log(

    "%c AI Study Planner Dashboard Loaded",

    "color:#4F46E5;font-size:16px;font-weight:bold"

);
