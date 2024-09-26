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
                <button onclick="closeOverlay(${taskIndex})" class="close-button"><img src="./assets/img/iconoir_cancel.png" alt=""></button>
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
            <button class="actionBigButton" onclick="EditData(${taskIndex})">
                <img class="iconTodoBig" src="./assets/img/edit.png">
                <p>Edit</p>
            </button>
        </div>
    `;
}

function closeOverlay(taskIndex) {
    const todoBig = document.getElementById('todoBig');
    const overlay = document.getElementById('overlay');
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');

    todoBig.classList.add('d-none');
    overlay.classList.add('d-none');
    selectedProfileContainer.innerHTML = '';


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


