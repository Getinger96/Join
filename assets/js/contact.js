const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contactsArray = [];
let beginningLetter = [];
let groupedContacts = [];
let selectedContactIndex = null; // Variable zum Speichern des aktuell ausgewählten Kontakts

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

// Fetch contacts from the server
async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.keys(userJSON.contacts);
    console.log(userAsArray);

    Object.keys(userJSON.contacts).forEach(key => {
        let contactGroup = userJSON.contacts[key];

        // Check if the contact group has nested contacts
        if (!contactGroup.email) {
            // It is a nested object, iterate over all nested contacts
            Object.keys(contactGroup).forEach(subKey => {
                contactsArray.push(contactGroup[subKey]);
            });
        } else {
            // It is a simple contact
            contactsArray.push(contactGroup);
        }
    });

    letterSorting();
    console.log(contactsArray);
}

function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
}


// Display contacts in the list
function getContacts() {
    let showContacts = document.getElementById('contactview');
    showContacts.innerHTML = '';

    let contactCounter = 0; 

    for (let index = 0; index < beginningLetter.length; index++) {
        let letter = beginningLetter[index];
        showContacts.innerHTML += `<h2>${letter}</h2>`;
        showContacts.innerHTML += `<hr class="contactlist-hr">`;

        // Add all contacts of the group
        let group = groupedContacts.find(group => group.letter === letter);
        if (group) {
            group.contacts.forEach((contact, contactIndex) => {
                let colorIndex = contactCounter % colors.length;
                let color = colors[colorIndex];
                let contactLastname = getLastName(contact.name);
                showContacts.innerHTML += displayContacts(contactCounter, contact.email, contact.name, contactLastname, contact.phone, color);
                contactCounter++; 
            });
        }
    }
}

// Display a single contact
function displayContacts(contactIndex, contactsEmail, contactsName, contactLastname, contactPhone, color) {
    return `<div onclick="getContactBig(${contactIndex}, '${contactsName}', '${contactsEmail}', '${contactPhone}', '${contactLastname}', '${color}')" class="single-contact-box">
                <div class="contact-icon" style="background-color:${color};">
                    <span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
                </div>
                <div class="contact-content">
                    <span class="contactname">${contactsName}</span>
                    <a class="contactmail" href="mailto:${contactsEmail}">${contactsEmail}</a>
                </div>
            </div>`;
}

function letterSorting() {
    beginningLetter = [];  // Stelle sicher, dass diese Arrays jedes Mal geleert werden
    groupedContacts = [];

    contactsArray.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();

        let group = groupedContacts.find(g => g.letter === firstLetter);
        if (!group) {
            group = { letter: firstLetter, contacts: [] };
            groupedContacts.push(group);
            beginningLetter.push(firstLetter);
        }
        group.contacts.push(contact);
    });

    beginningLetter.sort();  // Sortiere die Buchstaben alphabetisch
    groupedContacts.sort((a, b) => a.letter.localeCompare(b.letter));  // Sortiere die Gruppen ebenfalls alphabetisch

    getContacts();  
}


// Diese Funktion wird aufgerufen, wenn ein Kontakt angeklickt wird
function getContactBig(contactCounter) {
    let selectedContact = null;
    let counter = 0;
    for (let i = 0; i < beginningLetter.length; i++) {
        let letter = beginningLetter[i];
        let group = groupedContacts.find(group => group.letter === letter);
        if (group) {
            for (let j = 0; j < group.contacts.length; j++) {
                if (counter === contactCounter) {
                    selectedContact = group.contacts[j];
                    break;
                }
                counter++;
            }
            if (selectedContact) break;
        }
    }

    selectedContactIndex = contactsArray.findIndex(contact => contact.name === selectedContact.name);

    let color = colors[contactCounter % colors.length];

    let showContacts = document.getElementById('contactViewBig');
    showContacts.innerHTML = showContactBig(selectedContact.name, selectedContact.email, selectedContact.phone, getLastName(selectedContact.name), color);
}

// Diese Funktion zeigt die detaillierten Informationen eines Kontakts an
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
                <a class="contactphone" href="${contactPhone}">${contactPhone}</a>
            </div>
        </div>
    </div>`;
}

function createContact() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('mail').value.trim();
    const phone = document.getElementById('telephone').value.trim();

    const newContact = {
        name: name,
        email: email,
        phone: phone
    };

    contactsArray.push(newContact);
    letterSorting();
    closeCardContact();
}


// Funktion zum Öffnen des Overlays für einen neuen Kontakt
function addNewContact() {
    let newContactOverlay = document.getElementById('newContact'); 
    newContactOverlay.style.display = 'flex';

    // Event-Listener für den "Cancel"-Button setzen
    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.onclick = function() {
        closeCardContact();
    };

    // Event-Listener für den "Create Contact"-Button setzen
    const createButton = document.querySelector('.createContact-button');
    createButton.onclick = function() {
        createContact();
    };
}

// Funktion zum Abbrechen und Schließen des Overlays
function cancel() {
    closeCardContact(); 
}

function editContact(index) {
    let contact = contactsArray[index];
    
    // Inhalte für Edit-Mode einstellen
    document.querySelector('.addcontactheadline').textContent = 'Edit Contact';
    document.querySelector('.addcontactsecondline').style.display = 'none';
    document.getElementById('name').value = contact.name;
    document.getElementById('mail').value = contact.email;
    document.getElementById('telephone').value = contact.phone;
    document.querySelector('.createContact-button').innerHTML = 'Save <img src="assets/IMG/check.svg" alt="Save Icon" class="button-icon" style="margin-left: 8px;">';

    // Schaltfläche "Cancel" zu "Delete" ändern
    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.textContent = 'Delete'; // Icon entfernen
    cancelButton.style.display = 'block';
    cancelButton.onclick = function() { deleteContact(index); };

    // Schaltfläche "Save" für das Speichern der Änderungen anpassen
    const saveButton = document.querySelector('.createContact-button');
    saveButton.onclick = function() {
        saveEditedContact(index);
    };

    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'flex';
}

function saveEditedContact(index) {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('mail').value.trim();
    const phone = document.getElementById('telephone').value.trim();

    // Kontakt im Array aktualisieren
    contactsArray[index].name = name;
    contactsArray[index].email = email;
    contactsArray[index].phone = phone;

    // Kontakte sortieren und neu anzeigen
    letterSorting();

    // Overlay schließen und Eingabefelder zurücksetzen
    closeCardContact();
}


// Funktion zum Schließen des Overlays und Zurücksetzen der Felder
function closeCardContact() {
    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'none'; 

    // Felder zurücksetzen
    document.querySelector('.addcontactheadline').textContent = 'Add Contact';
    document.querySelector('.addcontactsecondline').style.display = 'flex'; 
    document.getElementById('name').value = '';
    document.getElementById('mail').value = '';
    document.getElementById('telephone').value = '';
    document.querySelector('.createContact-button').textContent = 'Create Contact';

    // Schaltfläche "Cancel" zurücksetzen
    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.innerHTML = 'Cancel<img class="close-button" src="assets/IMG/iconoir_cancel.png">'; 
    cancelButton.style.display = 'flex';
}

function clearBigContactView() {
    let showContacts = document.getElementById('contactViewBig');
    showContacts.innerHTML = ''; 
}


// Placeholder function for saving a contact
function saveContact() {
    closeCardContact();
}

// Funktion zum Löschen eines Kontakts und Schließen des Overlays
function deleteContact(index) {
    if (index > -1) {
        contactsArray.splice(index, 1); 
        letterSorting(); 
        closeCardContact(); 
        clearBigContactView();
    } else {
        console.error("Invalid index for deletion:", index);
    }
}
