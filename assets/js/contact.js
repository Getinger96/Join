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
    let userAsArray = Object.entries(userJSON.contacts);

    contactsArray = []; 

    for (let [id, contact] of userAsArray) {
        if (contact && contact.email) {
            contactsArray.push({
                id: id,
                email: contact.email,
                name: contact.name,
                password: contact.password,
                phone: contact.phone
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

function getContacts() {
    let showContacts = document.getElementById('contactview');
    let content = ''; 

    groupedContacts = {};

    contactsArray.forEach((contact, index) => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        let colorIndex = index;

        if (colorIndex >= colors.length) {
            colorIndex = colorIndex - colors.length;
        }

        let color = colors[colorIndex];

        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }

        groupedContacts[firstLetter].push({ ...contact, index, color });
    });

    beginningLetter = Object.keys(groupedContacts).sort();

    for (let index = 0; index < beginningLetter.length; index++) {
        let letter = beginningLetter[index];
        content += `<h2>${letter}</h2>`;
        content += `<hr class="contactlist-hr">`;

        groupedContacts[letter].forEach(contact => {
            let selectedClass = (contact.index === selectedContactIndex) ? 'selected' : '';
            content += displayContacts(contact.index, contact.email, contact.name, getLastName(contact.name), contact.phone, selectedClass, contact.color);
        });
    }

    showContacts.innerHTML = content; 
}

function displayContacts(contactIndex, contactsEmail, contactsName, contactLastname, contactPhone, selectedClass, color) {
    return `<div onclick="selectContact(${contactIndex})" class="single-contact-box ${selectedClass}" style="background-color:${selectedClass ? '#2A3647' : ''};">
                <div class="contact-icon" style="background-color:${color};">
                    <span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
                </div>
                <div class="contact-content">
                    <span class="contactname" style="color:${selectedClass ? 'white' : 'black'};">${contactsName}</span>
                    <a class="contactmail" href="mailto:${contactsEmail}">${contactsEmail}</a>
                </div>
            </div>`;
}

function selectContact(index) {
    selectedContactIndex = index;
    console.log('Selected Contact Index:', selectedContactIndex); 
    getContacts(); 
    getContactBig(index); 
}

function getContactBig(index) {
    let contact = contactsArray[index];
    console.log('Selected Contact:', contact);
    let showContacts = document.getElementById('contactViewBig');
    showContacts.innerHTML = showContactBig(contact.name, contact.email, contact.phone, getLastName(contact.name), colors[index]);
}

function showContactBig(contactsName, contactsEmail, contactPhone, contactLastname, color) {
    return `<div class="largcontactbox">
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
                <img class="deleteicon" src="assets/IMG/delete.png" alt="">
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
    </div>`;
}

function letterSorting() {
    beginningLetter = []; 
    groupedContacts = []; 

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
    getContacts();
}

async function createContact() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('mail').value.trim();
    const phone = document.getElementById('telephone').value.trim();

    const newContact = {
        name: name,
        email: email,
        phone: phone
    };

    contactsArray.push(newContact);
    await postData('contacts', newContact);
    letterSorting();
    closeCardContact();
}

function addNewContact() {
    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'flex';

    newContactOverlay.classList.add('transition-in-from-right');

    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.onclick = function () {
        closeCardContact();
    };

    const createButton = document.querySelector('.createContact-button');
    createButton.onclick = function () {
        const form = document.getElementById('contactForm');
        
        if (form.checkValidity()) {
            createContact(); 
            closeCardContact(); 
        } else {
            form.reportValidity(); 
        }
    };
}

function editContact(index) {
    let contact = contactsArray[index];

    document.querySelector('.addcontactheadline').textContent = 'Edit Contact';
    document.querySelector('.addcontactsecondline').style.display = 'none';
    document.getElementById('name').value = contact.name;
    document.getElementById('mail').value = contact.email;
    document.getElementById('telephone').value = contact.phone;
    document.querySelector('.createContact-button').innerHTML = 'Save <img src="assets/IMG/check.svg" alt="Save Icon" class="button-icon" style="margin-left: 8px;">';

    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.textContent = 'Delete';
    cancelButton.style.display = 'block';
    cancelButton.onclick = function () { deleteContact(index); };

    const saveButton = document.querySelector('.createContact-button');
    saveButton.onclick = function () {
        saveEditedContact(index);
    };

    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.classList.add('transition-in-from-right');
    newContactOverlay.style.display = 'flex';
}

async function deleteContact(index) {
    if (index > -1) {
        const contact = contactsArray[index];
        await deleteData(`contacts/${contact.id}`);
        contactsArray.splice(index, 1);
        letterSorting();
        closeCardContact();
        clearBigContactView();
    } else {
        console.error("Invalid index for deletion:", index);
    }
}

function closeCardContact() {
    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'none';

    newContactOverlay.classList.remove('transition-in-from-right');

    document.querySelector('.addcontactheadline').textContent = 'Add Contact';
    document.querySelector('.addcontactsecondline').style.display = 'flex';
    document.getElementById('name').value = '';
    document.getElementById('mail').value = '';
    document.getElementById('telephone').value = '';
    document.querySelector('.createContact-button').textContent = 'Create Contact';

    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.innerHTML = 'Cancel<img class="close-button" src="assets/IMG/iconoir_cancel.png">';
    cancelButton.style.display = 'flex';
}

function clearBigContactView() {
    let showContacts = document.getElementById('contactViewBig');
    showContacts.innerHTML = '';
}

async function saveEditedContact(index) {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('mail').value.trim();
    const phone = document.getElementById('telephone').value.trim();

    if (name && email && phone) {
        contactsArray[index].name = name;
        contactsArray[index].email = email;
        contactsArray[index].phone = phone;

        letterSorting();
        closeCardContact();
        getContactBig(index);
    }
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

async function deleteData(path="") {
    let response = await fetch(base_URL + path + ".json", {
        method: "DELETE",
    });

return responsASJson = await response.json();
}

async function putData(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return responsASJson = await response.json();
}



