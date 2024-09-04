let subtask = [];

let todos = [
    {
        id: 0,
        title: 'Kochwelt Page & Recipe Recommender',
        description: 'Build start page with recipe recommendation',
        kategorie: 'technicalTask',
        date: '2024-09-01',
        contacts: ['John Doe', 'Jane Smith'],
        priority: 'high',
        subtasks: ['Research recipes', 'Create layout'],
        status: 'open'  // Startstatus festlegen
    },
    {
        id: 1,
        title: 'CSS Architecture Planning',
        description: 'Define CSS naming conventions and structure.',
        kategorie: 'userStory',
        date: '2024-09-02',
        contacts: ['John Doe'],
        priority: 'medium',
        subtasks: ['Research BEM', 'Draft CSS plan'],
        status: 'progress'  // Startstatus festlegen
    },
    {
        id: 2,
        title: 'HTML Base Template Creation',
        description: 'Create reusable HTML base templates...',
        kategorie: 'technicalTask',
        date: '2024-09-03',
        contacts: ['Jane Smith'],
        priority: 'low',
        subtasks: ['Create header template', 'Create footer template'],
        status: 'awaitFeedback'  // Startstatus festlegen
    }
];


let currentDraggedElement;

document.addEventListener("DOMContentLoaded", function () {
    updateHTML();
});

function openTask() {
    let taskDiv = document.getElementById('boardAddTask');
    taskDiv.style.display = taskDiv.style.display === 'none' || taskDiv.style.display === '' ? 'block' : 'none';
}

function closeTask() {
    document.getElementById('boardAddTask').style.display = 'none';
}

// Generieren des HTML-Codes für eine Aufgabe
function generateTodoHTML(todo, contactIndex, contactsName = '', contactLastname = '', isSelected, color, backgroundColor, textColor) {
    // Überprüfe, ob das todo-Objekt die erwartete Struktur hat
    const title = todo.title || 'Kein Titel';
    const description = todo.description || 'Keine Beschreibung verfügbar';
    const dueDate = todo.dueDate || 'Kein Datum festgelegt';
    const priority = todo.priority || 'low'; // Standardwert 'low'

    // Überprüfen, ob subtasks existieren und ein Array sind
    const subtasks = Array.isArray(todo.subtasks) ? todo.subtasks : [];

    // Definiere Prioritäts-Icons
    let priorityIcon = '';
    switch (priority) {
        case 'urgent':
            priorityIcon = './assets/img/PRio_urgent (2).svg';
            break;
        case 'medium':
            priorityIcon = './assets/IMG/Prio_medium (2).svg';
            break;
        case 'low':
            priorityIcon = './assets/IMG/iconLowWhite.svg';
            break;
        default:
            priorityIcon = './assets/img/Prio_Low (2).svg'; // Fallback-Icon
    }

    // Definiere Farben basierend auf der Kategorie
    let categoryColor = '';
    switch (todo.kategorie) {
        case 'technicalTask':
            categoryColor = '#1FD7C1';
            break;
        case 'userStory':
            categoryColor = '#0038FF';
            break;
        default:
            categoryColor = '#CCCCCC'; // Fallback-Farbe
    }

    return /*html*/`
        <div class="todo" draggable="true" ondragstart="startDragging(${todo.id})">
            <div class="divKategorie" style="background-color: ${categoryColor};">${todo.kategorie}</div>
            <h3>${title}</h3>
            <p>${description}</p>
            <p>Priority: <img src="${priorityIcon}" alt="${priority} Priority"></p>

            <div onclick="selectContact(${contactIndex})" class="single-contact-box ${isSelected ? 'selected' : ''}" style="background-color:${backgroundColor};">
                <div class="contact-icon" style="background-color:${color};">
                    <span style="color: ${textColor};">
                        ${contactsName.charAt(0).toUpperCase() || ''}${contactLastname.charAt(0).toUpperCase() || ''}
                    </span>
                </div>
                <div class="contact-content">
                    <span class="contactname" style="color:${textColor};">${contactsName}</span>
                </div>
            </div>
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
    const draggedTodoIndex = todos.findIndex(todo => todo.id === currentDraggedElement);
    if (draggedTodoIndex !== -1) {
        todos[draggedTodoIndex].status = category;  // Aktualisiere den Status auf die neue Kategorie
        updateHTML();  // Aktualisiere die HTML-Darstellung
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
    document.getElementById('kategorie').selectedIndex = 0;

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

// Funktion, um den Wert des select-Elements abzurufen
function getSelectedCategory() {
    const categorySelect = document.getElementById('kategorie');
    if (categorySelect) {
        return categorySelect.value;
    }
    return null;
}

function generateUniqueId() {
    return todos.length > 0 ? todos[todos.length - 1].id + 1 : 0;
}


