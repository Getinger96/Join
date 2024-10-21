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
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let keysArray = Object.keys(userJSON.contacts);
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];
        let key = keysArray[index];
        let colorIndex = index % colors.length;

        let color = colors[colorIndex];
        if (contact.email == 'guest@web.de') {

        } else {
            contacts.push({
                id: key,
                email: contact.email,
                name: contact.name,
                password: contact.password,
                color: color,
            })
            
        }
    }
    renderSelectionContainer()
    renderPrioButtons()
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
    d_none=true;
}

function openCategoryLIst() {
    let seleCon = document.getElementById('Selection_Container_Category');
    let arrowcona = document.getElementById('arrow_img_container_Category');
    arrowcona.innerHTML = '';
    arrowcona.innerHTML = `<img onclick="closelistCategory()"class="arrow_drop_downaa" src="./assets/IMG/arrow_drop_up.svg" alt="">`;
    seleCon.classList.remove('d_none');
    seleCon.innerHTML = `  <div onclick="choosedUserStory()" id="userStory" class= "userStory">User Story</div>
                        <div onclick="choosedTechnicalTask()" id="technichalTask" class= "technical_TAsk">Technical Task</div>
                         `;
}

function closelistCategory() {
    let selecCon = document.getElementById('Selection_Container_Category');
    let arrowCon = document.getElementById('arrow_img_container_Category');
    arrowCon.innerHTML = '';
    arrowCon.innerHTML = `<img onclick="openCategoryLIst()"class="arrow_drop_downaa" src="./assets/IMG/arrow_drop_downaa.svg" alt="">`;
    selecCon.classList.add('d_none');
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
       
    }else{
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

function showSelectedProfile(firstletters, i, contactColour) {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    let profilebadgeassign = document.getElementById(`profile_Badge_assign${i}`);

    if (profilebadgeassign) {
        // Entferne das Badge, wenn der Kontakt abgewählt wird
        profilebadgeassign.remove();
    } else {
        if (assignedContacts.length <= 4) {

            if (firstletters && contactColour) {
                selectedProfileContainer.innerHTML += `
                    <div id="profile_Badge_assign${i}" class="profile_Badge_assign ${contactColour}">${firstletters}</div>
                `;
            }
        }
    }

    let extraContactsBadge = document.getElementById('extra_Contacts_Badge');
    if (assignedContacts.length > 4) {
        let extraCount = assignedContacts.length - 4;

        // Falls das Badge für extra Kontakte bereits existiert, aktualisiere die Zahl
        if (extraContactsBadge) {
            extraContactsBadge.textContent = `+${extraCount}`;
        } else {
            // Erstelle ein neues Badge für extra Kontakte in Grau
            selectedProfileContainer.innerHTML += `
                <div id="extra_Contacts_Badge" class="profile_Badge_assign gray">+${extraCount}</div>
            `;
        }
    } else if (extraContactsBadge) {
        // Falls es keine zusätzlichen Kontakte mehr gibt, entferne das extra Badge
        extraContactsBadge.remove();
    }
}

   


function dateinput() {
    let duedate = document.getElementById('dueDate');
    duedate.min = new Date().toISOString().split('T')[0];
}

function renderPrioButtons() {
    let prioButtonContainer = document.getElementById('Prio_btn_Container');
    prioButtonContainer.innerHTML = `
                        <button onclick="chossedurgent()" type="button" id="urgent"  class="Prio_Btn">Urgent <img
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


function choosedUserStory() {
    let userStory = document.getElementById('Category');
    userStory.innerHTML = "";
    userStory.value = "User Story"
    closelistCategory();
}

function choosedTechnicalTask() {
    let userStory = document.getElementById('Category');
    userStory.innerHTML = "";
    userStory.value = "Technical Task";
    closelistCategory();
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
    let loggedInUser = localStorage.getItem('loggedInUser');
    loggedInUser = JSON.parse(loggedInUser);
    let guest = { "email": "guest@web.de", "name": "guest", "password": "guest123456" }

    let titel = document.getElementById('title');
    let description = document.getElementById('Description');
    let assignedContact = assignedContacts;
    let date = document.getElementById('dueDate').value;
    let category = document.getElementById('Category');
    let subtask = subtasks;
    let status = 'open'


    if (!validateTask(titel, category, date)) {
        return;
    } else

    document.getElementById("InputFieldsMissing").innerHTML ='';
    document.getElementById("WrongCurrentDateId").innerHTML ='';

    let newTask = {
        Titel: titel.value,
        Description: description.value,
        AssignedContact: assignedContact,
        Date: date,
        Prio: prio,
        Category: category.value,
        Subtask: subtask,
        Status: status
    };

    if (loggedInUser === guest) {
        localStorage.setItem('guestTasks', JSON.stringify(newTask))
        clearTask();

    }

    
    clearMissingFieldContent();
    await postData(`tasks`, newTask);
    clearTask();
    gotoBoard();

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
    category.value = "";
    subtasks = [];
    prio = [];
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

