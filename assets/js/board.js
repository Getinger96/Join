
const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app";
let description = [];
let subtask = [];

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

function openTask() {
    let taskDiv = document.getElementById('boardAddTask');

    if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
        // Wenn die div ausgeblendet ist, zeige sie an
        taskDiv.style.display = 'block';
    } else {
        // Wenn die div sichtbar ist, blende sie wieder aus
        taskDiv.style.display = 'none';
    }
}

function closeTask() {
    let taskDiv = document.getElementById('boardAddTask');
    taskDiv.style.display = 'none'; // Blendet die div wieder aus
}

//add Task
function addTask() {
    let task = document.getElementById('addTask');
    task.innerHTML = '';
    for (let i = 0; i < todos.length; i++) {
        let title = todos[i][title];
        let description = description[i];
        task.innerHTML += addNewTaskHTML(title, description)
    }
}

//Task
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

    emptyTasks('open');
    emptyTasks('progress');
    emptyTasks('awaitFeedback');
    emptyTasks('closed');
}

//Drag & Drop
function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<h3 draggable="true" ondragstart="startDragging(${element.id})" class="todo">${element.title}</h3>`;
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
    return `<h3 draggable="true" ondragstart="startDragging(${element.id})" class="todo">${element.title}</h3>`;
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

// Add Subtask
function addSubtask() {
    let list = document.getElementById('list');
    list.innerHTML = ''; //Liste wird gelöscht
    for (let i = 0; i < subtask.length; i++) {
        let li = document.createElement('li'); //Liste wird wieder hinzugefügt
        li.innerHTML = subtask[i] + /*html*/` <button class="subtaskList" onclick="deleteItem(' + i +')"><img src="./assets/img/delete.png"></button>`;
        list.appendChild(li);
    }
}

function deleteItem(i) { //Einzelnen Elemente aus der Liste löschen
    subtask.splice(i, 1);
    addSubtask();
}

function addCurrentSubtask() {
    if (subtask.length < 5) {
        let CurrentSubtask = document.getElementById('new-subtask').value;
        subtask.push(CurrentSubtask);
        document.getElementById('new-subtask').value = ''; // Liste wieder leeren
        addSubtask();
    }
    else {
        alert('Genügend Subtasks hinzugefügt!');
    }
}


//Prio Buttons
function resetButtons() {
    // Zurücksetzen aller Buttons
    let buttons = [
        { id: 'urgent', color: 'initial', imgSrc: './assets/img/Prio_Urgent.svg' },
        { id: 'medium', color: 'initial', imgSrc: './assets/IMG/Prio_Medium.svg' },
        { id: 'low', color: 'initial', imgSrc: './assets/img/Prio_Low.svg' }
    ];

    buttons.forEach(button => {
        let btnElement = document.getElementById(button.id);
        let iconElement = document.getElementById(button.id + "Icon");

        btnElement.style.backgroundColor = button.color;
        btnElement.style.color = 'initial';
        iconElement.src = button.imgSrc;
    });
}

function urgent() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let urgentButton = document.getElementById("urgent");
    let urgentIcon = document.getElementById("urgentIcon");

    // Setze die neuen Styles und das Bild
    urgentButton.style.backgroundColor = "red";
    urgentButton.style.color = "white";
    urgentIcon.src = "./assets/IMG/iconUrgentWhite.svg";
}

function medium() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");

    // Setze die neuen Styles und das Bild
    mediumButton.style.backgroundColor = "orange";
    mediumButton.style.color = "white";
    mediumIcon.src = "./assets/IMG/iconMediumWhite.svg";
}

function low() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let lowButton = document.getElementById("low");
    let lowIcon = document.getElementById("lowIcon");

    // Setze die neuen Styles und das Bild
    lowButton.style.backgroundColor = "limegreen";
    lowButton.style.color = "white";
    lowIcon.src = "./assets/IMG/iconLowWhite.svg";
}

function search() {
    let search = document.getElementById('searchInput').value.toLowerCase();
    let todos = document.querySelectorAll('.todo');

    if (search.length >= 3) {
        showTasksSearch(search, todos);
    } else {
        for (let i = 0; i < todos.length; i++) {
            todos[i].style.display = 'block';
        }
    }
}

function showTasksSearch(search, todos) {
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        let titleElement = todo.querySelector('.drag-area'); // Greift auf das `div`-Element zu, das den Titel enthält
        let title = titleElement ? titleElement.textContent.toLowerCase() : todo.textContent.toLowerCase();

        if (title.includes(search)) {
            todo.style.display = 'block';
        } else {
            todo.style.display = 'none';
        }
    }
}

function clearTask() {
    
}