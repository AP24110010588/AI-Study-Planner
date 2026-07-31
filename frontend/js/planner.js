// ==========================================
// AI STUDY PLANNER - Planner Module
// ==========================================
const API_URL = "https://ai-study-planner-3nt2.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

// Logged In User
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
    console.log("Welcome", user.full_name);
}

// ==========================================
// Modal Selectors (Targeting Overlay Container)
// ==========================================
const plannerModal = document.getElementById("plannerModal"); // The overlay wrapper
const addPlannerBtn = document.getElementById("addPlannerBtn");
const closePlannerModal = document.getElementById("closePlannerModal");
const plannerForm = document.getElementById("plannerForm");
let editingTaskId = null;

// Open Modal (Toggling the 'show' class from CSS)
if (addPlannerBtn && plannerModal) {
    addPlannerBtn.onclick = () => {
        plannerModal.classList.add("show");
    };
}

// Close Modal
if (closePlannerModal && plannerModal) {
    closePlannerModal.onclick = () => {
        plannerModal.classList.remove("show");
    };
}

// Close Outside
window.onclick = function (e) {
    if (e.target === plannerModal) {
        plannerModal.classList.remove("show");
    }
};

// ==========================================
// UI Containers & Elements
// ==========================================
const plannerList = document.getElementById("plannerList");
const upcomingTasks = document.getElementById("upcomingTasks");
const todoContainer = document.getElementById("todoContainer");
const progressContainer = document.getElementById("progressContainer");
const completedContainer = document.getElementById("completedContainer");

// ==========================================
// CALENDAR ELEMENTS
// ==========================================

const plannerCalendar =
    document.getElementById("plannerCalendar");

const calendarMonth =
    document.getElementById("calendarMonth");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

let currentDate = new Date();
// Statistics Elements
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressFill = document.getElementById("progressFill");
const progressPercentage = document.getElementById("progressPercentage");

// Kanban Counters
const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const completedCount = document.getElementById("completedCount");

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    loadPlanner();
});

// ==========================================
// LOAD PLANNER TASKS
// ==========================================
async function loadPlanner() {
    try {
        console.log("Sending Request...");
        const response = await fetch(`${API_URL}/planner`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
            return;
        }

        renderPlanner(data.tasks);
    } catch (err) {
        console.error(err);
    }
}

// ==========================================
// RENDER PLANNER DATA
// ==========================================

function renderPlanner(tasks) {
    // Clear elements
    window.plannerTasks = tasks;
    plannerList.innerHTML = "";
    upcomingTasks.innerHTML = "";
    todoContainer.innerHTML = "";
    progressContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    let total = tasks.length;
    let completed = 0;
    let todoNum = 0;
    let progressNum = 0;

    tasks.forEach(task => {
        if (task.completed) completed++;

        // 1. Render Today's Tasks View
        plannerList.innerHTML += `
<div class="task">

    <input type="checkbox" ${task.completed ? "checked" : ""} disabled />

    <div>
        <strong>${task.title}</strong>
        <p>${task.study_date}</p>
    </div>

    <div class="task-right">

    <span>${task.start_time} - ${task.end_time}</span>

    <button
        class="edit-btn"
        onclick="editTask('${task.id}')">

        ✏️ Edit

    </button>

    <button
        class="delete-btn"
        onclick="deleteTask('${task.id}')">

        🗑 Delete

    </button>

</div>

</div>
`;

        // 2. Render Upcoming List
        upcomingTasks.innerHTML += `
        <div class="upcoming-card">
            <h4>${task.title}</h4>
            <small>${task.study_date} (${task.start_time})</small>
        </div>`;

        // 3. Render Kanban Card layout matching CSS styles
       const card = `
        <div
            class="task-card ${task.completed ? "completed-card" : ""}"
            draggable="true"
            data-id="${task.id}">
            <h4>${task.title}</h4>
            <p>${task.description || "No description provided."}</p>
            <div class="task-footer">
                <small><i class="fa-regular fa-clock"></i> ${task.start_time} - ${task.end_time}</small>
            </div>
        </div>`;

        // Map database status structure safely
        const taskStatus = (task.status || "todo").trim().toLowerCase();

switch (taskStatus) {

    case "completed":

        completedContainer.innerHTML += card;
        completed++;
        break;

    case "progress":

    case "in progress":

        progressContainer.innerHTML += card;
        progressNum++;
        break;

    default:

        todoContainer.innerHTML += card;
        todoNum++;
}
    });

    // Update Counter Panels
    totalTasks.innerHTML = total;
    completedTasks.innerHTML = completed;
    pendingTasks.innerHTML = total - completed;
    
    if (todoCount) todoCount.innerHTML = todoNum;
    if (completedCount) completedCount.innerHTML = completed;
    if (progressCount) progressCount.innerHTML = progressNum;

    // Calculate percentage values
    let percentage = 0;
    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    if (progressPercentage) progressPercentage.innerHTML = percentage + "%";
    if (progressFill) progressFill.style.width = percentage + "%";
    renderCalendar();
    loadDeadlines();

    loadWeeklyGoals();

    loadProductivityAnalytics();

    checkReminders();
}

// ==========================================
// ADD PLANNER TASK SUBMIT
// ==========================================
plannerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("plannerTitle").value.trim();
    const description = document.getElementById("plannerDescription").value.trim();
    const study_date = document.getElementById("plannerDate").value;
    const start_time = document.getElementById("plannerStartTime").value;
    const end_time = document.getElementById("plannerEndTime").value;
    const priority = document.getElementById("plannerPriority") ? document.getElementById("plannerPriority").value : "Medium";
const status = document.getElementById("plannerStatus") ? document.getElementById("plannerStatus").value : "todo";

    if (!title || !study_date || !start_time || !end_time) {
        alert("Please fill all required fields.");
        return;
    }

    try {
        const url = editingTaskId
    ? `${API_URL}/planner/${editingTaskId}`
    : `${API_URL}/planner`;

const method = editingTaskId ? "PUT" : "POST";

const response = await fetch(url, {
    method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
    title,
    description,
    study_date,
    start_time,
    end_time,
    priority,
    status,
    completed: status === "completed"
})
        });

        const data = await response.json();

        if (data.success) {
           alert(
    editingTaskId
        ? "Task Updated Successfully ✅"
        : "Task Added Successfully ✅"
);
            plannerForm.reset();
            editingTaskId = null;
            plannerModal.classList.remove("show"); // Close out matching modern wrapper rules
            loadPlanner();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Unable to save task.");
    }
});
// ==========================================
// GEMINI AI SMART PLANNER INTEGRATION
// ==========================================
const aiPromptInput = document.getElementById("aiPrompt");
const generatePlanBtn = document.querySelector(".ai-smart-panel #generatePlan");
const aiOutputContainer = document.getElementById("aiOutput");
const aiLoader = document.getElementById("aiLoader");

if (generatePlanBtn && aiPromptInput && aiOutputContainer) {
    generatePlanBtn.addEventListener("click", async () => {
        const promptText = aiPromptInput.value.trim();

        if (!promptText) {
            alert("Please type a study request first!");
            return;
        }

        // 1. Show the fullscreen loader screen you built in your HTML
       aiOutputContainer.innerHTML = `
<div class="ai-thinking">

    <div class="thinking-spinner"></div>

    <h3>🤖 Gemini AI is thinking...</h3>

    <p id="thinkingText">
        Understanding your request...
    </p>

</div>
`;

const thinkingText = document.getElementById("thinkingText");

const messages = [

    "Understanding your request...",

    "Analyzing your syllabus...",

    "Creating your study schedule...",

    "Optimizing the timetable...",

    "Almost finished..."

];

let current = 0;

const thinkingAnimation = setInterval(() => {

    thinkingText.textContent = messages[current];

    current = (current + 1) % messages.length;

}, 1200);

        try {
            const response = await fetch(`${API_URL}/ai/generate-plan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: promptText })
            });

            const data = await response.json();

            if (data.success) {
                // 2. Format and inject the AI results elegantly into the dashboard container
                aiOutputContainer.innerHTML = `
                    <div class="generated-plan">
                        <h3 style="margin-bottom: 15px; color: #4F46E5;"><i class="fa-solid fa-robot"></i> Your Custom AI Schedule</h3>
                        <p style="white-space: pre-wrap; line-height: 1.7; color: #1E293B;">${data.plan}</p>
                    </div>
                `;
            } else {
                alert(data.message || "Something went wrong generating your plan.");
            }
        } catch (err) {
            console.error("AI Error:", err);
            alert("Failed to communicate with AI server.");
        } finally {
            // 3. Turn off loading modal overlays cleanly
     clearInterval(thinkingAnimation);
        }
    });
}

// 4. Connect quick-prompt suggestion buttons
document.querySelectorAll(".quick-prompts .suggestion").forEach(button => {
    button.addEventListener("click", () => {
        if (aiPromptInput) {
            aiPromptInput.value = `Create a detailed schedule for: ${button.innerText.trim()}`;
            // Automatically focus the input for the user
            aiPromptInput.focus();
        }
    });
});

// ==========================================
// DELETE TASK
// ==========================================



async function deleteTask(id) {

    if (!confirm("Delete this task?")) return;

    try {

        const response = await fetch(`${API_URL}/planner/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (data.success) {

            alert("Task Deleted Successfully");

            loadPlanner();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

    }

}



function editTask(id) {

    editingTaskId = id;

    const task = window.plannerTasks.find(t => t.id === id);

    if (!task) return;

    document.getElementById("plannerTitle").value = task.title || "";
    document.getElementById("plannerDescription").value = task.description || "";
    document.getElementById("plannerDate").value = task.study_date || "";
    document.getElementById("plannerStartTime").value = task.start_time || "";
    document.getElementById("plannerEndTime").value = task.end_time || "";

    if (document.getElementById("plannerPriority"))
        document.getElementById("plannerPriority").value = task.priority || "Medium";

    if (document.getElementById("plannerStatus"))
        document.getElementById("plannerStatus").value = task.status || "todo";

    plannerModal.classList.add("show");

}

// ==========================================
// DRAG & DROP KANBAN
// ==========================================

let draggedTask = null;

document.addEventListener("dragstart", (e) => {

    if (e.target.classList.contains("task-card")) {

        draggedTask = e.target;

    }

});

[
    todoContainer,
    progressContainer,
    completedContainer
].forEach(container => {

    container.addEventListener("dragover", (e) => {

        e.preventDefault();

    });

    container.addEventListener("drop", async (e) => {

        e.preventDefault();

        if (!draggedTask) return;

        container.appendChild(draggedTask);

        const taskId = draggedTask.dataset.id;

        let status = "todo";

        if (container.id === "progressContainer") {

            status = "progress";

        }

        if (container.id === "completedContainer") {

            status = "completed";

        }

        await updateTaskStatus(taskId, status);
        draggedTask = null;

    });

});

// ==========================================
// UPDATE TASK STATUS
// ==========================================

async function updateTaskStatus(taskId, status) {

    try {

        const response = await fetch(

            `${API_URL}/planner/${taskId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    status,

                    completed: status === "completed"

                })

            }

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

        }

        loadPlanner();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// RENDER STUDY CALENDAR
// ==========================================

function renderCalendar() {

    if (!plannerCalendar) return;

    plannerCalendar.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];

    calendarMonth.textContent =
        `${monthNames[month]} ${year}`;

    const firstDay =
        new Date(year, month, 1).getDay();

    const totalDays =
        new Date(year, month + 1, 0).getDate();

    // Empty cells

    for (let i = 0; i < firstDay; i++) {

        plannerCalendar.innerHTML +=
            `<div class="calendar-empty"></div>`;

    }

    // Days

    for (let day = 1; day <= totalDays; day++) {

        const fullDate =

            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const hasTask =

            window.plannerTasks?.some(

                task => task.study_date === fullDate

            );

        const today = new Date().toISOString().split("T")[0];

plannerCalendar.innerHTML += `

<div
    class="calendar-day
        ${hasTask ? "has-task" : ""}
        ${fullDate === today ? "today" : ""}"
    data-date="${fullDate}">

    ${day}

</div>

`;

    }

}

// ==========================================
// CALENDAR NAVIGATION
// ==========================================

prevMonth?.addEventListener("click", () => {

    currentDate.setMonth(

        currentDate.getMonth() - 1

    );

    renderCalendar();

});

nextMonth?.addEventListener("click", () => {

    currentDate.setMonth(

        currentDate.getMonth() + 1

    );

    renderCalendar();

});

// ==========================================
// CLICK CALENDAR DATE
// ==========================================

plannerCalendar.addEventListener("click", (e) => {

    if (!e.target.classList.contains("calendar-day")) return;

    const selectedDate = e.target.dataset.date;

    const tasks = window.plannerTasks.filter(task =>
        task.study_date === selectedDate
    );

    if (tasks.length === 0) {

        alert("No tasks on this date.");

        return;

    }

    let message = `Tasks on ${selectedDate}\n\n`;

    tasks.forEach(task => {

        message += `• ${task.title}\n`;

    });

    alert(message);

});

// ==========================================
// LOAD UPCOMING DEADLINES
// ==========================================

function loadDeadlines() {

    const deadlineList =
        document.getElementById("deadlineList");

    if (!deadlineList) return;

    deadlineList.innerHTML = "";

    const today = new Date();

    const upcoming = window.plannerTasks
        .filter(task => new Date(task.study_date) >= today)
        .sort((a, b) =>
            new Date(a.study_date) - new Date(b.study_date)
        )
        .slice(0, 5);

    if (upcoming.length === 0) {

        deadlineList.innerHTML =
            "<p>No upcoming deadlines.</p>";

        return;

    }

    upcoming.forEach(task => {

        const daysLeft = Math.ceil(
            (new Date(task.study_date) - today) /
            (1000 * 60 * 60 * 24)
        );

        deadlineList.innerHTML += `

        <div class="deadline-card">

            <div>

                <h4>${task.title}</h4>

                <small>

                    📅 ${task.study_date}

                </small>

            </div>

            <span>

                ${daysLeft} day${daysLeft !== 1 ? "s" : ""}

            </span>

        </div>

        `;

    });

}

// ==========================================
// WEEKLY GOALS
// ==========================================

function loadWeeklyGoals() {

    const weeklyGoals =
        document.getElementById("weeklyGoals");

    if (!weeklyGoals) return;

    weeklyGoals.innerHTML = "";

    const totalTasks = window.plannerTasks.length;

    const completedTasks = window.plannerTasks.filter(
        task => task.completed
    ).length;

    const progress = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const goals = [

        {
            title: "Complete Weekly Tasks",
            description: `${completedTasks} of ${totalTasks} tasks completed`,
            progress
        },

        {
            title: "Study Consistency",
            description: "Maintain your study routine",
            progress: Math.min(progress + 10, 100)
        },

        {
            title: "Planner Completion",
            description: "Keep your planner updated",
            progress
        }

    ];

    goals.forEach(goal => {

        weeklyGoals.innerHTML += `

        <div class="goal-item">

            <div>

                <h4>${goal.title}</h4>

                <p>${goal.description}</p>

            </div>

            <span class="goal-status">

                ${goal.progress}%

            </span>

        </div>

        `;

    });

}



// ==========================================
// SEARCH TASKS
// ==========================================

const taskSearch = document.getElementById("taskSearch");

taskSearch?.addEventListener("input", () => {

    const keyword = taskSearch.value.toLowerCase().trim();

    const filtered = window.plannerTasks.filter(task =>

        task.title.toLowerCase().includes(keyword) ||

        (task.description || "")
            .toLowerCase()
            .includes(keyword)

    );

    renderPlanner(filtered);

});

// ==========================================
// PLANNER REMINDERS
// ==========================================

function checkReminders() {

    const today = new Date().toISOString().split("T")[0];

    const todaysTasks = window.plannerTasks.filter(task =>
        task.study_date === today &&
        !task.completed
    );

    if (todaysTasks.length === 0) return;

    let message = "📅 Today's Tasks\n\n";

    todaysTasks.forEach(task => {
        message += `• ${task.title} (${task.start_time})\n`;
    });

    alert(message);

}
