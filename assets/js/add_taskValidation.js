

function checkValidationDate() {
    
    
    let date = document.getElementById('dueDate').value;

    let selectedDate = new Date(date);
    let currentDate = new Date(); 

    currentDate.setHours(0, 0, 0, 0);


    if (selectedDate < currentDate ) {
        document.getElementById("dueDate").style.border = "2px solid red";
        showInvalidDateMessage();
        return false;
    }

    document.getElementById("WrongCurrentDateId").innerHTML = '';
    document.getElementById("dueDate").style.border = '';
}




function validateTask(titel,category, date) {


    let selectedDate = new Date(date);
    let currentDate = new Date(); 

    currentDate.setHours(0, 0, 0, 0);


    if (titel.value === '' ||category.value === '' || date === '') {
        allInputFieldMissing();
        changeColorBorder();
        showInvalidDateMessage();
        return false;
    } else {
        document.getElementById("title").style.border= '';
        document.getElementById("select_containerId").style.border= '';
        document.getElementById("InputFieldsMissing").innerHTML = '';
    }



    if (selectedDate < currentDate ) {
        showInvalidDateMessage();
        return false;
    }

   

    document.getElementById("WrongCurrentDateId").innerHTML = '';
    document.getElementById("dueDate").style.border = '';
    
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


    document.getElementById("title").style.border = "2px solid red";
    document.getElementById("dueDate").style.border = "2px solid red";
    document.getElementById("select_containerId").style.border = "2px solid red";


}


function clearMissingFieldContent() {
    document.getElementById("title").style.border= '';
    document.getElementById("dueDate").style.border= '';
    document.getElementById("select_containerId").style.border= '';
    document.getElementById("InputFieldsMissing").innerHTML = '';

    let SubtaskLengthReachedElement = document.getElementById('SubtaskLengthReached')

    if (SubtaskLengthReachedElement) {
        SubtaskLengthReachedElement.innerHTML ='';
    }
 
    

  
}


function clearWarningField() {
    document.getElementById("title").style.border= '';
    document.getElementById("dueDate").style.border= '';
    document.getElementById("select_containerId").style.border= '';
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';
}

async function fetchTasks(path = '') {
    tasksArray = [];
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let tasksAsarray = Object.values(userJSON.tasks)
    let keysArrayTask = Object.keys(userJSON.tasks);
    currentDraggedElement = 0;
    id = 0

    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];
        let keyTask = keysArrayTask[index];
        id++;
        let saveTask = tasksArray.filter(t => t.Title === task.Titel && t.Description === task.Description);
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

}


function gotoBoard() {

    let showTaskIsCreated = document.getElementById('newTaskIsReady');



    showTaskIsCreated.innerHTML = `<div class="ForwardingBoard">
    <span> Task added to board</span>
    <img src="./assets/IMG/Icons (3).png" alt="">
</div>`;


setTimeout(() => { window.location.href = "board.html";
            
}, 2000);


}

function addSubtask() {
    let list = document.getElementById('ul_subtasks');
    list.innerHTML = ''; 
    for (let i = 0; i < subtasks.length; i++) {


        if (subtasks.length < 0) {
            document.getElementById(`createNewTask${i}`).style.marginTop = "60px";
        }

        list.innerHTML += `
        <div class="ChangeSubtask" id="changeColorId${i}">
            <div id="subTaskValueId${i}" class="li subtaskError">${subtasks[i]}
            </div>
                <div class="changeButtonDeleteAndEdit">
                    <button type="button" class="Subtasks_Btn" onclick="deleteItem(${i})">
                        <img src="./assets/IMG/delete.png">
                    </button>
                    <button type="button" id="changeImgEdit${i}"  class="EditSubtaskButton" onclick="editSubtask(${i})">
                        <img  src="./assets/IMG/edit.png" class="deleteButton" alt="Edit">
                    </button>
                </div>            
            </div>`;
    }
}
function deleteItem(i) { 
    subtasks.splice(i, 1);
    addSubtask();
}

function addCurrentSubtask() {

    let currentSubtask = document.getElementById('input_Subtasks').value;
    let subtaskInfoText =  document.getElementById('SubtaskLengthReached');

    if (currentSubtask == '') {
        subtaskInfoText.innerHTML = ' <span class="tomanySubtask"> Please enter a valid subtask</span>';
        changeColorSubtaskInputField();
        return; 

        } else if (subtasks.length < 10) {
            subtasks.push(currentSubtask);
            document.getElementById('input_Subtasks').value = '';
            subtaskInfoText.innerHTML = '';
            removeColorSubtaskInputField();
            addSubtask();
            
        } else {
            subtaskInfoText.innerHTML = ' <span class="tomanySubtask"> maximum number of subtasks has been reached</span>';
            changeColorSubtaskInputField();
    }
}

function editSubtask(i) {


    document.getElementById(`subTaskValueId${i}`).innerHTML = `
    <li>
        <input id="subtaskValue${i}" class="subTaskInput" type="text" value="${subtasks[i]}"
        onblur="validateSubtask(${i})">
    </li>
    <div>
    <div id="subtasksValidation${i}"></div> 
     </div>`;
    let change = document.getElementById(`changeImgEdit${i}`)


    change.innerHTML = `<img class="imgCheckedIcon" src="./assets/IMG/checkAddTask.png" alt="check" onclick="enterNewSubtask(${i})">`;
}

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

function enterNewSubtask(i) {
    event.stopPropagation();
    removeColorSubtaskInputField();
    let newSubTask = document.getElementById(`subtaskValue${i}`).value
    
    if (newSubTask.length == 0) {
        subtasks.splice(i, 1);
        pleaseEnterASubtask();
        document.getElementById(`changeColorId${i}`).style.border= "1px solid red";
        document.getElementById(`subtaskValue${i}`).style.borderBottom = "3px solid red";
        return;
   }

   document.getElementById(`subtasksValidation${i}`).innerHTML ='';
   document.getElementById(`SubtaskLengthReached`).innerHTML ='';
   subtasks[i] = newSubTask;

   updateSubtaskElement(i);

}

function updateSubtaskElement(i) {
    let subtaskElement = document.getElementById(`changeColorId${i}`);
    
    subtaskElement.innerHTML = `
        <div id="subTaskValueId${i}" class="li subtaskError">${subtasks[i]}</div>
        <div class="changeButtonDeleteAndEdit">
            <button type="button" class="Subtasks_Btn" onclick="deleteItem(${i})">
                <img src="./assets/IMG/delete.png">
            </button>
            <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                <img src="./assets/IMG/edit.png" class="deleteButton" alt="Edit">
            </button>
        </div>`;
}

function pleaseEnterASubtask() {
    
    document.getElementById(`SubtaskLengthReached`).innerHTML =`<span class="showShubtaskError">Please Enter a full subtask`;
}


function changeColorSubtaskInputField() {

document.getElementById(`subtaskBorderInputchange`).style.border= "3px solid red";

}

function removeColorSubtaskInputField() {

    document.getElementById(`subtaskBorderInputchange`).style.border= "";
    
    }
