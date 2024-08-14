
let description = [];

let todos = [{
    'id': 0,
    'title': 'Putzen',
    'category': 'open'
}, {
    'id': 1,
    'title': 'Kochen',
    'category': 'open'
}, {
    'id': 2,
    'title': 'Einkaufen',
    'category': 'closed'
}];

let currentDraggedElement;

document.addEventListener("DOMContentLoaded", function () {
    updateHTML();
});

//add Task
function addTask() {
    let task = document.getElementById('addTask');
    task.innerHTML = '';
    for (let i = 0; i < todos.length; i++) {
        let title = todos[i][title];
        let description = description[i];
    }
    task.innerHTML += addNewTaskHTML(title, description)
}

//Task
function updateHTML() {
    let open = todos.filter(t => t['category'] == 'open');
    document.getElementById('open').innerHTML = '';
    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += generateTodoHTML(element);
    }

    let progress = todos.filter(t => t['category'] == 'progress');
    document.getElementById('progress').innerHTML = '';
    for (let index = 0; index < progress.length; index++) {
        const element = progress[index];
        document.getElementById('progress').innerHTML += generateTodoHTML(element);
    }

    let awaitFeedback = todos.filter(t => t['category'] == 'awaitFeedback');
    document.getElementById('awaitFeedback').innerHTML = '';
    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('awaitFeedback').innerHTML += generateTodoHTML(element);
    }

    let closed = todos.filter(t => t['category'] == 'closed');
    document.getElementById('closed').innerHTML = '';
    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += generateTodoHTML(element);
    }
}

//Drag & Drop
function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element.id})" class="todo">${element.title}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    // Finde das Task-Element nach seiner ID und aktualisiere die Kategorie
    const draggedTodoIndex = todos.findIndex(todo => todo.id === currentDraggedElement);
    if (draggedTodoIndex !== -1) {
        todos[draggedTodoIndex].category = category;
        updateHTML(); // Aktualisiere die HTML-Darstellung nach dem Verschieben
    } else {
        console.error("Dragged element not found:", currentDraggedElement);
    }
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

// Update der HTML-Elemente basierend auf den aktuellen Aufgaben
function updateHTML() {
    let openContainer = document.getElementById('open');
    let progressContainer = document.getElementById('progress');
    let awaitFeedbackContainer = document.getElementById('awaitFeedback');
    let closedContainer = document.getElementById('closed');

    openContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    awaitFeedbackContainer.innerHTML = '';
    closedContainer.innerHTML = '';

    todos.forEach(todo => {
        const taskHTML = generateTodoHTML(todo);
        if (todo.category === 'open') {
            openContainer.innerHTML += taskHTML;
        } else if (todo.category === 'progress') {
            progressContainer.innerHTML += taskHTML;
        } else if (todo.category === 'awaitFeedback') {
            awaitFeedbackContainer.innerHTML += taskHTML;
        } else if (todo.category === 'closed') {
            closedContainer.innerHTML += taskHTML;
        }
    });

    // Überprüfe nach jedem Update, ob es Aufgaben in den Spalten gibt
    emptyTasks('open');
    emptyTasks('progress');
    emptyTasks('awaitFeedback');
    emptyTasks('closed');
}

// Überprüfe, ob eine Spalte leer ist, und zeige die Nachricht entsprechend an
function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element.id})" class="todo">${element.title}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    // Finde das Task-Element nach seiner ID und aktualisiere die Kategorie
    const draggedTodoIndex = todos.findIndex(todo => todo.id === currentDraggedElement);
    if (draggedTodoIndex !== -1) {
        todos[draggedTodoIndex].category = category;
        updateHTML(); // Aktualisiere die HTML-Darstellung nach dem Verschieben
    } else {
        console.error("Dragged element not found:", currentDraggedElement);
    }
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

// Update der HTML-Elemente basierend auf den aktuellen Aufgaben
function updateHTML() {
    let openContainer = document.getElementById('open');
    let progressContainer = document.getElementById('progress');
    let awaitFeedbackContainer = document.getElementById('awaitFeedback');
    let closedContainer = document.getElementById('closed');

    openContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    awaitFeedbackContainer.innerHTML = '';
    closedContainer.innerHTML = '';

    todos.forEach(todo => {
        const taskHTML = generateTodoHTML(todo);
        if (todo.category === 'open') {
            openContainer.innerHTML += taskHTML;
        } else if (todo.category === 'progress') {
            progressContainer.innerHTML += taskHTML;
        } else if (todo.category === 'awaitFeedback') {
            awaitFeedbackContainer.innerHTML += taskHTML;
        } else if (todo.category === 'closed') {
            closedContainer.innerHTML += taskHTML;
        }
    });

    // Überprüfe nach jedem Update, ob es Aufgaben in den Spalten gibt
    emptyTasks('open');
    emptyTasks('progress');
    emptyTasks('awaitFeedback');
    emptyTasks('closed');
}

// Überprüfe, ob eine Spalte leer ist, und zeige die Nachricht entsprechend an
function emptyTasks(columnId) {
    const column = document.getElementById(columnId);
    const tasks = column.querySelectorAll('.todo');
    const noTasks = column.parentElement.querySelector('.noTasks');

    if (noTasks) {
        if (tasks.length === 0) {
            noTasks.style.display = 'block';
        } else {
            noTasks.style.display = 'none';
        }
    } else {
        console.error(`Element mit der Klasse 'noTasks' nicht gefunden für Spalte: ${columnId}`);
    }
}

