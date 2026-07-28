// ==========================================
// AI STUDY PLANNER
// NOTES MODULE - PART 1
// ==========================================
const API_URL = "https://ai-study-planner-3nt2.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";

}

// ==========================================
// USER
// ==========================================

const user = JSON.parse(localStorage.getItem("user"));

console.log("Logged In User:", user);

// ==========================================
// MODAL
// ==========================================

const noteModal = document.getElementById("noteModal");

const newNoteBtn = document.getElementById("newNoteBtn");

const closeModal = document.getElementById("closeModal");

const noteForm = document.getElementById("noteForm");

const folderModal = document.getElementById("folderModal");

const newFolderBtn = document.getElementById("newFolderBtn");
const foldersList = document.getElementById("foldersList");
const closeFolderModal =
document.getElementById("closeFolderModal");

const folderForm =
document.getElementById("folderForm");
const noteFolder = document.getElementById("noteFolder");
let editingNoteId = null;
let allNotes = [];
let activeFolderFilter = null;
let currentSearchTerm = "";
// Open Modal
let selectedFolder = "";


if (newNoteBtn) {

    newNoteBtn.onclick = () => {

        noteModal.classList.add("show");

    };

}

if (newFolderBtn) {

    newFolderBtn.onclick = () => {

        folderModal.classList.add("show");

    };

}

// Close Modal

if (closeModal) {

    closeModal.onclick = () => {

        noteModal.classList.remove("show");

    };

}

if (closeFolderModal) {

    closeFolderModal.onclick = () => {

        folderModal.classList.remove("show");

    };

}


window.onclick = (e) => {

    if (e.target === noteModal) {

        noteModal.classList.remove("show");

    }

    if (e.target === folderModal) {

        folderModal.classList.remove("show");

    }

};


// ==========================================
// NOTES CONTAINER
// ==========================================

const notesGrid =
    document.getElementById("notesGrid");

// ==========================================
// STATISTICS
// ==========================================

const totalNotes =
    document.getElementById("totalNotes");

const favoriteNotes =
    document.getElementById("favoriteNotes");

const aiSummaries =
    document.getElementById("aiSummaries");

const flashcardCount =
    document.getElementById("flashcardCount");
    // ==========================================
// AI NOTES ELEMENTS
// ==========================================

const aiPrompt =
    document.getElementById("aiPrompt");

const generateAI =
    document.getElementById("generateAI");

const aiResult =
    document.getElementById("aiResult");

// ==========================================
// LOAD NOTES
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadNotes();

    loadFolders();

});

// ==========================================
// EDIT NOTE
// ==========================================

function editNote(id) {

    const note = window.notes.find(n => n.id === id);

    if (!note) return;

    editingNoteId = id;

    document.getElementById("noteTitle").value = note.title;

    document.getElementById("noteSubject").value = note.subject;

    document.getElementById("noteContent").value = note.content;
    document.getElementById("noteFolder").value = note.folder_id || "";

    noteModal.classList.add("show");

}

// ==========================================
// FILTER NOTES
// ==========================================

function applyNotesView() {

    let filteredNotes = [...allNotes];

    if (activeFolderFilter) {

        filteredNotes = filteredNotes.filter(note =>
            String(note.folder_id || "") === String(activeFolderFilter)
        );

    }

    if (currentSearchTerm) {

        const keyword = currentSearchTerm.toLowerCase();

        filteredNotes = filteredNotes.filter(note =>
            (note.title || "").toLowerCase().includes(keyword) ||
            (note.subject || "").toLowerCase().includes(keyword) ||
            (note.content || "").toLowerCase().includes(keyword)
        );

    }

    renderNotes(filteredNotes);

}

// ==========================================
// RENDER NOTES
// ==========================================


function renderNotes(notes) {
    const notesToRender = Array.isArray(notes) ? notes : [];
    notesGrid.innerHTML = "";

    let total = notesToRender.length;

    let favorites = 0;

    notesToRender.forEach(note => {

        if (note.favorite) {

            favorites++;

        }

       notesGrid.innerHTML += `

<div class="note-item">

    <div class="note-header">

        <h3>${note.title}</h3>

        <div class="note-actions">

            <button
                class="favorite-btn"
                onclick="toggleFavorite('${note.id}', ${note.favorite})">

                ${note.favorite ? "⭐" : "☆"}

            </button>

            <button
                class="edit-btn"
                onclick="editNote('${note.id}')">

                ✏️

            </button>

            <button
                class="delete-btn"
                onclick="deleteNote('${note.id}')">

                🗑

            </button>

        </div>

    </div>

    <p>${note.content || "No Content"}</p>

    <span>${note.subject}</span>

</div>

`;

    });

    // ======================================
    // Empty Notes
    // ======================================

    if (total === 0) {

        notesGrid.innerHTML = `

        <div class="empty-notes">

            <h3>No Notes Found</h3>

            <p>Create your first note.</p>

        </div>

        `;

    }

    // ======================================
    // Statistics
    // ======================================

    totalNotes.textContent = total;

    favoriteNotes.textContent = favorites;

    aiSummaries.textContent = 0;

    flashcardCount.textContent = 0;

}

// ==========================================
// GET NOTES
// ==========================================

async function loadNotes() {

    try {

        const response = await fetch(`${API_URL}/notes`, {

            method: "GET",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (!data.success) {

            console.error(data.message);

            return;

        }

       allNotes = data.notes;

applyNotesView();

    }

    catch (err) {

        console.error(err);

    }

}
// ==========================================
// CREATE NOTE
// ==========================================

noteForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title =
        document.getElementById("noteTitle").value.trim();

    const subject =
        document.getElementById("noteSubject").value;

    const content =
        document.getElementById("noteContent").value.trim();
        const folder_id = noteFolder.value || null;

    // Validation

    if (!title || !subject || !content) {

        alert("Please fill all fields.");

        return;

    }

    try {

      const url = editingNoteId
    ? `${API_URL}/notes/${editingNoteId}`
    : `${API_URL}/notes`;

const method = editingNoteId
    ? "PUT"
    : "POST";

const response = await fetch(url, {

    method,

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                title,
                subject,
                content,
                folder_id

            })

        });

        const data = await response.json();

        if (data.success) {

            alert("Note Created Successfully ✅");

            noteForm.reset();

editingNoteId = null;

noteModal.classList.remove("show");

loadNotes();

        }

        else {

            alert(data.message);

        }

    }

    catch (err) {

        console.error(err);

        alert("Unable to save note.");

    }

});

// ==========================================
// DELETE NOTE
// ==========================================

async function deleteNote(id) {

    if (!confirm("Delete this note?")) return;

    try {

        const response = await fetch(`${API_URL}/notes/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (data.success) {

            loadNotes();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

    }

}

// ==========================================
// TOGGLE FAVORITE
// ==========================================

async function toggleFavorite(id, currentValue) {

    try {

        const response = await fetch(`${API_URL}/notes/favorite/${id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                favorite: !currentValue

            })

        });

        const data = await response.json();

        if (data.success) {

            loadNotes();

        }

    } catch (err) {

        console.error(err);

    }

}

// ==========================================
// LIVE SEARCH
// ==========================================

const searchInput = document.getElementById("searchNotes");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        currentSearchTerm = searchInput.value.trim();

        applyNotesView();

    });

}

// ==========================================
// SUBJECT FILTER
// ==========================================

function bindFolderCards() {

    if (!foldersList) return;

    document.querySelectorAll(".folder-card").forEach(card => {

        card.addEventListener("click", (e) => {

            if (e.target.closest("button")) return;

            const folderId = card.dataset.id;

            if (!folderId) return;

            activeFolderFilter = folderId;

            document.querySelectorAll(".folder-card.active").forEach(folderCard => {
                folderCard.classList.remove("active");
            });

            card.classList.add("active");

            applyNotesView();

        });

    });

}

// ==========================================
// VIEW ALL NOTES
// ==========================================

const viewAllNotes =
    document.getElementById("viewAllNotes");

if (viewAllNotes) {

    viewAllNotes.addEventListener("click", () => {

        activeFolderFilter = null;
        currentSearchTerm = "";

        if (searchInput) {
            searchInput.value = "";
        }

        applyNotesView();

    });

}

// ==========================================
// GEMINI AI - NOTES ASSISTANT
// ==========================================

if (generateAI) {

    generateAI.addEventListener("click", async () => {

        const prompt = aiPrompt.value.trim();

        if (!prompt) {

            alert("Please enter your notes or question.");

            return;

        }

        try {

            generateAI.disabled = true;

            generateAI.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

            aiResult.innerHTML =
                "<p>🤖 Gemini AI is thinking...</p>";

            const response = await fetch(`${API_URL}/ai/summarize`, {

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

                        <h3>🤖 AI Response</h3>

                        <p>${data.result.replace(/\n/g, "<br>")}</p>

                    </div>

                `;

            } else {

                aiResult.innerHTML =

                    `<p style="color:red">${data.message}</p>`;

            }

        }

        catch (error) {

            console.error(error);

            aiResult.innerHTML =

                "<p style='color:red'>Unable to connect to Gemini AI.</p>";

        }

        finally {

            generateAI.disabled = false;

            generateAI.innerHTML =

                '<i class="fa-solid fa-paper-plane"></i> Generate';

        }

    });

}

folderForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    const folder_name = document.getElementById("folderName").value.trim();

    const folder_icon = document.getElementById("folderIcon").value;

    if (!folder_name) {
        alert("Enter folder name");
        return;
    }

    try {

        const response = await fetch(
            "https://ai-study-planner-3nt2.onrender.com/api/folders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    folder_name,
                    folder_icon
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Folder Created Successfully");

            folderForm.reset();

            folderModal.classList.remove("show");

            loadFolders();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

        alert("Unable to create folder");

    }

});

async function loadFolders() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        "https://ai-study-planner-3nt2.onrender.com/api/folders",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (data.success) {

        foldersList.innerHTML = "";

        noteFolder.innerHTML =
`<option value="">Select Folder</option>`;

data.folders.forEach(folder => {

    foldersList.innerHTML += `

   <div class="folder-card"
     data-id="${folder.id}"
     onclick="selectFolder('${folder.id}')">

        <div class="folder-left">

            <div class="folder-icon">

                ${folder.folder_icon}

            </div>

            <div class="folder-name">

                ${folder.folder_name}

            </div>

        </div>

        <div class="folder-actions">

            <button
                class="edit-folder-btn"
                onclick="editFolder('${folder.id}','${folder.folder_name}')">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button
                class="delete-folder-btn"
                onclick="deleteFolder('${folder.id}')">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    </div>

    `;

    noteFolder.innerHTML += `

        <option value="${folder.id}">

            ${folder.folder_icon} ${folder.folder_name}

        </option>

    `;

});

        bindFolderCards();

    }


}
loadFolders();

// ==========================================
// DELETE FOLDER
// ==========================================

async function deleteFolder(id) {

    if (!confirm("Delete this folder?")) return;

    try {

        const response = await fetch(`${API_URL}/folders/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (data.success) {

            alert("Folder Deleted Successfully");

            loadFolders();

        } else {

            alert(data.message);

        }

    }

    catch(err){

        console.error(err);

    }

}

async function editFolder(id, currentName){

    const newName = prompt("Rename Folder", currentName);

    if(!newName) return;

    try{

        const response = await fetch(`${API_URL}/folders/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },

            body:JSON.stringify({

                folder_name:newName

            })

        });

        const data = await response.json();

        if(data.success){

            alert("Folder Updated Successfully");

            loadFolders();

        }else{

            alert(data.message);

        }

    }catch(err){

        console.error(err);

    }

}

function selectFolder(folderId){

    selectedFolder = folderId;

    loadNotes();

}