function openTaskBoard() {
    const windowWidth = window.innerWidth;

    // Wenn die Bildschirmbreite kleiner oder gleich 1450px ist, zur add_task.html weiterleiten

    // Standardmäßig das Overlay öffnen
    let taskDiv = document.getElementById('boardAddTask');
    let overlay = document.getElementById('darkOverlay');

    if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
        taskDiv.style.display = 'block';  // Overlay anzeigen
        overlay.style.display = 'block';  // Dunklen Hintergrund anzeigen
        document.body.style.overflow = 'hidden';  // Hauptseite scrollen verhindern
        setCreateTaskButton();
    } else {
        taskDiv.style.display = 'none';  // Overlay ausblenden
        overlay.style.display = 'none';  // Dunklen Hintergrund ausblenden
        document.body.style.overflow = 'auto';  // Scrollen auf der Hauptseite wieder erlauben
    }
}

function openList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML =`<img onclick="closelist()" class="arrow_drop_downaa" src="assets/IMG/arrow_drop_up.svg" alt="">`;
    selecCon.classList.remove('d_none');
    getContacts();

    for (let i = 0; i < contactsArray.length; i++) {
        let contact = contactsArray[i];
        let contactContainer = document.getElementById(`profile-${i}`);

        if (assignedContacts.includes(contact.name)) {
            contactContainer.classList.add('bg_color');
            contactContainer.classList.add('color_white');
        } else {
            contactContainer.classList.remove('bg_color');
            contactContainer.classList.remove('color_white');
        }
    }
}

function closelist() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = '';
    arrowCon.innerHTML = `<img onclick="openList()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_downaa.svg" alt="">`;
    selecCon.classList.add('d_none');
}

function displayContacts(contactIndex, contactsName, contactLastname, selectedClass, color) {
   

    return `<div class= "Contact-Container"  id="profile-${contactIndex}" onclick="selectedContact(${contactIndex}, '${color}', '${contactsName}')">
                <div class="contact-icon ${color} profilebadge">
                    <span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
                </div>
                <div class="contact-content">
                    <span class="contactname">${contactsName}</span>
                </div>
            </div>`;
            

}
function showSelectedContainer(name,index) {
    let includedName = assignedContacts.includes(name)
    let contactContainer = document.getElementById(`profile-${index}`);
    if (includedName) {
        contactContainer.classList.add('bg_color');
        contactContainer.classList.add('color_white');
        
    }else {
        contactContainer.classList.remove('bg_color');
        contactContainer.classList.remove('color_white');
    }
}

function selectedContact(index, color, name) {
    showSelectedContainer(name, index);
    let includedName = assignedContacts.includes(name);

    if (includedName) {
        deselctedtContact(index, color, name);
    } else {
        assignedContacts.push(name);
        showSelectedProfile(color, name, index);

        let contactContainer = document.getElementById(`profile-${index}`);
        contactContainer.classList.add('bg_color');
        contactContainer.classList.add('color_white');
    }
}




function deselctedtContact(index, color, name) {
    showSelectedContainer(name, index);
    let contactIndex = assignedContacts.indexOf(name);
    if (contactIndex !== -1) {
        assignedContacts.splice(contactIndex, 1);
    }

    let contactContainer = document.getElementById(`profile-${index}`);
    contactContainer.classList.remove('bg_color');
    contactContainer.classList.remove('color_white');

    let profileBadge = document.getElementById(`profilebadge_Assign${index}`);
    if (profileBadge) {
        profileBadge.remove();
    }


}

function showSelectedProfile(color, name, index) {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    let profile_Badge_assign = document.getElementById(`profilebadge_Assign${index}`);

    let contact = contactsArray[index];
    let firstletters = `${contact.name.charAt(0).toUpperCase()}${getLastName(contact.name).charAt(0).toUpperCase()}`;
    if (profile_Badge_assign) {
        profile_Badge_assign.remove();
    } else {
        selectedProfileContainer.innerHTML += `
    <div id="profilebadge_Assign${index}" class="contact-icon${index} ${color} profilebadge">
        <div>${firstletters}</div>
    </div>`;
    }
}


function showSelectedProfileEdit(name) {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    let findcontact = contactsArray.find(co => co.name === name);

    let color = findcontact.color;
    let index = contactsArray.indexOf(findcontact);

    let profile_Badge_assign = document.getElementById(`profilebadge_Assign${index}`)


    let firstletters = `${name.charAt(0).toUpperCase()}${getLastName(name).charAt(0).toUpperCase()}`;
    if (profile_Badge_assign) {
        profile_Badge_assign.remove();

    } else {

        selectedProfileContainer.innerHTML += `
    <div id="profilebadge_Assign${index}" class="contact-icon${index} ${color} profilebadge">
        <div>${firstletters}</div>
    </div>
`;
    }
};

function resetButtons() {
    let buttons = [
        { id: 'urgent', color: 'initial', imgSrc: './assets/IMG/Priority symbols (1).png' },
        { id: 'medium', color: 'initial', imgSrc: './assets/IMG/Priority symbols (2).png' },
        { id: 'low', color: 'initial', imgSrc: './assets/IMG/Priority symbols.png' }
    ];

    buttons.forEach(button => {
        let btnElement = document.getElementById(button.id);
        let iconElement = document.getElementById(button.id + "Icon");
        btnElement.style.backgroundColor = button.color;
        btnElement.style.color = 'initial';
        iconElement.src = button.imgSrc;
    });
    currentPriority = 'none';
}

function clearTask() {

    for (let contactIndex = 0; contactIndex < contactsArray.length; contactIndex++) {
        let contact = contactsArray[contactIndex];
        deselctedtContact(contactIndex, contact.name, `${contact.name.charAt(0).toUpperCase()}${getLastName(contact.name).charAt(0).toUpperCase()}`, contact.color);
    }

    const selectionContainer = document.getElementById('Selection_Container');
    if (selectionContainer) {
        selectionContainer.innerHTML = '';
    }
    const taskTitle = document.getElementById('taskTitle');
    if (taskTitle) {
        taskTitle.value = '';
    }
    const description = document.getElementById('description');
    if (description) {
        description.value = '';
    }
    const kategorie = document.getElementById('kategorie');
    if (kategorie) {
        kategorie.selectedIndex = 0;
    }
    let subtaskContainer = document.getElementById('subtasksContainer');
    if (subtaskContainer) {
        subtaskContainer.innerHTML = '';
    }
    const selectContainer = document.getElementById('select_container');
    if (selectContainer) {
        selectContainer.selectedIndex = 0;
    }
    const dateInput = document.querySelector('.inputTitle[type="date"]');
    if (dateInput) {
        dateInput.value = '';
    }
    const selectedProfilesContainer = document.getElementById('Selected_profiles_Container');
    if (selectedProfilesContainer) {
        selectedProfilesContainer.innerHTML = '';
    }
    resetButtons();
    assignedContacts = [];
    subtasks = [];
    getContacts();
}

function urgent() {
    resetButtons();

    let urgentButton = document.getElementById("urgent");
    let urgentIcon = document.getElementById("urgentIcon");
    urgentButton.style.backgroundColor = "red";
    urgentButton.style.color = "white";
    urgentIcon.src = "./assets/IMG/iconUrgentWhite.svg";
    currentPriority = 'urgent';
}

function medium() {
    resetButtons();

    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");
    mediumButton.style.backgroundColor = "orange";
    mediumButton.style.color = "white";
    mediumIcon.src = "./assets/IMG/Prio media.png";
    currentPriority = 'medium';
}

function low() {
    resetButtons();

    let lowButton = document.getElementById("low");
    let lowIcon = document.getElementById("lowIcon");
    lowButton.style.backgroundColor = "limegreen";
    lowButton.style.color = "white";
    lowIcon.src = "./assets/IMG/Prio_LOW_WHITE.svg";
    currentPriority = 'low';
}

function addCurrentSubtask() {
    if (!subtasks) {
        subtasks = [];
    }
    let currentSubtask = document.getElementById('new-subtask').value;
    if (currentSubtask === "") {
        alert('Bitte geben Sie eine gültige Subtask ein.');
        return;
    }
    if (subtasks.length < 5) {
        subtasks.push(currentSubtask);
        document.getElementById('new-subtask').value = '';
        addSubtask();
    } else {
        alert('Genügend Subtasks hinzugefügt!');
    }
}

function deleteItem(i) {
    event.stopPropagation();
    subtasks.splice(i, 1);
    let taskIndex = currentTaskIndex;
    tasksArray[taskIndex].subtask = subtasks;
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
    delete subtaskStatus[i];
    localStorage.setItem(`task-${taskIndex}-subtasks`, JSON.stringify(subtaskStatus));
    addSubtask();
    updateProgress(taskIndex);
}

function addSubtask() {

    if (!Array.isArray(subtasks)) {
        subtasks = [];
    }


    let subtaskContainer = document.getElementById('subtasksContainer');


    subtaskContainer.innerHTML = '';

  
    if (subtasks.length === 0) {
        return;
    }

 
    for (let i = 0; i < subtasks.length; i++) {
        subtaskContainer.innerHTML += `
            <div class="editSubtaskheadlineContainer" >
            <div class="editSubtask" id="subTaskValueId${i}">
                <ul>
                <li>${subtasks[i]}</li>
                </ul>
                </div>
            <div class="subtaskEditDiv">
                <button type="button" class="Subtasks_Btn" onclick="deleteItem(${i})">
                    <img src="./assets/IMG/delete.png" alt="Delete">
                </button>

            
              <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                    <img src="./assets/IMG/edit.png" alt="Edit">
                </button>
            </div>
            </div>`;
    }
}

function emptySubtask() {


    let currentSubtask = document.getElementById('new-subtask')

    currentSubtask.value='';
}

function editSubtask(i) {

    document.getElementById(`subTaskValueId${i}`).innerHTML = `
    <li>
    <input id="subtaskValue${i}" class="subTaskInput" type="text" value="${subtasks[i]}">
    </li>`

    document.getElementById(`changeImgEdit${i}`).innerHTML = `
   <button type="button" class="EditSubtaskButton" onclick="enterNewSubtask(${i})">
                    <img class="imgCheckedIcon" id="changeImgEdit${i}" src="./assets/IMG/checkAddTask.png" alt="check">
                </button>`;



}


function enterNewSubtask(i) {
    event.stopPropagation();
   let newSubTask = document.getElementById(`subtaskValue${i}`).value

   subtasks[i] =newSubTask;
   document.getElementById(`changeImgEdit${i}`).innerHTML =

    addSubtask();
    
}
