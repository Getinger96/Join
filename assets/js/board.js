let subtask = [];

let todos = [{
    'id': 0,
    'title': 'Kochwelt Page & Recipe Recommender',
    'description': 'Build start page with recipe recommendation',
    'category': 'open'
}, {
    'id': 1,
    'title': 'CSS Architecture Planning',
    'description': 'Define CSS naming conventiond and structure.',
    'category': 'open'
}, {
    'id': 2,
    'title': 'HTML Base Template Creation',
    'description': 'Create reusable HTML base templates...',
    'category': 'closed'
}];

let currentDraggedElement;

document.addEventListener("DOMContentLoaded", function () {
    updateHTML();
});

function openTask() {
    let taskDiv = document.getElementById('boardAddTask');

    if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
        // Wenn das div ausgeblendet ist, zeige es an
        taskDiv.style.display = 'block';
    } else {
        // Wenn das div sichtbar ist, blende es wieder aus
        taskDiv.style.display = 'none';
    }
}

function closeTask() {
    let taskDiv = document.getElementById('boardAddTask');
    taskDiv.style.display = 'none'; // Blendet das div wieder aus
}

// Funktion, um eine neue Aufgabe hinzuzufügen
function addTask() {
    // Sammeln der Eingabedaten aus den Feldern
    let title = document.getElementById('taskTitle').value;
    let description = document.getElementById('taskDescription').value;
    let category = document.getElementById('taskCategory').value;

    // Generiere eine neue ID für die Aufgabe
    let newId = todos.length ? todos[todos.length - 1].id + 1 : 0;

    // Erstellen einer neuen Aufgabe als Objekt
    let newTask = {
        id: newId,  // ID der Aufgabe
        title: title,
        description: description,
        category: category
    };

    // Hinzufügen der neuen Aufgabe zum todos-Array
    todos.push(newTask);

    // Aktualisieren der HTML-Anzeige
    updateHTML();

    // Formular zurücksetzen
    clearTask();
    closeTask();
}

// Generieren des HTML-Codes für eine Aufgabe
function generateTodoHTML(todo) {
    return `
        <div class="todo" draggable="true" ondragstart="startDragging(${todo.id})">
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
        </div>
    `;
}

// Funktion, um die Aufgaben in den richtigen Bereichen zu aktualisieren
function updateHTML() {
    let openContainer = document.getElementById('open');
    let progressContainer = document.getElementById('progress');
    let awaitFeedbackContainer = document.getElementById('awaitFeedback');
    let closedContainer = document.getElementById('closed');

    // Leeren der Container
    openContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    awaitFeedbackContainer.innerHTML = '';
    closedContainer.innerHTML = '';

    // Iterieren über alle Aufgaben und sie in den richtigen Bereich einfügen
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

    // Überprüfen, ob die Bereiche leer sind
    emptyTasks('open');
    emptyTasks('progress');
    emptyTasks('awaitFeedback');
    emptyTasks('closed');
}

// Funktion, um leere Bereiche mit einem Hinweis zu versehen
function emptyTasks(category) {
    let container = document.getElementById(category);
    let noTasksElement = document.querySelector(`.noTasks[category="${category}"]`);

    if (noTasksElement) {
        if (container.innerHTML.trim() === '') {
            noTasksElement.style.display = 'block';
        } else {
            noTasksElement.style.display = 'none';
        }
    } else {
        console.error(`Element mit category="${category}" nicht gefunden.`);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}



// Überprüfe, ob eine Spalte leer ist, und zeige die Nachricht entsprechend an
function startDragging(id) {
    currentDraggedElement = id;
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
        { id: 'urgent', color: 'initial', imgSrc: './assets/img/PRio_urgent (2).svg' },
        { id: 'medium', color: 'initial', imgSrc: './assets/IMG/Prio_medium (2).svg' },
        { id: 'low', color: 'initial', imgSrc: './assets/img/Prio_Low (2).svg' }
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

//Add Task leeren
function clearTask() {
    // Titel-Eingabefeld leeren
    document.getElementById('taskTitle').value = '';

    // Beschreibungstextfeld leeren
    document.getElementById('description').value = '';

    // Kategorie-Dropdown zurücksetzen
    document.getElementById('category').selectedIndex = 0;

    // Subtasks-Liste leeren
    document.getElementById('list').innerHTML = '';

    // Subtask-Eingabefeld leeren
    document.getElementById('new-subtask').value = '';

    // 'Assigned to'-Dropdown zurücksetzen (falls vorhanden)
    document.getElementById('select_container').selectedIndex = 0;

    // Datumseingabefeld leeren (falls vorhanden)
    document.querySelector('.inputTitle[type="date"]').value = '';

    // Prioritäts-Buttons zurücksetzen
    resetButtons();
}

function resetPrioButtons() {
    // Hintergrundfarbe und Bild der Prio-Buttons auf den Standard zurücksetzen
    const prioButtons = ['urgent', 'medium', 'low'];
    prioButtons.forEach(id => {
        let button = document.getElementById(id);
        let icon = document.getElementById(id + 'Icon');

        // Hintergrundfarbe und Textfarbe zurücksetzen
        button.style.backgroundColor = 'initial';
        button.style.color = 'initial';

        // Icon-Bild zurücksetzen
        switch (id) {
            case 'urgent':
                icon.src = './assets/img/Prio_Urgent.svg';
                break;
            case 'medium':
                icon.src = './assets/IMG/Prio_Medium.svg';
                break;
            case 'low':
                icon.src = './assets/img/Prio_LOw.svg';
                break;
        }
    });
}

function createTask() {
    // Sammeln der Eingabedaten aus den Feldern
    let title = document.getElementById('taskTitle').value.trim();
    let description = document.getElementById('description').value.trim();
    let category = document.getElementById('category').value;

    // Überprüfen, ob die Eingabefelder ausgefüllt sind
    if (title === '' || description === '') {
        alert('Bitte füllen Sie sowohl den Titel als auch die Beschreibung aus.');
        return;
    }

    // Generiere eine neue ID für die Aufgabe
    let newId = todos.length ? todos[todos.length - 1].id + 1 : 0;

    // Erstellen einer neuen Aufgabe als Objekt
    let newTask = {
        id: newId,  // ID der Aufgabe
        title: title,
        description: description,
        category: category
    };

    // Hinzufügen der neuen Aufgabe zum todos-Array
    todos.push(newTask);

    // Aktualisieren der HTML-Anzeige
    updateHTML();

    // Formular zurücksetzen
    clearTask();

    // Schließen des Formulars
    closeTask();
}
