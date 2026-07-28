/*==================================================
AI STUDY PLANNER
FLASHCARDS MODULE
PART 1
==================================================*/

/*=====================================
CONFIG
=====================================*/

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

/*=====================================
GLOBAL VARIABLES
=====================================*/

let flashcards = [];

let currentIndex = 0;

let editingFlashcard = null;

/*=====================================
DOM ELEMENTS
=====================================*/

const flashcard =
document.getElementById("flashcard");

const flipButton =
document.getElementById("flipCard");

const previousButton =
document.getElementById("previousCard");

const nextButton =
document.getElementById("nextCard");

const modal =
document.getElementById("flashcardModal");

const newFlashcardButton =
document.querySelector(".btn.primary");
const newDeckButton =
document.querySelector(".btn.secondary");

const deckModal =
document.getElementById("deckModal");

const closeDeckModal =
document.getElementById("closeDeckModal");

const deckForm =
document.getElementById("deckForm");

const deckName =
document.getElementById("deckName");

const closeModal =
document.getElementById("closeModal");

const flashcardForm =
document.getElementById("flashcardForm");

const flashcardQuestion =
document.getElementById("flashcardQuestion");

const flashcardAnswer =
document.getElementById("flashcardAnswer");

const flashcardSubject =
document.getElementById("flashcardSubject");

const flashcardDifficulty =
document.getElementById("flashcardDifficulty");

/*=====================================
OPEN MODAL
=====================================*/

newFlashcardButton.addEventListener("click", () => {

    editingFlashcard = null;

    flashcardForm.reset();

    modal.classList.add("show");

});

/*=====================================
OPEN DECK MODAL
=====================================*/

newDeckButton.addEventListener("click",()=>{

    deckForm.reset();

    deckModal.classList.add("show");

});

/*=====================================
CLOSE MODAL
=====================================*/

closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

});

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("show");

    }

    if(e.target===deckModal){

        deckModal.classList.remove("show");

    }

});

/*=====================================
CLOSE DECK MODAL
=====================================*/

closeDeckModal.addEventListener("click",()=>{

    deckModal.classList.remove("show");

});

/*=====================================
LOAD FLASHCARDS
=====================================*/

async function loadFlashcards(){

    try{

        const response = await fetch(

            `${API_URL}/flashcards`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        flashcards = data.flashcards;

        currentIndex = 0;

        renderFlashcard();

        console.log(flashcards);

    }

    catch(err){

        console.error(err);

    }

}

/*=====================================
SAVE FLASHCARD
=====================================*/

async function saveFlashcard(e){

    e.preventDefault();

    const body={

        question:flashcardQuestion.value,

        answer:flashcardAnswer.value,

        subject:flashcardSubject.value,

        difficulty:flashcardDifficulty.value

    };

    try{

        let url=`${API_URL}/flashcards`;

        let method="POST";

        if(editingFlashcard){

            url=`${API_URL}/flashcards/${editingFlashcard}`;

            method="PUT";

        }

        const response=await fetch(url,{

            method,

            headers:{

                "Content-Type":"application/json",

                Authorization:`Bearer ${token}`

            },

            body:JSON.stringify(body)

        });

        const data=await response.json();

        if(data.success){

            alert(

                editingFlashcard

                ?

                "Flashcard Updated Successfully"

                :

                "Flashcard Created Successfully"

            );

            modal.classList.remove("show");

            flashcardForm.reset();

            editingFlashcard=null;

            loadFlashcards();

        }

        else{

            alert(data.message);

        }

    }

    catch(err){

        console.error(err);

    }

}

flashcardForm.addEventListener(

    "submit",

    saveFlashcard

);

/*=====================================
CREATE NEW DECK
=====================================*/

async function saveDeck(e){

    e.preventDefault();

    try{

        const response = await fetch(

            `${API_URL}/subjects`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:`Bearer ${token}`

                },

                body:JSON.stringify({

                    subject_name:deckName.value

                })

            }

        );

        const data = await response.json();

        if(data.success){

            alert("Deck Created Successfully");

            deckModal.classList.remove("show");

            deckForm.reset();

            loadDecks();

        }

        else{

            alert(data.message);

        }

    }

    catch(err){

        console.error(err);

    }

}
deckForm.addEventListener(

    "submit",

    saveDeck

);

/*=====================================
LOAD DECKS
=====================================*/
async function loadDecks(){

    try{

        const response = await fetch(

            `${API_URL}/subjects`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if(!data.success){

            return;

        }

        const deckGrid =
        document.querySelector(".deck-grid");

        deckGrid.innerHTML = "";

        flashcardSubject.innerHTML = "";

        data.subjects.forEach(subject=>{

            deckGrid.innerHTML += `

                <div class="deck">

                    📚 ${subject.subject_name}

                </div>

            `;

            flashcardSubject.innerHTML += `

                <option value="${subject.subject_name}">

                    ${subject.subject_name}

                </option>

            `;

        });

    }

    catch(err){

        console.error(err);

    }

}

/*==================================================
AI STUDY PLANNER
FLASHCARDS MODULE
PART 2
==================================================*/

/*=====================================
RENDER FLASHCARD
=====================================*/

function renderFlashcard(){

    const front =
    flashcard.querySelector(".flashcard-front h3");

    const back =
    flashcard.querySelector(".flashcard-back p");

    if(flashcards.length===0){

        front.innerHTML="No Flashcards";

        back.innerHTML="Create your first flashcard.";

        flashcard.classList.remove("flipped");

        updateStatistics();

        renderRecentFlashcards();

        return;

    }

    front.innerHTML=

        flashcards[currentIndex].question;

    back.innerHTML=

        flashcards[currentIndex].answer;

    flashcard.classList.remove("flipped");

    updateStatistics();

    renderRecentFlashcards();

}

/*=====================================
FLIP CARD
=====================================*/

flipButton.addEventListener("click",()=>{

    flashcard.classList.toggle("flipped");

});

flashcard.addEventListener("click",()=>{

    flashcard.classList.toggle("flipped");

});

/*=====================================
NEXT CARD
=====================================*/

nextButton.addEventListener("click",()=>{

    if(flashcards.length===0) return;

    currentIndex++;

    if(currentIndex>=flashcards.length){

        currentIndex=0;

    }

    renderFlashcard();

});

/*=====================================
PREVIOUS CARD
=====================================*/

previousButton.addEventListener("click",()=>{

    if(flashcards.length===0) return;

    currentIndex--;

    if(currentIndex<0){

        currentIndex=flashcards.length-1;

    }

    renderFlashcard();

});

/*=====================================
SEARCH
=====================================*/

const searchInput =

document.querySelector(".search-box input");

if(searchInput){

searchInput.addEventListener("keyup",()=>{

const keyword=

searchInput.value.toLowerCase();

const cards=

document.querySelectorAll(".flash-item");

cards.forEach(card=>{

const text=

card.innerText.toLowerCase();

card.style.display=

text.includes(keyword)

?

"block"

:

"none";

});

});

}

/*=====================================
RECENT FLASHCARDS
=====================================*/

function renderRecentFlashcards(){

    const container =
    document.querySelector(".recent-grid");

    if(!container) return;

    container.innerHTML = "";

    flashcards.slice(0,6).forEach((card,index)=>{

        container.innerHTML += `

        <div class="flash-item" data-index="${index}">

            <h3>${card.question}</h3>

            <p>${card.answer.substring(0,80)}...</p>

            <span>${card.subject}</span>

            <div class="flash-actions">

                <button onclick="editFlashcard(${index})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button onclick="deleteFlashcard('${card.id}')">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

        `;

    });

    bindRecentCards();

}

/*=====================================
RECENT CARD CLICK
=====================================*/

function bindRecentCards(){

document

.querySelectorAll(".flash-item")

.forEach(item=>{

item.addEventListener("click",()=>{

currentIndex=

Number(item.dataset.index);

renderFlashcard();

window.scrollTo({

top:

flashcard.offsetTop-80,

behavior:"smooth"

});

});

});

}

/*==================================================
AI STUDY PLANNER
FLASHCARDS MODULE
PART 3
STATISTICS + EDIT + DELETE + SHUFFLE
==================================================*/

/*=====================================
STATISTICS
=====================================*/

function updateStatistics(){

    const stats =
    document.querySelectorAll(".stat h3");

    if(!stats.length) return;

    const total = flashcards.length;

    const learned =
    flashcards.filter(card=>card.mastered).length;

    const difficult =
    flashcards.filter(card=>card.difficulty==="Hard").length;

    const progress =
    total===0
    ?
    0
    :
    Math.round((learned/total)*100);

    stats[0].innerText = total;

    stats[1].innerText = learned;

    stats[2].innerText = difficult;

    stats[3].innerText = progress + "%";

}

/*=====================================
DELETE FLASHCARD
=====================================*/

async function deleteFlashcard(id){

    if(!confirm("Delete this flashcard?")){

        return;

    }

    try{

        const response =
        await fetch(`${API_URL}/flashcards/${id}`,{

            method:"DELETE",

            headers:{

                Authorization:`Bearer ${token}`

            }

        });

        const data =
        await response.json();

        if(data.success){

            alert("Flashcard Deleted");

            loadFlashcards();

        }else{

            alert(data.message);

        }

    }

    catch(err){

        console.error(err);

    }

}

/*=====================================
EDIT FLASHCARD
=====================================*/

function editFlashcard(index){

    const card =
    flashcards[index];

    editingFlashcard =
    card.id;

    flashcardQuestion.value =
    card.question;

    flashcardAnswer.value =
    card.answer;

    flashcardSubject.value =
    card.subject;

    flashcardDifficulty.value =
    card.difficulty;

    modal.classList.add("show");

}

/*=====================================
SHUFFLE
=====================================*/

const shuffleButton =
document.createElement("button");

shuffleButton.className =
"btn secondary";

shuffleButton.innerHTML =
`<i class="fa-solid fa-shuffle"></i> Shuffle`;

document
.querySelector(".flash-controls")
.appendChild(shuffleButton);

shuffleButton.onclick = ()=>{

    if(flashcards.length<2){

        return;

    }

    flashcards.sort(()=>Math.random()-0.5);

    currentIndex=0;

    renderFlashcard();

};

/*=====================================
MARK LEARNED
=====================================*/

const learnedButton =
document.createElement("button");

learnedButton.className =
"btn primary";

learnedButton.innerHTML =
`<i class="fa-solid fa-check"></i> Learned`;

document
.querySelector(".flash-controls")
.appendChild(learnedButton);

learnedButton.onclick = ()=>{

    if(flashcards.length===0){

        return;

    }

    flashcards[currentIndex].mastered=true;

    updateStatistics();

    alert("Marked as Learned");

};

/*=====================================
MARK DIFFICULT
=====================================*/

const difficultButton =
document.createElement("button");

difficultButton.className =
"btn secondary";

difficultButton.innerHTML =
`<i class="fa-solid fa-star"></i> Difficult`;

document
.querySelector(".flash-controls")
.appendChild(difficultButton);

difficultButton.onclick = ()=>{

    if(flashcards.length===0){

        return;

    }

    flashcards[currentIndex].difficulty="Hard";

    updateStatistics();

    alert("Marked as Difficult");

};

/*=====================================
AUTO REVIEW
=====================================*/

let reviewMode=false;

let reviewTimer;

const reviewButton =
document.createElement("button");

reviewButton.className =
"btn secondary";

reviewButton.innerHTML =
`▶ Auto Review`;

document
.querySelector(".flash-controls")
.appendChild(reviewButton);

reviewButton.onclick = ()=>{

    reviewMode=!reviewMode;

    if(reviewMode){

        reviewButton.innerHTML=
        "⏸ Stop Review";

        reviewTimer=
        setInterval(()=>{

            if(flashcards.length===0){

                return;

            }

            currentIndex++;

            if(currentIndex>=flashcards.length){

                currentIndex=0;

            }

            renderFlashcard();

        },5000);

    }

    else{

        reviewButton.innerHTML=
        "▶ Auto Review";

        clearInterval(reviewTimer);

    }

};

/*==================================================
AI STUDY PLANNER
FLASHCARDS MODULE
PART 4
AI + DECKS + INITIALIZATION
==================================================*/

if (generateAI) {

    generateAI.addEventListener("click", async () => {

        const prompt = aiPrompt.value.trim();

        if (!prompt) {

            alert("Please enter a topic.");

            return;

        }

        try {

            generateAI.disabled = true;

            generateAI.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

            aiResult.innerHTML =
                "<p>🤖 Gemini AI is thinking...</p>";

            const response = await fetch(`${API_URL}/ai/flashcards`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

               body: JSON.stringify({

    content: prompt

})

            });

            const data = await response.json();

            if (data.success) {

                aiResult.innerHTML = `
                    <div class="ai-answer">
                        <h3>🤖 AI Flashcards</h3>
                        <p>${data.result.replace(/\n/g,"<br>")}</p>
                    </div>
                `;

            } else {

                aiResult.innerHTML =
                    `<p style="color:red">${data.message}</p>`;

            }

        } catch (error) {

            console.error(error);

            aiResult.innerHTML =
                "<p style='color:red'>Unable to connect to Gemini AI.</p>";

        } finally {

            generateAI.disabled = false;

            generateAI.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Generate';

        }

    });

}

/*=====================================
SUBJECT DECKS
=====================================*/


/*=====================================
FILTER BY SUBJECT
=====================================*/

function bindDeckEvents(){

document

.querySelectorAll(".deck")

.forEach(deck=>{

deck.onclick=()=>{

const subject=

deck.dataset.subject;

if(!subject) return;

const filtered=

flashcards.filter(

card=>card.subject===subject

);

if(filtered.length===0){

return;

}

flashcards=filtered;

currentIndex=0;

renderFlashcard();

};

});

}

/*=====================================
RESET VIEW
=====================================*/

const viewAllButton=

document.querySelector(".recent-card button");

if(viewAllButton){

viewAllButton.onclick=()=>{

loadFlashcards();

};

}

/*=====================================
WINDOW LOAD
=====================================*/

window.addEventListener("load",()=>{

    loadFlashcards();

    loadDecks();

});

