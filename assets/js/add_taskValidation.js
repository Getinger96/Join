

function validateTask(titel, description,category, date) {


    if (titel.value === '' || description.value === '' || category.value === '' || date.value === '' ||  assignedContacts.length === 0  || prio.length === 0 ) {
        allInputFieldMissing();
        changeColorBorder();
        return false;
    }


    return true
    
}


function allInputFieldMissing() {

    let showTileMissing = document.getElementById("InputFieldsMissing")
    
    showTileMissing.innerHTML = `<div>
                                     <span class="missingInput"> Please fill in or select the marked fields !!!</span>
                                </div>`;
        


}

function changeColorBorder() {


    document.getElementById("title").style.border = "2px solid red";
    document.getElementById("dueDate").style.border = "2px solid red";
    document.getElementById("Description").style.border = "2px solid red";
    document.getElementById("select_containerId").style.border = "2px solid red";
    document.getElementById("select_container").style.border = "2px solid red";
    document.getElementById("urgent").style.border = "2px solid red";
    document.getElementById("medium").style.border = "2px solid red";
    document.getElementById("low").style.border = "2px solid red";
}


function clearMissingFieldContent() {
    document.getElementById("title").style.border= '';
    document.getElementById("dueDate").style.border= '';
    document.getElementById("Description").style.border = '';
    document.getElementById("select_containerId").style.border= '';
    document.getElementById("select_container").style.border = '';
    document.getElementById("InputFieldsMissing").innerHTML = '';

    document.getElementById("urgent").style.border = '';
    document.getElementById("medium").style.border = '';
    document.getElementById("low").style.border = '';
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