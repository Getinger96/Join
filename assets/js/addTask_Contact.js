async function fetchContacts(path = '') {
    const userJSON = await getContactsData(path);
    const keysArray = Object.keys(userJSON.contacts);
    const userAsArray = Object.values(userJSON.contacts);

    processAndAddContacts(userAsArray, keysArray);
    setPrioMediumAndRender();
}
/**
 * this function gets th path for the fetch function
 * 
 * @param {*} path 
 * @returns {boolean}
 */
async function getContactsData(path) {
    const response = await fetch(base_URL + path + ".json");
    return await response.json();
}

/**
 * This function iterate threw the array and pushes into the array contacts
 * 
 * @param {} userAsArray data from database
 * @param {*} keysArray key data from the database
 */
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


/**
 * This function changes the style of an selected contact and checks wether or not the contact is selected if its  already  selected then style changes back and get spliced from the array
 * 
 * @param {number} i index of the contact
 * @param {string} name name of the contact
 * @param {string} firstletters first leter of surname and lastname
 * @param {string} contactColour color of the contactsbadge
 */
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


/**
 * This function get started if the contact is already selected. and changes the style of the img of the contactcontainer and the starts another function named showselectedprofile
 * 
 * @param {number} i index of the contact
 * @param {string} name full name of the contact
 * @param {string} firstletters first letters of the surname and lastname 
 * @param {string} contactColour color of the contacts badge
 */
function deselctedtContact(i, name, firstletters, contactColour) {
    let checkbox = document.getElementById(`checkbox${i}`);
    checkbox.innerHTML = `<img  id="checkImg${i}" class="check_img" src="assets/IMG/Check button.svg" alt="">`
    assignedContacts = assignedContacts.filter(contact => contact !== name);
    showSelectedProfile(firstletters, i, contactColour);
}

/**
 * This function iterate thru the array assignedContacts and if the length is under 4 it starts the function  renderContactBadge(contactName, index) if its higher the other function get started
 * 
 */
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

/**
 * This function renders the contactsbadges that shows up under the selection container and returns the html
 * 
 * @param {string} contactName name of the contact
 * @param {number} index index of the contact
 */
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

/**
 * This function render the extra contactsbadge with the number of selcetd contacts
 * 
 * @param {*} selectedProfileContainer div container of the selected profiles
 * @param {*} extraContactsBadge div of the contact badge with the numbers of the selected contaqct above 4
 */
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