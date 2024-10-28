const colors = [
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
let contacts = [];
let subtasks = [];
let assignedContacts = [];
let prio = [];

async function fetchContacts(path = '') {
    const userJSON = await getContactsData(path);
    const keysArray = Object.keys(userJSON.contacts);
    const userAsArray = Object.values(userJSON.contacts);

    processAndAddContacts(userAsArray, keysArray);
    setPrioMediumAndRender();
}
async function getContactsData(path) {
    const response = await fetch(base_URL + path + ".json");
    return await response.json();
}

function processAndAddContacts(userAsArray, keysArray) {
    for (let index = 0; index < userAsArray.length; index++) {
        const contact = userAsArray[index];
        const key = keysArray[index];
        const color = colors[index % colors.length];

        if (contact.email !== 'guest@web.de') {
            contacts.push({
                id: key,
                email: contact.email,
                name: contact.name,
                password: contact.password,
                color: color,
            });
        }
    }
}
function setPrioMediumAndRender() {
    renderSelectionContainer();
    renderPrioButtons();

    const medium = document.getElementById('medium');
    medium.innerHTML = `
        Medium
        <img src="assets/IMG/PRio_Medium_WHITE.svg" alt="">
    `;
    medium.classList.add('color_white', 'bg_Medium');
    prio = 'medium';
}

function func1(event) {
    event.stopPropagation();
}
let d_none = true;

function openList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    selecCon.classList.toggle('d_none');

    if (d_none == true) {
        arrowCon.innerHTML = `<img class="arrow_drop_downaa" src="assets/IMG/arrow_drop_up.svg" alt="">`;
        d_none = false;
    } else {
        arrowCon.innerHTML = `<img class="arrow_drop_up" src="./assets/IMG/arrow_drop_downaa.svg" alt="">`;
        d_none = true;
    }

}


function closelist() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = '';
    arrowCon.innerHTML = `<img class="arrow_drop_downaa" src="assets/IMG/arrow_drop_downaa.svg" alt="">`;
    selecCon.classList.add('d_none');
    d_none = true;
}

function openCategoryLIst() {
    // Toggle the visibility of the category selection container
    let seleCon = document.getElementById('Selection_Container_Category');
    seleCon.classList.toggle('d_none');
}

function choosedUserStory() {
    // Set the selected category as "User Story"
    let userStory = document.getElementById('Category');
    userStory.textContent = "User Story";
    closelistCategory();
}

function choosedTechnicalTask() {
    // Set the selected category as "Technical Task"
    let technicalTask = document.getElementById('Category');
    technicalTask.textContent = "Technical Task";
    closelistCategory();
}

function closelistCategory() {
    // Hide the category selection container
    let seleCon = document.getElementById('Selection_Container_Category');
    seleCon.classList.add('d_none');
}


function getLastName(name) {
    let lastName = name.trim().split(' ');
    return lastName[lastName.length - 1];
}

function renderSelectionContainer() {
    let profiles = document.getElementById('Selection_Container');
    if (!profiles) {
        console.error('Selection_Container not found');
        return;
    }
    profiles.innerHTML = ' ';
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let name = contact.name;
        let contactColour = contacts[i].color;
        let forNAme = name.charAt(0);
        let forNAmebig = forNAme.toUpperCase();
        let lastname = getLastName(name);
        let firstletterlastname = lastname.charAt(0);
        let firstletterlastnameBIG = firstletterlastname.toUpperCase();
        let firstletters = forNAmebig + firstletterlastnameBIG;
        profiles.innerHTML += renderContacts(i, contactColour, firstletters, name);
    }
}

function renderContacts(i, contactColour, firstletters, name) {
    return `
       <div  onclick="selectedContact(${i},'${name}','${firstletters}','${contactColour}')" id="profile_Container${i}" class="profile_Container">
         <div class="profile_container_header">
          <div class="profile_Badge_assign ${contactColour}">${firstletters}</div>
          <div>${name}</div>
         </div>
          <div id="checkbox${i}">
          <img  class="check_img " src="./assets/IMG/Check button.svg" alt="">
         </div>
        </div>`

}

function selectedContact(i, name, firstletters, contactColour) {
    let checkbox = document.getElementById(`checkbox${i}`);
    checkbox.innerHTML = `<img  class="checked_img" src="./assets/IMG/Checked button.svg" alt="">`
    let profileContainer = document.getElementById(`profile_Container${i}`);
    profileContainer.classList.toggle('bg_color');
    profileContainer.classList.toggle('color_white');
    profileContainer.classList.toggle('profile_Containerselected');

    if (!assignedContacts.includes(name)) {
        assignedContacts.push(name)
        showSelectedProfile(firstletters, i, contactColour)
    } else {
        deselctedtContact(i, name)
    }
    showSelectedProfile();
}

function deselctedtContact(i, name, firstletters, contactColour) {
    let checkbox = document.getElementById(`checkbox${i}`);
    checkbox.innerHTML = `<img  id="checkImg${i}" class="check_img" src="assets/IMG/Check button.svg" alt="">`
    assignedContacts = assignedContacts.filter(contact => contact !== name);

    showSelectedProfile(firstletters, i, contactColour);

}

function showSelectedProfile() {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    selectedProfileContainer.innerHTML = '';  

    for (let index = 0; index < assignedContacts.length; index++) {
        if (index < 4) {  
            let contactName = assignedContacts[index]; 
            renderContactBadge(contactName, index);
        }
    }

    let extraContactsBadge = document.getElementById('extra_Contacts_Badge');
    if (assignedContacts.length > 4) {
        renderExtraContactsBadge(selectedProfileContainer, extraContactsBadge);
    } else if (extraContactsBadge) {
        extraContactsBadge.remove(); 
    }
}

function renderContactBadge(contactName, index) {
    let contact = contacts.find(c => c.name === contactName); 

    if (contact) {
        let contactColour = contact.color;
        let firstLetters = contactName.charAt(0).toUpperCase() + getLastName(contactName).charAt(0).toUpperCase();

        let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
        selectedProfileContainer.innerHTML += `
            <div id="profile_Badge_assign${index}" class="profile_Badge_assign ${contactColour}">${firstLetters}</div>
        `;
    }
}

function renderExtraContactsBadge(selectedProfileContainer, extraContactsBadge) {
    let extraCount = assignedContacts.length - 4;
    if (extraContactsBadge) {
        extraContactsBadge.textContent = `+${extraCount}`;
    } else {
        selectedProfileContainer.innerHTML += `
            <div id="extra_Contacts_Badge" class="profile_Badge_assign gray">+${extraCount}</div>
        `;
    }
}

function dateinput() {
    let duedate = document.getElementById('dueDate');
    duedate.min = new Date().toISOString().split('T')[0];
}

function renderPrioButtons() {
    let prioButtonContainer = document.getElementById('Prio_btn_Container');
    prioButtonContainer.innerHTML = renderPrioButtonsHtml();
}

function renderPrioButtonsHtml() {
    return ` <button onclick="chossedurgent()" type="button" id="urgent"  class="Prio_Btn">Urgent <img
                        id="urgentIcon" src="./assets/IMG/Priority symbols (1).png" alt=""></button>
                        <button type="button" id="medium" onclick="choossedmedium()" class="Prio_Btn">Medium <img
                        id="mediumIcon" src="./assets/IMG/Prio_medium(2).svg" alt="">
                        </button>
                        <button type="button" id="low" onclick="choosedlow()" class="Prio_Btn">Low
                            <img id="lowIcon" src="./assets/IMG/Prio_Low(2).svg" alt=""></button>
                             `;
}


function chossedurgent() {
    renderPrioButtons();
    let urgent = document.getElementById('urgent');
    urgent.innerHTML =
        `
     Urgent
     <img src="./assets/IMG/Prio_urgent_WHITE.svg" alt="">
     `;

    urgent.classList.add('bg_urgent_selected');
    urgent.classList.add('color_white')
    prio = 'urgent';
};

function choossedmedium() {
    renderPrioButtons();
    let medium = document.getElementById('medium');
    medium.innerHTML =
        `
    Medium
    <img src="assets/IMG/PRio_Medium_WHITE.svg" alt="">
    `;
    medium.classList.add('color_white');
    medium.classList.add('bg_Medium');
    prio = 'medium';
}

function choosedlow() {
    renderPrioButtons();
    let low = document.getElementById('low');
    low.innerHTML =
        `
    Low
    <img src="./assets/IMG/Prio_LOW_WHITE.svg" alt="">
    `;
    low.classList.add('color_white');
    low.classList.add('bg_Low');
    prio = 'low';
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

async function createTask(event) {
    event.preventDefault();
    let newTask = createNewTask();
    if (!validateTask(newTask.Titel, newTask.Category, newTask.Date)) {
        return;
    }
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';

    await saveTask(newTask);
    clearTask();
    gotoBoard();
}

function createNewTask() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let guest = { "email": "guest@web.de", "name": "guest", "password": "guest123456" };
    let titel = document.getElementById('title').value;
    let description = document.getElementById('Description').value;
    let assignedContact = assignedContacts;
    let date = document.getElementById('dueDate').value;
    let category = document.getElementById('Category').innerHTML;
    let subtask = subtasks;
    let status = 'open';
    let newTask = newTaskObject(titel, description, assignedContact, date, prio, category, subtask ,status)

    
    if (JSON.stringify(loggedInUser) === JSON.stringify(guest)) {
        localStorage.setItem('guestTasks', JSON.stringify(newTask));
        clearTask();
    }
    return newTask;
}

function newTaskObject(titel, description, assignedContact, date, prio, category, subtask ,status ) {
    return newTask = {
        Titel: titel,
        Description: description,
        AssignedContact: assignedContact,
        Date: date,
        Prio: prio,
        Category: category,
        Subtask: subtask,
        Status: status
    };
}

async function saveTask(newTask) {
    clearMissingFieldContent();
    await postData(`tasks`, newTask);
}


async function clearTask() {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let contactColour = contacts[i].color;
        let name = contact.name;
        let forNAme = name.charAt(0);
        let forNAmebig = forNAme.toUpperCase();
        let lastname = getLastName(name);
        let firstletterlastname = lastname.charAt(0);
        let firstletterlastnameBIG = firstletterlastname.toUpperCase();
        let firstletters = forNAmebig + firstletterlastnameBIG;
    }
        clearFormFields();
        resetAddTask();
}

function clearFormFields() {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    selectedProfileContainer.innerHTML = '';
    let inpuSubtask = document.getElementById('input_Subtasks');
    inpuSubtask.value = "";
    let list = document.getElementById('ul_subtasks');
    list.innerHTML = '';
    let titel = document.getElementById('title');
    let description = document.getElementById('Description')
    let date = document.getElementById('dueDate');
    let category = document.getElementById('Category');
    titel.value = "";
    description.value = "";
    assignedContacts = [];
    date.value = "";
    category.innerHTML = "";
    subtasks = [];
    prio = [];    
}
function resetAddTask() {
    renderPrioButtons();
    clearMissingFieldContent();
    clearWarningField();
    choossedmedium();
    renderSelectionContainer();
}

function emptySubtask() {
    let currentSubtask = document.getElementById('input_Subtasks')
    currentSubtask.value = '';
}

