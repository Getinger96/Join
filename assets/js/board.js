let description = [];
let deletet = [];
let category = [];
let subtasks = [];


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

// empty Container
function emptyTasks(columnId) {
    const column = document.getElementById(columnId);
    if (!column) {
        console.error(`Column with ID ${columnId} not found.`);
        return;
    }

    const tasks = column.querySelectorAll('.todo');
    console.log(`Tasks found in ${columnId}:`, tasks);

    // Finde das Elternelement der Spalte (paddingRight-Div)
    const paddingRightDiv = column.parentElement;
    console.log("PaddingRight Div:", paddingRightDiv);

    // Überprüfe, ob das Elternelement gefunden wurde
    if (!paddingRightDiv) {
        console.error(`PaddingRight Div not found for column ${columnId}.`);
        return;
    }

    // Finde die noTasks-Nachricht
    const noTasksMessage = paddingRightDiv.querySelector('.noTasks');
    console.log("No Tasks Message:", noTasksMessage);

    if (!noTasksMessage) {
        console.error('No tasks message not found.');
        return;
    }

    // Zeige oder verberge die Nachricht basierend auf der Anzahl der Aufgaben
    if (tasks.length === 0) {
        noTasksMessage.style.display = 'block';
    } else {
        noTasksMessage.style.display = 'none';
    }
}

//add Task
function addTask() {
    let task = document.getElementById('addTask');
    task.innerHTML = '';
    for (let i = 0; i < todos.length; i++) {
        let title = todos[i].title;
        let description = todos[i].description;
        task.innerHTML += addNewTaskHTML(title, description);
    }
}

// Drag & Drop
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

