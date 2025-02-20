/**
 * the function check validation date
 */
function checkValidationDate() {
    let date = document.getElementById('taskDueDate').value;
    let selectedDate = new Date(date);
    let currentDate = new Date(); 
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate < currentDate ) {
        document.getElementById("taskDueDate").style.border = "2px solid red";
        showInvalidDateMessage();
        return false;
    }
    document.getElementById("WrongCurrentDateId").innerHTML = '';
    document.getElementById("taskDueDate").style.border = '';
}
/**
 *  the function check validation titel, category, date
 * @param {*} titel addtask title
 * @param {*} category addtask category
 * @param {*} date addtask date
 * 
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
/**
 * the function validate input field
 * @param {*} titel addtask title
 * @param {*} category addtask category
 * @param {*} date addtask date
 *  
 */
function validateInputs(titel, category, date) {
    if (titel.value === '' || category.value === '' || date.value === '') {
        allInputFieldMissing();
        showInvalidDateMessage();
        changeColorBorder();
        return false;
    } else {
        document.getElementById("taskTitle").style.border = '';
        document.getElementById("InputFieldsMissing").innerHTML = '';
    }
    return true; 
}
/**
 * the function check date validity
 * @param {*} date addtask date
 * 
 */
function checkDateValidity(date) {
    let selectedDate = new Date(date.value);
    let currentDate = new Date(); 
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
        showInvalidDateMessage();
        return false; 
    }
    document.getElementById("taskDueDate").style.border = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';
    return true;
}

/**
 * the function reset input Field and style
 */
function resetInputStyles() {
    document.getElementById("taskTitle").style.border = '';
    document.getElementById("taskDueDate").style.border = '';
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';
}

/**
 * the function change color border
 */
function changeColorBorder() {
    document.getElementById("taskTitle").style.border = "2px solid red";
    document.getElementById("taskDueDate").style.border = "2px solid red";
  
}
/**
 * the function chang color prio icons
 */
function changColorPrioIcons() {
    document.getElementById("urgent").style.border = "2px solid red";
    document.getElementById("low").style.border = "2px solid red";
    document.getElementById("medium").style.border = "2px solid red";
}   
/**
 * the function remove color prio icons
 */
 function returnColorPrioIcons() {
    document.getElementById("urgent").style.border = '';
    document.getElementById("low").style.border = '';
    document.getElementById("medium").style.border = '';
}   

/**
 * the function clear missing field content
 */
function clearMissingFieldContent() {
    document.getElementById("taskTitle").style.border= '';
    document.getElementById("taskDueDate").style.border= '';
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';

    let SubtaskLengthReachedElement = document.getElementById('SubtaskLengthReached')

    if (SubtaskLengthReachedElement) {
        SubtaskLengthReachedElement.innerHTML ='';
    }
 
}

/**
 * the function add current subtask
 */
function addCurrentSubtask() {
    let currentSubtask = document.getElementById('new-subtask').value;
    let subtaskInfoText =  document.getElementById('SubtaskLengthReached');
    if (!subtasks) {
        subtasks = [];
    }
    if (currentSubtask == '') {
        subtaskInfoText.innerHTML = ' <span class="tomanySubtask"> Please enter a valid subtask</span>';
        changeColorSubtaskInputField();
        return; 
        } else if (subtasks.length < 10) {
            subtasks.push(currentSubtask);
            document.getElementById('new-subtask').value = '';
            subtaskInfoText.innerHTML = '';
            removeColorSubtaskInputField();
            addSubtask();   
        } else {
            subtaskInfoText.innerHTML = ' <span class="tomanySubtask"> maximum number of subtasks has been reached</span>';
            changeColorSubtaskInputField();
    }
}
/**
 * the function delete subtask wiht local storage item
 * @param {*} i subtask id
 */
function deleteItem(i) {
    event.stopPropagation();
    subtasks.splice(i, 1);
    let taskIndex = currentTaskIndex;
    tasksArray[taskIndex].subtask = subtasks;
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
    delete subtaskStatus[i];
    localStorage.setItem(`task-${taskIndex}-subtasks`, JSON.stringify(subtaskStatus));
    addSubtask();
    updateProgress(taskIndex);
}

/**
 * the function delete subtaskand update add Task 
 * @param {*} i subtask id
 */
function deleteSubtask(i){
    subtasks.splice(i, 1);
    addSubtask();
}

/**
 * the function add subtask
 */
function addSubtask() {
    if (!Array.isArray(subtasks)) {
        subtasks = [];
    }
    let subtaskContainer = document.getElementById('subtasksContainer');
    subtaskContainer.innerHTML = '';

    if (subtasks.length === 0) {
        return;
    }
    for (let i = 0; i < subtasks.length; i++) {
        subtaskContainer.innerHTML += showSubTaskContainer(subtasks, i);
    }
}

/**
 * the function empties the subtask value
 */
function emptySubtask() {
    let currentSubtask = document.getElementById('new-subtask')
    currentSubtask.value='';
}
/**
 * the function edit the subtask 
 *  * @param {*} i  subtask id
 */
function editSubtask(i) {
    document.getElementById(`SubtaskLengthReached`).innerHTML ='';    
    removeColorSubtaskInputField();
    document.getElementById(`subTaskValueId${i}`).innerHTML = showSubTaskValueEdit(subtasks, i);

    document.getElementById(`changeImgEdit${i}`).innerHTML = ShowChangeImgCheckedIcon(i);

}

/**
 * the function enter new subtask
 *  * @param {*} i  subtask id
 */
function enterNewSubtask(i) {
    event.stopPropagation();
   let newSubTask = document.getElementById(`subtaskValue${i}`).value
   document.getElementById(`SubtaskLengthReached`).innerHTML ='';    
   if (newSubTask.length == 0) {
        pleaseEnterASubtask(i);
        document.getElementById(`boderSubtaskId${i}`).classList.add("error-border"); 
        document.getElementById(`subtaskValue${i}`).classList.add("error-borderBottom"); 
        return;
   }
   document.getElementById(`subtasksValidation${i}`).innerHTML='';
   subtasks[i] =newSubTask;
   updateSubtaskElement(i);
   removeColorSubtaskInputField()
}
/**
 * the function validate subtask
 *  * @param {*} i  subtask id
 */
function validateSubtask(i) {
    let newSubTask = document.getElementById(`subtaskValue${i}`).value
    document.getElementById(`subtasksValidation${i}`).innerHTML='';
        
    if (newSubTask.length == 0) {
        subtasks.splice(i, 1);
        pleaseEnterASubtask();
        document.getElementById(`boderSubtaskId${i}`).classList.add("error-border"); 
        document.getElementById(`subtaskValue${i}`).classList.add("error-borderBottom"); 
        return;
    }
    document.getElementById(`subtasksValidation${i}`).innerHTML ='';
    document.getElementById(`boderSubtaskId${i}`).classList.remove("error-border");
    document.getElementById(`SubtaskLengthReached`).innerHTML ='';   
    subtasks[i] = newSubTask;
    updateSubtaskElement(i);
 }

/**
 * the function update subtask
 *  * @param {*} i  subtask id
 */
    function updateSubtaskElement(i) {
        let subTaskValueId = document.getElementById(`subTaskValueId${i}`);
        subTaskValueId.innerHTML = `
            <ul>
                <li>${subtasks[i]}</li>
            </ul> `;   
        let changeImgEdit = document.getElementById(`changeImgEdit${i}`);
        
        changeImgEdit.innerHTML =ShowChangeImgEdit(i);
    }


/**
 * the function change color subtask input field
 */
function changeColorSubtaskInputField() {
    document.getElementById(`subtaskBorderInputchange`).classList.add("error-border");
    }

/**
 * the function remove subtask style
 */
function removeColorSubtaskInputField() {
    document.getElementById(`subtaskBorderInputchange`).classList.remove("error-border");
        }
    