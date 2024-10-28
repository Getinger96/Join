let d_none = true;

function openTaskBoard() {
    let =addtask=true;
    setTaskPriority();
    toggleTaskBoardVisibility();
}

function setTaskPriority() {
    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");
    mediumButton.classList.add("medium")
    mediumIcon.src = "./assets/IMG/Prio media.png";
    currentPriority = 'medium';
}

function toggleTaskBoardVisibility() {
    let taskDiv = document.getElementById('boardAddTask');
    let overlay = document.getElementById('darkOverlay');

    if (taskDiv.classList.contains('visible')){
        showTaskBoard(taskDiv, overlay);
    } else {
        hideTaskBoard(taskDiv, overlay);
    }
}

function showTaskBoard(taskDiv, overlay) {
    taskDiv.classList.remove('visible');
    overlay.classList.remove('visible');
    document.body.classList.add('no-scroll');
    setCreateTaskButton();
}

function hideTaskBoard(taskDiv, overlay) {
    taskDiv.classList.add('visible');
    overlay.classList.add('visible');
    document.body.classList.remove('no-scroll');
}

function redirect() {
    let width=window.innerWidth;
    if (addtask==true) {
        if (width < 1230) {
            window.location="http://127.0.0.1:5500/add_task.html"
         }
    }
}

function openList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    selecCon.classList.toggle('d_none');
    if (d_none == true) {
        arrowCon.innerHTML = `<img class="arrow_drop_up" src="assets/IMG/arrow_drop_up.svg" alt="">`;
        d_none = false;
    } else {
        arrowCon.innerHTML = `<img class="arrow_drop_downaa" src="./assets/IMG/arrow_drop_downaa.svg" alt="">`;
        d_none = true;
    }
    getContacts();
    updateContactStyles();
}

function updateContactStyles() {
    for (let i = 0; i < contactsArray.length; i++) {
        const contact = contactsArray[i];
        const contactContainer = document.getElementById(`profile-${i}`);
        if (assignedContacts.includes(contact.name)) {
            contactContainer.classList.add('bg_color', 'color_white');
        } else {
            contactContainer.classList.remove('bg_color', 'color_white');
        }
    }
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
    if (!contactContainer) {
        return
    }
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

function deselctedtContact(index, name,nameletter,color) {
    showSelectedContainer(nameletter, index);
    let contactIndex = assignedContacts.indexOf(nameletter);
    if (contactIndex !== -1) {
        assignedContacts.splice(contactIndex, 1);
    }
    showSelectedProfile(color, name, index,color)
    let contactContainer = document.getElementById(`profile-${index}`);

    if (!contactContainer) {
        return;
    }
    contactContainer.classList.remove('bg_color');
    contactContainer.classList.remove('color_white');
    let profileBadge = document.getElementById(`profilebadge_Assign${index}`);
    if (profileBadge) {
        profileBadge.remove();
    }     
}


function showSelectedProfile(color, name, index) {
    clearSelectedProfileContainer();
    displayAssignedContacts();
    updateExtraContactsBadge();
}

function clearSelectedProfileContainer() {
    const selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    if (selectedProfileContainer) {
        selectedProfileContainer.innerHTML = '';  
    }
}

function displayAssignedContacts() {
    const selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    for (let i = 0; i < assignedContacts.length && i < 4; i++) { 
        let contactName = assignedContacts[i];
        let contact = contactsArray.find(c => c.name === contactName);
        if (contact) {
            addContactBadge(selectedProfileContainer, contact, contactName, i);
        }
    }
}

function addContactBadge(container, contact, contactName, index) {
    let contactColour = contact.color;
    let firstletters = contactName.charAt(0).toUpperCase() + getLastName(contactName).charAt(0).toUpperCase();
    container.innerHTML += `
        <div id="profile_Badge_assign${index}" class="profile_Badge_assign ${contactColour}">${firstletters}</div>
    `;
}

function updateExtraContactsBadge() {
    const extraContactsBadge = document.getElementById('extra_Contacts_Badge');
    let extraCount = assignedContacts.length - 4;

    if (extraCount > 0) {
        if (extraContactsBadge) {
            extraContactsBadge.textContent = `+${extraCount}`;
        } else {
            createExtraContactsBadge(extraCount);
        }
    } else if (extraContactsBadge) {
        extraContactsBadge.remove();
    }
}

function createExtraContactsBadge(extraCount) {
    const selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    selectedProfileContainer.innerHTML += `
        <div id="extra_Contacts_Badge" class="profile_Badge_assign gray">+${extraCount}</div>
    `;
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
        selectedProfileContainer.innerHTML += showselectedProfileContainer(index, color, firstletters);

    }
}

function showselectedProfileContainer(index, color, firstletters) {
  return `
    <div id="profilebadge_Assign${index}" class="contact-icon${index} ${color} profilebadge">
        <div>${firstletters}</div>
    </div>
`;
}

function resetButtons() {
    let buttons = [
        { id: 'urgent', imgSrc: './assets/IMG/Priority symbols (1).png' },
        { id: 'medium', imgSrc: './assets/IMG/Priority symbols (2).png' },
        { id: 'low', imgSrc: './assets/IMG/Priority symbols.png' }
    ];
    buttons.forEach(button => {
        let btnElement = document.getElementById(button.id);
        let iconElement = document.getElementById(button.id + "Icon");
        
        btnElement.classList.remove('urgent', 'medium', 'low');
        btnElement.classList.add('default');
        iconElement.src = button.imgSrc;
    });
    currentPriority = 'none';
}

function clearTask() {
    deselectAllContacts();
    clearCurrentTask();
    clearFormFields();
    resetAdditionalSettings();
    resetDataArrays();
    getContacts();
    clearMissingFieldContent();
    returnColorPrioIcons();
    medium();
}

function deselectAllContacts() {
    for (let contactIndex = 0; contactIndex < contactsArray.length; contactIndex++) {
        let contact = contactsArray[contactIndex];
        deselctedtContact(contactIndex, contact.name, `${contact.name.charAt(0).toUpperCase()}${getLastName(contact.name).charAt(0).toUpperCase()}`, contact.color);
    }
}

function clearCurrentTask() {
    let taskIndex = currentTaskIndex;
    if (taskIndex !== undefined && tasksArray[taskIndex]) {
        tasksArray[taskIndex].subtask = [];
        localStorage.removeItem(`task-${taskIndex}-subtasks`);
    }
}

function clearFormFields() {
    clearSelectionContainer();
    clearInputField('taskTitle');
    clearInputField('description');
    resetSelectElement('kategorie');
    clearSubtaskContainer();
    resetSelectElement('select_container');
    clearDateInput();
    clearSelectedProfiles();
}

function clearSelectionContainer() {
    const selectionContainer = document.getElementById('Selection_Container');
    if (selectionContainer) {
        selectionContainer.innerHTML = '';
    }
}

function clearInputField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = '';
    }
}

function resetSelectElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.selectedIndex = 0;
    }
}

function clearSubtaskContainer() {
    const subtaskContainer = document.getElementById('subtasksContainer');
    if (subtaskContainer) {
        subtaskContainer.innerHTML = '';
    }
}

function clearDateInput() {
    const dateInput = document.querySelector('.inputTitleDate');
    if (dateInput) {
        dateInput.value = '';
    }
}

function clearSelectedProfiles() {
    const selectedProfilesContainer = document.getElementById('Selected_profiles_Container');
    if (selectedProfilesContainer) {
        selectedProfilesContainer.innerHTML = '';
    }
}

function resetAdditionalSettings() {
    resetButtons();
}

function resetDataArrays() {
    assignedContacts = [];
    subtasks = [];
}

function urgent() {
    resetButtons();

    let urgentButton = document.getElementById("urgent");
    let urgentIcon = document.getElementById("urgentIcon");

    urgentButton.classList.add("urgent"); 
    urgentIcon.src = "./assets/IMG/iconUrgentWhite.svg";
    currentPriority = 'urgent';
}

function medium() {
    resetButtons();

    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");

    mediumButton.classList.add("medium");
    mediumIcon.src = "./assets/IMG/Prio media.png";
    currentPriority = 'medium';
}

function low() {
    resetButtons();

    let lowButton = document.getElementById("low");
    let lowIcon = document.getElementById("lowIcon");

    lowButton.classList.add("low"); 
    lowIcon.src = "./assets/IMG/Prio_LOW_WHITE.svg";
    currentPriority = 'low';
}

