const colors = [
    '#FF5733', // Orange
    '#FFC300', // Gelb
    '#33FF57', // Grün
    '#33FFF3', // Türkis
    '#3357FF', // Blau
    '#A133FF', // Lila
    '#FF33A1', // Pink
    '#FF8F33'  // Hellorange
];

const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contactsArray = [];
let beginningLetter = [];
let groupedContacts = [];
let selectedContactIndex = null;

async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];

        if (contact && contact.email) {
            contactsArray.push({
                email: contact.email,
            });
        }
    }

    console.log(contactsArray);
    letterSorting();
}

function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
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
}

function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
}

function openList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = `<img onclick="closelist()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_up.svg" alt="">`;
    selecCon.classList.remove('d_none');
}

function closelist() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = '';
    arrowCon.innerHTML = `<img onclick="openList()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_downaa.svg" alt="">`;
    selecCon.classList.add('d_none');
}


function openCategoryLIst() {
    let seleCon = document.getElementById('Selection_Container_Category');
    let arrowcona = document.getElementById('arrow_img_container_Category');
    arrowcona.innerHTML = '';
    arrowcona.innerHTML = `<img onclick="closelistCategory()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_up.svg" alt="">`;
    seleCon.classList.remove('d_none');
    seleCon.innerHTML = `  
        <div onclick="choosedUserStory()" id="userStory" class= "userStory">User Story</div>
        <div onclick="choosedTechnicalTask()" id="technichalTask" class= "technical_TAsk">Technical Task</div>
    `
}

function closelistCategory() {
    let selecCon = document.getElementById('Selection_Container_Category');
    let arrowCon = document.getElementById('arrow_img_container_Category');
    arrowCon.innerHTML = '';
    arrowCon.innerHTML = `<img onclick="openCategoryLIst()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_downaa.svg" alt="">`;
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
        let forNAme = name.charAt(0);
        let forNAmebig = forNAme.toUpperCase();
        let lastname = getLastName(name);
        let firstletterlastname = lastname.charAt(0);
        let firstletterlastnameBIG = firstletterlastname.toUpperCase();
        let firstletters = forNAmebig + firstletterlastnameBIG;
        profiles.innerHTML += `
       <div id="profile_Container${i}" onclick="selectedContact(${i},'${name}','${firstletters}')" class="profile_Container">
         <div class="profile_container_header">
          <div class="profile_Badge_assign">${firstletters}</div>
          <div>${name}</div>
         </div>
          <div>
          <img id="checkImg${i}"  class="check_img  " src="assets/IMG/Check button.svg" alt="">
          <img  id="checkedImg${i}" class="checked_img d_none" src="assets/IMG/Checked button.svg" alt="">
         </div>
        </div>`;
    }
}

function selectedContact(i, name, firstletters) {

    let profileContainer = document.getElementById(`profile_Container${i}`);
    let checkImg = document.getElementById(`checkImg${i}`);
    let checkedImg = document.getElementById(`checkedImg${i}`);

    checkImg.classList.toggle('d_none');
    checkedImg.classList.toggle('d_none');


    profileContainer.classList.toggle('bg_color');
    profileContainer.classList.toggle('color_white');

    showSelectedProfile(firstletters, i);
}


function showSelectedProfile(firstletters, i) {

    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    let profilebadgeassign = document.getElementById(`profile_Badge_assign${i}`)

    if (profilebadgeassign) {

        profilebadgeassign.remove();

    } else {
        selectedProfileContainer.innerHTML += `
            <div id="profile_Badge_assign${i}" class="profile_Badge_assign">${firstletters}</div>
        `;
    }
}



function selectedDificultyUrgent() {

    let urgent = document.getElementById('Urgent_container');
    let IMG = document.getElementById('sele_IMG_URG');
    let img = document.getElementById('Urgent_IMG');
    img.classList.toggle('d_none')
    IMG.classList.toggle('d_none')
    urgent.classList.toggle('color_white');
    urgent.classList.toggle('bg_urgent_selected');
    let medium = document.getElementById('MediumContainer');
    medium.classList.remove('color_white');
    medium.classList.remove('bg_Medium');
    let IMG_MEDIUM_SELEC = document.getElementById('sele_IMG_Med');
    let img_medium = document.getElementById('Med_IMG');
    IMG_MEDIUM_SELEC.classList.add('d_none')
    img_medium.classList.remove('d_none')
    let LOW = document.getElementById('LowContainer');
    let IMG_LOW = document.getElementById('sele_IMG_low');
    let img_low = document.getElementById('Low_IMG');
    IMG_LOW.classList.add('d_none')
    img_low.classList.remove('d_none')
    LOW.classList.remove('color_white');
    LOW.classList.remove('bg_Low');
}

function selectedDificultyMedium() {

    let medium = document.getElementById('MediumContainer');
    let IMG = document.getElementById('sele_IMG_Med');
    let img = document.getElementById('Med_IMG');
    img.classList.toggle('d_none')
    IMG.classList.toggle('d_none')
    medium.classList.toggle('color_white');
    medium.classList.toggle('bg_Medium');
    let urgent = document.getElementById('Urgent_container');
    let IMG_URGENT = document.getElementById('sele_IMG_URG');
    let img_urgent = document.getElementById('Urgent_IMG');
    IMG_URGENT.classList.add('d_none')
    img_urgent.classList.remove('d_none')
    urgent.classList.remove('color_white');
    urgent.classList.remove('bg_urgent_selected');
    let LOW = document.getElementById('LowContainer');
    let IMG_LOW = document.getElementById('sele_IMG_low');
    let img_low = document.getElementById('Low_IMG');
    IMG_LOW.classList.add('d_none')
    img_low.classList.remove('d_none')
    LOW.classList.remove('color_white');
    LOW.classList.remove('bg_Low');
}

function selectedDificultyLow() {

    let LOW = document.getElementById('LowContainer');
    let IMG = document.getElementById('sele_IMG_low');
    let img = document.getElementById('Low_IMG');
    img.classList.toggle('d_none')
    IMG.classList.toggle('d_none')
    LOW.classList.toggle('color_white');
    LOW.classList.toggle('bg_Low');
    let medium = document.getElementById('MediumContainer');
    medium.classList.remove('color_white');
    medium.classList.remove('bg_Medium');
    let IMG_MEDIUM_SELEC = document.getElementById('sele_IMG_Med');
    let img_medium = document.getElementById('Med_IMG');
    IMG_MEDIUM_SELEC.classList.add('d_none');
    img_medium.classList.remove('d_none');
    let urgent = document.getElementById('Urgent_container');
    let IMG_URGENT = document.getElementById('sele_IMG_URG');
    let img_urgent = document.getElementById('Urgent_IMG');
    IMG_URGENT.classList.add('d_none');
    img_urgent.classList.remove('d_none');
    urgent.classList.remove('color_white');
    urgent.classList.remove('bg_urgent_selected');
}

function addSubtask() {

    let list = document.getElementById('ul_subtasks');
    let subtask = document.getElementById('input_Subtasks').value;

    if (subtask == "") {

    }
    else {
        list.innerHTML += `<li>${subtask}</li>`;
        document.getElementById('input_Subtasks').value = '';
    }
}


function choosedUserStory() {
    let userStory = document.getElementById('Category');
    userStory.innerHTML = "";

    userStory.value = "User Story"
}

function choosedTechnicalTask() {
    let userStory = document.getElementById('Category');
    userStory.innerHTML = "";

    userStory.value = "Technical Task";
}


