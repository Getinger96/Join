let colors = [
    'orange',
    'gelb',
    'grün',
    'türkis',
    'blau',
    'lila',
    'pink',
    'hellorange'
];

const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contactsArray = [];
let beginningLetter = [];
let groupedContacts = [];
let assignedContacts = [];
let currentPriority = 'none';
let currentCategory = 'open';
let path = "tasks";
let currentStatus;

/**
 * Creates a new task and prevents default form submission.
 * @param {*} event event
 */
async function createTask(event) {
    event.preventDefault();

    if (!validateInputFields()) {
        return;
    }

    let newTodo = getTaskDetails();
    await createNewTodo(newTodo);
    resetAfterCreation();
}


/**
 * Validates input fields.
 * @returns {boolean} 
 */
function validateInputFields() {
    let titleElement = document.getElementById('taskTitle');
    let dueDateElement = document.getElementById('taskDueDate');
    let kategorieElement = document.getElementById('kategorie');

    if (!validateTask(titleElement, kategorieElement, dueDateElement)) {
        return false;
    } else {
        clearValidationMessages();
        return true;
    }
}
/**
 * Clears validation messages.
 */
function clearValidationMessages() {
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';
}


/**
 * 
 *  list and returns task details from input fields.
 */
function getTaskDetails() {
    let titleElement = document.getElementById('taskTitle');
    let dueDateElement = document.getElementById('taskDueDate');
    let kategorieElement = document.getElementById('kategorie');
    let title = titleElement.value.trim();
    let dueDate = dueDateElement.value.trim();
    let kategorie = kategorieElement.value.trim();
    let descriptionElement = document.getElementById('description');
    let description = descriptionElement ? descriptionElement.value.trim() : '';
    let priority = currentPriority;
    let subtask = subtasks;
    let validCategories = ['open', 'progress', 'awaitFeedback', 'closed'];
    let status = validCategories.includes(kategorie) ? kategorie : 'open';
    return {
        Titel: title,
        Description: description,
        Date: dueDate,
        Prio: priority,
        Category: kategorie,
        Subtask: subtask,
        Status: status,
        AssignedContact: assignedContacts,
    };
}

/**
 * Posts a new task to the server.
 */
async function createNewTodo(newTodo) {
    await postData(`tasks`, newTodo);
}

/**
 * Resets fields and reloads tasks after creation.
 */
function resetAfterCreation() {
    tasksArray = [];
    closeTaskUpdate();
    assignedContacts = [];
    fetchTasks();
}

/**
 * Sends a POST request to the server.
 * @param {string} path Request path
 * @param {Object} data Data to post
 * @returns {Object} Server response
 */
async function postData(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return responsASJson = await response.json();
}

/**
 * Deletes data from the API .
 * @param {string} path API path for delete
 */
async function deleteData(path = "") {
    let response = await fetch(base_URL + path + ".json", {
        method: "DELETE",
    });

    return responsASJson = await response.json();
}
/**
 * Updates  API put function
 * @param {string} path API path for put data
 * @param {Object} data Data to update
 * @returns {Object} Response from the server
 */
async function putDataEdit(path = "", data = {}) {
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
 * Deletes a task and updates the task list in local storage .
 * @param {number} task Index of the task to delete
 */
async function deleteTask(task) {
    localStorage.removeItem(`task-${task}-subtasks`);
    let key = tasksArray[task].taskKey;
    await deleteData(`tasks/${key}`);
    tasksArray.splice(task, 1);
    closeOverlay();
    location.reload();
}


/**
 * Edits a task by populating form fields and rendering contacts.
 * @param {number} index Index of the task to edit
 */ 
async function EditData(index) {
    openTask(index);
    let task = tasksArray[index];
    let title = task.Title;
    let description = task.Description;
    let dueDate = task.duedate;
    let priority = task.Prio;
    let assignedContacts = task.Assigned || [];
    let category = task.Category;
    let subtask = task.subtask;
    let status = task.status;
    currentCategory = status;
    getContacts();
    closeoverlayedit(index);
    
    renderAssignedContacts(assignedContacts);
    populateTaskFields(title, description, dueDate, priority, category, subtask, index);
}



/**
 * Fills task form fields for editing.
 * @param {string} title Task title
 * @param {string} description Task description
 * @param {string} dueDate Task due date
 * @param {string} priority Task priority
 * @param {string} category Task category
 * @param {Array} subtask Task subtasks
 * @param {number} index Task index
 */
function populateTaskFields(title, description, dueDate, priority, category, subtask, index) {
    let tasktitle = document.getElementById('taskTitle');
    tasktitle.value = title;
    let taskdescription = document.getElementById('description');
    taskdescription.value = description;
    let taskDAte = document.getElementById('taskDueDate');
    taskDAte.value = dueDate;
    setPriority(priority);
    let taskCategory = document.getElementById('kategorie');
    taskCategory.value = category;

    subtasks = subtask;
    addSubtask();
    changeAddtaskButton(index);
}

/**
 * Sets task priority based on its value.
 * @param {string} priority Priority level (urgent, medium, or low)
 */

function setPriority(priority) {
    if (priority == 'urgent') {
        urgent();
    } else if (priority == 'medium') {
        medium();
    } else if (priority == 'low') {
        low();
    }
}

/**
 * Validates and edits a task's details.
 * @param {number} index Index of the task to edit
 */
async function createEdittask(index) {
        let tasktitle = document.getElementById('taskTitle');
        let taskdescription = document.getElementById('description');
        let taskDAte = document.getElementById('taskDueDate');
        let taskCategory = document.getElementById('kategorie');
        let task = tasksArray[index];
        let status = task.status
        let key = task.taskKey;
        
        if (!validateTask(tasktitle, taskCategory, taskDAte)) {
            return;
        } else{ 
            createEdittaskPut(tasktitle, taskdescription, taskDAte, taskCategory, task, status, key)
        }
            
    }

/**
 * Sends an updated task to the server.
 * @param {HTMLElement} tasktitle Task title element
 * @param {HTMLElement} taskdescription Task description element
 * @param {HTMLElement} taskDAte Task due date element
 * @param {HTMLElement} taskCategory Task category element
 * @param {Object} task Task data
 * @param {string} status Task status
 * @param {string} key Task unique key
 */    
async function createEdittaskPut(tasktitle, taskdescription, taskDAte, taskCategory, task, status, key) {   
    let editedTASk = {
        
        Titel: tasktitle.value,
        Description: taskdescription.value,
        AssignedContact: assignedContacts,
        Date: taskDAte.value,
        Prio: currentPriority,
        Category: taskCategory.value,
        Subtask: subtasks,
        Status: status,
    }
    await putDataEdit(`tasks/${key}`, editedTASk)
    closeTask();
    closeOverlay();
    await fetchTasks();
    }

/**
 * Closes the task overlay and resets the form.
 */
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
    

    


  



