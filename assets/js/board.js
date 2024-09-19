let subtask = [];
let tasksArray = [];
let todoData = [];
let currentTodo = [];

let currentDraggedElement = null;
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
    id = 0;
    updateHtml();
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
function generateTodoHTML(task, taskIndex) {
    let title = task.Title;
    let description = task.Description || '';
    let dueDate = task.duedate;
    let priority = task.Prio || [];  // Stelle sicher, dass dies korrekt ist
    let assignedContacts = task.Assigned || [];
    let category = task.Category;
    let subtask = task.subtask || '';

    // Definiere Prioritäts-Icons
    let priorityIcon = getPriorityIcon(priority);  // Korrekte Verarbeitung der Priorität
    let categoryColor = getCategoryColor(category);

    // Erstelle das HTML für die Kontakte
    let contactsHtml = generateSmallContactsHtml(assignedContacts);

    return `
        <div class="todo" draggable="true" ondragstart="startDragging(${taskIndex})" onclick="openToDo(${taskIndex})">
            <div class="divKategorie" style="background-color: ${categoryColor};">${category}</div>
            <h3 class="title">${title}</h3>
            <p class="description">${description}</p>
            <p>Priority: <img src="${priorityIcon}" alt="${priority} Priority"></p>
            <p>Duedate: ${dueDate}</p>
            <div class="boardContacts" id="assignedContacts${taskIndex}">
                ${contactsHtml}
            </div>
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

    let todoBig = document.getElementById('todoBig');
    todoBig.classList = 'cardbig';  // Setze CSS-Klasse für das große Div
    todoBig.innerHTML = '';

    document.body.style.overflow = "hidden";
    document.getElementById('overlay').classList.remove('d-none');

    showCard(task);  // Übergibt die ausgewählte Aufgabe zur Anzeige
}

// Funktion zum Erstellen des HTML-Inhalts für die große ToDo-Anzeige
function getPriorityIcon(priority) {
    console.log('Priority received:', priority);  // Debug-Ausgabe hinzufügen

    if (Array.isArray(priority)) {
        priority = priority[0];
    }

    if (priority === undefined || priority === null || typeof priority !== 'string') {
        console.warn('Priority is not a valid string or is undefined:', priority);
        return './assets/img/Prio_Low(2).svg';
    }

    priority = priority.toLowerCase();

    switch (priority) {
        case 'urgent':
            return './assets/img/Prio_urgent(2).svg';
        case 'medium':
            return './assets/IMG/Prio_medium(2).svg';
        case 'low':
            return './assets/IMG/iconLowWhite.svg';
        default:
            console.warn('Unknown priority:', priority);
            return './assets/img/Prio_Low(2).svg';
    }
}


function getCategoryColor(category) {
    if (category === 'Technical Task') {
        return '#1FD7C1';
    }
    return '#0038FF';
}

function generateSmallContactsHtml(assignedContacts) {
    let contactsHtml = '';
    assignedContacts.forEach((contact, index) => {
        let contactParts = contact.split(' ');
        let contactFirstname = contactParts[0] || '';  // Der erste Teil ist der Vorname
        let contactLastname = contactParts.slice(1).join(' ') || '';  // Der Rest ist der Nachname

       
        contactsHtml += getassignecontacts(index, contactFirstname, contactLastname, '', color); // Farbe korrekt übergeben
    });
    return contactsHtml;
}

function createShowCard(task) {
    const title = task.Title || '';
    const description = task.Description || '';
    const dueDate = task.duedate || '';
    const priority = Array.isArray(task.Prio) ? (task.Prio[0] || '') : (task.Prio || '');
    const assignedContacts = task.Assigned || [];
    const category = task.Category || '';
    const subtask = task.subtask || '';

    const priorityIcon = getPriorityIcon(priority);
    const categoryColor = getCategoryColor(category);
    const contactsHtml = generateLargeContactsHtml(assignedContacts);

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
                <span>${priority}</span> 
                <img src="${priorityIcon}" alt="${priority} Priority">
            </p>
            <p><strong>Assigned To:</strong></p>
            <div class="assigned-contacts">
                ${contactsHtml}
            </div>
            <p><strong>Subtasks:</strong> ${subtask}</p>
        </div>
        <div class="actionBigTodo">
            <button class="actionBigButton" onclick="deleteTodo()">
                <img class="iconTodoBig" src="./assets/img/delete.png">
                <p>Delete</p>
            </button>
            <div></div>
            <button class="actionBigButton" onclick="editTodo()">
                <img class="iconTodoBig" src="./assets/img/edit.png">
                <p>Edit</p>
            </button>
        </div>
    `;
}









function getassignecontacts(task, taskIndex) {
    let assignedContacts =task.Assigned;
    let maxContact = 4;
    let remainingContacts = assignedContacts.length - maxContact;
    

    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);
    console.log(assignedContacts)

    for (let index = 0; index <  Math.min(assignedContacts.length, maxContact); index++) {
        let contact = assignedContacts[index];  
            nameParts = contact.split(" ");
            let color=  contactsArray[index].color

          let  firstLetterForName;
          let  firstLetterLastName;

        if (nameParts.length >= 2) {
            firstLetterForName = nameParts[0].charAt(0).toUpperCase();
            firstLetterLastName = nameParts[1].charAt(0).toUpperCase();

            
            asignedContainer.innerHTML += `<div class="contact-iconBoard ${color}">
                    <span>${firstLetterForName}${firstLetterLastName} </span>
                </div>`;
    } else {
            firstLetterForName = nameParts[0].charAt(0).toUpperCase();
            asignedContainer.innerHTML += `<div class="contact-iconBoard ${color}">
                    <span>${firstLetterForName} </span>
                </div>`;

        }

}
if (assignedContacts.length >= 4) {
    asignedContainer.innerHTML += `<div class="contact-iconBoard">
    <span> +${remainingContacts} </span>
</div>`;

    }
};





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
function startDragging(taskIndex) {
    currentDraggedElement = taskIndex;
}

function moveTo(ev, category) {
    ev.preventDefault();

    // Hole den aktuell gezogenen Index
    const taskIndex = currentDraggedElement;
    if (taskIndex !== null && tasksArray[taskIndex]) {
        let task = tasksArray[taskIndex];

        // Setze den neuen Status der Aufgabe
        task.status = category;

        // HTML aktualisieren
        updateHtml();
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
    selectedContactIndices.forEach((contactIndex) => {
        const contact = contactsArray[contactIndex];
        deselctedtContact(contactIndex, contact.name, `${contact.name.charAt(0).toUpperCase()}${getLastName(contact.name).charAt(0).toUpperCase()}`, contact.color);
    });

    // Clear the Selection_Container
    const selectionContainer = document.getElementById('Selection_Container');
    if (selectionContainer) {
        selectionContainer.innerHTML = '';
    }

    // Titel-Eingabefeld leeren
    const taskTitle = document.getElementById('taskTitle');
    if (taskTitle) {
        taskTitle.value = '';
    }

    // Beschreibungstextfeld leeren
    const description = document.getElementById('description');
    if (description) {
        description.value = '';
    }

    // Kategorie-Dropdown zurücksetzen
    const kategorie = document.getElementById('kategorie');
    if (kategorie) {
        kategorie.selectedIndex = 0;
    }

    // Subtasks-Liste leeren
    const list = document.getElementById('list');
    if (list) {
        list.innerHTML = '';
    }

    // Subtask-Eingabefeld leeren
    const newSubtask = document.getElementById('new-subtask');
    if (newSubtask) {
        newSubtask.value = '';
    }

    // 'Assigned to'-Dropdown zurücksetzen (falls vorhanden)
    const selectContainer = document.getElementById('select_container');
    if (selectContainer) {
        selectContainer.selectedIndex = 0;
    }

    // Datumseingabefeld leeren (falls vorhanden)
    const dateInput = document.querySelector('.inputTitle[type="date"]');
    if (dateInput) {
        dateInput.value = '';
    }

    // Selected profiles container leeren
    const selectedProfilesContainer = document.getElementById('Selected_profiles_Container');
    if (selectedProfilesContainer) {
        selectedProfilesContainer.innerHTML = '';
    }

    // Prioritäts-Buttons zurücksetzen
    resetButtons();

    // Leert die Liste der ausgewählten Kontakte
    selectedContactIndices = [];
    assignedContacts = [];
    fetchContacts();

    getContacts();
}


const selectionContainer = document.getElementById('Selection_Container');
if (selectionContainer) {
    selectionContainer.innerHTML = '';
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