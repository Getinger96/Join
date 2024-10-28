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

    if (!validateInputFields()) {
        return;
    }

    let newTodo = getTaskDetails();
    await createNewTodo(newTodo);
    resetAfterCreation();
}

function validateInputFields() {
    let titleElement = document.getElementById('taskTitle');
    let dueDateElement = document.getElementById('taskDueDate');
    let kategorieElement = document.getElementById('kategorie');

    if (!validateTask(titleElement, kategorieElement, dueDateElement)) {
        return false;
    } else {
        clearValidationMessages();
        return true;
    }
}

function clearValidationMessages() {
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';
}

function getTaskDetails() {
    let titleElement = document.getElementById('taskTitle');
    let dueDateElement = document.getElementById('taskDueDate');
    let kategorieElement = document.getElementById('kategorie');
    let title = titleElement.value.trim();
    let dueDate = dueDateElement.value.trim();
    let kategorie = kategorieElement.value.trim();
    let descriptionElement = document.getElementById('description');
    let description = descriptionElement ? descriptionElement.value.trim() : '';
    let priority = currentPriority;
    let subtask = subtasks;
    let validCategories = ['open', 'progress', 'awaitFeedback', 'closed'];
    let status = validCategories.includes(kategorie) ? kategorie : 'open';
    return {
        Titel: title,
        Description: description,
        Date: dueDate,
        Prio: priority,
        Category: kategorie,
        Subtask: subtask,
        Status: status,
        AssignedContact: assignedContacts,
    };
}

async function createNewTodo(newTodo) {
    await postData(`tasks`, newTodo);
}

function resetAfterCreation() {
    tasksArray = [];
    closeTaskUpdate();
    assignedContacts = [];
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

async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];
        let colorIndex = index % colors.length;
        let color = colors[colorIndex]

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
        return;
    }
    showContacts.innerHTML = '';
    let groupedContacts = groupContacts(contactsArray);
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
    
    function groupContacts(contacts) {
        let groupedContacts = {};
        contacts.forEach((contact, index) => {
            let firstLetter = contact.name.charAt(0).toUpperCase();
            let color = contact.color;
            
            if (!groupedContacts[firstLetter]) {
                groupedContacts[firstLetter] = [];
            }
    
            groupedContacts[firstLetter].push({ ...contact, index, color });
        });
    
        return groupedContacts;
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
    location.reload();
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
    let assignedContacts = task.Assigned || [];
    let category = task.Category;
    let subtask = task.subtask;
    let status = task.status;
    currentCategory = status;
    getContacts();
    closeoverlayedit(index);
    
    renderAssignedContacts(assignedContacts);
    populateTaskFields(title, description, dueDate, priority, category, subtask, index);
}

function renderAssignedContacts(assignedContacts) {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    selectedProfileContainer.innerHTML = '';

    for (let indexcon = 0; indexcon < assignedContacts.length && indexcon < 4; indexcon++) {
        let contact = assignedContacts[indexcon];
        let contactContainer = document.getElementById(`profile-${indexcon}`);
        if (contactContainer) {
            contactContainer.classList.add('bg_color');
            contactContainer.classList.add('color_white');
        }
        showSelectedProfileEdit(contact); 
    }

    handleExtraContacts(selectedProfileContainer, assignedContacts.length);
}

function handleExtraContacts(container, count) {
    if (count > 4) {
        let extraCount = count - 4;
        container.innerHTML += `
            <div id="extra_Contacts_Badge" class="profile_Badge_assign gray">+${extraCount}</div>
        `;
    }
}

function populateTaskFields(title, description, dueDate, priority, category, subtask, index) {
    let tasktitle = document.getElementById('taskTitle');
    tasktitle.value = title;
    let taskdescription = document.getElementById('description');
    taskdescription.value = description;
    let taskDAte = document.getElementById('taskDueDate');
    taskDAte.value = dueDate;

    setPriority(priority);

    let taskCategory = document.getElementById('kategorie');
    taskCategory.value = category;

    subtasks = subtask;
    addSubtask();

    changeAddtaskButton(index);
}

function setPriority(priority) {
    if (priority == 'urgent') {
        urgent();
    } else if (priority == 'medium') {
        medium();
    } else if (priority == 'low') {
        low();
    }
}

async function createEdittask(index) {
        let tasktitle = document.getElementById('taskTitle');
        let taskdescription = document.getElementById('description');
        let taskDAte = document.getElementById('taskDueDate');
        let taskCategory = document.getElementById('kategorie');
        let task = tasksArray[index];
        let status = task.status
        let key = task.taskKey;
        
        if (!validateTask(tasktitle, taskCategory, taskDAte)) {
            return;
        } else{ 
            createEdittaskPut(tasktitle, taskdescription, taskDAte, taskCategory, task, status, key)
        }
            
    }
async function createEdittaskPut(tasktitle, taskdescription, taskDAte, taskCategory, task, status, key) {   
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
        
    

    


  



