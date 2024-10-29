
/**
 * the function show card
 * @param {*} task task 
 * @param {*} taskIndex task id
 */
function showCard(task, taskIndex) {
    let todoBig = document.getElementById('todoBig');
    let showCardHTML = createShowCard(task, taskIndex); 
    todoBig.innerHTML = showCardHTML;

}
/**
 * the function open to do Card 
 * @param {*} taskIndex task id
 */
function openToDo(taskIndex) {
taskIndex--;
let task = tasksArray[taskIndex];  
let todoBig = document.getElementById('todoBig');
todoBig.classList = 'cardbig'; 
todoBig.innerHTML = '';

document.body.style.overflow = "hidden";
document.getElementById('overlay').classList.remove('d-none');

showCard(task, taskIndex );  
}

/**
 * the function generate small contact field
 * @param {*} assignedContacts assignedContacts elemente
 * 
 */
function generateSmallContactsHtml(assignedContacts) {
    let contactsHtml = '';
    assignedContacts.forEach((contact, index) => {
        let contactParts = contact.split(' ');
        let contactFirstname = contactParts[0] || '';  
        let contactLastname = contactParts.slice(1).join(' ') || '';  

        const color = getRandomColorForContact(); 
        contactsHtml += getSmallContactHtml(index, contactFirstname, contactLastname, color); 
    });
    return contactsHtml;
}
/**
 * the function generate larg contact field with  full name
 * @param {*} assignedContacts assignedContacts Element
 * 
 */
function generateLargeContactsHtml(assignedContacts) {
    let contactsHtml = ''; 

    for (let index = 0; index < assignedContacts.length; index++) {
        contactsHtml += generateContactHtml(assignedContacts[index], index);
    }
  
    return contactsHtml;  
}
/**
 * the function generate full element
 * @param {*} contact full contact
 * @param {*} index assignedContacts id
 * 
 */
function generateContactHtml(contact, index) {
    let nameParts = contact.split(' ');
    let contactFirstname = nameParts[0] || '';  
    let contactLastname = nameParts.slice(1).join(' ') || '';  

    let checkIndexarray = contactsArray.findIndex(c => c.name === contact);
    
    let firstLetterForName = contactFirstname.charAt(0).toUpperCase();
    let firstLetterLastName = contactLastname.charAt(0).toUpperCase();

    let color = showTheNameColor(checkIndexarray);
    
    return getLargeContactHtml(index, firstLetterForName, firstLetterLastName, contactFirstname, contactLastname, color);
}
/**
 * the function show the color name
 * @param {*} checkIndexarray check contact in taskarray and contaclistarray
 * 
 */
function showTheNameColor(checkIndexarray) {

    let contactColor = contactsArray[checkIndexarray].color
    contactColor = convertToValidColor(contactColor);
    
    
    return contactColor;

}
/**
 * the function generate the samll contact
 * @param {*} index assignedContacts id
 * @param {*} firstname firstname contact
 * @param {*} lastname  lastname contact
 * @param {*} color contact color
 * @returns 
 */
function getSmallContactHtml(index, firstname, lastname, color) {
    const initials = `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;
    return `
        <div class="contactCircle" style="background-color: ${color};">
            ${initials}
        </div>
    `;
}
/**
 * the function show the html element contact
 * @param {*} index assignedContacts id
 * @param {*} firstLetterForName firstname initial
 * @param {*} firstLetterLastName lastname initial
 * @param {*} contactFirstname firstname contact
 * @param {*} contactLastname lastname contact
 * @param {*} color contact color
 */
function getLargeContactHtml(index, firstLetterForName, firstLetterLastName, contactFirstname, contactLastname, color) {

    return `
        <div class="contact-box">
            <div class="contact-icon" style="background-color: ${color};">
                ${firstLetterForName}${firstLetterLastName}  
            </div>
            <div class="contact-content">
                <span class="contactname">${contactFirstname} ${contactLastname}</span>
            </div>
        </div>
    `;
}
/**
 * the function create the card element
 * @param {*} task tasks 
 * @param {*} taskIndex task id
 */
function createShowCard(task, taskIndex) {
    let title = task.Title || '';
    let description = task.Description || '';
    let dueDate = task.duedate || '';
    let priority = task.Prio;
    let assignedContacts1 = task.Assigned || [];
    let category = task.Category || '';
    
    assignedContacts.push(...assignedContacts1);


    const priorityIcon = getPriorityIcon(priority);
    const categoryColor = getCategoryColor(category);
    const contactsHtml = generateLargeContactsHtml(assignedContacts1);
    const subtasksHtml = generateSubtasksHtml(task.subtask, taskIndex);
    return generateCardHtml(title, description, dueDate, priority, priorityIcon, category, categoryColor, contactsHtml, subtasksHtml, taskIndex);
}
/**
 * 
 * the funtion show the html card 
 * @param {*} title task title
 * @param {*} description task description
 * @param {*} dueDate task dueDate
 * @param {*} priority task priority
 * @param {*} priorityIcon task priorityIcon
 * @param {*} category task category
 * @param {*} categoryColor task categoryColor
 * @param {*} contactsHtml task contactsHtml
 * @param {*} subtasksHtml task subtasksHtml
 * @param {*} taskIndex task taskIndex
 * @returns 
 */
function generateCardHtml(title, description, dueDate, priority, priorityIcon, category, categoryColor, contactsHtml, subtasksHtml, taskIndex) {
    return `
        <div class="todo-detail">
            <div>
                <div class="divKategorieCard" style="background-color: ${categoryColor};">${category}</div>
                <button onclick="closeOverlay(${taskIndex})" class="close-button"><img src="./assets/IMG/iconoir_cancel.png" alt=""></button>
            </div>
            <div>
                <h2>${title}</h2>
            </div>
            <div class="responsiveDescription">
                <p><strong>Description:</strong> ${description}</p>
            </div>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <div class="prioicon">
                <p><strong>Priority:</strong> 
                    <span class="">${priority}</span> 
                    <div class="prioicon-imgSection">
                        <img src="${priorityIcon}" alt="${priority} Priority">
                    </div> 
                </p>
            </div>
            <p><strong>Assigned To:</strong></p>
            <div class="assigned-contacts">
                ${contactsHtml}
            </div>
            <p class="subtaskstext"><strong>Subtasks:</strong></p>
            <div class="subtasks-container">
                ${subtasksHtml} <!-- Hier werden die Subtasks eingefügt -->
            </div>
        </div>
        <div class="actionBigTodo">
            <button class="actionBigButton" onclick="deleteTask(${taskIndex})">
                <img class="iconTodoBig" src="./assets/IMG/delete.png">
                <p>Delete</p>
            </button>
            <div></div>
            <button class="actionBigButton" onclick="EditData(${taskIndex})">
                <img class="iconTodoBig" src="./assets/IMG/edit.png">
                <p>Edit</p>
            </button>
        </div>
    `;
}

/**
 * the function closed overlay
 * @param {*} taskIndex task id
 */
function closeOverlay(taskIndex) {
    const todoBig = document.getElementById('todoBig');
    const overlay = document.getElementById('overlay');
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');

    todoBig.classList.add('d-none');
    overlay.classList.add('d-none');
    selectedProfileContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
    clearTask();
}
/**
 * the function closed eidt overlay
 * @param {*} taskIndex task id
 */
function closeoverlayedit(taskIndex) {
    const todoBig = document.getElementById('todoBig');
    const overlay = document.getElementById('overlay');
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    todoBig.classList.add('d-none');
    overlay.classList.add('d-none');
    selectedProfileContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
}


/**
 * 
 * @param {*} subtasks subtask element
 * @param {*} taskIndex task id
 * @returns 
 */
function generateSubtasksHtml(subtasks, taskIndex) {
    let subtasksHtml = '';
    const totalSubtasks = subtasks ? subtasks.length : 0;

    if (totalSubtasks > 0) {
        subtasks.forEach((subtask, index) => {
            const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
            const isChecked = subtaskStatus[index] || false; 

            subtasksHtml += showSubtasksHtml(taskIndex, index, isChecked, subtask);
        
        });
    }
    return subtasksHtml;
}
/**
 * the function show subtask html
 * @param {*} taskIndex task id
 * @param {*} subtaskIndex subtask id
 * @param {*} isChecked checkbox is checked
 * @param {*} subtask subtask element
 * @returns 
 */
function showSubtasksHtml(taskIndex, subtaskIndex, isChecked, subtask) {
    return `
    <div class="subtask-item">
        <input class="checkbox" type="checkbox" id="subtask-${taskIndex}-${subtaskIndex}" ${isChecked ? 'checked' : ''} 
        onchange="subtaskChecked(${taskIndex}, ${subtaskIndex})" />
        <label class="checkboxtext" for="subtask-${taskIndex}-${subtaskIndex}">${subtask}</label>
    </div>
`;
}

/**
 * the function checked checkbox
 * @param {*} taskIndex task id
 * @param {*} subtaskIndex subtask id     
 */
function subtaskChecked(taskIndex, subtaskIndex) {
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
    const isChecked = document.getElementById(`subtask-${taskIndex}-${subtaskIndex}`).checked;
    subtaskStatus[subtaskIndex] = isChecked;
    localStorage.setItem(`task-${taskIndex}-subtasks`, JSON.stringify(subtaskStatus));

    updateProgress(taskIndex);
}
/**
 * the function update subtask bar
 * @param {*} taskIndex task id   
 */
function updateProgress(taskIndex) {
    let indexTasksArray = taskIndex +1;
    const task = tasksArray.find(t => t.idTask === indexTasksArray);
    if (!task || !task.subtask) return;

    const totalSubtasks = task.subtask.length;
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
    const completedSubtasks = Object.values(subtaskStatus).filter(status => status).length;
    let progressLine = document.getElementById(`progressbarline-${taskIndex}`);
    if (!progressLine) return;  


    const progressPercentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;
    progressLine.style.width = `${progressPercentage}%`;
    document.getElementById(`progress-text-${taskIndex}`).innerText = `Subtasks: ${completedSubtasks}/${totalSubtasks}`;
}
/**
 * the function initialize all progress
 */
async function initializeAllProgress() {
    for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
        const tasksArrayElement = tasksArray[taskIndex];
        const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};

        if (tasksArrayElement === undefined) {
            return; 
        }
        if (!tasksArrayElement.subtask || tasksArrayElement.subtask.length === 0) {
            continue; 
        }
    
        await initializeSubtaskProgressElement(taskIndex, tasksArrayElement, subtaskStatus);
    }
}
/**
 * the function initialize subtask progress element
 * @param {*}taskIndex task id 
 * @param {*} tasksArrayElement task element
 * @param {*} subtaskStatus subtaskStatus checkbox
 */
async function initializeSubtaskProgressElement(taskIndex, tasksArrayElement, subtaskStatus) {
    tasksArrayElement.subtask.forEach((_, index) => {
        const isChecked = subtaskStatus[index] || false;
        const checkbox = document.getElementById(`subtask-${taskIndex}-${index}`);
        if (checkbox) {
            checkbox.checked = isChecked; 
        }
    });
    updateProgress(taskIndex);
}

/**
 * the function input search task element
 */
function search() {
let searchTask = getSearchInput();
    if (searchTask.length >= 3) {
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            showTasksSearch(searchTask, todos, todo);
        });
    } else {
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            hideTask(todos);
        });
    }
    if (searchTask === '') {
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            showTask(todos)
        });
    }
}
/**
 * the function get search value
 * 
 */
function getSearchInput() {
    return document.getElementById('searchInput').value.toLowerCase();
}

/**
 * the function hide task style
 * 
 */
function hideTask(taskElement) {
    taskElement.classList.add('hiddenToDo');
}
/**
 * the function show task style
 * 
 */
function showTask(taskElement) {
    taskElement.classList.remove('hiddenToDo');
}

/**
 * the function show the search task 
 * @param {*} search search value 
 * @param {*} todos all task element
 * @param {*} todo single task element
 */
function showTasksSearch(search, todos, todo) {
    let taskTitle = todo.Title.toLowerCase();
    let taskdescription= todo.Description.toLowerCase();

    if (taskTitle.includes(search)  || taskdescription.includes(search) ) {
        showTask(todos);
    } else {
        hideTask(todos);
    }
}
/**
 * the function allow to drop
 * @param {*} ev event
 */
function allowDrop(ev) {
    ev.preventDefault();
}
/**
 * the function allow to leave the drag area
 * @param {*} ev event
 */
function dragLeave(ev) {
    const target = ev.target.closest('.drag-area');
    if (target) {
        removeHighlight(target.id);
    }
}
/**
 * the function start dragging
 * @param {*} idBoard id borad element
 */
function startDragging(idBoard) {
    currentDraggedElement = idBoard;
}
/**
 * the function move to category
 * @param {*} ev event
 *  @param {*} idBoard id current category
 */
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
    updateAndCheckEmptyFields();
    removeHighlight(category);
}
/**
 * Sends data to the specified path in the database using the PUT method.
 * @async
 * @param {string} [path=""] - Path in the database where data is to be updated.
 * @param {Object} [data={}] - The data to be sent.
 * @returns {Object} - The JSON response from the database.
 */
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

/**
 * Adds a highlight effect to a specified category area when a drag event occurs over it.
 * @param {string} categoryId - The ID of the category to highlight.
 */
function handleDragOver(categoryId) {
    let dragArea = document.getElementById(categoryId);
    dragArea.classList.add('dragging-over');
}

/**
 * the function removes the highlight effect from a specified category area when a drag event ends.
 * @param {string} categoryId id  of the category to remove the highlight from.
 */
function removeHighlight(categoryId) {
    let dragArea = document.getElementById(categoryId);
    dragArea.classList.remove('dragging-over');
}

/**
 * Updates the board by removing a task from its current position
 * 
 * @async
 * @param {string} category the ID of the category 
 * @param {Object} task  the task object 
 * @param {Event} event  event
 */
async function updateBoard(category, task, event) {
    let taskElement = document.getElementById(`task_${task.idTask - 1}Element`);
    if (taskElement) {
        taskElement.remove();
    }
    
    let newCategoryColumn = document.getElementById(category);
    let taskHTML = generateTodoHTML(task, task.idTask);
    
    newCategoryColumn.insertAdjacentHTML('afterbegin', taskHTML);
    
    getassignecontacts(task, task.idTask);
    
    updateAndCheckEmptyFields();
}

/**
 * the function checks each category field for empty content
 */
function checkEmptyFieldsMoveToUpdate() {
    let fields = ["open", "progress", "awaitFeedback", "closed"];
    fields.forEach(fieldId => {
        let container = document.getElementById(fieldId);
        if (container) {
            if (container.children.length === 0) {
                container.innerHTML = showEmptyFields(fieldId);
            } else {
                let emptyField = container.querySelector('.fiedIsempty');
                if (emptyField) {
                    emptyField.remove();
                }
            }
        }
    });
    updateFields();
    updateAndCheckEmptyFields();
}

/**
 * the function adds a highlight effect dragarea element.
 * @param {string} id - The ID of the element to be highlighted.
 */
function highlight(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('drag-area-highlight');
    }
}


