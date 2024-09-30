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
    arrowCon.innerHTML = `<img onclick="closelist()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_up.svg" alt="">`;
    selecCon.classList.remove('d_none');
    getContacts();

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


function selectedContact(index, color, name) {


    let includedName = assignedContacts.includes(name)

    if (includedName) {
        deselctedtContact(index, color, name)

    } else {
        let contactContainer = document.getElementById(`profile-${index}`);
        contactContainer.classList.add('bg_color');
        contactContainer.classList.add('color_white');
        assignedContacts.push(name);
        showSelectedProfile(color, name, index)
    }



}

function deselctedtContact(index, color, name) {
    let contactContainer = document.getElementById(`profile-${index}`);
    contactContainer.classList.remove('bg_color');
    contactContainer.classList.remove('color_white');
    assignedContacts.splice(name, 1);
    showSelectedProfile(color, name, index)
}


function showSelectedProfile(color, name, index) {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    let profile_Badge_assign=document.getElementById(`profilebadge_Assign${index}`)

    let contact = contactsArray[index];
        let firstletters = `${contact.name.charAt(0).toUpperCase()}${getLastName(contact.name) .charAt(0).toUpperCase()}`;
if (profile_Badge_assign) {
    profile_Badge_assign.remove();

}else{
    selectedProfileContainer.innerHTML += `
    <div id="profilebadge_Assign${index}" class="contact-icon${index} ${color} profilebadge">
        <div>${firstletters}</div>
    </div>
`;


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
