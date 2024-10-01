let subtasks = [];
let subtask = [];
let tasksArray = [];
let subTaskChecked = [];
let currentTaskIndex = null;

const colorsBoard = [
    { index: 0, color: 'orange' },
    { index: 1, color: 'yellow' },
    { index: 2, color: 'green' },
    { index: 3, color: 'turquoise' },
    { index: 4, color: 'blue' },
    { index: 5, color: 'purple' },
    { index: 6, color: 'pink' },
    { index: 7, color: 'light orange' }
];
let currentDraggedElement;
let id = 0

async function fetchTasks(path = '') {
    tasksArray = [];
    
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let tasksAsarray = Object.values(userJSON.tasks)
    let keysArrayTask = Object.keys(userJSON.tasks);
    currentDraggedElement = 0;
    id = 0
    localStorage.removeItem(`task-${id}-subtasks`);   


    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];
        let keyTask =  keysArrayTask[index];
        id++;


        let saveTask = tasksArray.filter(t => t.Title === task.Titel);

        // Beispielbedingung, die du anpassen kannst
        if (saveTask.length > 0) {
            console.log(`Task mit Titel "${task.Titel}" existiert bereits.`);
    
        } else {
          
            tasksArray.push({
                taskKey: keyTask,
                idTask: id,
                Title: task.Titel,
                Description: task.Description,
                Assigned: task.AssignedContact,
                duedate: task.Date,
                Prio: task.Prio,
                Category: task.Category,
                subtask: task.Subtask,
                status: task.Status,
            });

    
        }
    }
        
    
   
    
         removeAllElement(); 
  await  updateHtml();

    renderSubtask();
    console.log(tasksArray)

}


function removeAllElement () {
    let allElements = document.querySelectorAll('.drag-area');
    allElements.forEach(element => element.innerHTML = '');
}


function renderSubtask() {
    let idSubtask = 0
    for (let index = 0; index < tasksArray.length; index++) {
        idSubtask++;
        let subtaskElement = tasksArray[index].subtask;
        localStorage.removeItem(`task-${id}-subtasks`);   

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
    checkEmptyFields();
    await  initializeAllProgress(); 
}


function checkEmptyFields() {
    let fields = ["open", "progress", "awaitFeedback", "closed"];

    fields.forEach(fieldId => {
        let container = document.getElementById(fieldId);
        if (container && container.children.length === 0) { // children Holen Sie sich eine Sammlung der untergeordneten Elemente
            container.innerHTML = showEmptyFields();;  // Füge leere Felder zur Liste hinzu
        }
    });


}


function showEmptyFields() {
    return ` <div class="fiedIsempty"> 
                                <p> Field is empty </p>
                            </div>`
    
}



function openTask(taskIndex) {
    currentTaskIndex = taskIndex;
    const windowWidth = window.innerWidth;

    // Wenn die Bildschirmbreite kleiner oder gleich 1450px ist, zur add_task.html weiterleiten
  
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



function openTaskBoard() {
    const windowWidth = window.innerWidth;

    // Wenn die Bildschirmbreite kleiner oder gleich 1450px ist, zur add_task.html weiterleiten
   
        // Standardmäßig das Overlay öffnen
        let taskDiv = document.getElementById('boardAddTask');
        let overlay = document.getElementById('darkOverlay');

        if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
            taskDiv.style.display = 'block';  // Overlay anzeigen
            overlay.style.display = 'block';  // Dunklen Hintergrund anzeigen
            document.body.style.overflow = 'hidden';  // Hauptseite scrollen verhindern
            setCreateTaskButton();
        } else {
            taskDiv.style.display = 'none';  // Overlay ausblenden
            overlay.style.display = 'none';  // Dunklen Hintergrund ausblenden
            document.body.style.overflow = 'auto';  // Scrollen auf der Hauptseite wieder erlauben
        }
    
}









function closeTask() {
    document.getElementById('boardAddTask').style.display = 'none';
    document.getElementById('darkOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';  // Scrollen auf der Hauptseite wieder erlauben
    clearTask()
}

function closeTaskUpdate() {
    document.getElementById('boardAddTask').style.display = 'none';
    document.getElementById('darkOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';  // Scrollen auf der Hauptseite wieder erlauben
}



function generateTodoHTML(task, taskIndex) {

    
    let title = task.Title;
    let description = task.Description || "";
    let dueDate = task.duedate;
    let priority = task.Prio;
    let assignedContacts = task.Assigned || "";
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
                <span class="progresstext" id="progress-text-${task.idTask-1}">Subtasks ${completedSubtasks}/${totalSubtasks}</span>
            </div>
        `;
    }

    return `
       <div class="todo" id="task_${task.idTask-1}Element" draggable="true" ondragstart="startDragging(${task.idTask})" onclick="openToDo(${task.idTask})">
    <div class="divKategorie" style="background-color: ${categoryColor};">${category}</div>
    <h3 id="task_Title${task.idTask-1}" class="title">${title}</h3>
    <div>
    <p class="description">${description}</p>
    </div>
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


// Funktion zum Erstellen des HTML-Inhalts für die große ToDo-Anzeige
function getPriorityIcon(priority) {
    let checkPriority = priority;
    // Define priority icons
    let priorityIcon = '';
    if (checkPriority === 'urgent') {
        priorityIcon = './assets/IMG/Priority symbols (1).png';
    } else if (checkPriority === 'medium') {
        priorityIcon = './assets/IMG/Priority symbols (2).png';
    } else if (checkPriority === 'low') {
        priorityIcon = './assets/IMG/Priority symbols.png';
    } else {
        priorityIcon = './assets/IMG/Priority symbols.png';
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



function getassignecontacts(task, taskIndex) {
    let assignedContacts =task.Assigned;
    if (assignedContacts === undefined) {
        return
    }
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
        showTheNameInitialInColorBoard(index,colorid);
}
if (assignedContacts.length > 4) {
    asignedContainer.innerHTML += `<div id="colorName" class="contact-iconBoard">
    <span> +${remainingContacts} </span>
</div>`
}
}


function showTheNameInitialInColorBoard(index, colorid) {
    let nameColorContainer  = document.getElementById(colorid);


    colorsBoard.forEach(indexColor => {

        if (indexColor.index === index) {
            let currentColor = indexColor.color; 
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

async function moveTo(event, category) {
    event.preventDefault();
    
    currentDraggedElement--; // Reduziere den Index auf 0-basierten Index
    let task = tasksArray[currentDraggedElement]; // Hole das Task-Objekt
    let key = task.taskKey;

    if (task.idTask) {
        // 1. Ändere den Status der Aufgabe
        task.status = category;

    
      await  putDataTask(`tasks/${key}/Status`, category);

        
}
 updateBoard(category,task,event);

}
async function putDataTask(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return responsASJson = await response.json();
}


async function updateBoard(category, task, event) {
    let taskElement = document.getElementById(`task_${task.idTask-1}Element`);
    if (taskElement) {
        taskElement.remove();
    }

    let newCategoryColumn = document.getElementById(category);
    let taskHTML = generateTodoHTML(task, task.idTask);
    newCategoryColumn.innerHTML += taskHTML;

    // Überprüfe die Felder und aktualisiere den Inhalt

    checkEmptyFieldsMoveToUpdate();
    getassignecontacts(task, task.idTask);

}

function checkEmptyFieldsMoveToUpdate() {
    let fields = ["open", "progress", "awaitFeedback", "closed"];
    fields.forEach(fieldId => {
        let container = document.getElementById(fieldId);
        if (container) {
            if (container.children.length === 0) {
                // Wenn das Feld leer ist, zeige das leere Feld an
                container.innerHTML = showEmptyFields();
            } else {
                // Wenn das Feld nicht leer ist, entferne das leere Element
                let emptyField = container.querySelector('.fiedIsempty');
                if (emptyField) {
                    emptyField.remove();
                }
            }
        }
    });
    updateFields();
}


function updateFields() {
    const allElements = document.querySelectorAll('.drag-area');

allElements.forEach((div) => {
    const hasTodo = div.querySelector('.todo');
    if(!hasTodo) {
        div.innerHTML = `
        <div class="fiedIsempty"> 
            <p> Field is empty</p>
        </div>
        `;
    }
});
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
    // Ensure 'subtasks' is initialized as an array if it's not already
    if (!Array.isArray(subtasks)) {
        subtasks = [];
    }

    // Get the container for subtasks
    let subtaskContainer = document.getElementById('subtasksContainer');

    // Clear previous subtasks displayed in the container
    subtaskContainer.innerHTML = '';

    // Check if subtasks array has any items
    if (subtasks.length === 0) {
        return;
    }

    // Loop through the subtasks array and render each subtask
    for (let i = 0; i < subtasks.length; i++) {
        subtaskContainer.innerHTML += `
            <div class="editSubtaskheadlineContainer" >
            <div class="editSubtask" id="subTaskValueId${i}">
                ${subtasks[i]}
                </div>
            <div class="subtaskEditDiv">
                <button type="button" class="Subtasks_Btn" onclick="deleteItem(${i})">
                    <img src="./assets/IMG/delete.png" alt="Delete">
                </button>

            
              <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                    <img src="./assets/IMG/edit.png" alt="Delete">
                </button>
            </div>
            </div>`;
    }
}

function editSubtask(i) {

    document.getElementById(`subTaskValueId${i}`).innerHTML = `
    <input id="subtaskValue${i}" class="subTaskInptu" type="text" placeholder="${subtasks[i]}">`

    document.getElementById(`changeImgEdit${i}`).innerHTML = `
   <button type="button" class="EditSubtaskButton" onclick="enterNewSubtask(${i})">
                    <img class="imgCheckedIcon" id="changeImgEdit${i}" src="./assets/IMG/checkAddTask.png" alt="check">
                </button>`;



}


function enterNewSubtask(i) {

   let newSubTask = document.getElementById(`subtaskValue${i}`).value

   subtasks[i] =newSubTask;
   document.getElementById(`changeImgEdit${i}`).innerHTML =

    addSubtask();
    
}


function deleteItem(i) {
    // Entferne die Subtask aus dem Array
    subtasks.splice(i, 1);

    // Aktualisiere den Task im tasksArray
    let taskIndex = currentTaskIndex; // Stelle sicher, dass du den aktuellen Task-Index hast
    tasksArray[taskIndex].subtask = subtasks; // Aktualisiere die Subtask-Liste im tasksArray

    // Aktualisiere den gespeicherten Status der Subtasks in localStorage
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};

    // Entferne die Subtask auch aus dem gespeicherten Status
    delete subtaskStatus[i];

    // Speichere den neuen Subtask-Status zurück in den localStorage
    localStorage.setItem(`task-${taskIndex}-subtasks`, JSON.stringify(subtaskStatus));

    // Aktualisiere die Anzeige der Subtasks und die Progress-Bar
    addSubtask();
    updateProgress(taskIndex);  // Aktualisiere den Fortschritt für die gelöschte Subtask
}



function addCurrentSubtask() {

    if (!subtasks) {
        subtasks = [];
    }

        let currentSubtask = document.getElementById('new-subtask').value;

        if (currentSubtask === "") {
            alert('Bitte geben Sie eine gültige Subtask ein.'); // Prompt user to input valid subtask
            return;
        }

        if (subtasks.length < 5) {

        subtasks.push(currentSubtask);
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
        { id: 'urgent', color: 'initial', imgSrc: './assets/IMG/Priority symbols (1).png' },
        { id: 'medium', color: 'initial', imgSrc: './assets/IMG/Priority symbols (2).png' },
        { id: 'low', color: 'initial', imgSrc: './assets/IMG/Priority symbols.png' }
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
    mediumIcon.src = "./assets/IMG/Priority symbols (2).png";

    currentPriority = 'medium';  // Setzt die Priorität auf 'medium'
}

function low() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let lowButton = document.getElementById("low");
    let lowIcon = document.getElementById("lowIcon");

    // Setze die neuen Styles und das Bild
    lowButton.style.backgroundColor = "limegreen";
    lowButton.style.color = "white";
    lowIcon.src = "./assets/IMG/Priority symbols.png";

    currentPriority = 'low';  // Setzt die Priorität auf 'low'
}


//Add Task leeren
function clearTask() {

    for (let contactIndex = 0; contactIndex < contactsArray.length; contactIndex++) {
        let contact = contactsArray[contactIndex];
        deselctedtContact(contactIndex, contact.name, `${contact.name.charAt(0).toUpperCase()}${getLastName(contact.name).charAt(0).toUpperCase()}`, contact.color);
    }


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
    

    // Subtask-Eingabefeld leeren
    let subtaskContainer= document.getElementById('subtasksContainer');
    
    if (subtaskContainer) {
        subtaskContainer.innerHTML = '';
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
    
    assignedContacts = [];
    subtasks= [];
    

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
                icon.src = './assets/IMG/Priority symbols (1).png';
                break;
            case 'medium':
                icon.src = './assets/IMG/Priority symbols (2).png';
                break;
            case 'low':
                icon.src = './assets/IMG/Priority symbols.png';
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