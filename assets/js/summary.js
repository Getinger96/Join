let countPrioUrgent = 0;
let iconsBooleanColorChange = false;


async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];

            contactsArray.push({
                email: contact.email,
                name: contact.name,
                password: contact.password,
                phone: contact.phone
            });
    
    }

    console.log(contactsArray);

}




function loadToDoAtTheKanbanBoard() {
        let statusCheckopen = 'open';
        let statusCheckprogress = 'progress';
        let statusCheckawaitingfeedback = 'awaitFeedback';
        let statusCheckclosed = 'closed';

        let countOpen = 0;
        let countInProgress = 0;
        let countAwaitingFeedback = 0;
        let countDone = 0;
        
       for (let index = 0; index < todos.length; index++) {
        let kanbanBoardStatus = todos[index].status;
        let kanbanBoradPrioUrgent = todos[index].priority;

 
    if (kanbanBoardStatus === statusCheckopen) {
        countOpen++;
    } else if (kanbanBoardStatus === statusCheckprogress) {
        countInProgress++;
    } else if (kanbanBoardStatus === statusCheckawaitingfeedback) {
        countAwaitingFeedback++;
    } else if (kanbanBoardStatus === statusCheckclosed) {       
        countDone++;
    }

    showAllPrioUrgent(kanbanBoradPrioUrgent);
    }

showKanbanBoardTodo(countOpen);                
showKanbanBoardTaskProgress(countInProgress);  
showKanbanBoarTaskAwaitingFeedback(countAwaitingFeedback);  
showKanbanBoardTaskdone(countDone);                  
showAllTaskinBoard(todos);          
showTheCurrentDate();    
checkIfLoggedIn();     
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


function showAllTaskinBoard(todos) {
    let getAllTask = document.getElementById('allTaskinBoard');

    getAllTask.innerHTML = `${todos.length}`;
    
}

function showAllPrioUrgent(kanbanBoradPrioUrgent) {

    let numberOfPrioUrgent = document.getElementById('prioUrgentId');
    
    if (kanbanBoradPrioUrgent === "urgent") {
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
}



//function loginUpSuccessfully() {
 //   document.getElementById('loginupsuccessfully').innerHTML =`  <div class="loginUpsuccessfully">
  //  <span class="loginstylesuccessfully"> Good  Afternoon !!!</span>

   // </div>`;

    
//}



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



