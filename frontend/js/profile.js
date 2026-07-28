/*==================================================
AI STUDY PLANNER
PROFILE MODULE
PART 3A
==================================================*/

/*=====================================
ELEMENTS
=====================================*/

const saveButton =
document.querySelector(".btn.primary");

const changePhotoButton =
document.querySelector(".btn.secondary");

const profileImage =
document.querySelector(".profile-image");

const profileInputs =
document.querySelectorAll(".profile-form input");

const academicInputs =
document.querySelectorAll(".academic-grid input");

const goalBoxes =
document.querySelectorAll(".goal-box");

const achievements =
document.querySelectorAll(".achievement");

const stats =
document.querySelectorAll(".stat");

const passwordButton =
document.querySelector(".security-card .btn");

const preferenceSelects =
document.querySelectorAll(".preference-card select");

const themeSelect = preferenceSelects[0];
const notificationSelect = preferenceSelects[1];
const languageSelect = preferenceSelects[2];
const timeFormatSelect = preferenceSelects[3];
const socialInputs =
document.querySelectorAll(
".preference-card input"
);

/*=====================================
API
=====================================*/

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first.");

    window.location.href = "../pages/login.html";

}

/*=====================================
LOAD PROFILE
=====================================*/

async function loadProfile() {

    try {

        const response = await fetch(

            `${API_URL}/profile`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if (!result.success) {

            console.error(result.message);

            return;

        }

        const profile = result.profile;

        if (profile.preferences) {

    themeSelect.value =
        profile.preferences.theme || "Light Theme";

    notificationSelect.value =
        profile.preferences.notifications || "Email Notifications";

    languageSelect.value =
        profile.preferences.language || "English";

    timeFormatSelect.value =
        profile.preferences.timeFormat || "12 Hour Time";

}
document.getElementById("profileName").textContent =
    profile.full_name || "";

document.getElementById("fullName").value =
    profile.full_name || "";

        document.getElementById("email").value =
            profile.email || "";

        document.getElementById("phone").value =
            profile.phone || "";

        document.getElementById("location").value =
            profile.location || "";

        document.getElementById("university").value =
            profile.university || "";

        document.getElementById("degree").value =
            profile.degree || "";

        document.getElementById("branch").value =
            profile.branch || "";

        document.getElementById("currentYear").value =
            profile.current_year || "";

        document.getElementById("semester").value =
            profile.semester || "";

       document.getElementById("cgpa").value =
    profile.cgpa ?? "";
    document.getElementById("linkedin").value =
    profile.linkedin || "";

document.getElementById("github").value =
    profile.github || "";

document.getElementById("portfolio").value =
    profile.portfolio || "";

document.getElementById("twitter").value =
    profile.twitter || "";

    document.getElementById("studyHours").textContent =
    profile.study_hours ?? 0;

document.getElementById("dayStreak").textContent =
    profile.day_streak ?? 0;

document.getElementById("quizAccuracy").textContent =
    `${profile.quiz_accuracy ?? 0}%`;

document.getElementById("flashcardsReviewed").textContent =
    profile.flashcards_reviewed ?? 0;

       if (profile.avatar) {

    document.getElementById("profilePhoto").src =
        profile.avatar;

}

    }

    catch (error) {

        console.error(error);

    }

}




/*=====================================
SAVE PROFILE
=====================================*/

saveButton.addEventListener("click", async () => {

    try {

        const response = await fetch(

            `${API_URL}/profile`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    full_name: document.getElementById("fullName").value,

                    phone: document.getElementById("phone").value,

                    location: document.getElementById("location").value,

                    university: document.getElementById("university").value,

                    degree: document.getElementById("degree").value,

                    branch: document.getElementById("branch").value,

                    current_year: document.getElementById("currentYear").value,

                    semester: document.getElementById("semester").value,

                    cgpa: document.getElementById("cgpa").value,

                   avatar:
    document.getElementById("profilePhoto").src,
preferences: {

    theme: themeSelect.value,

    notifications: notificationSelect.value,

    language: languageSelect.value,

    timeFormat: timeFormatSelect.value

},

linkedin:
    document.getElementById("linkedin").value,

github:
    document.getElementById("github").value,

portfolio:
    document.getElementById("portfolio").value,

twitter:
    document.getElementById("twitter").value

                })

            }

        );

        const result = await response.json();

        if (!result.success) {

            alert(result.message);

            return;

        }

        document.getElementById("profileName").textContent =
            document.getElementById("fullName").value;
await loadProfile();
        alert("✅ Profile Updated Successfully!");

    }

    catch (error) {

        console.error(error);

        alert("Server Error");

    }

});

/*=====================================
GOAL CLICK
=====================================*/

goalBoxes.forEach(goal=>{

goal.addEventListener("click",()=>{

goal.classList.toggle("active");

alert(

`🎯 Goal Selected

${goal.innerText}`

);

});

});

/*=====================================
ACHIEVEMENTS
=====================================*/

achievements.forEach(item=>{

item.addEventListener("click",()=>{

alert(

`🏆 Achievement

${item.innerText}

Congratulations!`

);

});

});

/*=====================================
STATISTICS
=====================================*/

stats.forEach(stat=>{

stat.addEventListener("click",()=>{

alert(

`📊 Personal Statistics

Detailed analytics will
be available after
backend integration.`

);

});

});

/*=====================================
PASSWORD
=====================================*/

passwordButton.addEventListener("click", async () => {

    const currentPassword =
        document.querySelector('input[placeholder="Current Password"]').value;

    const newPassword =
        document.querySelector('input[placeholder="New Password"]').value;

    const confirmPassword =
        document.querySelector('input[placeholder="Confirm Password"]').value;

    if (!currentPassword || !newPassword || !confirmPassword) {

        alert("Please fill all password fields.");
        return;

    }

    if (newPassword !== confirmPassword) {

        alert("New password and Confirm password do not match.");
        return;

    }

    try {

        const response = await fetch(
            `${API_URL}/profile/change-password`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            }
        );

        const result = await response.json();

        if (!result.success) {

            alert(result.message);
            return;

        }

        alert("✅ Password updated successfully.");

        document.querySelector('input[placeholder="Current Password"]').value = "";
        document.querySelector('input[placeholder="New Password"]').value = "";
        document.querySelector('input[placeholder="Confirm Password"]').value = "";

    } catch (error) {

        console.error(error);
        alert("Server Error");

    }

});

/*=====================================
THEME
=====================================*/

function applyTheme(theme) {

    if (theme === "Dark Theme") {

        document.body.style.background = "#0F172A";
        document.body.style.color = "white";

    } else {

        document.body.style.background = "#F5F7FF";
        document.body.style.color = "#1E293B";

    }

}

themeSelect.addEventListener("change", () => {

    applyTheme(themeSelect.value);

});

/*=====================================
SOCIAL LINKS
=====================================*/

socialInputs.forEach(input => {

    input.addEventListener("blur", () => {

        const value = input.value.trim();

        if (value === "") return;

        try {

            new URL(value);

        } catch {

            alert(`Please enter a valid URL for ${input.placeholder}`);

            input.focus();

        }

    });

});

/*=====================================
PROFILE INPUTS
=====================================*/

profileInputs.forEach(input=>{

input.addEventListener("change",()=>{

console.log(

input.placeholder,

input.value

);

});

});

academicInputs.forEach(input=>{

input.addEventListener("change",()=>{

console.log(

input.placeholder,

input.value

);

});

});

/*=====================================
LOAD
=====================================*/

window.addEventListener("load",()=>{

console.log(

"Profile Module Loaded"

);

});

/*==================================================
AI STUDY PLANNER
PROFILE MODULE
PART 3B
==================================================*/

/*=====================================
ANIMATED STATISTICS
=====================================*/

function animateCounter(element,target){

    let count=0;

    const increment=Math.ceil(target/60);

    const timer=setInterval(()=>{

        count+=increment;

        if(count>=target){

            count=target;

            clearInterval(timer);

        }

        element.innerText=count;

    },30);

}

window.addEventListener("load",()=>{

    document.querySelectorAll(".stat h3")

    .forEach(item=>{

        const value=parseInt(item.innerText);

        if(!isNaN(value)){

            item.innerText="0";

            animateCounter(item,value);

        }

    });

});

/*=====================================
ACHIEVEMENT EFFECT
=====================================*/

achievements.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="scale(1.08)";

        card.style.boxShadow=

        "0 15px 30px rgba(79,70,229,.25)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="scale(1)";

        card.style.boxShadow="none";

    });

});

/*=====================================
GOAL EFFECT
=====================================*/

goalBoxes.forEach(goal=>{

    goal.addEventListener("dblclick",()=>{

        goal.style.background="#4F46E5";

        goal.style.color="white";

        alert(

        "🎯 Goal marked as completed!"

        );

    });

});

/*=====================================
PROFILE IMAGE EFFECT
=====================================*/

profileImage.addEventListener("mouseenter",()=>{

    profileImage.style.transform="scale(1.05)";

    profileImage.style.transition=".3s";

});

profileImage.addEventListener("mouseleave",()=>{

    profileImage.style.transform="scale(1)";

});

/*=====================================
AUTO SAVE DEMO
=====================================*/

setInterval(()=>{

console.log(

"Auto-saving profile..."

);

},30000);

/*=====================================
THEME DEMO
=====================================*/

themeSelect.addEventListener("change",()=>{

if(themeSelect.value.includes("Dark")){

document.body.style.background="#0F172A";

document.body.style.color="white";

}else{

document.body.style.background="#F5F7FF";

document.body.style.color="#1E293B";

}

});

/*=====================================
SOCIAL LINK VALIDATION
=====================================*/

socialInputs.forEach(input=>{

input.addEventListener("blur",()=>{

if(

input.value!=="" &&

!input.value.startsWith("http")

){

alert(

`⚠ Please enter a valid URL for

${input.placeholder}`

);

}

});

});

/*=====================================
PROFILE COMPLETENESS
=====================================*/

function profileCompletion(){

let total=0;

let filled=0;

document

.querySelectorAll("input")

.forEach(input=>{

total++;

if(input.value.trim()!==""){

filled++;

}

});

const percent=

Math.round((filled/total)*100);

console.log(

`Profile Completion: ${percent}%`

);

}

document

.querySelectorAll("input")

.forEach(input=>{

input.addEventListener(

"keyup",

profileCompletion

);

});

/*=====================================
WELCOME
=====================================*/
window.addEventListener("load",()=>{

    console.log(

        "AI Profile Module Fully Loaded"

    );

    loadProfile();

});