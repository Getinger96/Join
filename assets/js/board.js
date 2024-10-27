let subtasks = [];
let subtask = [];
let tasksArray = [];
let subTaskChecked = [];
let currentTaskIndex = null;
let currentDraggedElement;
let id = 0
let addtask = false;

async function fetchTasks(path = '') {
    tasksArray = [];
    const userJSON = await fetchTasksFromServer(path);
    if (!userJSON.tasks) {
        return;     
    }

    const tasksAsArray = Object.values(userJSON.tasks);
    const keysArrayTask = Object.keys(userJSON.tasks);
    
    await processTasks(tasksAsArray, keysArrayTask);
    updatedView();
}

async function fetchTasksFromServer(path) {
    let response = await fetch(base_URL + path + ".json");
    return await response.json();
}

async function processTasks(tasksAsArray, keysArrayTask) {
    currentDraggedElement = 0;
    let id = 0;

    for (let index = 0; index < tasksAsArray.length; index++) {
        let task = tasksAsArray[index];
        let keyTask = keysArrayTask[index];
        id++;
        
        if (!isTaskAlreadySaved(keyTask)) {
            saveTask(keyTask, id, task);
        }
    }
}

function isTaskAlreadySaved(keyTask) {
    let saveTask = tasksArray.filter(t => keyTask === t.taskKey);
    return saveTask.length > 0;
}

function saveTask(keyTask, id, task) {
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


async function updatedView() {
    removeAllElement();
    await updateHtml();
    renderSubtask();

}


function removeAllElement() {
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
}
function closeTask() {
    let boardAddTask = document.getElementById('boardAddTask');
    let darkOverlay = document.getElementById('darkOverlay');

    boardAddTask.classList.remove('visible');
    darkOverlay.classList.remove('visible');
    document.body.style.overflow = 'auto';

    clearTask();
    clearMissingFieldContent();
    returnColorPrioIcons();
    location.reload();
}


async function updateHtml() {
    let statusCategories = ['open', 'progress', 'awaitFeedback', 'closed'];
    for (let index = 0; index < statusCategories.length; index++) {
        let category = statusCategories[index];
        let filteredTasks = tasksArray.filter(t => t.status === category);
        let currentCategoryElement = document.getElementById(category)

        if (!currentCategoryElement) {
            return
        }

        currentCategoryElement.innerHTML = '';

        filteredTasks.forEach(task => {
            let taskHTML = generateTodoHTML(task, task.idTask);
            document.getElementById(category).insertAdjacentHTML('afterbegin', taskHTML);
            getassignecontacts(task, task.idTask);
        });
    }
    updateAndCheckEmptyFields();
    await initializeAllProgress();
}


function updateAndCheckEmptyFields() {
    let fields = [
        { id: "open", text: "No tasks open" },
        { id: "progress", text: "No tasks in progress" },
        { id: "awaitFeedback", text: "No tasks awaiting feedback" },
        { id: "closed", text: "No tasks done" }
    ];

    fields.forEach(field => {
        let container = document.getElementById(field.id);
        let hasTodo = container.querySelector('.todo');
        let emptyMessage = container.querySelector('.fiedIsempty');
        checkAndDisplayEmptyMessage(container, hasTodo, field.text, emptyMessage);

    });
}

function checkAndDisplayEmptyMessage(container, hasTodo, messageText, emptyMessage) {
        
    if (!hasTodo) {
            if (!emptyMessage) {
                container.innerHTML = `
                    <div class="fiedIsempty"> 
                        <p>${messageText}</p>
                    </div>`;
            } else {
                emptyMessage.classList.remove('visibleContainer');
            }
        } else {
            if (emptyMessage) {
                emptyMessage.classList.add('visibleContainer');
            }
        }
    }

function showEmptyFields(text) {
    return ` 
    <div class="fiedIsempty"> 
        <p>${text}</p>
           </div>`;
}

function openTask(taskIndex) {
    currentTaskIndex = taskIndex;
    let taskDiv = document.getElementById('boardAddTask');
    let darkOverlay = document.getElementById('darkOverlay');

    if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
        boardAddTask.classList.add('visible');
        darkOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    } else {
        boardAddTask.classList.remove('visible');
        darkOverlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }

}

async function closeTaskUpdate() {
    let boardAddTask = document.getElementById('boardAddTask');
    let darkOverlay = document.getElementById('darkOverlay');

    boardAddTask.classList.remove('visible');
    darkOverlay.classList.remove('visible');
    document.body.style.overflow = 'auto';

    clearTask();
    clearMissingFieldContent();
}

function generateTodoHTML(task, taskIndex) {
    const title = task.Title;
    const description = task.Description || "";
    const priority = task.Prio;
    const category = task.Category;
    const priorityIcon = getPriorityIcon(priority);
    const categoryColor = getCategoryColor(category);
    const progressHtml = generateProgressHtml(task);

    return `
       <div class="todo" id="task_${task.idTask - 1}Element" draggable="true" ondragstart="startDragging(${task.idTask})" onclick="openToDo(${task.idTask})">
           ${generateHeader(category, categoryColor, task.idTask)}
           <h3 id="task_Title${task.idTask - 1}" class="title">${title}</h3>
           <p class="description">${description}</p>
           ${progressHtml} <!-- Fortschritts-HTML wird hier eingefügt -->
           ${generateFooter(priorityIcon, task.idTask)}
       </div>`;
}


function generateHeader(category, categoryColor, taskId) {
    return `
        <div class="boardCardheadlinesmall">  
            <div>
                <div class="divKategorie"> 
                    <div class="categoryheadline" style="background-color: ${categoryColor};">
                        <span>${category} </span>
                    </div>
                    <div class="mobileCategory" onclick="showMoveTheElements(${taskId - 1})"> 
                        <img class="iconcategorybar" src="./assets/IMG/Menu Contact options.png" alt=""> 
                    </div>
                </div>
                <div id="fields_${taskId - 1}"></div> 
            </div>
        </div>`;
}

function generateFooter(priorityIcon, taskId) {
    return `
        <div class="task-footer">
            <div class="boardContacts" id="assignedContacts${taskId}"></div>  
            <div class="priority-icon">
                <img src="${priorityIcon}" alt="${taskId} Priority">
            </div>
        </div>`;
}

function generateProgressHtml(task) {
    const subtasks = task.subtask || [];
    const totalSubtasks = subtasks.length;
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${task.idTask - 1}-subtasks`)) || {};
    const completedSubtasks = Object.values(subtaskStatus).filter(isChecked => isChecked).length;
    const progressPercentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;

    if (totalSubtasks > 0) {
        return `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress" id="progressbarline-${task.idTask - 1}" style="width: ${progressPercentage}%;"></div>
                </div>
                <span class="progresstext" id="progress-text-${task.idTask - 1}">Subtasks ${completedSubtasks}/${totalSubtasks}</span>
            </div>
        `;
    }
    return '';
}

function showMoveTheElements(idTask) {
    event.stopPropagation();

    if (window.innerWidth <= 1410) {
        toggleMenu(idTask);
    } else if (window.innerWidth > 1410 && window.innerWidth <= 1420) {
        hideMenu(idTask);
    }
}

function toggleMenu(idTask) {
    let fieldsContainer = document.getElementById(`fields_${idTask}`);
    let existingMenu = fieldsContainer.querySelector('.showsmallFieldBar');

    if (existingMenu) {
        fieldsContainer.innerHTML = '';
    } else {
        fieldsContainer.innerHTML = `
            <div id="existingmenu" class="showsmallFieldBar" onclick="event.stopPropagation()">
                <div class="headlsmallField"></div>
                <div class="fieldElement"> <span class="statusField" onclick="moveTaskTo(${idTask}, 'open', event)">todo</span></div>
                <div class="fieldElement"> <span class="statusField" onclick="moveTaskTo(${idTask}, 'progress', event)">Progress</span></div>
                <div class="fieldElement"> <span class="statusField" onclick="moveTaskTo(${idTask}, 'awaitFeedback', event)">awaitFeedback</span></div>
                <div class="fieldElement"> <span class="statusField" onclick="moveTaskTo(${idTask}, 'closed', event)">done</span></div>
            </div>`;
    }
}

function hideMenu(idTask) {
    let fieldsContainer = document.getElementById(`fields_${idTask}`);
    let existingMenu = fieldsContainer.querySelector('.showsmallFieldBar');

    if (existingMenu) {
        fieldsContainer.innerHTML = '';
    }
}

document.addEventListener('click', function(event) {
    const openMenu = document.querySelector('.showsmallFieldBar');
    if (openMenu && !openMenu.contains(event.target)) {
        openMenu.remove();
    }
});


function handleResize() {
    const windowWidth = window.innerWidth;
    const openMenu = document.querySelector('.showsmallFieldBar');

    if (windowWidth > 1410) {
        if (openMenu) {
            openMenu.remove();
        }
    }
}

 async function moveTaskTo(idTask, newStatus, event) {
    event.stopPropagation();  
    idTask++;
    let taskIndex = tasksArray.findIndex(task => task.idTask === idTask);
    
    if (taskIndex !== -1) {
        tasksArray[taskIndex].status = newStatus;
        let key =tasksArray[taskIndex].taskKey;
        await putDataTask(`tasks/${key}/Status`, newStatus);
        updateBoard(newStatus, tasksArray[taskIndex]);
    }
    
}
function getPriorityIcon(priority) {
    let checkPriority = priority;
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
    return priorityIcon;
}

function getCategoryColor(category) {
    if (category === 'Technical Task') {
        return '#1FD7C1';
    }
    return '#0038FF';
}

async function getassignecontacts(task, taskIndex) {
    let assignedContacts = task.Assigned;
    if (assignedContacts === undefined) {
        return
    }
    let maxContact = 4;
    let remainingContacts = assignedContacts.length - maxContact;

    updateGetAssigneContacts(assignedContacts, taskIndex, maxContact, remainingContacts);
}

async function updateGetAssigneContacts(assignedContacts, taskIndex, maxContact, remainingContacts) {
    for (let index = 0; index < assignedContacts.length; index++) {
        if (index === maxContact) {
            break;
        }
        let contact = assignedContacts[index];

        if (contactsArray.length === 0) {
            await fetchContacts();
        }   

        let checkIndexarray = contactsArray.findIndex(c => c.name === contact);
        nameParts = contact.split(" ");
        let colorid = `contactIcon_${taskIndex}_${index}`;

        if (nameParts.length >= 2) {
            getAssignCcontactsForAndLastName(taskIndex, nameParts ,colorid)
        } else {
            getAssignCcontactsForName(taskIndex, colorid)
        }
        showTheNameInitialInColorBoard(checkIndexarray, colorid);
    }
    if (assignedContacts.length > 4) {
        showTheNearestContactsAsNumbers(taskIndex, remainingContacts)
    }
}

function getAssignCcontactsForAndLastName(taskIndex, nameParts ,colorid ) {
    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);
    let firstLetterForName;
    let firstLetterLastName;

    firstLetterForName = nameParts[0].charAt(0).toUpperCase();
    firstLetterLastName = nameParts[1].charAt(0).toUpperCase();
    asignedContainer.innerHTML += `<div id="${colorid}"class="contact-iconBoard">
            <span>${firstLetterForName}${firstLetterLastName}</span>
        </div>`;
}

function getAssignCcontactsForName(taskIndex, colorid ) {
    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);
    let firstLetterForName;

    firstLetterForName = nameParts[0].charAt(0).toUpperCase();
    asignedContainer.innerHTML += `<div id="${colorid}" class="contact-iconBoard">
            <span>${firstLetterForName}</span>
        </div>`;

}

function showTheNearestContactsAsNumbers(taskIndex, remainingContacts) {
    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);

    asignedContainer.innerHTML += `<div id="colorName" class="contact-iconBoard">
    <span> +${remainingContacts} </span>
</div>`
}

function showTheNameInitialInColorBoard(checkIndexarray, colorid) {
    let nameColorContainer = document.getElementById(colorid);
    let contactColor = contactsArray[checkIndexarray].color
    contactColor = convertToValidColor(contactColor);
    nameColorContainer.style.backgroundColor = contactColor;
}

function convertToValidColor(color) {
    const colorMap = {
        "hellorange": "#FFA07A",
        "türkis": "#40E0D0",
        "gelb": "#FFC300",
        "grün": "#008000",
        "blau": "#0000FF",
        "pink": "#FF33A1",
        "orange": "#FF5733",
        "lila": "#A133FF"
    };
    return colorMap[color];
}

