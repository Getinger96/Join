let subtask = [];
let tasksArray = [];



let currentDraggedElement;


async function fetchTasks(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let tasksAsarray = Object.values(userJSON.tasks)


    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];

        tasksArray.push(
            {
                Title: task.Titel,
                Description: task.description,
                Assigned: task.AssignedContact,
                duedate: task.Date,
                Prio: task.Prio,
                Category: task.Category,
                subtask: task.Subtask,
                status: 'open',
            }
        )
<<<<<<< HEAD
        updateHtml(task);
=======

        generateTodoHTML(task,index)
>>>>>>> ea73104dddb7ac6accb64af3416e8c66d17547df
    }

    console.log(tasksArray)

}



<<<<<<< HEAD
function updateHtml(task) {
let statusCategories = ['open', 'progress', 'awaitFeedback', 'closed'];

for (let index = 0; index < statusCategories.length; index++) {
    let categoryies = statusCategories[index];

        let filteredTasks = tasksArray.filter(t => t.status === categoryies);
        document.getElementById(categoryies).innerHTML = '';
        filteredTasks.forEach((task, taskIndex) => {
            document.getElementById(categoryies).innerHTML += generateTodoHTML(task, taskIndex);
            getassignecontacts(task, taskIndex);
        });
    };
}


=======

>>>>>>> ea73104dddb7ac6accb64af3416e8c66d17547df



function openTask() {
    let taskDiv = document.getElementById('boardAddTask');
    taskDiv.style.display = taskDiv.style.display === 'none' || taskDiv.style.display === '' ? 'block' : 'none';
}

function closeTask() {
    document.getElementById('boardAddTask').style.display = 'none';
}

// Generieren des HTML-Codes für eine Aufgabe
<<<<<<< HEAD
function generateTodoHTML(task, taskIndex) {
    // Überprüfe, ob das todo-Objekt die erwartete Struktur hat
    let title = task.Title;
    let description = task.Description;
    let dueDate = task.duedate;
    let priority = task.Prio;
    let assignedContacts =task.Assigned;
    let category = task.Category;
    let subtask = task.subtask;
=======
function generateTodoHTML(task,index) {
    // Überprüfe, ob das todo-Objekt die erwartete Struktur hat
    let title = task.Titel;
    let description = task.Description;
    let dueDate = task.Date;
    let priority = task.Prio;
    let assignedContacts =task.AssignedContact;
    let category = task.Category;
    let subtask = task.Subtask;
>>>>>>> ea73104dddb7ac6accb64af3416e8c66d17547df




   

   


    // Definiere Prioritäts-Icons
    let priorityIcon = '';
    if (priority == 'urgent') {
        priorityIcon = './assets/img/PRio_urgent (2).svg';

    } else if (priority == 'medium') {
        priorityIcon = './assets/IMG/Prio_medium (2).svg';
    } else if (priority == 'low') {
        priorityIcon = './assets/IMG/iconLowWhite.svg';


    } else {
        priorityIcon = './assets/img/Prio_Low (2).svg';
    }



    // Definiere Farben basierend auf der Kategorie
    let categoryColor = '';
    if (category == 'Technical Task') {
        categoryColor = '#1FD7C1';
    } else {
        categoryColor = '#0038FF';

    }
   

<<<<<<< HEAD
  return  `
    <div class="todo" draggable="true" ondragstart="startDragging(${taskIndex})">
=======
    let open = document.getElementById('open')
    open.innerHTML+=   /*html*/`
    <div class="todo" draggable="true" ondragstart="startDragging(${index})">
>>>>>>> ea73104dddb7ac6accb64af3416e8c66d17547df
        <div class="divKategorie" style="background-color: ${categoryColor};">${category}</div>
        <h3>${title}</h3>
        <p>${description}</p>
        <p>Priority: <img src="${priorityIcon}" alt="${priority} Priority"></p>
        <p>Duedate: ${dueDate}</p>
<<<<<<< HEAD
        <p id="assignedContacts${taskIndex}">Assigned Contacts:</p>
        <p>Subtasks: ${subtask}</p>
    </div>`;
}

function getassignecontacts(task, taskIndex) {
    let assignedContacts =task.Assigned;

    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);
=======
        <p id="assignedContacts${index}">Assigned Contacts:</p>
        <p>Subtaskasks: ${subtask}</p>
            
        

     
    </div>
   
       `;


getassignecontacts(assignedContacts, index)

}

function getassignecontacts(assignedContacts, index) {
    let asignedContainer = document.getElementById(`assignedContacts${index}`);
>>>>>>> ea73104dddb7ac6accb64af3416e8c66d17547df
    console.log(assignedContacts)

    for (let index = 0; index < assignedContacts.length; index++) {
        let contact = assignedContacts[index];

        asignedContainer.innerHTML += `<div class="profilebadge">${contact}</div>`;

    }

}


function allowDrop(ev) {
    ev.preventDefault();

}

function dragLeave(ev) {
    const target = ev.target.closest('.drag-area');
    if (target) {
        removeHighlight(target.id);
    }
}

// Überprüfe, ob eine Spalte leer ist, und zeige die Nachricht entsprechend an
function startDragging(index) {
    currentDraggedElement = index;
}

function moveTo(category) {
    tasksArray[currentDraggedElement]['status'] = category;
    updateHtml();

}

function highlight(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('drag-area-highlight');
    }
}

function removeHighlight(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('drag-area-highlight');
    }
}

// Add Subtask
function addSubtask() {
    let list = document.getElementById('list');
    list.innerHTML = ''; //Liste wird gelöscht
    for (let i = 0; i < subtask.length; i++) {
        let li = document.createElement('li'); //Liste wird wieder hinzugefügt
        li.innerHTML = subtask[i] + /*html*/` <button class="subtaskList" onclick="deleteItem(' + i +')"><img src="./assets/img/delete.png"></button>`;
        list.appendChild(li);
    }
}

function deleteItem(i) { //Einzelnen Elemente aus der Liste löschen
    subtask.splice(i, 1);
    addSubtask();
}

function addCurrentSubtask() {
    if (subtask.length < 5) {
        let CurrentSubtask = document.getElementById('new-subtask').value;
        subtask.push(CurrentSubtask);
        document.getElementById('new-subtask').value = ''; // Liste wieder leeren
        addSubtask();
    }
    else {
        alert('Genügend Subtasks hinzugefügt!');
    }
}

//Prio Buttons
function resetButtons() {
    // Zurücksetzen aller Buttons
    let buttons = [
        { id: 'urgent', color: 'initial', imgSrc: './assets/img/PRio_urgent (2).svg' },
        { id: 'medium', color: 'initial', imgSrc: './assets/IMG/Prio_medium (2).svg' },
        { id: 'low', color: 'initial', imgSrc: './assets/img/Prio_Low (2).svg' }
    ];

    buttons.forEach(button => {
        let btnElement = document.getElementById(button.id);
        let iconElement = document.getElementById(button.id + "Icon");

        btnElement.style.backgroundColor = button.color;
        btnElement.style.color = 'initial';
        iconElement.src = button.imgSrc;
    });

    currentPriority = 'none';  // Keine Priorität ausgewählt
}

function urgent() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let urgentButton = document.getElementById("urgent");
    let urgentIcon = document.getElementById("urgentIcon");

    // Setze die neuen Styles und das Bild
    urgentButton.style.backgroundColor = "red";
    urgentButton.style.color = "white";
    urgentIcon.src = "./assets/IMG/iconUrgentWhite.svg";

    currentPriority = 'urgent';  // Setzt die Priorität auf 'urgent'
}

function medium() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");

    // Setze die neuen Styles und das Bild
    mediumButton.style.backgroundColor = "orange";
    mediumButton.style.color = "white";
    mediumIcon.src = "./assets/IMG/iconMediumWhite.svg";

    currentPriority = 'medium';  // Setzt die Priorität auf 'medium'
}

function low() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let lowButton = document.getElementById("low");
    let lowIcon = document.getElementById("lowIcon");

    // Setze die neuen Styles und das Bild
    lowButton.style.backgroundColor = "limegreen";
    lowButton.style.color = "white";
    lowIcon.src = "./assets/IMG/iconLowWhite.svg";

    currentPriority = 'low';  // Setzt die Priorität auf 'low'
}

function search() {
    let search = document.getElementById('searchInput').value.toLowerCase();
    let todos = document.querySelectorAll('.todo');

    if (search.length >= 3) {
        showTasksSearch(search, todos);
    } else {
        for (let i = 0; i < todos.length; i++) {
            todos[i].style.display = 'block';
        }
    }
}

function showTasksSearch(search, todos) {
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        let titleElement = todo.querySelector('.drag-area'); // Greift auf das `div`-Element zu, das den Titel enthält
        let title = titleElement ? titleElement.textContent.toLowerCase() : todo.textContent.toLowerCase();

        if (title.includes(search)) {
            todo.style.display = 'block';
        } else {
            todo.style.display = 'none';
        }
    }
}

//Add Task leeren
function clearTask() {
    // Titel-Eingabefeld leeren
    document.getElementById('taskTitle').value = '';

    // Beschreibungstextfeld leeren
    document.getElementById('description').value = '';

    // Kategorie-Dropdown zurücksetzen
    document.getElementById('kategorie').selectedIndex = 0;

    // Subtasks-Liste leeren
    document.getElementById('list').innerHTML = '';

    // Subtask-Eingabefeld leeren
    document.getElementById('new-subtask').value = '';

    // 'Assigned to'-Dropdown zurücksetzen (falls vorhanden)
    document.getElementById('select_container').selectedIndex = 0;

    // Datumseingabefeld leeren (falls vorhanden)
    document.querySelector('.inputTitle[type="date"]').value = '';

    // Prioritäts-Buttons zurücksetzen
    resetButtons();
}

function resetPrioButtons() {
    // Hintergrundfarbe und Bild der Prio-Buttons auf den Standard zurücksetzen
    const prioButtons = ['urgent', 'medium', 'low'];
    prioButtons.forEach(id => {
        let button = document.getElementById(id);
        let icon = document.getElementById(id + 'Icon');

        // Hintergrundfarbe und Textfarbe zurücksetzen
        button.style.backgroundColor = 'initial';
        button.style.color = 'initial';

        // Icon-Bild zurücksetzen
        switch (id) {
            case 'urgent':
                icon.src = './assets/img/Prio_Urgent.svg';
                break;
            case 'medium':
                icon.src = './assets/IMG/Prio_Medium.svg';
                break;
            case 'low':
                icon.src = './assets/img/Prio_LOw.svg';
                break;
        }
    });
}

// Funktion, um den Wert des select-Elements abzurufen
function getSelectedCategory() {
    const categorySelect = document.getElementById('kategorie');
    if (categorySelect) {
        return categorySelect.value;
    }
    return null;
}

function generateUniqueId() {
    return tasksArray.length > 0 ? tasksArray[tasksArray.length - 1].id + 1 : 0;
<<<<<<< HEAD
}
=======
}


>>>>>>> ea73104dddb7ac6accb64af3416e8c66d17547df
