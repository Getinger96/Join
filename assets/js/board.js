let subtask = [];
let todos = [
    {
        id: 0,
        title: 'Kochwelt Page & Recipe Recommender',
        description: 'Build start page with recipe recommendation',
        category: 'open'
    },
    {
        id: 1,
        title: 'CSS Architecture Planning',
        description: 'Define CSS naming convention and structure.',
        category: 'progress'
    }
    // Weitere todo-Objekte
];



let currentDraggedElement;

document.addEventListener("DOMContentLoaded", function () {
    let showContacts = document.getElementById('Selection_Container');

    if (!showContacts) {
        console.error("Element with ID 'Selection_Container' not found.");
        return;
    }
    updateHTML();
});

function openTask(categoryId) {
    currentCategory = categoryId; // Setzt die aktuelle Kategorie
    let taskDiv = document.getElementById('boardAddTask');
    taskDiv.style.display = taskDiv.style.display === 'none' || taskDiv.style.display === '' ? 'block' : 'none';
}

function closeTask() {
    document.getElementById('boardAddTask').style.display = 'none';
}

// Speichert die Aufgabe und ordnet sie der aktuellen Kategorie zu
function saveTask() {
    let title = document.getElementById('taskTitle').value.trim();
    let description = document.getElementById('description').value.trim();
    let date = document.getElementById('taskDueDate').value;

    // Überprüfen, ob die erforderlichen Felder ausgefüllt sind
    if (title === '' || date === '' || !currentCategory) {
        alert('Bitte füllen Sie sowohl den Titel, das Fälligkeitsdatum als auch die Kategorie aus.');
        return;
    }

    // Generiere eine neue ID für die Aufgabe
    let newId = todos.length ? todos[todos.length - 1].id + 1 : 0;

    // Erstellen einer neuen Aufgabe als Objekt
    let newTask = {
        id: newId,
        title: title,
        description: description,
        date: date,
        category: currentCategory
    };

    // Hinzufügen der neuen Aufgabe zum todos-Array
    todos.push(newTask);

    // Aufgabe in Firebase hochladen
    addTaskToDatabase(newTask);

    // Aktualisieren der HTML-Anzeige
    updateHTML();

    // Formular zurücksetzen
    clearTask();

    // Schließen des Formulars
    closeTask();
}

// Funktion zum Generieren von HTML für eine Aufgabe
function generateTodoHTML(todo) {
    return `
        <div class="todo" draggable="true" ondragstart="startDragging(${todo.id})">
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
        </div>
    `;
}

function allowDrop(ev) {
    ev.preventDefault();
    const target = ev.target.closest('.drag-area');
    if (target) {
        highlight(target.id);
    }
}

function dragLeave(ev) {
    const target = ev.target.closest('.drag-area');
    if (target) {
        removeHighlight(target.id);
    }
}

// Überprüfe, ob eine Spalte leer ist, und zeige die Nachricht entsprechend an
function startDragging(id) {
    currentDraggedElement = id;
}

function moveTo(category) {
    if (!category) {
        console.error('Invalid category:', category);
        return;
    }

    const draggedTodoIndex = todos.findIndex(todo => todo.id === currentDraggedElement);
    if (draggedTodoIndex !== -1) {
        todos[draggedTodoIndex].category = category;
        updateHTML();
        removeHighlight(category);
    }
}

function highlight(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('drag-area-highlight');
    }
}

function removeHighlight(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('drag-area-highlight');
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

    currentPriority = 'none';  // Keine Priorität ausgewählt
}

function urgent() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let urgentButton = document.getElementById("urgent");
    let urgentIcon = document.getElementById("urgentIcon");

    // Setze die neuen Styles und das Bild
    urgentButton.style.backgroundColor = "red";
    urgentButton.style.color = "white";
    urgentIcon.src = "./assets/IMG/iconUrgentWhite.svg";

    currentPriority = 'urgent';  // Setzt die Priorität auf 'urgent'
}

function medium() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");

    // Setze die neuen Styles und das Bild
    mediumButton.style.backgroundColor = "orange";
    mediumButton.style.color = "white";
    mediumIcon.src = "./assets/IMG/iconMediumWhite.svg";

    currentPriority = 'medium';  // Setzt die Priorität auf 'medium'
}

function low() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let lowButton = document.getElementById("low");
    let lowIcon = document.getElementById("lowIcon");

    // Setze die neuen Styles und das Bild
    lowButton.style.backgroundColor = "limegreen";
    lowButton.style.color = "white";
    lowIcon.src = "./assets/IMG/iconLowWhite.svg";

    currentPriority = 'low';  // Setzt die Priorität auf 'low'
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

    // Ausgewählte Kontakte zurücksetzen
    selectedContactIndices = [];
    document.getElementById('Selected_profiles_Container').innerHTML = '';
    document.getElementById('Selected_profiles_Container').style.display = 'none'; // Verstecke den Container
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

