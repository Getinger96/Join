let countPrioUrgent = 0;
let countOpen = 0;
let countInProgress = 0;
let countAwaitingFeedback = 0;
let countDone = 0;
let iconsBooleanColorChange = false;


async function fetchTasksSummary(path = '') {
    tasksArray = []; // Leere das Array vor dem Hinzufügen neuer Einträge
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let tasksAsArray = Object.values(userJSON.tasks);
    let keysArrayTask = Object.keys(userJSON.tasks);

    for (let index = 0; index < tasksAsArray.length; index++) {
        let task = tasksAsArray[index];
        let keyTask = keysArrayTask[index];
        id++;

        let saveTask = tasksArray.filter(t => t.Title === task.Titel);

        // Beispielbedingung, die du anpassen kannst
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
renderSummarySite();
}


function renderSummarySite() {

for (let index = 0; index < tasksArray.length; index++) {
    loadToDoAtTheKanbanBoard(index)
    
}

}



function loadToDoAtTheKanbanBoard(index) {
        let statusCheckopen = 'open';
        let statusCheckprogress = 'progress';
        let statusCheckawaitingfeedback = 'awaitFeedback';
        let statusCheckclosed = 'closed';


        let kanbanBoardStatus = tasksArray[index].status;
        let kanbanBoradPrioUrgent = tasksArray[index].Prio;

 
    if (kanbanBoardStatus === statusCheckopen) {
        countOpen++;
        showKanbanBoardTodo(countOpen);
    } else if (kanbanBoardStatus === statusCheckprogress) {
        countInProgress++;
        showKanbanBoardTaskProgress(countInProgress);  
    } else if (kanbanBoardStatus === statusCheckawaitingfeedback) {
        countAwaitingFeedback++;
        showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback)
        showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback);  
    } else if (kanbanBoardStatus === statusCheckclosed) {       
        countDone++;
        showKanbanBoardTaskdone(countDone);
    }

    showAllPrioUrgent(kanbanBoradPrioUrgent);

                
showAllTaskinBoard(tasksArray);          
showTheCurrentDate();    
showKanbanBoardTodo(countOpen);
showKanbanBoardTaskProgress(countInProgress);  
showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback);
showKanbanBoardTaskdone(countDone);
}


function showKanbanBoardTodo(countOpen) {
    let getTaskOpen = document.getElementById('toDoNumber');


    getTaskOpen.innerHTML =`${countOpen}`;

}


function showKanbanBoardTaskProgress(countInProgress) {
    let getTaskInProgress = document.getElementById('taskInProgress');

    getTaskInProgress.innerHTML =`${countInProgress}`;
}



function showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback) {
    let getTaskAwaitingFeedback = document.getElementById('taskAwaitingFeedback');

    getTaskAwaitingFeedback.innerHTML =`${countAwaitingFeedback}`;
}


function showKanbanBoardTaskdone(countDone) {
    let getTaskDone = document.getElementById('accomplishedTask');

    getTaskDone.innerHTML =`${countDone}`;
}


function showAllTaskinBoard(tasksArray) {
    let getAllTask = document.getElementById('allTaskinBoard');

    getAllTask.innerHTML = `${tasksArray.length}`;
    
}

function showAllPrioUrgent(kanbanBoradPrioUrgent) {
     let checkPriority = kanbanBoradPrioUrgent[0];

    let numberOfPrioUrgent = document.getElementById('prioUrgentId');
    
    if (checkPriority === "urgent") {
    countPrioUrgent++;
    numberOfPrioUrgent.innerHTML = `${countPrioUrgent}`;
}


}
    

function showTheCurrentDate() {
let date = new Date()
    
    let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
     let month = monthNames[date.getMonth()]; 
     let day = date.getDate();               
     let year = date.getFullYear();  
    
    
    let getCurrentDay = `${month} ${day},   ${year} `;

document.getElementById('currentDate').innerHTML = `${getCurrentDay}`;

    showTheCurrentTime();
}


function  showTheCurrentTime(){


let currentTime = new Date().getHours();
let greetingText = document.getElementById('showTheRightTime');

if (currentTime < 12) {
  greetingText.innerHTML = "Good Morning !!!"; 
  
} else if (currentTime < 18) {
    greetingText.innerHTML = "Good Afternoon !!!"; 
  console.log(greetingText);
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

function changeImageDoneDefault(boolean) {
    
    let imgIconKanbanBoardDone = document.getElementById('iconBoardDone');


    if (boolean) {
        imgIconKanbanBoardDone.src = './assets/IMG/frameimgwhitetwo.png';

    } else {
        imgIconKanbanBoardDone.src = './assets/IMG/Frame 59 (1).png'
    }
}



