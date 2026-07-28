/*=========================================
AI STUDY PLANNER
ANALYTICS MODULE
PART 1
=========================================*/
const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

let weeklyChart;
let analyticsData = null;


let exportReportBtn;
/*=====================================
AI ANALYSIS MODAL
=====================================*/
let aiAnalysisBtn;
let aiAnalysisModal;
let closeAiModal;
let aiAnalysisContent;
document.addEventListener("DOMContentLoaded", () => {
    aiAnalysisBtn =
    document.querySelector(".ai-analysis-btn");

aiAnalysisModal =
    document.getElementById("aiAnalysisModal");

closeAiModal =
    document.getElementById("closeAiModal");

aiAnalysisContent =
    document.getElementById("aiAnalysisContent");

exportReportBtn =
    document.querySelector(".export-report-btn");

    

    /*=====================================
AI ANALYSIS EVENTS
=====================================*/

aiAnalysisBtn.addEventListener(
    "click",
    openAiAnalysis
);

closeAiModal.addEventListener(
    "click",
    closeAnalysisModal
);
exportReportBtn.addEventListener(
    "click",
    exportReport
);

window.addEventListener(
    "click",
    (e) => {

        if (e.target === aiAnalysisModal) {

            closeAnalysisModal();

        }

    }
);

    const ctx =
        document
        .getElementById("weeklyChart");

    weeklyChart = new Chart(ctx, {

    type: "bar",

    data: {

        labels: [

            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"

        ],

        datasets: [

            {

                label: "Study Hours",

                data: [],

                backgroundColor: [

                    "#4F46E5",
                    "#6366F1",
                    "#7C3AED",
                    "#8B5CF6",
                    "#4F46E5",
                    "#6366F1",
                    "#7C3AED"

                ],

                borderRadius: 10

            }

        ]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                display: false

            }

        },

        scales: {

            y: {

                beginAtZero: true,

                ticks: {

                    stepSize: 1

                }

            }

        }

    }

});
loadAnalytics();
});

/* ==========================================
   ANIMATE COUNTER
========================================== */

function animateCounter(element, target, suffix = "") {

    let current = 0;

    const duration = 1500;

    const increment = target / (duration / 16);

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;

            clearInterval(timer);

        }

        element.textContent =
            `${Math.floor(current)}${suffix}`;

    }, 16);

}
/* ==========================================
   LOAD ANALYTICS
========================================== */

async function loadAnalytics() {

    try {

        const response = await fetch(

            `${API_URL}/analytics`,

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

        const analytics = result.analytics;
        analyticsData = analytics;
const totalHours =
    (analytics.totalStudyTime / 3600).toFixed(1);

document.getElementById("totalStudyTime").textContent =
    totalHours + " hrs";

animateCounter(

    document.getElementById("studyStreak"),

    analytics.studyStreak,

    " Days"

);
document.getElementById("streakDays").textContent =
    analytics.studyStreak;

const streak = analytics.studyStreak;

const streakTitle =
    document.getElementById("streakTitle");

const streakMessage =
    document.getElementById("streakMessage");

if (streak >= 30) {

    streakTitle.textContent = "🏆 Legendary!";
    streakMessage.textContent =
        "Outstanding! You have maintained a 30+ day study streak.";

}
else if (streak >= 14) {

    streakTitle.textContent = "Amazing Consistency!";
    streakMessage.textContent =
        "Keep studying every day to reach your next milestone of 30 consecutive study days.";

}
else if (streak >= 7) {

    streakTitle.textContent = "Excellent Progress!";
    streakMessage.textContent =
        "Your study habit is getting stronger every day.";

}
else if (streak >= 3) {

    streakTitle.textContent = "Great Start!";
    streakMessage.textContent =
        "You're building consistency. Keep studying daily.";

}
else if (streak >= 1) {

    streakTitle.textContent = "Keep Going!";
    streakMessage.textContent =
        "Study tomorrow to continue your streak.";

}
else {

    streakTitle.textContent = "Start Your Journey!";
    streakMessage.textContent =
        "Complete your first study session to begin your streak.";

}

animateCounter(

    document.getElementById("averageQuizScore"),

    analytics.averageQuizScore,

    "%"

);

animateCounter(

    document.getElementById("flashcardsReviewed"),

    analytics.flashcardsReviewed

);
            weeklyChart.data.datasets[0].data =
    analytics.weeklyStudyHours;

weeklyChart.update();
loadSubjectPerformance(
    analytics.subjectPerformance
);
loadGoals(
    analytics.goals
);

    }

    catch (error) {

        console.error("Analytics Error:", error);

    }



}

/*=====================================
OPEN AI ANALYSIS
=====================================*/

function openAiAnalysis() {

    aiAnalysisModal.classList.add("show");

    generateAnalysis();

}

/*=====================================
CLOSE AI ANALYSIS
=====================================*/

function closeAnalysisModal() {

    aiAnalysisModal.classList.remove("show");

}
/*=====================================
GENERATE AI ANALYSIS
=====================================*/

function generateAnalysis() {

    if (!analyticsData) {

        aiAnalysisContent.innerHTML = `

            <div class="ai-card">

                Analytics data not available.

            </div>

        `;

        return;

    }

    const strongest = analyticsData.subjectPerformance.reduce(

        (best, current) =>

            current.score > best.score ? current : best

    );

    const weakest = analyticsData.subjectPerformance.reduce(

        (worst, current) =>

            current.score < worst.score ? current : worst

    );

    aiAnalysisContent.innerHTML = `

        <div class="ai-card">

            <h3>🏆 Strongest Subject</h3>

            <p>

                ${strongest.subject}

                (${strongest.score}%)

            </p>

        </div>

        <div class="ai-card">

            <h3>📚 Needs Improvement</h3>

            <p>

                ${weakest.subject}

                (${weakest.score}%)

            </p>

        </div>

        <div class="ai-card">

            <h3>🔥 Study Streak</h3>

            <p>

                ${analyticsData.studyStreak}

                Day Streak

            </p>

        </div>

        <div class="ai-card">

            <h3>💡 Recommendation</h3>

            <ul>

                <li>

                    Focus more on

                    <strong>${weakest.subject}</strong>

                </li>

                <li>

                    Maintain your

                    ${analyticsData.studyStreak}

                    day streak.

                </li>

                <li>

                    Try one AI Quiz every day.

                </li>

            </ul>

        </div>

    `;

}
/* ==========================================
   LOAD SUBJECT PERFORMANCE
========================================== */

function loadSubjectPerformance(subjects) {

    const container =
        document.getElementById(
            "subjectPerformanceContainer"
        );

    container.innerHTML = "";

    subjects.forEach(subject => {

        const card =
            document.createElement("div");

        card.className = "subject-card";

        card.innerHTML = `

            <div class="subject-header">

                <span>${subject.subject}</span>

                <strong>${subject.score}%</strong>

            </div>

            <div class="progress">

                <div
                    class="progress-fill"
                    style="width:${subject.score}%">

                </div>

            </div>

        `;

        container.appendChild(card);

    });

}

function loadGoals(goals) {

    const container =
        document.getElementById("goalContainer");

    container.innerHTML = "";

    goals.forEach(goal => {

        const percentage = Math.min(
            Math.round((goal.progress / goal.target) * 100),
            100
        );

        container.innerHTML += `

            <div class="goal">

                <span>${goal.goal}</span>

                <div class="progress">

                    <div
                        class="progress-fill"
                        style="width:${percentage}%">

                    </div>

                </div>

                <small>

                    ${goal.progress} / ${goal.target}

                </small>

            </div>

        `;

    });

}

/*=====================================
EXPORT REPORT
=====================================*/

function exportReport() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(22);

    pdf.text(

        "AI Study Planner",

        20,

        20

    );

    pdf.setFontSize(16);

    pdf.text(

        "Analytics Report",

        20,

        35

    );

    pdf.setFontSize(12);

    pdf.text(

        `Total Study Time : ${analyticsData.totalStudyTime} hrs`,

        20,

        55

    );

    pdf.text(

        `Study Streak : ${analyticsData.studyStreak} Days`,

        20,

        65

    );

    pdf.text(

        `Average Quiz Score : ${analyticsData.averageQuizScore}%`,

        20,

        75

    );

    pdf.text(

        `Flashcards Reviewed : ${analyticsData.flashcardsReviewed}`,

        20,

        85

    );

    pdf.text(

        "Subject Performance",

        20,

        105

    );

    let y = 115;

    analyticsData.subjectPerformance.forEach(subject => {

        pdf.text(

            `${subject.subject} : ${subject.score}%`,

            25,

            y

        );

        y += 10;

    });

    pdf.text(

        "AI Recommendation",

        20,

        y + 10

    );

    pdf.text(

        `Focus more on ${analyticsData.subjectPerformance.reduce(
            (a, b) => a.score < b.score ? a : b
        ).subject}.`,

        25,

        y + 20

    );

    pdf.save("Analytics_Report.pdf");

}