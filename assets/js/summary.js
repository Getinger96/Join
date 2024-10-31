/**
 * Global counters for task statuses and priority, as well as a flag for icon color change.
 */
let countPrioUrgent = 0;
let countOpen = 0;
let countInProgress = 0;
let countAwaitingFeedback = 0;
let countDone = 0;
let iconsBooleanColorChange = false;

/**
 * Fetches and processes the task data, then renders the summary view.
 * @async
 * @param {string} [path=''] - The path to fetch tasks data from.
 */
async function fetchTasksSummary(path = '') {
    tasksArray = [];
    let userJSON = await fetchAndParseTasks(path);
    if (!userJSON || !userJSON.tasks) {
        return;
    }
    processTaskData(userJSON);
    finalizeSummaryRendering();
}

/**
 * Fetches tasks data from the server and parses it as JSON.
 * @async
 * @param {string} path - The path to fetch tasks data from.
 * @returns {Promise<Object>} - Parsed JSON data containing tasks.
 */
async function fetchAndParseTasks(path) {
    let response = await fetch(base_URL + path + ".json");
    return await response.json();
}

/**
 * Processes the JSON task data, filters out duplicates, and populates the tasks array.
 * @param {Object} userJSON - The JSON object containing task data.
 */
function processTaskData(userJSON) {
    let tasksAsArray = Object.values(userJSON.tasks);
    let keysArrayTask = Object.keys(userJSON.tasks);

    for (let index = 0; index < tasksAsArray.length; index++) {
        let task = tasksAsArray[index];
        let keyTask = keysArrayTask[index];
        id++;

        let saveTask = tasksArray.filter(t => t.Title === task.Titel && t.Description === task.Description);
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
}

/**
 * Finalizes the rendering of the summary view.
 */
function finalizeSummaryRendering() {
    renderSummarySite();
    showTheCurrentDate();
}

/**
 * Renders the tasks on the Kanban board by iterating over the tasks array.
 */
function renderSummarySite() {
    for (let index = 0; index < tasksArray.length; index++) {
        loadToDoAtTheKanbanBoard(index);
    }
}

/**
 * Loads a specific task onto the Kanban board based on its index.
 * @param {number} index - The index of the task in tasksArray.
 */
function loadToDoAtTheKanbanBoard(index) {
    let kanbanBoardStatus = tasksArray[index].status;
    let kanbanBoradPrioUrgent = tasksArray[index].Prio;

    incrementStatusCounts(kanbanBoardStatus);
    showBoardPrioAndTasks(kanbanBoradPrioUrgent);
    updateBoardView();
}

/**
 * Increments the task counts based on task status and updates the display.
 * @param {string} status - The status of the task (e.g., 'open', 'progress', etc.).
 */
function incrementStatusCounts(status) {
    if (status === 'open') {
        countOpen++;
        showKanbanBoardTodo(countOpen);
    } else if (status === 'progress') {
        countInProgress++;
        showKanbanBoardTaskProgress(countInProgress);
    } else if (status === 'awaitFeedback') {
        countAwaitingFeedback++;
        showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback);
    } else if (status === 'closed') {
        countDone++;
        showKanbanBoardTaskdone(countDone);
    }
}

/**
 * Updates the display for priority tasks and the total number of tasks.
 * @param {string} prioUrgent - The priority of the task.
 */
function showBoardPrioAndTasks(prioUrgent) {
    showAllPrioUrgent(prioUrgent);
    showAllTaskinBoard(tasksArray);
}

/**
 * Updates the view of the board by showing the current date and task counts.
 */
function updateBoardView() {
    showTheCurrentDate();
    showKanbanBoardTodo(countOpen);
    showKanbanBoardTaskProgress(countInProgress);
    showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback);
    showKanbanBoardTaskdone(countDone);
}

/**
 * Displays the count of "To Do" tasks on the board.
 * @param {number} countOpen - Number of open tasks.
 */
function showKanbanBoardTodo(countOpen) {
    let getTaskOpen = document.getElementById('toDoNumber');
    getTaskOpen.innerHTML = `${countOpen}`;
}

/**
 * Displays the count of "In Progress" tasks on the board.
 * @param {number} countInProgress - Number of tasks in progress.
 */
function showKanbanBoardTaskProgress(countInProgress) {
    let getTaskInProgress = document.getElementById('taskInProgress');
    getTaskInProgress.innerHTML = `${countInProgress}`;
}

/**
 * Displays the count of tasks "Awaiting Feedback" on the board.
 * @param {number} countAwaitingFeedback - Number of tasks awaiting feedback.
 */
function showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback) {
    let getTaskAwaitingFeedback = document.getElementById('taskAwaitingFeedback');
    getTaskAwaitingFeedback.innerHTML = `${countAwaitingFeedback}`;
}

/**
 * Displays the count of "Done" tasks on the board.
 * @param {number} countDone - Number of completed tasks.
 */
function showKanbanBoardTaskdone(countDone) {
    let getTaskDone = document.getElementById('accomplishedTask');
    getTaskDone.innerHTML = `${countDone}`;
}

/**
 * Shows the total number of tasks on the board.
 * @param {Array} tasksArray - Array of all tasks.
 */
function showAllTaskinBoard(tasksArray) {
    let getAllTask = document.getElementById('allTaskinBoard');
    getAllTask.innerHTML = `${tasksArray.length}`;
}

/**
 * Shows the count of "Urgent" priority tasks on the board.
 * @param {string} kanbanBoradPrioUrgent - Priority of the task.
 */
function showAllPrioUrgent(kanbanBoradPrioUrgent) {
    let checkPriority = kanbanBoradPrioUrgent;
    let numberOfPrioUrgent = document.getElementById('prioUrgentId');

    if (checkPriority === "urgent") {
        countPrioUrgent++;
        numberOfPrioUrgent.innerHTML = `${countPrioUrgent}`;
    }
}

/**
 * Displays the nearest due date for "Urgent" tasks or a default message.
 */
function showTheCurrentDate() {
    let urgentTasks = tasksArray.filter(task => task.Prio === 'urgent');
    if (urgentTasks.length > 0) {
        let nextUrgentTask = urgentTasks.reduce((earliest, current) => {
            let earliestDate = new Date(earliest.duedate);
            let currentDate = new Date(current.duedate);
            return currentDate < earliestDate ? current : earliest;
        });
        document.getElementById('currentDate').innerHTML = formatDate(nextUrgentTask.duedate);
    } else {
        document.getElementById('currentDate').innerHTML = "No upcoming urgent tasks";
    }
    showTheCurrentTime();
}

/**
 * Formats a date string in "Month Day, Year" format.
 * @param {string} dueDate - The date to format.
 * @returns {string} - Formatted date string.
 */
function formatDate(dueDate) {
    let date = new Date(dueDate);
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Displays a greeting based on the current time.
 */
function showTheCurrentTime() {
    let currentTime = new Date().getHours();
    let greetingText = document.getElementById('showTheRightTime');
    if (currentTime < 12) {
        greetingText.innerHTML = "Good Morning !!!";
    } else if (currentTime < 18) {
        greetingText.innerHTML = "Good Afternoon !!!";
    } else {
        greetingText.innerHTML = "Good Evening !!!";
    }
}

/**
 * Adjusts the styling for screens narrower than 900px.
 */
function summaryScreenWidth() {
    let screenWidth = window.innerWidth;
    let getNewHrLine = document.getElementById('newHrLineHeader');
    if (screenWidth <= 900) {
        getNewHrLine.classList.add('newhr');
    }
}

/**
 * Navigates to the Kanban board document.
 */
function showTheKanbanBoardDocument() {
    window.location.href = "board.html";
}

/**
 * Changes the To Do icon image based on hover state.
 * @param {boolean} boolean - Hover state (true if hovered).
 */
function changeImageToDoDefault(boolean) {
    let imgIconKanbanBoardToDo = document.getElementById('iconBoardToDo');
    if (boolean) {
        imgIconKanbanBoardToDo.src = './assets/IMG/Frameimgwhite.png';
    } else {
        imgIconKanbanBoardToDo.src = './assets/IMG/Frame 59.png'
    }

}

function changeImageDoneDefault(isHovered) {
    let imgIconKanbanBoardDone = document.getElementById('iconBoardDone');
    if (isHovered) {
        imgIconKanbanBoardDone.src = './assets/IMG/frameimgwhitetwo.png';
    } else {
        imgIconKanbanBoardDone.src = './assets/IMG/Frame 59 (1).png';
    }
}




