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
        let keyTask = keysArrayTask[index];
        id++;
        let saveTask = tasksArray.filter(t => t.Title === task.Titel);
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
    console.log(tasksArray)

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
    console.log(subtask);
}

function closeTask() {
    document.getElementById('boardAddTask').style.display = 'none';
    document.getElementById('darkOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';  // Scrollen auf der Hauptseite wieder erlauben
    clearTask()
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
    await initializeAllProgress();
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


function closeTaskUpdate() {
    document.getElementById('boardAddTask').style.display = 'none';
    document.getElementById('darkOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
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
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${task.idTask - 1}-subtasks`)) || {};
    const completedSubtasks = Object.values(subtaskStatus).filter(isChecked => isChecked).length;
    const progressPercentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;

    let progressHtml = '';
    if (totalSubtasks > 0) {
        progressHtml = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress" id="progressbarline-${task.idTask - 1}" style="width: ${progressPercentage}%;"></div>
                </div>
                <span class="progresstext" id="progress-text-${task.idTask - 1}">Subtasks ${completedSubtasks}/${totalSubtasks}</span>
            </div>
        `;
    }

    return `
       <div class="todo" id="task_${task.idTask - 1}Element" draggable="true" ondragstart="startDragging(${task.idTask})" onclick="openToDo(${task.idTask})">
    <div class="divKategorie" style="background-color: ${categoryColor};">${category}</div>
    <h3 id="task_Title${task.idTask - 1}" class="title">${title}</h3>
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

function getassignecontacts(task, taskIndex) {
    let assignedContacts = task.Assigned;
    if (assignedContacts === undefined) {
        return
    }
    let maxContact = 4;
    let remainingContacts = assignedContacts.length - maxContact;

    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);
    console.log(assignedContacts)

    for (let index = 0; index < assignedContacts.length; index++) {
        if (index === maxContact) {
            break;
        }
        let contact = assignedContacts[index];
        nameParts = contact.split(" ");
        let firstLetterForName;
        let firstLetterLastName;
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
        showTheNameInitialInColorBoard(index, colorid);
    }
    if (assignedContacts.length > 4) {
        asignedContainer.innerHTML += `<div id="colorName" class="contact-iconBoard">
    <span> +${remainingContacts} </span>
</div>`
    }
}

function showTheNameInitialInColorBoard(index, colorid) {
    let nameColorContainer = document.getElementById(colorid);
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
    currentDraggedElement--;
    let task = tasksArray[currentDraggedElement];
    let key = task.taskKey;

    if (task.idTask) {
        task.status = category;
        await putDataTask(`tasks/${key}/Status`, category);
    }
    updateBoard(category, task, event);
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
    let taskElement = document.getElementById(`task_${task.idTask - 1}Element`);
    if (taskElement) {
        taskElement.remove();
    }
    let newCategoryColumn = document.getElementById(category);
    let taskHTML = generateTodoHTML(task, task.idTask);
    newCategoryColumn.innerHTML += taskHTML;
    checkEmptyFieldsMoveToUpdate();
    getassignecontacts(task, task.idTask);
}

function checkEmptyFieldsMoveToUpdate() {
    let fields = ["open", "progress", "awaitFeedback", "closed"];
    fields.forEach(fieldId => {
        let container = document.getElementById(fieldId);
        if (container) {
            if (container.children.length === 0) {
                container.innerHTML = showEmptyFields();
            } else {
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
        if (!hasTodo) {
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

