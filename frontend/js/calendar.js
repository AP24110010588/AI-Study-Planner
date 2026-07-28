/*==================================================
AI STUDY PLANNER
CALENDAR V2
PART 3A-1
==================================================*/
const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");
/*=====================================
MONTH DATA
=====================================*/

const months = [

"January","February","March","April","May","June",

"July","August","September","October","November","December"

];

const weekDays = [

"Sun","Mon","Tue","Wed","Thu","Fri","Sat"

];

/*=====================================
CURRENT DATE
=====================================*/

let today = new Date();

let currentMonth = today.getMonth();

let currentYear = today.getFullYear();

/*=====================================
ELEMENTS
=====================================*/

const calendarGrid = document.getElementById("calendarGrid");

const monthTitle = document.querySelector(".month-bar h2");

const monthButtons = document.querySelectorAll(".month-btn");

const todayButton = document.querySelector(".today-btn");

/*=====================================
DEMO EVENTS
=====================================*/
let calendarEvents = [];

/*=====================================
RENDER CALENDAR
=====================================*/

function renderCalendar(){

calendarGrid.innerHTML="";

monthTitle.innerHTML=

`${months[currentMonth]} ${currentYear}`;

weekDays.forEach(day=>{

calendarGrid.innerHTML+=`

<div class="day-header">

${day}

</div>

`;

});

const firstDay=

new Date(currentYear,currentMonth,1).getDay();

const daysInMonth=

new Date(currentYear,currentMonth+1,0).getDate();

/* Empty Cells */

for(let i=0;i<firstDay;i++){

calendarGrid.innerHTML+=`

<div></div>

`;

}


/* Calendar Days */

for (let day = 1; day <= daysInMonth; day++) {

    let todayClass = "";

    if (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
    ) {
        todayClass = "today";
    }

    const event = calendarEvents.find(e => {

        const d = new Date(e.event_date);

        return (
            d.getFullYear() === currentYear &&
            d.getMonth() === currentMonth &&
            d.getDate() === day
        );

    });

    calendarGrid.innerHTML += `

    <div
        class="calendar-day ${todayClass}"
        data-day="${day}"
    >

        <strong>${day}</strong>

        ${
            event
                ? `<div class="event study">${event.title}</div>`
                : ""
        }

    </div>

    `;

}
activateDaySelection();

}


/*=====================================
SELECT DAY
=====================================*/

function activateDaySelection(){

document

.querySelectorAll(".calendar-day")

.forEach(day=>{

day.addEventListener("click",()=>{

document

.querySelectorAll(".calendar-day")

.forEach(d=>{

d.classList.remove("selected");

});

day.classList.add("selected");

});

});

}


/*=====================================
MONTH NAVIGATION
=====================================*/

monthButtons[0].addEventListener("click",()=>{

currentMonth--;

if(currentMonth<0){

currentMonth=11;

currentYear--;

}

renderCalendar();

});

monthButtons[1].addEventListener("click",()=>{

currentMonth++;

if(currentMonth>11){

currentMonth=0;

currentYear++;

}

renderCalendar();

});

/*=====================================
TODAY BUTTON
=====================================*/

todayButton.addEventListener("click",()=>{

today=new Date();

currentMonth=today.getMonth();

currentYear=today.getFullYear();

renderCalendar();

});

/*=====================================
INITIALIZE
=====================================*/


/*==================================================
CALENDAR V2
PART 3A-2
AI ASSISTANT + EVENT MODAL
==================================================*/

/*=====================================
ELEMENTS
=====================================*/

const aiPrompt = document.getElementById("aiPrompt");

const generateAI = document.getElementById("generateAI");

const aiResult = document.getElementById("aiResult");

const quickButtons = document.querySelectorAll(".quick-prompts button");

const addEventBtn = document.querySelector(".btn.secondary");

const modal = document.getElementById("eventModal");

const closeModal = document.getElementById("closeModal");

const eventForm = document.getElementById("eventForm");

/*=====================================
QUICK PROMPTS
=====================================*/

quickButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        aiPrompt.value=button.innerText;

    });

});

// ==========================================
// GEMINI AI - CALENDAR ASSISTANT
// ==========================================

if (generateAI) {

    generateAI.addEventListener("click", async () => {

        const prompt = aiPrompt.value.trim();

        if (!prompt) {

            alert("Please enter your study request.");

            return;

        }

        try {

            generateAI.disabled = true;

            generateAI.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

            aiResult.innerHTML =
                "<p>🤖 Gemini AI is thinking...</p>";

            const response = await fetch(`${API_URL}/ai/generate-plan`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${localStorage.getItem("token")}`

                },

                body: JSON.stringify({

                    prompt

                })

            });

            const data = await response.json();

            if (data.success) {

                aiResult.innerHTML = `

                <div class="generated-plan">

                    <h3>🤖 AI Calendar Schedule</h3>

                    <p style="white-space:pre-wrap">

                        ${data.plan}

                    </p>

                </div>

                `;

            }

            else {

                aiResult.innerHTML =

                `<p style="color:red">${data.message}</p>`;

            }

        }

        catch(error){

            console.error(error);

            aiResult.innerHTML =

            "<p style='color:red'>Unable to connect to Gemini AI.</p>";

        }

        finally{

            generateAI.disabled = false;

            generateAI.innerHTML =

            '<i class="fa-solid fa-paper-plane"></i> Generate';

        }

    });

}

/*=====================================
EVENT MODAL
=====================================*/

if(addEventBtn){

addEventBtn.addEventListener("click",()=>{

modal.classList.add("show");

});

}

if(closeModal){

closeModal.addEventListener("click",()=>{

modal.classList.remove("show");

});

}

window.addEventListener("click",(e)=>{

if(e.target===modal){

modal.classList.remove("show");

}

});

/*=====================================
SAVE EVENT
=====================================*/

if(eventForm){

eventForm.addEventListener("submit", async (e)=>{

e.preventDefault();

const title = document.getElementById("eventTitle").value;
const description = document.getElementById("eventDescription").value;
const event_date = document.getElementById("eventDate").value;
const start_time = document.getElementById("startTime").value;
const end_time = document.getElementById("endTime").value;
const event_type = document.getElementById("eventType").value;

try{

const response = await fetch("https://ai-study-planner-6q2f.onrender.com/api/calendar",{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${localStorage.getItem("token")}`

},

body:JSON.stringify({

title,

description,

event_date,

start_time,

end_time,

event_type

})

});

const data = await response.json();

if(data.success){

alert("✅ Event Added Successfully");

modal.classList.remove("show");

eventForm.reset();

loadCalendarEvents();

}else{

alert(data.message);

}

}catch(err){

console.error(err);

alert("Server Error");

}

});

}

/*=====================================
TIMELINE EVENTS
=====================================*/

document.querySelectorAll(".slot").forEach(slot=>{

slot.addEventListener("click",()=>{

if(slot.classList.contains("empty")) return;

alert(

`📅 ${slot.innerText}

This event will open a detailed
event page after backend integration.`

);

});

});

/*=====================================
NOTIFICATIONS
=====================================*/

document.querySelectorAll(".notification").forEach(item=>{

item.addEventListener("click",()=>{

alert(

`🔔 Notification

Detailed notification functionality
will be available after backend integration.`

);

});

});

/*=====================================
ANALYTICS
=====================================*/

document.querySelectorAll(".stat").forEach(stat=>{

stat.addEventListener("click",()=>{

alert(

`📊 Calendar Analytics

Real statistics will be loaded
from your database later.`

);

});

});

async function loadCalendarEvents(){

try{

const response = await fetch(

"https://ai-study-planner-6q2f.onrender.com/api/calendar",

{

headers:{

Authorization:`Bearer ${localStorage.getItem("token")}`

}

}

);

const data = await response.json();

if(data.success){

calendarEvents = data.events;
console.log(calendarEvents);

renderCalendar();

loadUpcomingEvents();

loadTimeline();

loadNotifications();

loadAnalytics();

}

}catch(err){

console.error(err);

}

}

loadCalendarEvents();

// ==========================================
// LOAD UPCOMING EVENTS
// ==========================================

function loadUpcomingEvents() {

    const container = document.getElementById("upcomingEventsList");

    if (!container) return;

    container.innerHTML = "";

    const today = new Date();
    today.setHours(0,0,0,0);

    const events = [...calendarEvents]
        .sort((a,b)=>new Date(a.event_date)-new Date(b.event_date));

    events.forEach(event=>{

        container.innerHTML += `

        <div class="event-card">

            <div class="event-dot"></div>

            <div>

                <h3>${event.title}</h3>

                <p>${event.event_date}</p>

            </div>

        </div>

        `;

    });

}
// ==========================================
// LOAD WEEKLY TIMELINE
// ==========================================

function loadTimeline() {

    const container = document.getElementById("timelineContainer");

    if (!container) return;

    container.innerHTML = "";

    if (calendarEvents.length === 0) {

        container.innerHTML = `
            <div class="slot empty">
                No events available.
            </div>
        `;
        return;
    }

    const events = [...calendarEvents].sort((a, b) => {
        return a.start_time.localeCompare(b.start_time);
    });

    events.forEach(event => {

        container.innerHTML += `

        <div class="slot">

            <div class="slot-time">
                ${event.start_time} - ${event.end_time}
            </div>

            <div class="slot-content">

                <h3>${event.title}</h3>

                <p>${event.description || "No description"}</p>

                <small>${event.event_date}</small>

            </div>

        </div>

        `;

    });

}

// ==========================================
// LOAD SMART NOTIFICATIONS
// ==========================================

function loadNotifications() {

    const container = document.getElementById("notificationContainer");

    if (!container) return;

    container.innerHTML = "";

    const today = new Date();

    calendarEvents.forEach(event => {

        const eventDate = new Date(event.event_date);

        const diffDays = Math.ceil(
            (eventDate - today) / (1000 * 60 * 60 * 24)
        );

        let message = "";

        if (diffDays === 0) {
            message = "📅 Event is today.";
        } else if (diffDays === 1) {
            message = "⏰ Event is tomorrow.";
        } else if (diffDays > 1 && diffDays <= 3) {
            message = `⚠️ ${diffDays} days remaining.`;
        } else {
            return;
        }

        container.innerHTML += `
            <div class="notification">
                <strong>${event.title}</strong>
                <p>${message}</p>
            </div>
        `;
    });

    if (container.innerHTML === "") {
        container.innerHTML = `
            <div class="notification">
                <strong>No upcoming notifications</strong>
            </div>
        `;
    }
}

// ==========================================
// LOAD CALENDAR ANALYTICS
// ==========================================

function loadAnalytics() {

    document.getElementById("studySessions").textContent =
        calendarEvents.length;

    const exams = calendarEvents.filter(event =>
        event.event_type &&
        event.event_type.toLowerCase() === "exam"
    );

    document.getElementById("upcomingExams").textContent =
        exams.length;

    const completed = calendarEvents.filter(event => {

        const eventDate = new Date(event.event_date);

        return eventDate < new Date();

    });

    const percentage = calendarEvents.length === 0
        ? 0
        : Math.round((completed.length / calendarEvents.length) * 100);

    document.getElementById("completionRate").textContent =
        percentage + "%";

    document.getElementById("studyStreak").textContent =
        completed.length + " Days";

}