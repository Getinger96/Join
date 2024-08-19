const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contactsArray = [];
let beginningLetter = [];
let groupedContacts = [];


async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.keys(userJSON.contacts);
    console.log(userAsArray);
    
  
    Object.keys(userJSON.contacts).forEach(key => {
        let contactGroup = userJSON.contacts[key];

        // Überprüfe, ob die Kontaktgruppe verschachtelte Kontakte enthält
        if (!contactGroup.email ) {
            // Es ist ein verschachteltes Objekt, durchlaufe alle verschachtelten Kontakte
            Object.keys(contactGroup).forEach(subKey => {
                contactsArray.push(contactGroup[subKey]);
            });
        } else {
            // Es ist ein einfacher Kontakt
            contactsArray.push(contactGroup);
        }
    });

    letterSorting();
    console.log(contactsArray);
}

function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');

    // Der Nachname ist das letzte Element
    let lastName = nameParts[nameParts.length - 1];

    return lastName;
}


function getContacts() {
    let showContacts = document.getElementById('contactview');
    showContacts.innerHTML = '';


    for (let index = 0; index < beginningLetter.length; index++) {
        let letter = beginningLetter[index];
        showContacts.innerHTML += `<h2>${letter}</h2>`;
        showContacts.innerHTML += `<hr class="contactlist-hr">`;

        // Füge alle Kontakte der Gruppe hinzu
        let group = groupedContacts.find(group => group.letter === letter);
        if (group) {
            group.contacts.forEach((contact, contactIndex) => {
                let contactLastname = getLastName(contact.name);
                showContacts.innerHTML += displayContacts(contactIndex,contact.email, contact.name, contactLastname,contact.phone);
            });
        }
    }};


function displayContacts(contactIndex,contactsEmail, contactsName,contactLastname,contactPhone) {

        
    
    return `<div onclick="getContactBig(${contactIndex}, '${contactsName}', '${contactsEmail}', '${contactPhone}', '${contactLastname}')" class="single-contact-box">
                <div class="contact-icon">
                    <span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
                </div>
                <div class="contact-content">
                    <span class="contactname"> ${contactsName}</span>
                    <a class="contactmail" href="mailto:${contactsEmail}"> ${contactsEmail} </a>
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
            console.log(groupedContacts);
        } else {

            let group = groupedContacts.find(contacts => contacts.letter === firstLetter);
            if (group) {
                group.contacts.push(contact);
            } // Erklärung


            //// group sieht so aus:

        //letter: 'A',
        //contacts: [
        //{ name: 'Alice', email: 'alice@example.com', forname: 'Alice', lastname: 'Doe', phone: '+1234567890' },
        //{ name: 'Alicia', email: 'alicia@example.com', forname: 'Alicia', lastname: 'Smith', phone: '+0987654321' }
    
            // groupedContacts ist ein array mit objekten buchstaben und die kontakte 
            // find suchw nach dem Elemente das die Bedinigung erfüllt
            // group ist ein Einzelnes objekt im array z. letter: m contact[name, email]#
            //group.letter === firstLetter überprüft, ob firstletter mit groupletter übereinstimmt
            //group ist das Objekt innerhalb von groupedContacts, dessen letter-Eigenschaft dem firstLetter entspricht.
            //group.contacts: Dies ist das Array von Kontakten innerhalb der gefundenen Gruppe.
            //push(contact): Fügt den neuen Kontakt



        }
    });

    // Buchstaben alphabetisch sortieren
    beginningLetter.sort();

    // Kontakte anzeigen
    getContacts();
}


function getContactBig(index,contactsName,contactsEmail,contactPhone,contactLastname) {
    let showContacts = document.getElementById('contactViewBig');
    showContacts.innerHTML = showContactBig(contactsName, contactsEmail, contactPhone, contactLastname);


} 




function showContactBig(contactsName,contactsEmail,contactPhone,contactLastname) {

    return `<div class="largcontactbox">
        <div class="largsingle-contact-box">
            <div class="largcontact-icon">
                <span> ${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
            </div>
            <div class="largcontact-content">
                <span class="largcontactname"> ${contactsName} </span>
                <div class="editanddelete">
                <div onclick="edit()" class="editcontent blur">
                <img class="editicon" src="assets/IMG/edit.svg" alt="">
                <span class="edit"> Edit</span>
                </div>

                <div class="deletecontent" onclick="delete()">
                <img class="deleteicon" src="assets/IMG/delete.png" alt="">
                <span class="delete"> delete </span>

                </div>
                </div>
            </div>    
                  
    </div>          
            <div class="contactinfo">
            <span class="contactinfoname"> Contact Information</span>
      

            <div class="contactmailsection">
                <span class="Emailname"> Email </span>
                <a class="contactmailadress" href="mailto:${contactsEmail}">${contactsEmail} </a>
            </div>

            <div class="contactphonesection">
                <span class="phonename"> Phone </span>
                <a class="contactphone" href="${contactPhone}"> ${contactPhone} </a>
            </div>

            </div> `;
}


function addNewContact() {
    let newContactOverlay = document.getElementById('newContact'); 
    newContactOverlay.style.display = 'flex';
}

function closeCardContact() {
    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.style.display = 'none';
}