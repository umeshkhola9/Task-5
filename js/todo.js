/* =============================================================
   TODO.JS — Sochit Web Studio
   Complete Todo List App logic:
   - Task state (in-memory array, persisted via storage.js)
   - CRUD: add, delete, toggle complete, inline edit
   - Filtering: all / active / completed
   - Stats display and "Clear Completed" button
   Depends on: storage.js
   ============================================================= */

/* ---------------------------------------------------------------
   STATE
   tasks[] is the single source of truth. Always call
   saveTasks() after any mutation, then renderTasks() to update UI.
   --------------------------------------------------------------- */
let tasks = [];
let currentFilter = "all"; /* "all" | "active" | "completed" */

/* ---------------------------------------------------------------
   DOM REFERENCES
   --------------------------------------------------------------- */
const todoInput         = document.getElementById("todo-input");
const addTaskBtn        = document.getElementById("add-task-btn");
const todoList          = document.getElementById("todo-list");
const todoEmpty         = document.getElementById("todo-empty");
const todoValidationMsg = document.getElementById("todo-validation-msg");
const todoCount         = document.getElementById("todo-count");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const filterBtns        = document.querySelectorAll(".todo-filter-btn");

/* ---------------------------------------------------------------
   PERSISTENCE  (via storage.js)
   --------------------------------------------------------------- */

/** Save the current tasks array to localStorage */
function saveTasks() {
    storageSet(STORAGE_KEYS.TODO_TASKS, tasks);
}

/** Load tasks from localStorage (or start with an empty array) */
function loadTasks() {
    tasks = storageGet(STORAGE_KEYS.TODO_TASKS) || [];
}

/* ---------------------------------------------------------------
   TASK OPERATIONS
   --------------------------------------------------------------- */

/**
 * addTask(text) — creates a new task object and prepends it.
 * @param {string} text
 */
function addTask(text) {
    const task = {
        id:        Date.now(),
        text:      text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.unshift(task); /* newest task appears at top */
    saveTasks();
    renderTasks();
}

/**
 * deleteTask(id) — removes a task by its id.
 * @param {number} id
 */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

/**
 * toggleTask(id) — flips a task's completed state.
 * @param {number} id
 */
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

/**
 * updateTaskText(id, newText) — saves an edited task's text.
 * @param {number} id
 * @param {string} newText
 */
function updateTaskText(id, newText) {
    const task = tasks.find(t => t.id === id);
    if (task && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

/** clearCompleted() — removes all completed tasks */
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}

/* ---------------------------------------------------------------
   FILTERING
   --------------------------------------------------------------- */

/** Returns the subset of tasks matching the active filter */
function getFilteredTasks() {
    switch (currentFilter) {
        case "active":    return tasks.filter(t => !t.completed);
        case "completed": return tasks.filter(t =>  t.completed);
        default:          return tasks;
    }
}

/* ---------------------------------------------------------------
   RENDER
   --------------------------------------------------------------- */

/** Re-renders the task list and updates stats */
function renderTasks() {
    const filtered = getFilteredTasks();
    todoList.innerHTML = "";

    if (filtered.length === 0) {
        todoEmpty.classList.remove("hidden");
    } else {
        todoEmpty.classList.add("hidden");
        filtered.forEach(task => todoList.appendChild(createTaskElement(task)));
    }

    updateStats();
}

/**
 * createTaskElement(task)
 * Builds a <li> element for a single task with check, text,
 * edit, and delete controls, then attaches event listeners.
 * @param   {Object} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
    const li = document.createElement("li");
    li.className  = `todo-item${task.completed ? " completed" : ""}`;
    li.dataset.id = task.id;

    li.innerHTML = `
        <button class="todo-check-btn"
                aria-label="${task.completed ? "Mark incomplete" : "Mark complete"}"
                title="${task.completed ? "Mark incomplete" : "Mark complete"}">
            ${task.completed ? "✅" : "⬜"}
        </button>
        <span class="todo-text">${escapeHtml(task.text)}</span>
        <div class="todo-item-actions">
            <button class="todo-edit-btn" aria-label="Edit task" title="Edit">✏️</button>
            <button class="todo-delete-btn" aria-label="Delete task" title="Delete">🗑️</button>
        </div>
    `;

    li.querySelector(".todo-check-btn").addEventListener("click", () => toggleTask(task.id));
    li.querySelector(".todo-delete-btn").addEventListener("click", () => deleteTask(task.id));
    li.querySelector(".todo-edit-btn").addEventListener("click",   () => startEditing(li, task));

    return li;
}

/**
 * startEditing(li, task)
 * Replaces the task text span with an editable input and changes
 * the edit button to a save button.
 * @param {HTMLLIElement} li
 * @param {Object}        task
 */
function startEditing(li, task) {
    const textSpan  = li.querySelector(".todo-text");
    const editInput = document.createElement("input");
    editInput.type      = "text";
    editInput.className = "todo-edit-input";
    editInput.value     = task.text;
    editInput.setAttribute("aria-label", "Edit task text");

    textSpan.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    /* Switch edit icon to save icon */
    const editBtn  = li.querySelector(".todo-edit-btn");
    editBtn.textContent = "💾";
    editBtn.title       = "Save";

    function saveEdit() {
        const newText = editInput.value.trim();
        if (!newText) {
            /* Show inline error state rather than saving empty text */
            editInput.classList.add("input-error");
            editInput.placeholder = "Task cannot be empty";
            return;
        }
        updateTaskText(task.id, newText);
    }

    editBtn.onclick = saveEdit;

    editInput.addEventListener("keydown", e => {
        if (e.key === "Enter")  saveEdit();
        if (e.key === "Escape") renderTasks(); /* cancel edit */
    });

    /* Save on blur with a small delay so the save button click
       registers before this fires */
    editInput.addEventListener("blur", () => {
        setTimeout(() => {
            if (document.activeElement !== editBtn) saveEdit();
        }, 150);
    });
}

/** updateStats() — refreshes task count label and clear-completed visibility */
function updateStats() {
    const total     = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active    = total - completed;

    todoCount.textContent = total === 0
        ? "No tasks yet"
        : `${active} task${active !== 1 ? "s" : ""} remaining`;

    clearCompletedBtn.style.display = completed > 0 ? "inline-block" : "none";
}

/* ---------------------------------------------------------------
   INPUT VALIDATION
   --------------------------------------------------------------- */

/**
 * showValidation(msg)
 * Displays a temporary validation message below the input.
 * @param {string} msg
 */
function showValidation(msg) {
    todoValidationMsg.textContent = msg;
    todoValidationMsg.classList.remove("hidden");
    setTimeout(() => todoValidationMsg.classList.add("hidden"), 3000);
}

/* ---------------------------------------------------------------
   EVENT LISTENERS
   --------------------------------------------------------------- */

/* Add task button */
addTaskBtn.addEventListener("click", () => {
    const text = todoInput.value.trim();
    if (!text) {
        showValidation("⚠️ Please enter a task before adding.");
        todoInput.focus();
        return;
    }
    addTask(text);
    todoInput.value = "";
    todoInput.focus();
});

/* Enter key in the input field */
todoInput.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const text = todoInput.value.trim();
    if (!text) { showValidation("⚠️ Please enter a task before adding."); return; }
    addTask(text);
    todoInput.value = "";
});

/* Filter buttons */
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

/* Clear completed tasks */
clearCompletedBtn.addEventListener("click", clearCompleted);

/* ---------------------------------------------------------------
   UTILITY
   --------------------------------------------------------------- */

/**
 * escapeHtml(str) — prevents XSS when inserting user input into innerHTML.
 * @param   {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

/* ---------------------------------------------------------------
   INIT — load persisted tasks and render on page load
   --------------------------------------------------------------- */
(function init() {
    loadTasks();
    renderTasks();
})();
