let subtask = [];
let tasksArray = [];
let todoData = [];
let currentTodo = [];


let currentDraggedElement;
let id = 0

async function fetchTasks(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let tasksAsarray = Object.values(userJSON.tasks)


    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];
        id++;

        tasksArray.push(
            {
                idTask: id,
                Title: task.Titel,
                Description: task.description,
                Assigned: task.AssignedContact,
                duedate: task.Date,
                Prio: task.Prio,
                Category: task.Category,
                subtask: task.Subtask,
                status: 'open',
            }
        )

    }
    updateHtml();
    console.log(tasksArray)

}

function updateHtml() {
    let statusCategories = ['open', 'progress', 'awaitFeedback', 'closed'];

    for (let index = 0; index < statusCategories.length; index++) {
        let categoryies = statusCategories[index];

        // Erstelle ein Array für die gefilterten Aufgaben inklusive ihrer originalen Indizes
        let filteredTasks = [];

        // Durchlaufe das tasksArray und filtere basierend auf dem Status, ohne den Index zu verlieren
        for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
            let task = tasksArray[taskIndex];
            if (task.status === categoryies) {
                filteredTasks.push({ task, taskIndex });  // Füge die Aufgabe und den ursprünglichen Index hinzu
            }
        }

        document.getElementById(categoryies).innerHTML = '';

        // Verwende den originalen Index der Aufgaben
        filteredTasks.forEach(({ task, taskIndex }) => {
            document.getElementById(categoryies).innerHTML += generateTodoHTML(task, taskIndex);
            getassignecontacts(task, taskIndex);  // Übergib den ursprünglichen Index
        });
    }
}

function openTask() {
    // Prüfen der Fensterbreite
    const windowWidth = window.innerWidth;

    // Wenn die Bildschirmbreite kleiner oder gleich 1450px ist, zur add_task.html weiterleiten
    if (windowWidth <= 1450) {
        window.location.href = 'add_task.html'; // Redirect zur add_task.html
    } else {
        // Standardmäßig das Overlay öffnen
        let taskDiv = document.getElementById('boardAddTask');
        let overlay = document.getElementById('darkOverlay');

        if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
            taskDiv.style.display = 'block';  // Overlay anzeigen
            overlay.style.display = 'block';  // Dunklen Hintergrund anzeigen
            document.body.style.overflow = 'hidden';  // Hauptseite scrollen verhindern
        } else {
            taskDiv.style.display = 'none';  // Overlay ausblenden
            overlay.style.display = 'none';  // Dunklen Hintergrund ausblenden
            document.body.style.overflow = 'auto';  // Scrollen auf der Hauptseite wieder erlauben
        }
    }
}


function closeTask() {
    document.getElementById('boardAddTask').style.display = 'none';
    document.getElementById('darkOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';  // Scrollen auf der Hauptseite wieder erlauben
}

// Generieren des HTML-Codes für eine Aufgabe
// Generieren des HTML-Codes für eine Aufgabe
function generateTodoHTML(task, taskIndex) {
    // Überprüfe, ob das todo-Objekt die erwartete Struktur hat
    let title = task.Title;
    let description = task.Description;
    let dueDate = task.duedate;
    let priority = task.Prio;
    let assignedContacts = task.Assigned;
    let category = task.Category;
    let subtask = task.subtask;

    if (description === undefined) {
        description = "";
    }

    // Definiere Prioritäts-Icons
    let priorityIcon = '';
    if (priority == 'urgent') {
        priorityIcon = './assets/img/Prio_urgent(2).svg';
    } else if (priority == 'medium') {
        priorityIcon = './assets/IMG/Prio_medium(2).svg';
    } else if (priority == 'low') {
        priorityIcon = './assets/IMG/iconLowWhite.svg';
    } else {
        priorityIcon = './assets/img/Prio_Low(2).svg';
    }

    // Definiere Farben basierend auf der Kategorie
    let categoryColor = '';
    if (category == 'Technical Task') {
        categoryColor = '#1FD7C1';
    } else {
        categoryColor = '#0038FF';
    }

    // Füge das onclick-Event hinzu, das die Aufgabe öffnet
    return `
        <div class="todo" draggable="true" ondragstart="startDragging(${taskIndex})" onclick="openToDo(${taskIndex})">
            <div class="divKategorie" style="background-color: ${categoryColor};">${category}</div>
            <h3 class="title">${title}</h3>
            <p class="description">${description}</p>
            <p>Priority: <img src="${priorityIcon}" alt="${priority} Priority"></p>
            <p>Duedate: ${dueDate}</p>
            <div class="boardContacts" id="assignedContacts${taskIndex}"></div>
            <p>Subtasks: ${subtask}</p>
        </div>`;
}

// Funktion zum Anzeigen der großen ToDo-Karte im Overlay
function showCard(task) {
    try {
        if (!task || typeof task !== 'object') {
            console.error('Invalid task object:', task);
            return;
        }

        let todoBig = document.getElementById('todoBig');
        let showCardHTML = createShowCard(task);  // Funktion zum Erstellen der Detailansicht-HTML
        todoBig.innerHTML = showCardHTML;
    } catch (error) {
        console.error('Error displaying task:', error);
    }
}


// Funktion zum Öffnen des großen ToDos im Overlay
function openToDo(taskIndex) {
    let task = tasksArray[taskIndex];  // Hole die Aufgabe aus dem Array basierend auf dem Index
    if (!task) {
        console.error('Task not found at index:', taskIndex);
        return;
    }

    console.log('Opening task:', task);  // Ausgabe der Task-Daten zur Überprüfung

    let todoBig = document.getElementById('todoBig');
    todoBig.classList = 'cardbig';  // Setze CSS-Klasse für das große Div
    todoBig.innerHTML = '';

    document.body.style.overflow = "hidden";
    document.getElementById('overlay').classList.remove('d-none');

    showCard(task);  // Übergibt die ausgewählte Aufgabe zur Anzeige
}


// Funktion zum Erstellen des HTML-Inhalts für die große ToDo-Anzeige
function getPriorityIcon(priority) {
    // Überprüfe, ob `priority` ein String ist
    if (typeof priority !== 'string') {
        console.warn('Priority is not a string:', priority);
        return './assets/img/Prio_Low(2).svg'; // Standard-Icon im Fehlerfall
    }

    switch (priority.toLowerCase()) {
        case 'urgent':
            return './assets/img/Prio_urgent(2).svg';
        case 'medium':
            return './assets/IMG/Prio_medium(2).svg';
        case 'low':
            return './assets/IMG/iconLowWhite.svg';
        default:
            console.warn('Unknown priority:', priority);
            return './assets/img/Prio_Low(2).svg'; // Standard-Icon im Fehlerfall
    }
}


function getCategoryColor(category) {
    if (category === 'Technical Task') {
        return '#1FD7C1';
    }
    return '#0038FF';
}

function generateContactsHtml(assignedContacts) {
    let contactsHtml = '';
    assignedContacts.forEach((contact, index) => {
        let contactParts = contact.split(' ');
        let contactFirstname = contactParts[0] || '';  // Der erste Teil ist der Vorname
        let contactLastname = contactParts.slice(1).join(' ') || '';  // Der Rest ist der Nachname

        const color = getRandomColorForContact(); // Farbe für den Kontakt generieren
        contactsHtml += getassignecontacts(index, contactFirstname, contactLastname, '', color); // Farbe korrekt übergeben
    });
    return contactsHtml;
}


function createShowCard(task) {
    const title = task.Title || '';
    const description = task.Description || '';
    const dueDate = task.duedate || '';

    // Überprüfen, ob `task.Prio` ein Array ist und den ersten Wert extrahieren
    const priority = Array.isArray(task.Prio) ? (task.Prio[0] || '') : (task.Prio || '');

    const assignedContacts = task.Assigned || [];
    const category = task.Category || '';
    const subtask = task.subtask || '';

    const priorityIcon = getPriorityIcon(priority);
    const categoryColor = getCategoryColor(category);
    const contactsHtml = generateContactsHtml(assignedContacts);

    return /*html*/`
        <div class="todo-detail">
            <div>
                <div class="divKategorie" style="background-color: ${categoryColor};">${category}</div>   
                <button onclick="closeOverlay()" class="close-button"><img src="./assets/img/iconoir_cancel.png" alt=""></button>
            </div>
            <h2>${title}</h2>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <p><strong>Priority:</strong> 
                <span>${priority}</span>  <!-- Zeige das Wort (z.B. urgent, medium, low) -->
                <img src="${priorityIcon}" alt="${priority} Priority"> <!-- Zeige das Icon passend zur Priorität -->
            </p>
            <p><strong>Assigned To:</strong></p>
            <div class="assigned-contacts">
                ${contactsHtml}
            </div>
            <p><strong>Subtasks:</strong> ${subtask}</p>
        </div>
    `;
}

function getRandomColorForContact() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'];
    return colors[Math.floor(Math.random() * colors.length)];
}


// Funktion zum Schließen des Overlays
function closeOverlay() {
    document.getElementById('overlay').classList.add('d-none');
    document.body.style.overflow = "auto"; // Scrollen der Seite wieder erlauben
}


function getassignecontacts(contactIndex, contactFirstname, contactLastname, selectedClass, color) {
    if (typeof contactFirstname !== 'string') {
        contactFirstname = String(contactFirstname); // Konvertiere zu einem String, wenn es nötig ist
    }
    if (typeof contactLastname !== 'string') {
        contactLastname = String(contactLastname); // Konvertiere zu einem String, wenn es nötig ist
    }

    return `<div onclick="selectContact(${contactIndex})" class="single-contact-box ${selectedClass}">
                <div class="contact-icon" style="background-color:${color};">
                    <span>${contactFirstname.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
                </div>
                <div class="contact-content">
                    <span class="contactname">${contactFirstname} ${contactLastname}</span>
                </div>
            </div>`;
}


function showTheNameInitialInColorBoard(firstLetterForName, colorid) {
    let nameColorContainer = document.getElementById(colorid);
    colorLetter.forEach(colorLetterItem => {

        if (firstLetterForName === colorLetterItem.letter) {
            let currentColor = colorLetterItem.color;
            nameColorContainer.style.backgroundColor = currentColor;
        }
    });
}



function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
}



function allowDrop(ev) {
    ev.preventDefault();

}

function dragLeave(ev) {
    const target = ev.target.closest('.drag-area');
    if (target) {
        removeHighlight(target.id);
    }
}

// Überprüfe, ob eine Spalte leer ist, und zeige die Nachricht entsprechend an
function startDragging(idBoard) {
    currentDraggedElement = idBoard;
}
function moveTo(category) {
    currentDraggedElement--;
    let task = tasksArray[currentDraggedElement]

    // Wenn die Aufgabe gefunden wurde, ändere ihren Status
    if (task) {
        task.status = category;
    }

    // Aktualisiere das HTML, um die Änderungen darzustellen
    updateHtml();



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
    list.innerHTML = ''; // Liste wird gelöscht
    for (let i = 0; i < subtask.length; i++) {
        let li = document.createElement('li');
        li.classList.add('subtaskListItem'); 
        li.innerHTML = `
            <span id="subtask-text-${i}" class="subtaskText">${subtask[i]}</span>
            <input id="subtask-input-${i}" class="subtaskEditInput" style="display:none;" type="text" value="${subtask[i]}">
            <div class="subtaskActions">
                <button class="subtaskList" onclick="editItem(${i})">
                    <img class="EditSubTaskcheck" src="./assets/img/edit.png" alt="Edit">
                </button>
                <button class="subtaskList" onclick="saveItem(${i})" style="display:none;">
                    <img class="addSubTaskcheck" src="assets/img/check.png" alt="Save">
                </button>
                <button class="subtaskList" onclick="deleteItem(${i})">
                    <img class="deleteSubTaskcheck" src="./assets/img/delete.png" alt="Delete">
                </button>
            </div>`;
        list.appendChild(li);
    }
}

// Subtask löschen
function deleteItem(i) {
    subtask.splice(i, 1);
    addSubtask();
}


function editItem(i) {
    document.getElementById(`subtask-text-${i}`).style.display = 'none';
    document.getElementById(`subtask-input-${i}`).style.display = 'inline';
    document.querySelector(`.subtaskList[onclick="saveItem(${i})"]`).style.display = 'inline';
    document.querySelector(`.subtaskList[onclick="editItem(${i})"]`).style.display = 'none';
}

function saveItem(i) {
    const newValue = document.getElementById(`subtask-input-${i}`).value;
    subtask[i] = newValue;
    addSubtask(); // Aktualisiert die Liste nach dem Speichern
}

function addCurrentSubtask() {
    if (subtask.length < 5) {
        let CurrentSubtask = document.getElementById('new-subtask').value;
        subtask.push(CurrentSubtask);
        document.getElementById('new-subtask').value = ''; // Liste wieder leeren
        addSubtask();
    } else {
        alert('Genügend Subtasks hinzugefügt!');
    }
}


//Prio Buttons
function resetButtons() {
    // Zurücksetzen aller Buttons
    let buttons = [
        { id: 'urgent', color: 'initial', imgSrc: './assets/img/Prio_urgent(2).svg' },
        { id: 'medium', color: 'initial', imgSrc: './assets/IMG/Prio_medium(2).svg' },
        { id: 'low', color: 'initial', imgSrc: './assets/img/Prio_Low(2).svg' }
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
    document.getElementById('Selection_Container').innerHTML = '';
    getContacts();


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

    document.getElementById('Selected_profiles_Container').innerHTML = '';

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
    return tasksArray.length > 0 ? tasksArray[tasksArray.length - 1].id + 1 : 0;
}