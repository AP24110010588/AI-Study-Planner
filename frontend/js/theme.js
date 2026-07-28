/* ==========================================
   GLOBAL THEME MANAGER
========================================== */

const savedTheme = localStorage.getItem("theme") || "Light";

/* ==========================================
   APPLY THEME
========================================== */

function applyTheme(theme) {

    if (theme === "Dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    localStorage.setItem("theme", theme);

}

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    applyTheme(savedTheme);
});

/* ==========================================
   EXPORT
========================================== */

window.applyTheme = applyTheme;