const colors = [
    '#FF5733', // Orange
    '#FFC300', // Yellow
    '#33FF57', // Green
    '#33FFF3', // Türkis
    '#3357FF', // Blue
    '#A133FF', // Purple
    '#FF33A1', // Pink
    '#FF8F33'  // brightorange
];

const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contactsArray = [];
let beginningLetter = [];
let groupedContacts = [];
let selectedContactIndex = null;

async function fetchContacts(path = '') {
    contactsArray = [];
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let keysArray = Object.keys(userJSON.contacts);
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];
        let key = keysArray[index];

        let checkMailContact = userAsArray.filter(c => c.email === contact.email);

        if (contact.email !== "guest@web.de" && checkMailContact.length > 0) {
            contactsArray.push({

                id: key,
                email: contact.email,
                name: contact.name,
                password: contact.password,
                phone: contact.phone
            });
        }
    };

    sortContactsByLetter();
}

/**
 * Extracts the last name from a full name string.
 * @param {string} fullName - The full name from which to extract the last name.
 */
function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
}


/**
 * Groups contacts by the first letter of their name.
 */
function groupContacts() {
    groupedContacts = {};

    contactsArray.forEach((contact, index) => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        let colorIndex = index % colors.length;
        let color = colors[colorIndex];

        if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
        }

        groupedContacts[firstLetter].push({ ...contact, index, color });
    });

    beginningLetter = Object.keys(groupedContacts).sort();
}

/**
 * Retrieves and groups contacts, then renders them.
 */
function renderContacts() {
    let showContacts = document.getElementById('contactview');
    let content = '';

    beginningLetter.forEach(letter => {
        content += `<h2>${letter}</h2>`;
        content += `<hr class="contactlist-hr">`;

        groupedContacts[letter].forEach(contact => {
            let selectedClass = (contact.index === selectedContactIndex) ? 'selected' : '';
            content += displayContacts(contact.index, contact.email, contact.name, getLastName(contact.name), contact.phone, selectedClass, contact.color);
        });
    });

    showContacts.innerHTML = content;
}
/**
 * Retrieves and groups contacts, then renders them.
 */
function getContacts() {
    groupContacts();
    renderContacts();
}


/**
 * Displays a single contact in the contact list.
 * @param {number} contactIndex - The index of the contact.
 * @param {string} contactsEmail - The email of the contact.
 * @param {string} contactsName - The name of the contact.
 * @param {string} contactLastname - The last name of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 * @param {string} selectedClass - Class indicating if the contact is selected.
 * @param {string} color - Background color for the contact icon.
 */
function displayContacts(contactIndex, contactsEmail, contactsName, contactLastname, contactPhone, selectedClass, color) {
    return `<div onclick="selectContact(${contactIndex})" class="single-contact-box ${selectedClass}" style="background-color:${selectedClass ? '#2A3647' : ''};">
                <div class="contact-icon" style="background-color:${color};">
                    <span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
                </div>
                <div class="contact-content">
                    <span class="contactname" style="color:${selectedClass ? 'white' : 'black'};">${contactsName}</span>
                </div>
             <img src="./assets/IMG/Secondary mobile contact V1.png" alt="Add Contact" class="add-contact-button" onclick="mobileAddContact(event)">
            </div>`;
}


/**
 * Selects a contact by its index and updates the UI accordingly.
 * @param {number} index - The index of the selected contact.
 */
function selectContact(index) {
    selectedContactIndex = index;
    getContacts();
    getContactBig(index);

    let detailView = document.querySelector('.contactview-container');
    detailView.classList.add('active');
}

/**
 * Closes the detail view of the contact.
 */
function closeDetailView() {
    let detailView = document.querySelector('.contactview-container');
    detailView.classList.remove('active');
}


/**
 * Retrieves and displays detailed information of a contact in a larger view.
 * @param {number} index - The index of the contact to display.
 */
function getContactBig(index) {
    let contact = contactsArray[index];
    let colorIndex = index % colors.length;
    let color = colors[colorIndex];
    
    let showContacts = document.getElementById('contactViewBig');
    showContacts.innerHTML = showContactBig(contact.name, contact.email, contact.phone, getLastName(contact.name), color);
}


/**
 * Displays detailed information of a contact in a large view.
 * @param {string} contactsName - The name of the contact.
 * @param {string} contactsEmail - The email of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 * @param {string} contactLastname - The last name of the contact.
 * @param {string} color - Background color for the contact icon.
 */
function showContactBig(contactsName, contactsEmail, contactPhone, contactLastname, color) {
    return `
    <div class="largcontactbox">
        <div class="largsingle-contact-box">
            <div class="largcontact-icon" style="background-color:${color};">
                <span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
            </div>
            <div class="largcontact-content">
                <span class="largcontactname">${contactsName}</span>
                <div class="editanddelete">
                    <div onclick="editContact(selectedContactIndex)" class="editcontent blur">
                        <img class="editicon" src="assets/IMG/edit.svg" alt="">
                        <span class="edit">Edit</span>
                    </div>
                    <div class="deletecontent" onclick="deleteContact(selectedContactIndex)">
                        <img class="deleteicon" src="./assets/IMG/delete.png" alt="">
                        <span class="delete">Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="contactinfo">
            <span class="contactinfoname">Contact Information</span>
            <div class="contactmailsection">
                <span class="Emailname">Email</span>
                <a class="contactmailadress" href="mailto:${contactsEmail}">${contactsEmail}</a>
            </div>
            <div class="contactphonesection">
                <span class="phonename">Phone</span>
                <a class="contactphone" href="tel:${contactPhone}">${contactPhone}</a>
            </div>
        </div>
        <img src="./assets/IMG/arrow-left-line.png" alt="backButton" onclick="closeDetailView()" class="back-button">
        <img src="./assets/IMG/Menu Contact options.png" alt="Menu button" class="menu-button-img" onclick="toggleMenu()">
        
        <!-- Kontextmenü -->
        <div id="contextMenu" class="context-menu">
            <div onclick="editContact(selectedContactIndex)" class="menu-item">
                <img src="./assets/IMG/edit.svg" alt="Edit" class="menu-icon">
                <span>Edit</span>
            </div>
            <div onclick="deleteContact(selectedContactIndex)" class="menu-item">
                <img src="./assets/IMG/delete.png" alt="Delete" class="menu-icon">
                <span>Delete</span>
            </div>
        </div>
    </div>
`;
}

/**
 * Collects the first letters of contact names and stores them in beginningLetter.
 */
function collectBeginningLetters() {
    beginningLetter = [];
    groupedContacts = {};

    contactsArray.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (!beginningLetter.includes(firstLetter)) {
            beginningLetter.push(firstLetter);
        }
    });

    beginningLetter.sort();
}

/**
 * Groups contacts by the first letter of their name and updates the display.
 */
function groupContactsByLetter() {
    contactsArray.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
    });
}

/**
 * Deletes a contact by index and updates the contact list.
 * @param {number} index - The index of the contact to delete.
 */
function sortContactsByLetter() {
    collectBeginningLetters();
    groupContactsByLetter();
    getContacts();
}

/**
 * Creates a new contact and sends it to the server.
 */
async function createContact() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('mail').value.trim();
    const phone = document.getElementById('telephone').value.trim();

    if (!validateContact(name, email, phone)) return;

    const newContact = { name, email, phone };
    let response = await postData('contacts', newContact);
    let generatedKey = response.name;

    contactsArray.push({ ...newContact, id: generatedKey });
    closeCardContact();
    await fetchContacts();
}

/**
 * Displays the new contact overlay to add a new contact.
 */
function addNewContact() {
    selectedContactIndex = null;
    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'flex';
    newContactOverlay.classList.add('transition-in-from-right');

    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.onclick = function () {
        closeCardContact();
    };

    const createButton = document.querySelector('.createContact-button');
    createButton.onclick = function () {
        createContact();
    }

}
/**
 * Displays the logo of the contact being edited.
 * @param {string} contactsName - The name of the contact.
 * @param {string} contactLastname - The last name of the contact.
 * @param {string} color - Background color for the contact icon.
 * @returns {string} - The HTML representation of the contact's logo.
 */
function displayEditContactLogo(contactsName, contactLastname, color) {
    return `
        <div class="edit-contact-logo" style="background-color:${color};">
            <span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
        </div>`;
}
/**
 * Displays the logo of the contact being edited.
 * @param {string} contactsName - The name of the contact.
 * @param {string} contactLastname - The last name of the contact.
 * @param {string} color - Background color for the contact icon.
 */
function htmlEditForm(index) {
    let contact = contactsArray[index];

    document.querySelector('.addcontactheadline').textContent = 'Edit Contact';
    document.querySelector('.addcontactsecondline').style.display = 'none';
    document.getElementById('name').value = contact.name;
    document.getElementById('mail').value = contact.email;
    document.getElementById('telephone').value = contact.phone;
    document.querySelector('.createContact-button').innerHTML = 'Save <img src="./assets/IMG/check.svg" alt="Save Icon" class="button-icon" style="margin-left: 8px;">';
    document.querySelector('.addNewContactimg').style.display = 'none';

    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.classList.add('transition-in-from-right');
    newContactOverlay.style.display = 'flex';
}
/**
 * Sets up actions for the edit contact modal, including save and delete actions.
 * @param {number} index - The index of the contact to edit.
 */
function editFunctionAction(index) {
    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.textContent = 'Delete';
    cancelButton.style.display = 'block';
    cancelButton.onclick = function () { deleteContact(index); };

    const saveButton = document.querySelector('.createContact-button');
    saveButton.onclick = function () {
        saveEditedContact(index);
    };
}
/**
 * Closes the contact form overlay and resets the form fields.
 */
function closeCardContact() {
    const newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'none';
    newContactOverlay.classList.remove('transition-in-from-right');

    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.innerHTML = 'Cancel <img src="assets/IMG/iconoir_cancel.png" alt="Cancel Icon" class="close-button" style="margin-left: 8px;">';
    cancelButton.onclick = closeCardContact;
    cancelButton.style.display = 'flex';

    document.querySelector('.addcontactheadline').textContent = 'Add Contact';
    document.querySelector('.addcontactsecondline').style.display = 'flex';
    document.getElementById('name').value = '';
    document.getElementById('mail').value = '';
    document.getElementById('telephone').value = '';

    let createButton = document.querySelector('.createContact-button');
    createButton.innerHTML = 'Create Contact <img src="assets/IMG/check.svg" alt="Create Icon" class="button-icon" style="margin-left: 8px;">';
    document.querySelector('.addNewContactimg').style.display = 'block';

    renderContacts();
}

/**
 * Edits an existing contact based on the index provided.
 * @param {number} index - The index of the contact to edit.
 */
function editContact(index) {
    if (window.innerWidth <= 1150) {
        showMobileEditContactOverlay(index);
    } else {

        htmlEditForm(index);
        editFunctionAction(index);
    }
}
/**
 * Deletes a contact by index and updates the contact list.
 * @param {number} index - The index of the contact to delete.
 */
async function deleteContact(index) {
    let key = contactsArray[index].id;
    if (index > -1) {
        await deleteData(`contacts/${key}`);
        deleteContactInBoard(index);
        contactsArray.splice(index, 1);
        sortContactsByLetter();

        if (window.innerWidth <= 1150) {
            closeDetailView();
        } else {
            clearBigContactView();
        }
        getContacts();

    } else {
        console.error("Invalid index for deletion:", index);
    }
}

/**
 * Resets the contact form fields to their default values.
 */
function resetContactForm() {
    document.querySelector('.addcontactheadline').textContent = 'Add Contact';
    document.querySelector('.addcontactsecondline').style.display = 'flex';
    document.getElementById('name').value = '';
    document.getElementById('mail').value = '';
    document.getElementById('telephone').value = '';

    let createButton = document.querySelector('.createContact-button');
    createButton.innerHTML = 'Create Contact <img src="assets/IMG/check.svg" alt="Create Icon" class="button-icon" style="margin-left: 8px;">';
    document.querySelector('.addNewContactimg').style.display = 'block';
}

/**
 * Closes the overlay and resets the contact form.
 */
function closeOverlay() {
    const newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'none';
    newContactOverlay.classList.remove('transition-in-from-right');

    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.innerHTML = 'Cancel <img src="assets/IMG/iconoir_cancel.png" alt="Cancel Icon" class="close-button" style="margin-left: 8px;">';
    cancelButton.onclick = closeCardContact;
    cancelButton.style.display = 'flex';

    resetContactForm();
    renderContacts();
}

/**
 * Closes the contact form overlay and resets the form fields and warning messages.
 */
function closeCardContact() {
    closeOverlay();
    resetContactForm();
    closeAllWarningMessage();
}

/**
 * Handles the closing of contact forms, both desktop and mobile.
 */
function handleCloseContact() {
    closeCardContact();
    closeCardContactMobile();
}

/**
 * Clears the detailed view of a contact.
 */
function clearBigContactView() {
    let showContacts = document.getElementById('contactViewBig');
    showContacts.innerHTML = '';
}

/**
 * Saves the edited contact data and updates the contact list.
 * @param {number} index - The index of the contact to save.
 */
async function saveEditedContact(index) {
    const oldName = contactsArray[index].name,
          name = document.getElementById('name').value.trim(),
          email = document.getElementById('mail').value.trim(),
          phone = document.getElementById('telephone').value.trim();

    if (!name || !email || !phone || !validateContact(name, email, phone)) return;

    const key = contactsArray[index].id,
          password = contactsArray[index].password;

    Object.assign(contactsArray[index], { name, email, phone });

    await putData(`contacts/${key}`, { name, email, phone, password });
    await updateContactInTasks({ oldName, newName: name });

    await fetchTasks();
    await fetchContacts();
    closeCardContact();
    getContactBig(index);
}

