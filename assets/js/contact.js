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


        contactsArray.push({
            email: contact.email,
            name: contact.name,
            password: contact.password,
        })
        console.log(contactsArray);

        letterSorting()

}
}
      
function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
}

function getContacts() {
    let showContacts = document.getElementById('contactview');
    showContacts.innerHTML = '';

    let contactCounter = 0;

    groupedContacts = [];
    // Füge alle Kontakte der Gruppe hinzu
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

    // Anzeigen der Kontakte
    for (let index = 0; index < beginningLetter.length; index++) {
        let letter = beginningLetter[index];
        showContacts.innerHTML += `<h2>${letter}</h2>`;
        showContacts.innerHTML += `<hr class="contactlist-hr">`;

        groupedContacts[letter].forEach(contact => {
            let selectedClass = (contact.index === selectedContactIndex) ? 'selected' : '';
            showContacts.innerHTML += displayContacts(contact.index, contact.email, contact.name, getLastName(contact.name), contact.phone, selectedClass, contact.color);
        });
    }
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
    console.log('Selected Contact Index:', selectedContactIndex); // Debugging
    getContacts(); // Kontakte neu rendern, um die Markierung zu aktualisieren
    getContactBig(index); // Zeige den ausgewählten Kontakt in der großen Ansicht an
}

function getContactBig(index) {
    let contact = contactsArray[index];
    console.log('Selected Contact:', contact); // Debugging
    let showContacts = document.getElementById('contactViewBig');
    showContacts.innerHTML = showContactBig(contact.name, contact.email, contact.phone, getLastName(contact.name), colors[index % colors.length]);
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
                <div onclick="edit()" class="editcontent blur">
                <img class="editicon" src="assets/IMG/edit.svg" alt="">
                <span class="edit">Edit</span>
                </div>
                <div class="deletecontent" onclick="delete()">
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

function addNewContact() {
    let newContactOverlay = document.getElementById('newContact'); 
    newContactOverlay.style.display = 'flex';
}

function closeCardContact() {
    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'none';
}
