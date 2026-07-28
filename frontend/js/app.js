/*==================================================
AI STUDY PLANNER
app.js
==================================================*/

/*=========================================
  MOBILE MENU
=========================================*/

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });
}

/*=========================================
  STICKY HEADER
=========================================*/

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/*==================================================
PREMIUM AI BOX
==================================================*/

const aiButton = document.getElementById("aiBoxButton");
const aiPopup = document.getElementById("aiBox");
const closeAI = document.getElementById("closeAI");
const minimizeAI = document.getElementById("minimizeAI");
const newChat = document.getElementById("newChat");

const chatArea = document.getElementById("chatArea");
let input = document.getElementById("aiInput");
const sendBtn = document.getElementById("sendBtn");

const chips = document.querySelectorAll(".ai-chip");

/*==============================
OPEN
==============================*/

if(aiButton){

    aiButton.onclick=()=>{

        aiPopup.classList.add("show");

    }

}

/*==============================
CLOSE
==============================*/

if(closeAI){

    closeAI.onclick=()=>{

        aiPopup.classList.remove("show");

    }

}

/*==============================
MINIMIZE
==============================*/

if(minimizeAI){

    minimizeAI.onclick=()=>{

        aiPopup.classList.remove("show");

    }

}

/*==============================
NEW CHAT
==============================*/

if(newChat){

    newChat.onclick=()=>{

        chatArea.innerHTML=`

        <div class="message ai-message">

            <div class="message-avatar">

                🤖

            </div>

            <div class="message-content">

                <h4>New Chat Started</h4>

                <p>

                Hello 👋

                What would you like to study today?

                </p>

            </div>

        </div>

        `;

    }

}

/*==============================
SEND MESSAGE
==============================*/

function sendMessage(){

    const message=input.value.trim();

    if(message==="") return;

    chatArea.innerHTML+=`

    <div class="message user-message">

        <div class="message-content">

            ${message}

        </div>

    </div>

    `;

    input.value="";

    chatArea.scrollTop=chatArea.scrollHeight;

    showTyping();

}

/*==============================
SEND BUTTON
==============================*/

if(sendBtn){

    sendBtn.onclick=sendMessage;

}

/*==============================
ENTER KEY
==============================*/

if(input){

    input.addEventListener("keypress",(e)=>{

        if(e.key==="Enter"){

            sendMessage();

        }

    });

}

/*==============================
PROMPT CHIPS
==============================*/

chips.forEach(chip=>{

    chip.onclick=()=>{

        input.value=chip.innerText;

        input.focus();

    }

});

/*==============================
TYPING
==============================*/

function showTyping(){

    const typing=document.createElement("div");

    typing.className="message ai-message typing";

    typing.innerHTML=`

    <div class="message-avatar">

        🤖

    </div>

    <div class="message-content">

        <span class="dot"></span>

        <span class="dot"></span>

        <span class="dot"></span>

    </div>

    `;

    chatArea.appendChild(typing);

    chatArea.scrollTop=chatArea.scrollHeight;

    setTimeout(()=>{

        typing.remove();

        aiReply();

    },1800);

}

/*==============================
AI REPLY
==============================*/

function aiReply(){

    const replies=[

"✅ I've prepared a personalized study plan for you.",

"📚 I recommend revising your weakest subject today.",

"📝 I can generate a quiz based on your syllabus.",

"🧠 Flashcards are ready for today's revision.",

"📈 Your productivity improved by 12% this week.",

"⏰ A 45-minute study session is recommended now.",

"🎯 Based on your progress, revise Calculus tomorrow.",

"🚀 You're doing great! Keep your study streak alive."

];

    const randomReply=replies[Math.floor(Math.random()*replies.length)];

    chatArea.innerHTML+=`

    <div class="message ai-message">

        <div class="message-avatar">

            🤖

        </div>

        <div class="message-content">

            ${randomReply}

        </div>

    </div>

    `;

    chatArea.scrollTop=chatArea.scrollHeight;

}

/*=========================================
  CLOSE WHEN CLICKING OUTSIDE
=========================================*/

document.addEventListener("click", (event) => {

   if (!aiPopup || !aiButton) return;

if (
    !aiPopup.contains(event.target) &&
    !aiButton.contains(event.target)
) {
    aiPopup.classList.remove("show");
}

});

/*=========================================
  SUGGESTED PROMPTS
=========================================*/

const promptItems = document.querySelectorAll(".suggested-prompts span");
const input = document.querySelector(".ai-box-footer input");

promptItems.forEach(item => {

    item.addEventListener("click", () => {

        if (input) {
            input.value = item.textContent;
            input.focus();
        }

    });

});

/*=========================================
  SEND MESSAGE (Demo)
=========================================*/

const sendBtn = document.querySelector(".send-btn");

function sendMessage() {

    if (!input) return;

    const message = input.value.trim();

    if (message === "") return;

    alert("🤖 AI Box received:\n\n" + message);

    input.value = "";

}

if (sendBtn) {

    sendBtn.addEventListener("click", sendMessage);

}

if (input) {

    input.addEventListener("keypress", (event) => {

        if (event.key === "Enter") {

            sendMessage();

        }

    });

}

/*=========================================
  QUICK ACTION BUTTONS
=========================================*/

const actionButtons = document.querySelectorAll(".ai-actions button");

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (input) {
            input.value = button.textContent.trim();
            input.focus();
        }

    });

});

/*==================================================
STATISTICS COUNTER
==================================================*/

const counters = document.querySelectorAll(".counter");

const speed = 200;

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            counters.forEach(counter => {

                const updateCounter = () => {

                    const target = +counter.getAttribute("data-target");

                    const count = +counter.innerText;

                    const increment = Math.ceil(target / speed);

                    if(count < target){

                        counter.innerText = count + increment;

                        setTimeout(updateCounter,10);

                    }else{

                        if(target >= 1000000){

                            counter.innerText = "2M+";

                        }

                        else if(target >= 500000){

                            counter.innerText = "500K+";

                        }

                        else if(target >= 50000){

                            counter.innerText = "50K+";

                        }

                        else{

                            counter.innerText = target + "%";

                        }

                    }

                }

                updateCounter();

            });

            observer.disconnect();

        }

    });

});

const statisticsSection = document.querySelector(".statistics");

if (statisticsSection) {
    observer.observe(statisticsSection);
}

/*==================================================
FAQ ACCORDION
==================================================*/

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {

        faqItems.forEach(other => {

            if(other !== item){

                other.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});
