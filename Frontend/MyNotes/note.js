let addNote = document.getElementById("addNote");
let deleteIcon = document.querySelector(".icon");
let addBtn = document.getElementById("addBtn");
let searchInput = document.querySelector(".search-input");

let saveEditBtn = null;

let notes = []; // Array to store notes

// Define an array of colors
const noteColors = [
  "note-color-1",
  "note-color-2",
  "note-color-3",
  "note-color-4",
  "note-color-5",
  // Add more colors as needed
];

// Function to load notes from local storage
function loadNotes() {
  let storedNotes = localStorage.getItem("notes");
  if (storedNotes) {
    notes = JSON.parse(storedNotes);
    renderNotes();
  }
}

// Function to save notes to local storage
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Function to render tags
function renderTags(tags) {
  // Check if tags is an array and has elements
  if (Array.isArray(tags) && tags.length > 0) {
    return tags.map((tag) => `<span class="tag">${tag}</span>`).join(" ");
  } else {
    return ""; // Return an empty string if tags is not valid
  }
}

// Function to render notes from the notes array
function renderNotes(filteredNotes = null) {
  let notesContainer = document.querySelector(".new-notes");
  notesContainer.innerHTML = ""; // Clear existing notes

  let notesToRender = filteredNotes || notes; // Use filteredNotes if provided, otherwise use all notes

  notesToRender.forEach((note, index) => {
    // Assign color based on index
    let colorClass = noteColors[index % noteColors.length];

    let div = document.createElement("div");
    div.classList.add("my-note", colorClass); // Add color class to note

    div.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.description}</p>
      <div class="tags">${renderTags(note.tags)}</div>
      <div class="btn-container">
        <button class="delete-btn" data-index="${index}">Delete</button>
        <button class="edit-btn" data-index="${index}">Edit</button>
      </div>
    `;

    div.querySelector(".edit-btn").addEventListener("click", function () {
      editNote(index); // Call editNote function with correct index when Edit button is clicked
    });

    div.querySelector(".delete-btn").addEventListener("click", function () {
      notes.splice(index, 1); // Remove note from array
      saveNotes(); // Save updated notes to local storage
      renderNotes(); // Re-render notes
    });

    notesContainer.appendChild(div);
  });
}

// Function to parse tags input
function parseTags(tagsInput) {
  return tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
}

// Function to handle editing a note
function editNote(index) {
  let note = notes[index];
  document.getElementById("title").value = note.title;
  document.getElementById("description").value = note.description;
  document.getElementById("tags").value = note.tags ? note.tags.join(", ") : ""; // Populate tags input

  // Show the add form
  let addForm = document.querySelector(".add-form");
  addForm.style.display = "block";

  // Hide the add button temporarily when editing
  addBtn.style.display = "none";

  // Check if saveEditBtn already exists
  if (!saveEditBtn) {
    // Create a save button for editing
    saveEditBtn = document.createElement("button");
    saveEditBtn.textContent = "Save";
    saveEditBtn.classList.add("save-edit-btn");

    // Add event listener to save edit button
    saveEditBtn.addEventListener("click", function () {
      notes[index].title = document.getElementById("title").value.trim();
      notes[index].description = document
        .getElementById("description")
        .value.trim();
      notes[index].tags = parseTags(document.getElementById("tags").value); // Update tags array

      saveNotes(); // Save updated notes to local storage
      renderNotes(searchNotes(searchInput.value.toLowerCase())); // Re-render notes with current filter
      closeForm(); // Close the form after saving
    });

    // Append the save edit button to the form
    addForm.appendChild(saveEditBtn);
  }
}

// Function to close the add form and reset fields
function closeForm() {
  let addForm = document.querySelector(".add-form");
  addForm.style.display = "none";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("tags").value = "";

  addBtn.style.display = "block"; // Show add button again

  // Remove the save edit button if it exists
  if (saveEditBtn && saveEditBtn.parentNode === addForm) {
    saveEditBtn.remove();
    saveEditBtn = null; // Reset saveEditBtn variable
  }
}

// Event listener for Add Note button
addNote.addEventListener("click", function () {
  document.querySelector(".add-form").style.display = "block";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
});

// Event listener for Delete Icon
deleteIcon.addEventListener("click", function () {
  document.querySelector(".add-form").style.display = "none";
});

// Event listener for Add Button
addBtn.addEventListener("click", function () {
  let title = document.getElementById("title").value.trim();
  let description = document.getElementById("description").value.trim();
  let tagsInput = document.getElementById("tags");

  // Parse tags input
  let tags = parseTags(tagsInput.value);

  if (title === "" || description === "") {
    alert("Please enter both title and description before adding the note.");
    return; // Exit the function if fields are empty
  }

  let newNote = {
    title: title,
    description: description,
    tags: tags,
  };

  notes.push(newNote); // Add new note to array
  saveNotes(); // Save updated notes to local storage
  renderNotes(searchNotes(searchInput.value.toLowerCase())); // Render updated notes on the page with current filter

  // Reset input fields
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  tagsInput.value = ""; // Reset tags input

  document.querySelector(".add-form").style.display = "none";
});

// Event listener for Search Input
searchInput.addEventListener("input", function () {
  let searchTerm = searchInput.value.toLowerCase();
  renderNotes(searchNotes(searchTerm)); // Render notes based on current search term
});

// Function to filter notes based on search term
function searchNotes(searchTerm) {
  return notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(searchTerm) ||
      note.description.toLowerCase().includes(searchTerm) ||
      (note.tags &&
        note.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );
  });
}

// Load notes from local storage when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadNotes();
});
