/*
==========================================
AI STUDY PLANNER
QUIZ MODULE
==========================================
*/

/* ==========================================
   API CONFIGURATION
========================================== */

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let quizQuestions = [];
let currentQuestion = 0;
let selectedAnswers = [];
let score = 0;

let timer = 900;
let timerInterval = null;

/* Quiz Settings */

let quizSettings = {
    timer: 900,
    shuffleQuestions: false,
    shuffleOptions: false,
    autoSubmit: true,
    showAnswers: true,
    instantFeedback: false
};

/* ==========================================
   DOM ELEMENTS
========================================== */

/* Generator */

const quizTopic = document.getElementById("quizTopic");
const quizDifficulty = document.getElementById("quizDifficulty");
const quizCount = document.getElementById("quizCount");
const generateQuizBtn = document.getElementById("generateQuizBtn");

/* Loading */

const quizLoading = document.getElementById("quizLoading");

/* Quiz */

const quizContainer = document.getElementById("quizContainer");
const questionCounter = document.getElementById("questionCounter");
const quizTopicName = document.getElementById("quizTopicName");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const progressBar = document.getElementById("progressBar");
const timerElement = document.getElementById("timer");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitQuizBtn = document.getElementById("submitQuizBtn");

/* Result */

const resultContainer = document.getElementById("resultContainer");
const scoreValue = document.getElementById("scoreValue");
const accuracyValue = document.getElementById("accuracyValue");
const performanceValue = document.getElementById("performanceValue");
const restartQuizBtn = document.getElementById("restartQuizBtn");

/* Settings Modal */

const settingsModal = document.getElementById("settingsModal");

const settingsBtn = document.querySelector(".header-buttons .secondary");

const closeSettings = document.getElementById("closeSettings");
const cancelSettings = document.getElementById("cancelSettings");
const saveSettings = document.getElementById("saveSettings");

const quizTimer = document.getElementById("quizTimer");
const shuffleQuestions = document.getElementById("shuffleQuestions");
const shuffleOptions = document.getElementById("shuffleOptions");
const autoSubmit = document.getElementById("autoSubmit");
const showAnswers = document.getElementById("showAnswers");
const instantFeedback = document.getElementById("instantFeedback");

/* ==========================================
   EVENT LISTENERS
========================================== */

/* Generate Quiz */

generateQuizBtn.addEventListener("click", generateQuiz);

/* Navigation */

prevBtn.addEventListener("click", previousQuestion);

nextBtn.addEventListener("click", nextQuestion);

submitQuizBtn.addEventListener("click", submitQuiz);

restartQuizBtn.addEventListener("click", restartQuiz);

/* Settings */

settingsBtn.addEventListener("click", openSettings);

closeSettings.addEventListener("click", closeSettingsModal);

cancelSettings.addEventListener("click", closeSettingsModal);

saveSettings.addEventListener("click", saveQuizSettings);

/* Close modal when clicking outside */

window.addEventListener("click", (e) => {

    if (e.target === settingsModal) {

        closeSettingsModal();

    }

});

/* ==========================================
   SETTINGS FUNCTIONS
========================================== */

/* Load Settings */

loadQuizSettings();

/* ------------------------------------------
   Open Settings
------------------------------------------ */

function openSettings() {

    settingsModal.classList.remove("hidden");

}

/* ------------------------------------------
   Close Settings
------------------------------------------ */

function closeSettingsModal() {

    settingsModal.classList.add("hidden");

}

/* ------------------------------------------
   Save Settings
------------------------------------------ */

function saveQuizSettings() {

    quizSettings = {

        timer: Number(quizTimer.value),

        shuffleQuestions: shuffleQuestions.checked,

        shuffleOptions: shuffleOptions.checked,

        autoSubmit: autoSubmit.checked,

        showAnswers: showAnswers.checked,

        instantFeedback: instantFeedback.checked

    };

    localStorage.setItem(
        "quizSettings",
        JSON.stringify(quizSettings)
    );

    closeSettingsModal();

    alert("Quiz settings saved successfully.");

}

/* ------------------------------------------
   Load Saved Settings
------------------------------------------ */

function loadQuizSettings() {

    const savedSettings =
        localStorage.getItem("quizSettings");

    if (!savedSettings) {

        return;

    }

    quizSettings =
        JSON.parse(savedSettings);

    quizTimer.value =
        quizSettings.timer;

    shuffleQuestions.checked =
        quizSettings.shuffleQuestions;

    shuffleOptions.checked =
        quizSettings.shuffleOptions;

    autoSubmit.checked =
        quizSettings.autoSubmit;

    showAnswers.checked =
        quizSettings.showAnswers;

    instantFeedback.checked =
        quizSettings.instantFeedback;

}

/* ------------------------------------------
   Reset Settings (Optional)
------------------------------------------ */

function resetQuizSettings() {

    quizSettings = {

        timer: 900,

        shuffleQuestions: false,

        shuffleOptions: false,

        autoSubmit: true,

        showAnswers: true,

        instantFeedback: false

    };

    quizTimer.value = 900;

    shuffleQuestions.checked = false;

    shuffleOptions.checked = false;

    autoSubmit.checked = true;

    showAnswers.checked = true;

    instantFeedback.checked = false;

    localStorage.setItem(
        "quizSettings",
        JSON.stringify(quizSettings)
    );

}

/* ==========================================
   GENERATE AI QUIZ
========================================== */

async function generateQuiz() {

    const topic = quizTopic.value.trim();

    if (topic === "") {

        alert("Please enter a quiz topic.");

        quizTopic.focus();

        return;

    }

    /* Load latest saved settings */

    loadQuizSettings();

    /* Disable Generate Button */

    generateQuizBtn.disabled = true;

    generateQuizBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    /* Show Loading */

    quizLoading.classList.remove("hidden");

    quizContainer.classList.add("hidden");

    resultContainer.classList.add("hidden");

    try {

        const response = await fetch(`${API_URL}/quiz/generate`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                topic: topic,

                difficulty: quizDifficulty.value,

                questions: Number(quizCount.value)

            })

        });

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message || "Failed to generate quiz."
            );

        }

        /* Store Questions */

        quizQuestions = result.questions;

        /* Shuffle Questions */

        if (quizSettings.shuffleQuestions) {

           shuffleArray(quizQuestions);

        }

        /* Shuffle Options */

        if (quizSettings.shuffleOptions) {

            quizQuestions.forEach(question => {

                const correctAnswerText =
                    question.options[question.correctAnswer];

                shuffleArray(question.options);

                question.correctAnswer =
                    question.options.indexOf(correctAnswerText);

            });

        }

        /* Reset Quiz */

        currentQuestion = 0;

        selectedAnswers = new Array(quizQuestions.length);

        score = 0;

        timer = quizSettings.timer;

        /* Hide Loading */

        quizLoading.classList.add("hidden");

        /* Show Quiz */

        quizContainer.classList.remove("hidden");

        /* Update Topic */

        quizTopicName.textContent = topic;

        /* Render First Question */

        renderQuestion();

        /* Start Timer */

        startTimer();

    }

    catch (error) {

        quizLoading.classList.add("hidden");

        alert(error.message);

        console.error(error);

    }

    finally {

        generateQuizBtn.disabled = false;

        generateQuizBtn.innerHTML =
            '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate AI Quiz';

    }

}



/* ==========================================
   RENDER QUESTION
========================================== */

function renderQuestion() {

    const question = quizQuestions[currentQuestion];

    questionCounter.textContent =
        `Question ${currentQuestion + 1} / ${quizQuestions.length}`;

    questionText.textContent =
        question.question;

    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {

        const button =
            document.createElement("button");

        button.className = "option";

        button.textContent = option;

        if (selectedAnswers[currentQuestion] === index) {

            button.classList.add("selected");

        }

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".option")
                .forEach(btn => {

                    btn.classList.remove("selected");

                    btn.classList.remove("correct");

                    btn.classList.remove("wrong");

                });

            selectedAnswers[currentQuestion] = index;

            button.classList.add("selected");

            if (quizSettings.instantFeedback) {

                if (index === question.correctAnswer) {

                    button.classList.add("correct");

                } else {

                    button.classList.add("wrong");

                }

            }

        });

        optionsContainer.appendChild(button);

    });

    prevBtn.style.display =
        currentQuestion === 0
            ? "none"
            : "inline-flex";

    nextBtn.style.display =
        currentQuestion === quizQuestions.length - 1
            ? "none"
            : "inline-flex";

    submitQuizBtn.classList.toggle(
        "hidden",
        currentQuestion !== quizQuestions.length - 1
    );

    updateProgressBar();

}

/* ==========================================
   PREVIOUS QUESTION
========================================== */

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();

    }

}

/* ==========================================
   NEXT QUESTION
========================================== */

function nextQuestion() {

    if (selectedAnswers[currentQuestion] === undefined) {

        alert("Please select an answer.");

        return;

    }

    if (currentQuestion < quizQuestions.length - 1) {

        currentQuestion++;

        renderQuestion();

    }

}

/* ==========================================
   UPDATE PROGRESS BAR
========================================== */

function updateProgressBar() {

    const progress =

        ((currentQuestion + 1) / quizQuestions.length) * 100;

    progressBar.style.width = `${progress}%`;

}

/* ==========================================
   START QUIZ TIMER
========================================== */

function startTimer() {

    clearInterval(timerInterval);

    timer = quizSettings.timer;

    updateTimerDisplay();

    timerInterval = setInterval(() => {

        timer--;

        updateTimerDisplay();

        if (timer <= 0) {

            clearInterval(timerInterval);

            if (quizSettings.autoSubmit) {

                alert("Time is up! Submitting your quiz...");

                submitQuiz();

            }

        }

    }, 1000);

}

/* ==========================================
   UPDATE TIMER
========================================== */

function updateTimerDisplay() {

    const minutes = Math.floor(timer / 60);

    const seconds = timer % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

/* ==========================================
   SUBMIT QUIZ
========================================== */

async function submitQuiz() {

    clearInterval(timerInterval);

    score = 0;

    quizQuestions.forEach((question, index) => {

        if (selectedAnswers[index] === question.correctAnswer) {

            score++;

        }

    });

    const accuracy = Math.round(

        (score / quizQuestions.length) * 100

    );

    let performance = "";

    if (accuracy >= 90) {

        performance = "Excellent";

    }

    else if (accuracy >= 75) {

        performance = "Very Good";

    }

    else if (accuracy >= 60) {

        performance = "Good";

    }

    else if (accuracy >= 40) {

        performance = "Average";

    }

    else {

        performance = "Needs Improvement";

    }

    scoreValue.textContent =
        `${score} / ${quizQuestions.length}`;

    accuracyValue.textContent =
        `${accuracy}%`;

    performanceValue.textContent =
        performance;

    quizContainer.classList.add("hidden");

    resultContainer.classList.remove("hidden");
    if (quizSettings.showAnswers) {

    reviewAnswers();

}

    try {

        const response = await fetch(

            `${API_URL}/quiz/submit`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    topic: quizTopic.value.trim(),

                    difficulty: quizDifficulty.value,

                    totalQuestions: quizQuestions.length,

                    score: score,

                    accuracy: accuracy,

                    timeTaken: quizSettings.timer - timer

                })

            }

        );

        const result = await response.json();

        if (!result.success) {

            console.error(result.message);

        }

    }

    catch (error) {

        console.error(

            "Failed to save quiz result:",

            error

        );

    }

}

/* ==========================================
   RESTART QUIZ
========================================== */

function restartQuiz() {

    clearInterval(timerInterval);

    quizQuestions = [];

    currentQuestion = 0;

    selectedAnswers = [];

    score = 0;

    timer = quizSettings.timer;

    progressBar.style.width = "0%";

    timerElement.textContent = formatTime(timer);

    quizContainer.classList.add("hidden");

    resultContainer.classList.add("hidden");

    quizLoading.classList.add("hidden");

    generateQuizBtn.disabled = false;

    generateQuizBtn.innerHTML =
        '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate AI Quiz';

    quizTopic.focus();

}

/* ==========================================
   REVIEW ANSWERS
========================================== */

function reviewAnswers() {

    if (!quizSettings.showAnswers) {

        return;

    }

    quizQuestions.forEach((question, index) => {

        console.log(

            `Question ${index + 1}`,

            {

                question: question.question,

                yourAnswer:
                    question.options[selectedAnswers[index]],

                correctAnswer:
                    question.options[question.correctAnswer]

            }

        );

    });

}

/* ==========================================
   FORMAT TIME
========================================== */

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

}

/* ==========================================
   SHUFFLE ARRAY
========================================== */

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];

    }

    return array;

}

/* ==========================================
   INITIALIZE QUIZ
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadQuizSettings();

    timerElement.textContent =
        formatTime(quizSettings.timer);

});

async function loadQuizStreak() {

    try {

        const response = await fetch(`${API_URL}/quiz/streak`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (data.success) {

            document.getElementById("quizStreak").textContent =
                `${data.streak} Days`;

        }

    } catch (error) {

        console.error(error);

    }

}