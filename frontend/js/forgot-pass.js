/*==================================================
AI STUDY PLANNER
FORGOT PASSWORD MODULE
PART 3A
==================================================*/

/*=====================================
ELEMENTS
=====================================*/

const forgotForm =
document.getElementById("forgotForm");

const resetForm =
document.getElementById("resetForm");

const emailInput =
document.getElementById("email");

const otpInputs =
document.querySelectorAll(".otp-box input");

const timer =
document.getElementById("timer");

const resendButton =
document.querySelector(".btn.secondary");

const newPassword =
document.getElementById("newPassword");

const confirmPassword =
document.getElementById("confirmPassword");

const togglePassword =
document.querySelectorAll(".toggle-password");

const strengthFill =
document.querySelector(".strength-fill");

/*=====================================
SEND OTP
=====================================*/

forgotForm.addEventListener("submit",(e)=>{

e.preventDefault();

if(emailInput.value===""){

alert("Please enter your email.");

return;

}

alert(

`OTP sent successfully.

(Frontend Simulation)`

);

});

/*=====================================
OTP INPUT AUTO MOVE
=====================================*/

otpInputs.forEach((input,index)=>{

input.addEventListener("keyup",(e)=>{

if(input.value.length===1 && index<otpInputs.length-1){

otpInputs[index+1].focus();

}

if(e.key==="Backspace" && index>0){

otpInputs[index-1].focus();

}

});

});

/*=====================================
SHOW PASSWORD
=====================================*/

togglePassword.forEach(icon=>{

icon.addEventListener("click",()=>{

const input=
icon.previousElementSibling;

if(input.type==="password"){

input.type="text";

icon.classList.replace(

"fa-eye",

"fa-eye-slash"

);

}

else{

input.type="password";

icon.classList.replace(

"fa-eye-slash",

"fa-eye"

);

}

});

});

/*=====================================
PASSWORD STRENGTH
=====================================*/

newPassword.addEventListener("keyup",()=>{

const len=
newPassword.value.length;

if(len<6){

strengthFill.style.width="30%";
strengthFill.style.background="#EF4444";

}

else if(len<10){

strengthFill.style.width="65%";
strengthFill.style.background="#F59E0B";

}

else{

strengthFill.style.width="100%";
strengthFill.style.background="#10B981";

}

});

/*=====================================
RESET PASSWORD
=====================================*/

resetForm.addEventListener("submit",(e)=>{

e.preventDefault();

if(newPassword.value!==confirmPassword.value){

alert(

"Passwords do not match."

);

return;

}

alert(

`Password reset successful.

Backend integration will
update the password.`

);

});

/*=====================================
LOAD
=====================================*/

window.addEventListener("load",()=>{

console.log(

"Forgot Password Module Loaded"

);

});

/*==================================================
AI STUDY PLANNER
FORGOT PASSWORD MODULE
PART 3B
==================================================*/

/*=====================================
OTP COUNTDOWN TIMER
=====================================*/

let time = 300;

const countdown = setInterval(() => {

    const minutes = Math.floor(time / 60);

    const seconds = time % 60;

    timer.innerText =
        `OTP expires in ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    time--;

    if (time < 0) {

        clearInterval(countdown);

        timer.innerText = "OTP Expired";

        timer.style.color = "#EF4444";

    }

}, 1000);

/*=====================================
RESEND OTP
=====================================*/

resendButton.addEventListener("click", () => {

    time = 300;

    timer.style.color = "#10B981";

    alert(

        "A new OTP has been sent.\n\n(Frontend Simulation)"

    );

});

/*=====================================
PASSWORD MATCH CHECK
=====================================*/

confirmPassword.addEventListener("keyup", () => {

    if (confirmPassword.value === "") return;

    if (confirmPassword.value === newPassword.value) {

        confirmPassword.style.borderColor = "#10B981";

    }

    else {

        confirmPassword.style.borderColor = "#EF4444";

    }

});

/*=====================================
ENTER KEY SUPPORT
=====================================*/

otpInputs.forEach((input) => {

    input.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {

            resetForm.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

/*=====================================
EMAIL VALIDATION
=====================================*/

emailInput.addEventListener("blur", () => {

    const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (

        emailInput.value !== "" &&

        !pattern.test(emailInput.value)

    ) {

        alert("Please enter a valid email address.");

    }

});

/*=====================================
SUCCESS MESSAGE
=====================================*/

function showSuccess(message){

    const success = document.createElement("div");

    success.innerText = message;

    success.style.position = "fixed";
    success.style.top = "20px";
    success.style.right = "20px";
    success.style.padding = "15px 20px";
    success.style.background = "#10B981";
    success.style.color = "#fff";
    success.style.borderRadius = "10px";
    success.style.boxShadow = "0 10px 25px rgba(0,0,0,.2)";
    success.style.zIndex = "9999";

    document.body.appendChild(success);

    setTimeout(() => {

        success.remove();

    }, 3000);

}

/*=====================================
RESET SUCCESS
=====================================*/

resetForm.addEventListener("submit", () => {

    showSuccess("Password reset successfully!");

});

/*=====================================
WELCOME
=====================================*/

window.addEventListener("load", () => {

    console.log(

        "Forgot Password Module Ready"

    );

});