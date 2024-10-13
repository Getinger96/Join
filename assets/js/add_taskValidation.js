

function validateTask(titel,category, date) {


    let selectedDate = new Date(date);
    let currentDate = new Date(); 

    currentDate.setHours(0, 0, 0, 0);

    if (titel.value === '' ||category.value === '' || date.value === ''  || selectedDate < currentDate ||  assignedContacts.length === 0   ) {
        allInputFieldMissing();
        showInvalidDateMessage();
        changeColorBorder();
        return false;
    }


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
    document.getElementById("select_container").style.border = "2px solid red";
  
}


function clearMissingFieldContent() {
    document.getElementById("title").style.border= '';
    document.getElementById("dueDate").style.border= '';
    document.getElementById("select_containerId").style.border= '';
    document.getElementById("select_container").style.border = '';
    document.getElementById("InputFieldsMissing").innerHTML = '';

  
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