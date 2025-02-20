

let subtasks = [];
let subtask = [];
let tasksArray = [];
let subTaskChecked = [];
let currentTaskIndex = null;
let currentDraggedElement;
let id = 0
let addtask = false;


/**
 * Fetches tasks from the server, processes, and updates the view.
 * @param {string} path Optional path to fetch specific tasks
 */
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

/**
 * Fetches JSON data from the server at a specified path.
 * @param {string} path Path for API request
 * @returns {Object} JSON response
 */
async function fetchTasksFromServer(path) {
    let response = await fetch(base_URL + path + ".json");
    return await response.json();
}
/**
 * Processes tasks by assigning them IDs and saving new tasks to tasksArray.
 * @param {Array} tasksAsArray Array of task objects
 * @param {Array} keysArrayTask Array of task keys
 */
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

/**
 * Checks if a task with a specific key is already saved.
 * @param {string} keyTask  task key
 * @returns {boolean} boolean
 */
function isTaskAlreadySaved(keyTask) {
    let saveTask = tasksArray.filter(t => keyTask === t.taskKey);
    return saveTask.length > 0;
}


/**
 * Saves a new task to the tasks array.
 * @param {string} keyTask  task key
 * @param {number} id  task ID
 * @param {Object} task Task object with details
 */
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


