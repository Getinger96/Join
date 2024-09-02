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
        subtasks: ['Research recipes', 'Create layout']
    },
    {
        id: 1,
        title: 'CSS Architecture Planning',
        description: 'Define CSS naming conventions and structure.',
        kategorie: 'userStory',
        date: '2024-09-02',
        contacts: ['John Doe'],
        priority: 'medium',
        subtasks: ['Research BEM', 'Draft CSS plan']
    },
    {
        id: 2,
        title: 'HTML Base Template Creation',
        description: 'Create reusable HTML base templates...',
        kategorie: 'technicalTask',
        date: '2024-09-03',
        contacts: ['Jane Smith'],
        priority: 'low',
        subtasks: ['Create header template', 'Create footer template']
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
function generateTodoHTML(todo) {
    const contactsHTML = todo.contacts.map(contact => `<span>${contact}</span>`).join(', ');
    const subtasksHTML = todo.subtasks.length > 0 ? `<ul>${todo.subtasks.map(subtask => `<li>${subtask}</li>`).join('')}</ul>` : '<p>No subtasks</p>';
    const priorityHTML = `<p><strong>Priority:</strong> ${todo.priority}</p>`;
    const dateHTML = `<p><strong>Due Date:</strong> ${todo.date}</p>`;

    return `
        <div class="todo" draggable="true" ondragstart="startDragging(${todo.id})">
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            ${dateHTML}
            ${priorityHTML}
            <p><strong>Contacts:</strong> ${contactsHTML}</p>
            <div><strong>Subtasks:</strong> ${subtasksHTML}</div>
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


