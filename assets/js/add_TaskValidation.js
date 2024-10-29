/**
 * This function check the validation of the input of the Date
 * 
 * @returns {boolean} if the Date is unacceptable
 */
function checkValidationDate() {
    let date = document.getElementById('dueDate').value;
    let selectedDate = new Date(date);
    let currentDate = new Date(); 
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate ) {
        document.getElementById("dueDate").classList.add("invalid-date-border");
        showInvalidDateMessage();
        return false;
    }
    document.getElementById("WrongCurrentDateId").innerHTML = '';
    document.getElementById("dueDate").classList.remove("invalid-date-border");
}

/**
 * This function cheks if the required input fileds are filled
 * 
 * @param {string} titel titel of the task
 * @param {string} category  category of the task
 * @param {date} date  date due the task should be finished
 * @returns {boolean} wether or not ist filled
 */
function validateTask(titel, category, date) {
    if (!validateInputs(titel, category, date)) {
        return false; 
    }
    if (!checkDateValidity(date)) {
        return false; 
    }
    resetInputStyles();
    return true;
}

function validateInputs(titel, category, date) {
    if (titel === '' || category === '' || date === '') {
        allInputFieldMissing();
        changeColorBorder();
        showInvalidDateMessage();
        return false; 
    }
    return true; 
}

function checkDateValidity(date) {
    let selectedDate = new Date(date);
    let currentDate = new Date(); 
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
        showInvalidDateMessage();
        return false; 
    }
    return true; 
}

/**
 * This function resets the styles of the inputfields
 * 
 */
function resetInputStyles() {
    document.getElementById("title").classList.remove("missing-input-border");
    document.getElementById("select_containerId").classList.remove("missing-input-border");
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';
    document.getElementById("dueDate").classList.remove("invalid-date-border");
}


/**
 * This function generate html about missing inputfields
 * 
 */
function allInputFieldMissing() {
    let showTileMissing = document.getElementById("InputFieldsMissing")
    showTileMissing.innerHTML = `<div>
                                     <span class="missingInput"> Please fill in or select the marked fields</span>
                                </div>`;    
}

/**
 * This function generate html about missing inputfields
 * 
 */

function showInvalidDateMessage() {
    let showWrongCurrentDate = document.getElementById("WrongCurrentDateId")
    showWrongCurrentDate.innerHTML = `<div>
                                     <span class="missingInput"> No date in the past may be specified</span>
                                </div>`;   
}

/**
 * This function changes the color of the invalid input fields
 * 
 */
function changeColorBorder() {
    document.getElementById("title").classList.add("missing-input-border");
    document.getElementById("dueDate").classList.add("missing-input-border");
    document.getElementById("select_containerId").classList.add("missing-input-border");
}


function clearMissingFieldContent() {
    document.getElementById("title").classList.remove("missing-input-border");
    document.getElementById("dueDate").classList.remove("missing-input-border");
    document.getElementById("select_containerId").classList.remove("missing-input-border");
    document.getElementById("InputFieldsMissing").innerHTML = '';
    let SubtaskLengthReachedElement = document.getElementById('SubtaskLengthReached')

    if (SubtaskLengthReachedElement) {
        SubtaskLengthReachedElement.innerHTML ='';
    }
   
}

function clearWarningField() {
    document.getElementById("title").classList.remove("missing-input-border");
    document.getElementById("dueDate").classList.remove("missing-input-border");
    document.getElementById("select_containerId").classList.remove("missing-input-border");
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';
}

/**
 * this function check if the array has task in teh database
 * 
 * @param {Array} userJSON 
 * @returns {boolean}
 */
function hasTasks(userJSON) {
    if (userJSON.tasks) {
        return true;
    } else {
        return false; 
    }
}

/**
 * This function fetches data from database about users
 * 
 * @param {*} path 
 * @returns {}
 */
async function fetchUserData(path) {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    return userJSON;
}

/**
 * This function fetch Task from the Database
 * 
 * @param {} path path of the data from the database
 * @returns 
 */
async function fetchTasks(path = '') {
    tasksArray = [];
    let userJSON = await fetchUserData(path);
    if (!hasTasks(userJSON)) { 
        return;
    }
    let tasksAsarray = Object.values(userJSON.tasks);
    let keysArrayTask = Object.keys(userJSON.tasks);
    currentDraggedElement = 0;
    id = 0;

    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];
        let keyTask = keysArrayTask[index];
        id++;
        addTaskToArray(task, keyTask, id, tasksArray);
    }
}

/**
 * 
 * @param {number} task index of the task
 * @param {*} keyTask  key automatically generate by the database
 * @param {number} id  id of the task
 * @param {*} tasksArray Array
 */
function addTaskToArray(task, keyTask, id, tasksArray) {
    let saveTask = tasksArray.filter(t => keyTask === t.taskKey);
    if (saveTask.length === 0) {
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
 
/**
 * This function change location of the window
 * 
 */
 function gotoBoard() {
    let showTaskIsCreated = document.getElementById('newTaskIsReady');

    showTaskIsCreated.innerHTML = `<div class="ForwardingBoard">
    <span> Task added to board</span>
    <img src="./assets/IMG/Icons (3).png" alt="">
</div>`;

setTimeout(() => { window.location.href = "board.html";
            
}, 2000);
}

/**
 * This function add the created subtask 
 * 
 */
function addSubtask() {
    let list = document.getElementById('ul_subtasks');
    list.innerHTML = ''; 
    if (subtasks.length <= 0) {
        document.getElementById(`createNewTask${0}`).style.marginTop = "60px";
    }

    for (let i = 0; i < subtasks.length; i++) {
        list.innerHTML += generateSubtaskHTML(i);
    }
}

/**
 * this function returns Html for the add subtask function 
 * 
 * @param {number} i index of the subtask
 * @returns 
 */
function generateSubtaskHTML(i) {
    return `
        <div class="ChangeSubtask" id="changeColorId${i}">
            <div id="subTaskValueId${i}" class="li subtaskError">${subtasks[i]}</div>
            <div class="changeButtonDeleteAndEdit">
                <button type="button" class="deleteSubtask_Btn" onclick="deleteItem(${i})">
                    <img src="./assets/IMG/delete.png" class="deleteButton">
                </button>
                <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                    <img src="./assets/IMG/edit.png" class="deleteButton" alt="Edit">
                </button>
            </div>            
        </div>`;
}

/**
 * this function delete the choosed subtask
 * 
 * @param {number} i index of the subtask
 */
function deleteItem(i) { 
    subtasks.splice(i, 1);
    addSubtask();
}

/**
 * 
 * 
 * @returns 
 */
function addCurrentSubtask() {
    let currentSubtask = document.getElementById('input_Subtasks').value;
    if (currentSubtask === '') {       
        return;
    } else if (subtasks.length < 10) {
        subtasks.push(currentSubtask);
        document.getElementById('input_Subtasks').value = '';  
        addSubtask(); 
     }
}

/**
 * This function validates the subtask if its empty
 * 
 * @param {number} i index of the subtask
 * @returns 
 */
function validateSubtask(i) {
let newSubTask = document.getElementById(`subtaskValue${i}`).value
document.getElementById(`SubtaskLengthReached`).innerHTML =''; 
removeColorSubtaskInputField(); 

if (newSubTask.length == 0) {
    subtasks.splice(i, 1);
    pleaseEnterASubtask();
    document.getElementById(`changeColorId${i}`).style.border= "1px solid red";
    document.getElementById(`subtaskValue${i}`).style.borderBottom = "3px solid red";
    return;
}
document.getElementById(`subtasksValidation${i}`).innerHTML ='';
document.getElementById(`changeColorId${i}`).style.border= '';
subtasks[i] = newSubTask;
updateSubtaskElement(i);
}

/**
 * genrate html for not valid subtasks
 * 
 */
function pleaseEnterASubtask() {
    document.getElementById(`SubtaskLengthReached`).innerHTML =`<span class="showShubtaskError">Please Enter a full subtask`;
}

/**
 * function to edit the subtasks
 * 
 * @param {number} i index of the subtask
 */
function editSubtask(i) {
    let subtaskElement = document.getElementById(`subTaskValueId${i}`);

    subtaskElement.innerHTML = `
        <input id="subtaskValue${i}" class="subTaskInput" type="text" value="${subtasks[i]}">
        <div id="subtasksValidation${i}" class="subtaskError"></div>  <!-- Platz für Fehlermeldung -->
    `;

    let change = document.getElementById(`changeImgEdit${i}`);
    change.innerHTML = `<img class="imgCheckedIcon" src="./assets/IMG/checkAddTask.png" alt="check" onclick="enterNewSubtask(${i})">`;
}

/**
 * Function to change the Subtask
 * 
 * @param {number} i index of the subtask
 * @returns 
 */
function enterNewSubtask(i) {
    event.stopPropagation();
    let newSubTask = document.getElementById(`subtaskValue${i}`).value.trim();

    let errorMessageElement = document.getElementById(`subtasksValidation${i}`);

    if (newSubTask === '') {
        errorMessageElement.innerHTML = '<span class= "subtaskempty" style="color:red;">Subtask cannot be empty</span>';  // Zeige Fehlermeldung in rot
        return;
    }
    subtasks[i] = newSubTask;
    errorMessageElement.innerHTML = '';
    updateSubtaskElement(i);
}

/**
 * Function to update the Subtaskelement
 * 
 * @param {number} i  index of the Subtask
 */
function updateSubtaskElement(i) {
    let subtaskElement = document.getElementById(`changeColorId${i}`);

    subtaskElement.innerHTML = `
        <div id="subTaskValueId${i}" class="li">${subtasks[i]}</div>
        <div class="changeButtonDeleteAndEdit">
            <button type="button" class="Subtasks_Btn" onclick="deleteItem(${i})">
                <img src="./assets/IMG/delete.png">
            </button>
            <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                <img src="./assets/IMG/edit.png" class="deleteButton" alt="Edit">
            </button>
        </div>`;
}
