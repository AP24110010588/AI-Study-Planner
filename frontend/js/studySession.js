const API_URL = "https://ai-study-planner-3nt2.onrender.com/api";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {

    const timerDisplay = document.getElementById("studyTimer");
    const startBtn = document.getElementById("startSessionBtn");
    const stopBtn = document.getElementById("stopSessionBtn");

    if (!timerDisplay || !startBtn || !stopBtn) return;

    let timer = null;

    function formatTime(totalSeconds) {

        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const secs = String(totalSeconds % 60).padStart(2, "0");

        return `${hrs}:${mins}:${secs}`;
    }

    function updateTimer() {

        const startTime = Number(localStorage.getItem("studyStartTime"));

        if (!startTime) return;

        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

        timerDisplay.textContent = formatTime(elapsedSeconds);
    }

    function startTimer() {

        if (timer) clearInterval(timer);

        timer = setInterval(updateTimer, 1000);

        updateTimer();
    }

    // Restore timer after refresh/page change
    if (localStorage.getItem("studySessionActive") === "true") {

        startBtn.disabled = true;
        stopBtn.disabled = false;

        startTimer();
    }

    startBtn.addEventListener("click", () => {

        localStorage.setItem("studySessionActive", "true");
        localStorage.setItem("studyStartTime", Date.now());

        startBtn.disabled = true;
        stopBtn.disabled = false;

        startTimer();
    });

    stopBtn.addEventListener("click", async () => {

        clearInterval(timer);

        const startTime = Number(localStorage.getItem("studyStartTime"));

        const duration = Math.floor((Date.now() - startTime) / 1000);

        try {

            const response = await fetch(`${API_URL}/study-session`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({ duration })

            });

            const result = await response.json();

            if (result.success) {

                alert("✅ Study Session Saved!");

            } else {

                alert(result.message);

            }

        } catch (error) {

            console.error(error);

            alert("Server connection failed.");

        }

        localStorage.removeItem("studySessionActive");
        localStorage.removeItem("studyStartTime");

        timerDisplay.textContent = "00:00:00";

        startBtn.disabled = false;
        stopBtn.disabled = true;

    });

});