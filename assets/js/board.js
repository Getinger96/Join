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
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    if (!userJSON.tasks) {
       

        return;
        
    }
    let tasksAsarray = Object.values(userJSON.tasks)
    let keysArrayTask = Object.keys(userJSON.tasks);
    currentDraggedElement = 0;
    id = 0

    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];
        let keyTask = keysArrayTask[index];
        id++;
        let saveTask = tasksArray.filter(t => keyTask === t.taskKey);
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
    document.getElementById('boardAddTask').style.display = 'none';
    document.getElementById('darkOverlay').style.display = 'none';
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

        if (!hasTodo) {
            if (!emptyMessage) {
                container.innerHTML = `
                    <div class="fiedIsempty"> 
                        <p>${field.text}</p>
                    </div>`;
            } else {
                emptyMessage.style.display = 'flex';
            }
        } else {
            if (emptyMessage) {
                emptyMessage.style.display = 'none';
            }
        }
    });
}

function showEmptyFields(text) {
    return ` 
    <div class="fiedIsempty"> 
        <p>${text}</p>
           </div>`;
}
function openTask(taskIndex) {
    currentTaskIndex = taskIndex;
    const windowWidth = window.innerWidth;
    let taskDiv = document.getElementById('boardAddTask');
    let overlay = document.getElementById('darkOverlay');
    if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
        taskDiv.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        taskDiv.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

}


async function closeTaskUpdate() {
    document.getElementById('boardAddTask').style.display = 'none';
    document.getElementById('darkOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
    clearTask();
    clearMissingFieldContent();
}

function generateTodoHTML(task, taskIndex) {
    let title = task.Title;
    let description = task.Description || "";
    let dueDate = task.duedate;
    let priority = task.Prio;
    let assignedContacts = task.Assigned || "";
    let category = task.Category;
    let idBoard = task.idTask;
    let priorityIcon = getPriorityIcon(priority);
    let categoryColor = getCategoryColor(category);
    const progressHtml = generateProgressHtml(task);

    return `
       <div class="todo" id="task_${task.idTask - 1}Element" draggable="true" ondragstart="startDragging(${task.idTask})" onclick="openToDo(${task.idTask})">
           <div class="boardCardheadlinesmall">  
               <div>
                   <div class="divKategorie"> 
                       <div class="categoryheadline" style="background-color: ${categoryColor};">
                           <span>${category} </span>
                       </div>
                       <div class="mobileCategory" onclick="showMoveTheElements(${task.idTask - 1})"> 
                           <img class="iconcategorybar" src="./assets/IMG/Menu Contact options.png" alt=""> 
                       </div>
                   </div>
                   <div id="fields_${task.idTask - 1}"></div> 
               </div>
           </div>
           <h3 id="task_Title${task.idTask - 1}" class="title">${title}</h3>
           <p class="description">${description}</p>
           ${progressHtml} <!-- Fortschritts-HTML wird hier eingefügt -->
           
           <!-- Wrapper für Kontakte und Prioritäts-Icon -->
           <div class="task-footer">
               <div class="boardContacts" id="assignedContacts${task.idTask}"></div>  
               <div class="priority-icon">
                   <img src="${priorityIcon}" alt="${priority} Priority">
               </div>
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
   else if (window.innerWidth > 1410 && window.innerWidth <= 1420) 
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

    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);


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
        let firstLetterForName;
        let firstLetterLastName;
        let colorid = `contactIcon_${taskIndex}_${index}`;

        if (nameParts.length >= 2) {
            firstLetterForName = nameParts[0].charAt(0).toUpperCase();
            firstLetterLastName = nameParts[1].charAt(0).toUpperCase();
            asignedContainer.innerHTML += `<div id="${colorid}"class="contact-iconBoard">
                    <span>${firstLetterForName}${firstLetterLastName}</span>
                </div>`;
        } else {
            firstLetterForName = nameParts[0].charAt(0).toUpperCase();
            asignedContainer.innerHTML += `<div id="${colorid}" class="contact-iconBoard">
                    <span>${firstLetterForName}</span>
                </div>`;
        }
        showTheNameInitialInColorBoard(checkIndexarray, colorid);
    }
    if (assignedContacts.length > 4) {
        asignedContainer.innerHTML += `<div id="colorName" class="contact-iconBoard">
    <span> +${remainingContacts} </span>
</div>`
    }
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

