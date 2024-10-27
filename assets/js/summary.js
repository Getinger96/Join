let countPrioUrgent = 0;
let countOpen = 0;
let countInProgress = 0;
let countAwaitingFeedback = 0;
let countDone = 0;
let iconsBooleanColorChange = false;


async function fetchTasksSummary(path = '') {
    tasksArray = [];
    let userJSON = await fetchAndParseTasks(path);
    if (!userJSON || !userJSON.tasks) {
        return;
    }
    processTaskData(userJSON);
    finalizeSummaryRendering();
}

async function fetchAndParseTasks(path) {
    let response = await fetch(base_URL + path + ".json");
    return await response.json();
}

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

function finalizeSummaryRendering() {
    renderSummarySite();
    showTheCurrentDate();
}

function renderSummarySite() {

    for (let index = 0; index < tasksArray.length; index++) {
        loadToDoAtTheKanbanBoard(index);
    }

}
function loadToDoAtTheKanbanBoard(index) {
    let kanbanBoardStatus = tasksArray[index].status;
    let kanbanBoradPrioUrgent = tasksArray[index].Prio;

    incrementStatusCounts(kanbanBoardStatus);
    showBoardPrioAndTasks(kanbanBoradPrioUrgent);
    updateBoardView();
}

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

function showBoardPrioAndTasks(prioUrgent) {
    showAllPrioUrgent(prioUrgent);
    showAllTaskinBoard(tasksArray);
}
function updateBoardView() {
    showTheCurrentDate();
    showKanbanBoardTodo(countOpen);
    showKanbanBoardTaskProgress(countInProgress);
    showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback);
    showKanbanBoardTaskdone(countDone);
}

function showKanbanBoardTodo(countOpen) {
    let getTaskOpen = document.getElementById('toDoNumber');
    getTaskOpen.innerHTML = `${countOpen}`;

}


function showKanbanBoardTaskProgress(countInProgress) {
    let getTaskInProgress = document.getElementById('taskInProgress');

    getTaskInProgress.innerHTML = `${countInProgress}`;
}



function showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback) {
    let getTaskAwaitingFeedback = document.getElementById('taskAwaitingFeedback');

    getTaskAwaitingFeedback.innerHTML = `${countAwaitingFeedback}`;
}


function showKanbanBoardTaskdone(countDone) {
    let getTaskDone = document.getElementById('accomplishedTask');

    getTaskDone.innerHTML = `${countDone}`;
}


function showAllTaskinBoard(tasksArray) {
    let getAllTask = document.getElementById('allTaskinBoard');

    getAllTask.innerHTML = `${tasksArray.length}`;

}

function showAllPrioUrgent(kanbanBoradPrioUrgent) {
    let checkPriority = kanbanBoradPrioUrgent;

    let numberOfPrioUrgent = document.getElementById('prioUrgentId');

    if (checkPriority === "urgent") {
        countPrioUrgent++;
        numberOfPrioUrgent.innerHTML = `${countPrioUrgent}`;
    }


}


function showTheCurrentDate() {
    let urgentTasks = tasksArray.filter(task => task.Prio === 'urgent');
    if (urgentTasks.length > 0) {
        let nextUrgentTask = urgentTasks.reduce((earliest, current) => {
            let earliestDate = new Date(earliest.duedate);
            let currentDate = new Date(current.duedate);
            if (currentDate < earliestDate) {
                return current;
            } else {
                return earliest;
            }
        });
        document.getElementById('currentDate').innerHTML = formatDate(nextUrgentTask.duedate);
    } else {
        document.getElementById('currentDate').innerHTML = "No upcoming urgent tasks";
    }
    showTheCurrentTime();
}

function formatDate(dueDate) {
    let date = new Date(dueDate);
    let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

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

function summaryScreenWidth() {
    let screenWidth = window.innerWidth;
    let getNewHrLine = document.getElementById('newHrLineHeader');
    if (screenWidth <= 900) {
        getNewHrLine.classList.add('newhr')
    }

}

function showTheKanbanBoardDocument() {
    window.location.href = "board.html"
}


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




