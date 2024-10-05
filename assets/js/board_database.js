let colors = [
    'orange',
    'gelb',
    'grün',
    'türkis',
    'blau',
    'lila',
    'pink',
    'hellorange'
];

const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contactsArray = [];
let beginningLetter = [];
let groupedContacts = [];
let assignedContacts = [];
let currentPriority = 'none';
let currentCategory = 'open';
let path = "tasks";
let currentStatus;

async function createTask(event) {
    event.preventDefault();
    const titleElement = document.getElementById('taskTitle');
    const dueDateElement = document.getElementById('taskDueDate');
    const kategorieElement = document.getElementById('kategorie');

    if (!titleElement || !dueDateElement || !kategorieElement) {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
    }
    const title = titleElement.value.trim();
    const dueDate = dueDateElement.value.trim();
    const kategorie = kategorieElement.value.trim();

    if (!title || !dueDate || !kategorie) {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
    }

    const descriptionElement = document.getElementById('description');
    const description = descriptionElement ? descriptionElement.value.trim() : '';
    const priority = currentPriority;
    let subtask = subtasks;
    const validCategories = ['open', 'progress', 'awaitFeedback', 'closed'];
    const status = validCategories.includes(kategorie) ? kategorie : 'open';
    const newTodo = {
        Titel: title,
        Description: description,
        Date: dueDate,
        Prio: priority,
        Category: kategorie,
        Subtask: subtask,
        Status: status,
        AssignedContact: assignedContacts,
    };
    await postData(`tasks`, newTodo);
    tasksArray = [];
<<<<<<< HEAD
    closeTaskUpdate();
    assignedContacts=[];
=======
    await closeTaskUpdate();
>>>>>>> 5e396c6050edc753f502aac56469a3141cbaeba8
    fetchTasks();
}

async function postData(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return responsASJson = await response.json();
}

function emptyTasks(category) {
    let container = document.getElementById(category);
    let noTasksElement = document.querySelector(`.noTasks[category="${category}"]`);

    if (noTasksElement) {
        if (container && container.innerHTML.trim() === '') {
            noTasksElement.style.display = 'block';
        } else {
            noTasksElement.style.display = 'none';
        }
    } else {
        console.error(`Element mit category="${category}" nicht gefunden.`);
    }
}

async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];
        let colorIndex = index;

        if (colorIndex >= colors.length) {
            colorIndex -= colors.length;
        }

        let color = colors[colorIndex];

        if (contact.email == 'guest@web.de') {

        } else {
            contactsArray.push({
                name: contact.name,
                color: color,
            })
        }
        letterSorting()
    }
}

function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
}

function getContacts() {
    let showContacts = document.getElementById('Selection_Container');

    if (!showContacts) {
        console.error("Element with ID 'Selection_Container' not found.");
        return;
    }
    showContacts.innerHTML = '';
    let groupedContacts = {};
    contactsArray.forEach((contact, index) => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        let color = contact.color;
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }

        groupedContacts[firstLetter].push({ ...contact, index, color });
    });
    let beginningLetter = Object.keys(groupedContacts).sort();
    for (let index = 0; index < beginningLetter.length; index++) {
        let letter = beginningLetter[index];
        showContacts.innerHTML += `<h2 class="letter">${letter}</h2>`;
        groupedContacts[letter].forEach(contact => {
            showContacts.innerHTML += displayContacts(contact.index, contact.name, getLastName(contact.name), '', contact.color)
            showSelectedContainer(contact.name,contact.index);
        });
       
}
    }
    





function letterSorting() {
    contactsArray.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();

        if (beginningLetter.indexOf(firstLetter) === -1) {
            beginningLetter.push(firstLetter);
            groupedContacts.push({
                letter: firstLetter,
                contacts: [contact]
            });
        } else {
            let group = groupedContacts.find(contacts => contacts.letter === firstLetter);
            if (group) {
                group.contacts.push(contact);
            }
        }
    });
    beginningLetter.sort();
    getContacts();
}

function updateHTMLBoard() {
    console.log("Aktuelle Todos:", tasksArray);
    const containers = {
        open: document.getElementById('open'),
        progress: document.getElementById('progress'),
        awaitFeedback: document.getElementById('awaitFeedback'),
        closed: document.getElementById('closed')
    };

    Object.values(containers).forEach(container => {
        if (container) {
            container.innerHTML = '';
        } else {
            console.error('Container nicht gefunden.');
        }
    });

    tasksArray.forEach(task => {
        console.log("Aktuelle Aufgabe:", task);
        if (containers[task.status]) {
            const taskHTML = generateTodoHTML(task);
            containers[task.status].innerHTML += taskHTML;
        } else {
            console.error(`Container für Status "${todo.status}" nicht gefunden.`);
        }
    });

    ['open', 'progress', 'awaitFeedback', 'closed'].forEach(category => {
        emptyTasks(category);
    });
}

function emptyTasks(category) {
    let container = document.getElementById(category);
    let noTasksElement = document.querySelector(`.noTasks[category="${category}"]`);

    if (noTasksElement) {
        if (container && container.innerHTML.trim() === '') {
            noTasksElement.style.display = 'block';
        } else {
            noTasksElement.style.display = 'none';
        }
    } else {
        console.error(`Element mit category="${category}" nicht gefunden.`);
    }
}

async function deleteData(path = "") {
    let response = await fetch(base_URL + path + ".json", {
        method: "DELETE",
    });

    return responsASJson = await response.json();
}

async function putDataEdit(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return responsASJson = await response.json();
}

async function deleteTask(task) {
    localStorage.removeItem(`task-${task}-subtasks`);
    let key = tasksArray[task].taskKey;
    await deleteData(`tasks/${key}`);
    tasksArray.splice(task, 1);
    closeOverlay();
    updateHtml();
}

function changeAddtaskButton(index) {
    let buttonaddtask = document.getElementById('DibButtomAddtask');
    buttonaddtask.innerHTML = `
          <button onclick="clearTask()" class="buttonContainerWhite curser">Clear <img
                            src="./assets/IMG/x_icon_clear.svg"></button>
                    <button  onclick="createEdittask(${index})" class="buttonContainerdark curser">Edit Task <img
                            src="assets/IMG/clear_Img.svg"></button>`
}

function setCreateTaskButton() {
    let buttonaddtask = document.getElementById('DibButtomAddtask');
    buttonaddtask.innerHTML = `
            <button onclick="clearTask()" class="buttonContainerWhite curser">Clear <img
                src="./assets/IMG/x_icon_clear.svg"></button>
            <button onclick="createTask(event)" class="buttonContainerdark curser">Create Task <img
                src="assets/IMG/clear_Img.svg"></button>`;
}

 
async function EditData(index) {
    openTask(index);
    let task = tasksArray[index];
    let title = task.Title;
    let description = task.Description;
    let dueDate = task.duedate;
    let priority = task.Prio;
    let assignedContacts = task.Assigned || '';
    let category = task.Category;
    let subtask = task.subtask;
    let status = task.status;
    currentCategory = status;
    getContacts();
    closeOverlay(index);

    for (let indexcon = 0; indexcon < assignedContacts.length; indexcon++) {
        let contact = assignedContacts[indexcon];
        let contactContainer = document.getElementById(`profile-${indexcon}`);
        contactContainer.classList.add('bg_color');
        contactContainer.classList.add('color_white');
        showSelectedProfileEdit(contact, indexcon)
    }

    let tasktitle = document.getElementById('taskTitle');
    tasktitle.value = title;
    let taskdescription = document.getElementById('description');
    taskdescription.value = description;
    let taskDAte = document.getElementById('taskDueDate');
    taskDAte.value = dueDate;
    if (priority == 'urgent') {
        urgent()
    }
    if (priority == 'medium') {
        medium()
    }
    if (priority == 'low') {
        low()
    }
    let taskCategory = document.getElementById('kategorie');
    taskCategory.value = category;
    subtasks = subtask;
    addSubtask(event);
    changeAddtaskButton(index);
};

async function createEdittask(index) {
    let tasktitle = document.getElementById('taskTitle');
    let taskdescription = document.getElementById('description');
    let taskDAte = document.getElementById('taskDueDate');
    console.log(currentCategory);
    let taskCategory = document.getElementById('kategorie');
    let task = tasksArray[index];
    let status = task.status
    let key = task.taskKey;

    let editedTASk = {

        Titel: tasktitle.value,
        Description: taskdescription.value,
        AssignedContact: assignedContacts,
        Date: taskDAte.value,
        Prio: currentPriority,
        Category: taskCategory.value,
        Subtask: subtasks,
        Status: status,
    }
    await putDataEdit(`tasks/${key}`, editedTASk)
    closeTask();
    closeOverlay();
    await fetchTasks();
}

    