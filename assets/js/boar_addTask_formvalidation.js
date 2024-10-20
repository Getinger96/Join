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


function validateTask(titel,category, date) {


    let selectedDate = new Date(date.value);
    let currentDate = new Date(); 

    currentDate.setHours(0, 0, 0, 0);

    if (titel.value === '' ||category.value === '' || date.value === '') {
        allInputFieldMissing();
        showInvalidDateMessage();
        changeColorBorder();
        return false;
    } else {
        document.getElementById("taskTitle").style.border= '';
        document.getElementById("InputFieldsMissing").innerHTML = '';
    }
    

    if (selectedDate < currentDate ) {
        showInvalidDateMessage();
        return false;
    }

    document.getElementById("taskDueDate").style.border= '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';

 return true;
}

function allInputFieldMissing() {

    let showTileMissing = document.getElementById("InputFieldsMissing")
    
    showTileMissing.innerHTML = `<div>
                                     <span class="missingInput"> Please fill in or select the marked fields</span>
                                </div>`;
    
}

function showInvalidDateMessage() {

    
    let showWrongCurrentDate = document.getElementById("WrongCurrentDateId")
    
    showWrongCurrentDate.innerHTML = `<div>
                                     <span class="missingInput"> No date in the past may be specified</span>
                                </div>`;
    
}

function changeColorBorder() {


    document.getElementById("taskTitle").style.border = "2px solid red";
    document.getElementById("taskDueDate").style.border = "2px solid red";
  
  
}

function changColorPrioIcons() {
    document.getElementById("urgent").style.border = "2px solid red";
    document.getElementById("low").style.border = "2px solid red";
    document.getElementById("medium").style.border = "2px solid red";
}   

 function returnColorPrioIcons() {
    document.getElementById("urgent").style.border = '';
    document.getElementById("low").style.border = '';
    document.getElementById("medium").style.border = '';
}   


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

function deleteSubtask(i){
    subtasks.splice(i, 1);
    addSubtask();
}

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
        subtaskContainer.innerHTML += `
            <div class="editSubtaskheadlineContainer" id="boderSubtaskId${i}">
            <div class="editSubtask" id="subTaskValueId${i}">
                <ul>
                <li>${subtasks[i]}</li>
                </ul>
                </div>
            <div class="subtaskEditDiv">
                <button type="button" class="Subtasks_Btn" onclick="deleteSubtask(${i})">
                    <img src="./assets/IMG/delete.png" alt="Delete">
                </button>

            
              <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                    <img src="./assets/IMG/edit.png" alt="Edit">
                </button>
            </div>
            </div>`;
    }
}

function emptySubtask() {


    let currentSubtask = document.getElementById('new-subtask')

    currentSubtask.value='';
}

function editSubtask(i) {
    document.getElementById(`SubtaskLengthReached`).innerHTML ='';    
    document.getElementById(`subTaskValueId${i}`).innerHTML = `
    <li>
    <input id="subtaskValue${i}" class="subTaskInput" type="text" value="${subtasks[i]}"
    onblur="validateSubtask(${i})">
    </li>
    <div id="subtasksValidation${i}"></div> `

    document.getElementById(`changeImgEdit${i}`).innerHTML = `
   <button type="button" class="EditSubtaskButton" onclick="enterNewSubtask(${i})">
                    <img class="imgCheckedIcon" id="changeImgEdit${i}" src="./assets/IMG/checkAddTask.png" alt="check">
                </button>`;



}


function enterNewSubtask(i) {
    event.stopPropagation();
   let newSubTask = document.getElementById(`subtaskValue${i}`).value
   document.getElementById(`SubtaskLengthReached`).innerHTML ='';    


   if (newSubTask.length == 0) {
        pleaseEnterASubtask(i);
        document.getElementById(`boderSubtaskId${i}`).style.border= "1px solid red";
        document.getElementById(`subtaskValue${i}`).style.borderBottom= "1px solid red";
        return;
   }

   document.getElementById(`subtasksValidation${i}`).innerHTML='';


   subtasks[i] =newSubTask;

   updateSubtaskElement(i);
   removeColorSubtaskInputField()

}


function validateSubtask(i) {
    let newSubTask = document.getElementById(`subtaskValue${i}`).value
    document.getElementById(`subtasksValidation${i}`).innerHTML='';
        
    if (newSubTask.length == 0) {
        subtasks.splice(i, 1);
        pleaseEnterASubtask();
        document.getElementById(`boderSubtaskId${i}`).style.border= "1px solid red";
        document.getElementById(`subtaskValue${i}`).style.borderBottom = "3px solid red";
        return;
    }
    
    document.getElementById(`subtasksValidation${i}`).innerHTML ='';
    document.getElementById(`boderSubtaskId${i}`).style.border= "";
    document.getElementById(`SubtaskLengthReached`).innerHTML ='';   
    subtasks[i] = newSubTask;
    
    updateSubtaskElement(i);
    
    }

    function updateSubtaskElement(i) {
        let subTaskValueId = document.getElementById(`subTaskValueId${i}`);
        
        subTaskValueId.innerHTML = `
            <ul>
                <li>${subtasks[i]}</li>
            </ul>
        `;
    
        let changeImgEdit = document.getElementById(`changeImgEdit${i}`);
        
        changeImgEdit.innerHTML = `
            <button type="button" class="EditSubtaskButton" onclick="editSubtask(${i})">
                <img src="./assets/IMG/edit.png" alt="Edit">
            </button>
        `;
    }


function pleaseEnterASubtask() {
    
    document.getElementById(`SubtaskLengthReached`).innerHTML =`<span class="showShubtaskError">Please Enter a full subtask`;
}



function changeColorSubtaskInputField() {

    document.getElementById(`subtaskBorderInputchange`).style.border= "4px solid red";
    
    }
    
    function removeColorSubtaskInputField() {
    
        document.getElementById(`subtaskBorderInputchange`).style.border= "";
        
        }
    