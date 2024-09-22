let subtasks = [];
let subtask = [];
let tasksArray = [];
let subTaskChecked = [];


let currentDraggedElement;
let id = 0

async function fetchTasks(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let tasksAsarray = Object.values(userJSON.tasks)
    let keysArrayTask = Object.keys(userJSON.contacts);


    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];
        let keyTask =  keysArrayTask[index];

        id++;

        let saveTask = task.Filter+

        tasksArray.push(
            {
                taskKey:keyTask,
                idTask: id,
                Title: task.Titel,
                Description: task.description,
                Assigned: task.AssignedContact,
                duedate: task.Date,
                Prio: task.Prio,
                Category: task.Category,
                subtask: task.Subtask,
                status: task.Status,
            }
        )
        
    }
   
    

    updateHtml();
    renderSubtask();
  await  initializeAllProgress(); 
    console.log(tasksArray)

}


function renderSubtask() {
    let idSubtask = 0
    for (let index = 0; index < tasksArray.length; index++) {
        idSubtask++;
        let subtaskElement = tasksArray[index].subtask;


        if (subtaskElement === undefined) {
            subtaskElement = [];

        }

        subtask.push(
            {
              id: idSubtask,
              subtask: subtaskElement,
            }
        )

    
}
console.log(subtask);


}



async function updateHtml() {
    let statusCategories = ['open', 'progress', 'awaitFeedback', 'closed'];
    for (let index = 0; index < statusCategories.length; index++) {
        let category = statusCategories[index];
        let filteredTasks = tasksArray.filter(t => t.status === category);
        document.getElementById(category).innerHTML = ''; // Clear the category

        
        filteredTasks.forEach(task => {
            let taskHTML = generateTodoHTML(task, task.idTask); // Use idTask as a unique identifier
            document.getElementById(category).innerHTML += taskHTML;
            getassignecontacts(task, task.idTask); // Use idTask to fetch correct contacts

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

function generateTodoHTML(task, taskIndex) {

    
    let title = task.Title;
    let description = task.Description || "";
    let dueDate = task.duedate;
    let priority = task.Prio;
    let assignedContacts = task.Assigned;
    let category = task.Category;
    let subtasks = task.subtask || [];
    let idBoard = task.idTask; 

    let priorityIcon = getPriorityIcon(priority);
    let categoryColor = getCategoryColor(category);

    const totalSubtasks = subtasks.length;
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${task.idTask-1}-subtasks`)) || {};
    const completedSubtasks = Object.values(subtaskStatus).filter(isChecked => isChecked).length;
    const progressPercentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;


    let progressHtml = '';
    if (totalSubtasks > 0) {
        progressHtml = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress" id="progressbarline-${task.idTask-1}" style="width: ${progressPercentage}%;"></div>
                </div>
                <span id="progress-text-${task.idTask-1}">Subtasks: ${completedSubtasks}/${totalSubtasks}</span>
            </div>
        `;
    }

    return `
       <div class="todo" id="task_${task.idTask-1}Element" draggable="true" ondragstart="startDragging(${task.idTask})" onclick="openToDo(${task.idTask})">
    <div class="divKategorie" style="background-color: ${categoryColor};">${category}</div>
    <h3 id="task_Title${task.idTask-1}" class="title">${title}</h3>
    <p class="description">${description}</p>
    ${progressHtml} <!-- Progressbar nur anzeigen, wenn Subtasks vorhanden sind -->
    
    <!-- Wrapper für Kontakte und Prioritäts-Icon -->
    <div class="task-footer">
        <div class="boardContacts" id="assignedContacts${task.idTask}"></div>  
        <div class="priority-icon">
            <img src="${priorityIcon}" alt="${priority} Priority">
        </div>
    </div>
</div>`;
}




// Funktion zum Anzeigen der großen ToDo-Karte im Overlay
function showCard(task, taskIndex) {
        let todoBig = document.getElementById('todoBig');
        let showCardHTML = createShowCard(task, taskIndex); 
        todoBig.innerHTML = showCardHTML;

}

// Funktion zum Öffnen des großen ToDos im Overlay
function openToDo(taskIndex) {
    taskIndex--;
    let task = tasksArray[taskIndex];  // Hole die Aufgabe aus dem Array basierend auf dem Index
    let todoBig = document.getElementById('todoBig');
    todoBig.classList = 'cardbig';  // Setze CSS-Klasse für das große Div
    todoBig.innerHTML = '';

    document.body.style.overflow = "hidden";
    document.getElementById('overlay').classList.remove('d-none');

    showCard(task, taskIndex );  // Übergibt die ausgewählte Aufgabe zur Anzeige
}

// Funktion zum Erstellen des HTML-Inhalts für die große ToDo-Anzeige
function getPriorityIcon(priority) {
    // Define priority icons
    let priorityIcon = '';
    if (priority === 'urgent') {
        priorityIcon = './assets/img/Prio_urgent(2).svg';
    } else if (priority === 'medium') {
        priorityIcon = './assets/IMG/Prio_medium(2).svg';
    } else if (priority === 'low') {
        priorityIcon = './assets/IMG/iconLowWhite.svg';
    } else {
        priorityIcon = './assets/img/Prio_Low(2).svg';
    }
    
    // Return the determined priority icon
    return priorityIcon;
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

        const color = getRandomColorForContact(); // Farbe für den Kontakt generieren
        contactsHtml += getSmallContactHtml(index, contactFirstname, contactLastname, color); // Zeige nur Initialen
    });
    return contactsHtml;
}

function generateLargeContactsHtml(assignedContacts) {
    let contactsHtml = ''; 

    for (let index = 0; index < assignedContacts.length; index++) {
        let nameParts = assignedContacts[index].split(' ');
        let contactFirstname = nameParts[0] || '';  
        let contactLastname = nameParts.slice(1).join(' ') || '';  

        let firstLetterForName = contactFirstname.charAt(0).toUpperCase();
        let firstLetterLastName = contactLastname.charAt(0).toUpperCase();

        let color = showTheNameColor(firstLetterForName);
        
        contactsHtml += getLargeContactHtml(index, firstLetterForName, firstLetterLastName, contactFirstname, contactLastname, color);
    }
  
    return contactsHtml;  // Gib das komplette generierte HTML zurück
}

function showTheNameColor(firstLetterForName) {
    let currentColor = 'gray';
    colorLetter.forEach(colorLetterItem => {

        if (firstLetterForName === colorLetterItem.letter) {
            currentColor = colorLetterItem.color; 
        }
    });
    return currentColor
}



function getSmallContactHtml(index, firstname, lastname, color) {
    const initials = `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;
    return `
        <div class="contactCircle" style="background-color: ${color};">
            ${initials}
        </div>
    `;
}

function getLargeContactHtml(index, firstLetterForName, firstLetterLastName, contactFirstname, contactLastname, color) {// Zeige vollständige Namen

    return `
        <div class="contact-box">
            <div class="contact-icon" style="background-color: ${color};">
                ${firstLetterForName} ${firstLetterLastName}  
            </div>
            <div class="contact-content">
                <span class="contactname">${contactFirstname} ${contactLastname}</span>
            </div>
        </div>
    `;
}

function createShowCard(task, taskIndex) {
    let title = task.Title || '';
    let description = task.Description || '';
    let dueDate = task.duedate || '';
    let priority = task.Prio;
    let assignedContacts = task.Assigned || [];
    let category = task.Category || '';

    const priorityIcon = getPriorityIcon(priority);
    const categoryColor = getCategoryColor(category);
    const contactsHtml = generateLargeContactsHtml(assignedContacts);
    const subtasksHtml = generateSubtasksHtml(task.subtask, taskIndex); // Subtasks generieren

   return `
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
            <p class="subtaskstext"> <strong>Subtasks:</strong></p>
            <div class="subtasks-container">
                ${subtasksHtml} <!-- Hier werden die Subtasks eingefügt -->
            </div>
        </div>
        <div class="actionBigTodo">
            <button class="actionBigButton" onclick="deleteTask(${taskIndex})">
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

function closeOverlay() {
    const todoBig = document.getElementById('todoBig');
    const overlay = document.getElementById('overlay');

    todoBig.classList.add('d-none');
    overlay.classList.add('d-none');

    document.body.style.overflow = 'auto';
}



function generateSubtasksHtml(subtasks, taskIndex) {
    let subtasksHtml = '';
    const totalSubtasks = subtasks ? subtasks.length : 0;

    if (totalSubtasks > 0) {
        subtasks.forEach((subtask, index) => {
            const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
            const isChecked = subtaskStatus[index] || false;  // Standardmäßig auf false setzen

            subtasksHtml += `
                <div class="subtask-item">
                    <input class="checkbox" type="checkbox" id="subtask-${taskIndex}-${index}" ${isChecked ? 'checked' : ''} 
                    onchange="subtaskChecked(${taskIndex}, ${index})" />
                    <label class="checkboxtext" for="subtask-${taskIndex}-${index}">${subtask}</label>
                </div>
            `;
        });
    }

    return subtasksHtml;
}

function subtaskChecked(taskIndex, subtaskIndex) {
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
    const isChecked = document.getElementById(`subtask-${taskIndex}-${subtaskIndex}`).checked;
    subtaskStatus[subtaskIndex] = isChecked;
    localStorage.setItem(`task-${taskIndex}-subtasks`, JSON.stringify(subtaskStatus));

    updateProgress(taskIndex);
}

function updateProgress(taskIndex) {
    let indexTasksArray = taskIndex +1;
    const task = tasksArray.find(t => t.idTask === indexTasksArray);
    if (!task || !task.subtask) return;

    const totalSubtasks = task.subtask.length;
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
    const completedSubtasks = Object.values(subtaskStatus).filter(status => status).length;

    const progressPercentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;
    document.getElementById(`progressbarline-${taskIndex}`).style.width = `${progressPercentage}%`;
    document.getElementById(`progress-text-${taskIndex}`).innerText = `Subtasks: ${completedSubtasks}/${totalSubtasks}`;
}

async function initializeAllProgress() {
    for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
        const tasksArrayElement = tasksArray[taskIndex];
        const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};

        if (tasksArrayElement === undefined) {
            return;
        }

        // Überprüfen, ob subtasks leer sind
        if (!tasksArrayElement.subtask || tasksArrayElement.subtask.length === 0) {
            continue; // Wenn leer, zur nächsten Aufgabe gehen
        }

        tasksArrayElement.subtask.forEach((_, index) => {
            const isChecked = subtaskStatus[index] || false;
            const checkbox = document.getElementById(`subtask-${taskIndex}-${index}`);
            if (checkbox) {
                checkbox.checked = isChecked;
            }
        });
        updateProgress(taskIndex);
    }
}

function getassignecontacts(task, taskIndex) {
    let assignedContacts =task.Assigned;
    let maxContact = 4;
    let remainingContacts = assignedContacts.length - maxContact;

    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);
    console.log(assignedContacts)

    for (let index = 0; index <  assignedContacts.length; index++) {
        if (index === maxContact) {
            break; 
        }

        let contact = assignedContacts[index];  
            nameParts = contact.split(" ");

          let  firstLetterForName;
          let  firstLetterLastName;
          let colorid = `contactIcon_${taskIndex}_${index}`;

        if (nameParts.length >= 2) {
            firstLetterForName = nameParts[0].charAt(0).toUpperCase();
            firstLetterLastName = nameParts[1].charAt(0).toUpperCase();

            
            asignedContainer.innerHTML += `<div id="${colorid}"class="contact-iconBoard">
                    <span>${firstLetterForName}${firstLetterLastName} </span>
                </div>`;
        } else {
            firstLetterForName = nameParts[0].charAt(0).toUpperCase();
            asignedContainer.innerHTML += `<div id="${colorid}" class="contact-iconBoard">
                    <span>${firstLetterForName} </span>
                </div>`;

        }
        showTheNameInitialInColorBoard(firstLetterForName,colorid);
}
if (assignedContacts.length > 4) {
    asignedContainer.innerHTML += `<div id="colorName" class="contact-iconBoard">
    <span> +${remainingContacts} </span>
</div>`
}
}


function showTheNameInitialInColorBoard(firstLetterForName, colorid) {


    let nameColorContainer  = document.getElementById(colorid);
    colorLetter.forEach(colorLetterItem => {

        if (firstLetterForName === colorLetterItem.letter) {
            let currentColor = colorLetterItem.color; 
            nameColorContainer.style.backgroundColor = currentColor;
        }
    });
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


function startDragging(idBoard) {
    currentDraggedElement = idBoard;
}

function moveTo(event, category) {
    event.preventDefault();
    
    currentDraggedElement--;
    let task = tasksArray[currentDraggedElement];

    if (task) {
        console.log("Aktueller Task:", task);
        console.log("task.idTask:", task.idTask);

        if (task.idTask) {
            task.status = category;

            // Pfad anpassen
            putDataTask(`tasks/${task.idTask}`, { Status: category })
                .then(() => {
                    console.log("Status aktualisiert für Task:", task.idTask);
                    updateHtml();
                })
                .catch(error => {
                    console.error("Fehler beim Aktualisieren des Status:", error);
                });
        } else {
            console.error("task.idTask ist undefiniert. Die Aufgabe kann nicht aktualisiert werden.");
        }
    } else {
        console.error("Kein Task gefunden für den aktuellen Index:", currentDraggedElement);
    }
}

async function putDataTask(path = "", data = {}) {
    try {
        console.log("Sending data to:", base_URL + path + ".json");
        console.log("Data:", data);

        let response = await fetch(base_URL + path + ".json", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Fehler beim PATCH-Request: ${response.status}`);
        }

        let responseAsJson = await response.json();
        console.log("Server Response:", responseAsJson);
        return responseAsJson;
    } catch (error) {
        console.error("Fehler beim PATCH-Aufruf:", error);
    }
}


function saveTasksToLocalStorage() {
    localStorage.setItem('tasksArray', JSON.stringify(tasksArray)); 
}


function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasksArray'); 
    if (savedTasks) {
        tasksArray = JSON.parse(savedTasks); 
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
    let subtaskContainer= document.getElementById('subtasksContainer');
    subtaskContainer.innerHTML='';
    for (let i = 0; i < subtasks.length; i++) {
       subtaskContainer.innerHTML+= `
       
       <div class="li">${subtasks[i]}<button type="button" class="Subtasks_Btn" onclick="deleteItem(${i})"><img src="./assets/img/delete.png"></button></div>`
           ;
        
    }
}


// Subtask löschen
function deleteItem(i) {
    subtasks.splice(i, 1);
    addSubtask();
}



function addCurrentSubtask() {
    if (subtasks.length < 5) {
        let CurrentSubtask = document.getElementById('new-subtask').value;
        subtasks.push(CurrentSubtask);
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
    let search = document.getElementById('searchInput').value;
    let searchTask = search.toLowerCase();

    // Prüfen, ob mindestens 3 Zeichen eingegeben wurden
    if (searchTask.length >= 3) {
        // Alle Aufgaben durchsuchen
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            showTasksSearch(searchTask, todos, todo);
        });
    } else {
        // Wenn weniger als 3 Zeichen eingegeben wurden, alle Aufgaben ausblenden
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            todos.style.display = 'none';
        });
    }

    // Wenn das Suchfeld leer ist, alle Aufgaben anzeigen
    if (searchTask === '') {
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            todos.style.display = 'block';
        });
    }
}
function showTasksSearch(search, todos, todo) {
    let taskTitle = todo.Title.toLowerCase();

    // Überprüfen, ob der Titel die Suchzeichenkette enthält
    if (taskTitle.includes(search)) {
        todos.style.display = 'block';
    } else {
        todos.style.display = 'none';
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