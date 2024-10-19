function openTaskBoard() {
  
    let =addtask=true;
 
       
    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");
    mediumButton.style.backgroundColor = "orange";
    mediumButton.style.color = "white";
    mediumIcon.src = "./assets/IMG/Prio media.png";
    currentPriority = 'medium';
    
    let taskDiv = document.getElementById('boardAddTask');
    let overlay = document.getElementById('darkOverlay');

    if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
        taskDiv.style.display = 'block';  
        overlay.style.display = 'block';  
        document.body.style.overflow = 'hidden';  
        setCreateTaskButton();
    
    } else {
        taskDiv.style.display = 'none';  
        overlay.style.display = 'none';  
        document.body.style.overflow = 'auto'; 
    }
   
}


function redirect() {
    let width=window.innerWidth;
    if (addtask==true) {
        if (width < 1230) {
            window.location="http://127.0.0.1:5500/add_task.html"
             
         }
    }
   
}

let d_none = true;
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


    let taskIndex = currentTaskIndex;
    if (taskIndex !== undefined && tasksArray[taskIndex]) {
        tasksArray[taskIndex].subtask = [];
        localStorage.removeItem(`task-${taskIndex}-subtasks`);
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
    const dateInput = document.querySelector('.inputTitleDate');
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
    clearMissingFieldContent();
    returnColorPrioIcons();
    medium();
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

