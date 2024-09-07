function toggleMenu() {
    const menu = document.getElementById("contextMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}




function showMobileNewContactOverlay() {
    let overlay = document.getElementById("mobileNewContactOverlay");
    overlay.classList.remove("mobileNewContactOverlay-hidden");
    overlay.style.display = 'flex';
}


function closeMobileNewContact() {
    let overlay = document.getElementById("mobileNewContactOverlay");
    overlay.classList.add("mobileNewContactOverlay-hidden");
    overlay.style.display = 'none';
}

function mobileAddContact(event) {
    event.stopPropagation();  // Verhindert, dass das übergeordnete div ausgewählt wird

    if (window.innerWidth <= 1150) {
        showMobileNewContactOverlay();
    } else {
        addNewContact();
    }
}


async function createContactMobile() {
    const name = document.getElementById('mobileName').value.trim();
    const email = document.getElementById('mobileMail').value.trim();
    const phone = document.getElementById('mobilePhone').value.trim();

    const newContact = {
        name: name,
        email: email,
        phone: phone
    };

    contactsArray.push(newContact);
    await postData('contacts', newContact);
    sortContactsByLetter();
    closeMobileNewContact();
}


function showMobileNewContactOverlay() {
    let overlay = document.getElementById("mobileNewContactOverlay");
    overlay.querySelector("h1").textContent = "Add contact";
    overlay.querySelector("span").textContent = "Tasks are better with a team!";
    overlay.querySelector(".createContact-mobile-button").style.display = "flex";
    overlay.querySelector(".save-button").style.display = "none";
    overlay.querySelector(".delete-button").style.display = "none";
    overlay.querySelector("input[type='text']").value = '';
    overlay.querySelector("input[type='email']").value = '';
    overlay.querySelector("input[type='tel']").value = '';
    overlay.style.display = 'flex';
}

function showMobileEditContactOverlay(contactIndex) {
    let overlay = document.getElementById("mobileNewContactOverlay");
    let contact = contactsArray[contactIndex];

    overlay.querySelector("h1").textContent = "Edit contact";
    overlay.querySelector("span").textContent = "";
    overlay.querySelector(".createContact-mobile-button").style.display = "none";
    overlay.querySelector(".save-button").style.display = "flex";
    overlay.querySelector(".delete-button").style.display = "flex";

    document.getElementById('mobileName').value = contact.name;
    document.getElementById('mobileMail').value = contact.email;
    document.getElementById('mobilePhone').value = contact.phone;

    overlay.style.display = 'flex';
}


async function saveEditedContactMobile(contactIndex) {
    const name = document.getElementById('mobileName').value.trim();
    const email = document.getElementById('mobileMail').value.trim();
    const phone = document.getElementById('mobilePhone').value.trim();

    if (name && email && phone) {
        contactsArray[contactIndex].name = name;
        contactsArray[contactIndex].email = email;
        contactsArray[contactIndex].phone = phone;

        sortContactsByLetter();
        closeMobileNewContact();
        getContactBig(contactIndex);
    }
}


async function deleteContactMobile(contactIndex) {
    if (contactIndex > -1) {
        const contact = contactsArray[contactIndex];
        await deleteData(`contacts/${contact.id}`);
        contactsArray.splice(contactIndex, 1);
        sortContactsByLetter();
        closeMobileNewContact();
    }
}
