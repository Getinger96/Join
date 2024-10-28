

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
    const userJSON = await fetchTasksFromServer(path);
    if (!userJSON.tasks) {
        return;     
    }

    const tasksAsArray = Object.values(userJSON.tasks);
    const keysArrayTask = Object.keys(userJSON.tasks);
    
    await processTasks(tasksAsArray, keysArrayTask);
    updatedView();
}

async function fetchTasksFromServer(path) {
    let response = await fetch(base_URL + path + ".json");
    return await response.json();
}

async function processTasks(tasksAsArray, keysArrayTask) {
    currentDraggedElement = 0;
    let id = 0;

    for (let index = 0; index < tasksAsArray.length; index++) {
        let task = tasksAsArray[index];
        let keyTask = keysArrayTask[index];
        id++;
        
        if (!isTaskAlreadySaved(keyTask)) {
            saveTask(keyTask, id, task);
        }
    }
}

function isTaskAlreadySaved(keyTask) {
    let saveTask = tasksArray.filter(t => keyTask === t.taskKey);
    return saveTask.length > 0;
}

function saveTask(keyTask, id, task) {
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