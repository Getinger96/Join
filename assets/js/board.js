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
    let keysArrayTask = Object.keys(userJSON.tasks);


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
    checkEmptyFields();
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
                                <p> text</p>
                            </div>`
    
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
    clearTask()
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


// Funktion zum Erstellen des HTML-Inhalts für die große ToDo-Anzeige
function getPriorityIcon(priority) {
    let checkPriority = priority[0];
    // Define priority icons
    let priorityIcon = '';
    if (checkPriority === 'urgent') {
        priorityIcon = './assets/img/Prio_urgent(2).svg';
    } else if (checkPriority === 'medium') {
        priorityIcon = './assets/IMG/Prio_medium(2).svg';
    } else if (checkPriority === 'low') {
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


function showTheNameInitialInColorBoard(colorid, index) {
    let nameColorContainer = document.getElementById(colorid);

    for (let indexColor = 0; indexColor < colorsBoard.length; indexColor++) {
        let colorItem = colorsBoard[indexColor];

        if (indexColor === index) {
            let currentColor = colorItem; 
            nameColorContainer.style.backgroundColor = currentColor;
            break;
        }
    }

    if (index >= colorsBoard.length) {
        let fallbackColorIndex = colorsBoard.length -7;
        let fallbackColor = colorsBoard[fallbackColorIndex];
        nameColorContainer.style.backgroundColor = fallbackColor;
    }
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
        task.Status = category;

    
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

    getassignecontacts(task, task.idTask);
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
    
    assignedContacts = [];
    

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