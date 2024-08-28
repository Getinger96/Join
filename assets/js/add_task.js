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
let contacts = [];
let subtasks = [];
let assignedContacts = [];
let prio= [];




async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];

        if (contact && contact.email) {
            contactsArray.push({
                email: contact.email,
                name: contact.name,
                password: contact.password,
            });
        }
    }

    console.log(contactsArray);
    letterSorting();
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
    seleCon.innerHTML = `  <div onclick="choosedUserStory()" id="userStory" class= "userStory">User Story</div>
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
       <div id="profile_Container${i}" " class="profile_Container">
         <div class="profile_container_header">
          <div class="profile_Badge_assign">${firstletters}</div>
          <div>${name}</div>
         </div>
          <div id="checkbox${i}">
          <img onclick="selectedContact(${i},'${name}','${firstletters}')"  class="check_img " src="assets/IMG/Check button.svg" alt="">
          
         </div>
         
      
        </div>`;

    }

}

function selectedContact(i, name, firstletters,) {

    let checkbox = document.getElementById(`checkbox${i}`);

    checkbox.innerHTML = '';
    checkbox.innerHTML = `<img onclick="deselctedtContact(${i},'${name}','${firstletters}')"  class="checked_img" src="assets/IMG/Checked button.svg" alt="">`


    let profileContainer = document.getElementById(`profile_Container${i}`);




    profileContainer.classList.add('bg_color');
    profileContainer.classList.add('color_white');

    assignedContacts.push(name)


    showSelectedProfile(firstletters, i);

}







function deselctedtContact(i, name, firstletters) {


    let checkbox = document.getElementById(`checkbox${i}`);

    checkbox.innerHTML = '';
    checkbox.innerHTML = `<img onclick="selectedContact(${i},'${name}','${firstletters}')" id="checkImg${i}"  class="check_img  " src="assets/IMG/Check button.svg" alt="">`



    let profileContainer = document.getElementById(`profile_Container${i}`);





    profileContainer.classList.remove('bg_color');
    profileContainer.classList.remove('color_white');

    assignedContacts.splice(name, 1)


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
}

function urgent() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let urgentButton = document.getElementById("urgent");
    let urgentIcon = document.getElementById("urgentIcon");

    // Setze die neuen Styles und das Bild
    urgentButton.style.backgroundColor = "red";
    urgentButton.style.color = "white";
    urgentIcon.src = "./assets/IMG/iconUrgentWhite.svg";
}

function medium() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");

    // Setze die neuen Styles und das Bild
    mediumButton.style.backgroundColor = "orange";
    mediumButton.style.color = "white";
    mediumIcon.src = "./assets/IMG/iconMediumWhite.svg";
}

function low() {
    resetButtons();  // Setzt alle anderen Buttons zurück

    let lowButton = document.getElementById("low");
    let lowIcon = document.getElementById("lowIcon");

    // Setze die neuen Styles und das Bild
    lowButton.style.backgroundColor = "limegreen";
    lowButton.style.color = "white";
    lowIcon.src = "./assets/IMG/iconLowWhite.svg";
}

function addSubtask() {
    let list = document.getElementById('ul_subtasks');
    list.innerHTML = ''; //Liste wird gelöscht
    for (let i = 0; i < subtasks.length; i++) {
        let li = document.createElement('li'); //Liste wird wieder hinzugefügt
        li.innerHTML = subtasks[i] + /*html*/ ` <button class="Subtasks_Btn" onclick="deleteItem(${i})"><img src="./assets/img/delete.png"></button>`;
        list.appendChild(li);
    }
}

function deleteItem(i) { //Einzelnen Elemente aus der Liste löschen
    subtasks.splice(i, 1);
    addSubtask();
}

function addCurrentSubtask() {
    if (subtasks.length < 5) {
        let CurrentSubtask = document.getElementById('input_Subtasks').value;
        subtasks.push(CurrentSubtask);
        document.getElementById('input_Subtasks').value = ''; // Liste wieder leeren
        addSubtask();
    }
    else {
        alert('Genügend Subtasks hinzugefügt!');
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


async function createTask() {
    
    
    let titel = document.getElementById('title');
    let description = document.getElementById('Description')
    let assignedContact = assignedContacts;
    let date = document.getElementById('dueDate');
    let category= document.getElementById('Category');
    let subtask=subtasks;



    let newTask  = {
        Titel: titel.value,
        Description: description.value,
        AssignedContact: assignedContact,
        Date : date.value,
        Category : category.value,
        Subtask : subtask
    };
    

    await postData(`task`, newTask)

   





}