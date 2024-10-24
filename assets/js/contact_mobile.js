function toggleMenu() {
    const menuButton = document.querySelector('.menu-button-img');
    const contextMenu = document.querySelector('#contextMenu');
    const isMenuVisible = contextMenu.classList.contains('show');

    if (isMenuVisible) {
        hideMenu(menuButton, contextMenu);
    } else {
        showMenu(menuButton, contextMenu);
    }
}

function showMenu(menuButton, contextMenu) {
    contextMenu.style.display = "block";
    contextMenu.classList.add('show');
    menuButton.style.display = "none";
}

function hideMenu(menuButton, contextMenu) {
    contextMenu.classList.remove('show');
    contextMenu.classList.add('hide');
    setTimeout(() => {
        contextMenu.style.display = "none";
        contextMenu.classList.remove('hide');
        menuButton.style.display = "block";
    }, 300); 
}

document.addEventListener('click', function(event) {
    const menuButton = document.querySelector('.menu-button-img');
    const contextMenu = document.querySelector('#contextMenu');

    if (contextMenu && menuButton && !contextMenu.contains(event.target) && !menuButton.contains(event.target) && contextMenu.classList.contains('show')) {
        hideMenu(menuButton, contextMenu);
    }
});






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
    event.stopPropagation(); 

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

    if (!validateContactMobileVersion(name, email, phone)) {
        return;
    }


    const newContact = {
        name: name,
        email: email,
        phone: phone
    };

    contactsArray.push(newContact);
    await postData('contacts', newContact);
    closeMobileNewContact();
    await fetchContacts();
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
    let oldName = contactsArray[contactIndex].name;  
    let name = document.getElementById('mobileName').value.trim();
    let email = document.getElementById('mobileMail').value.trim();
    let phone = document.getElementById('mobilePhone').value.trim();

    if (name && email && phone) {
        if (!validateContactMobileVersion(name, email, phone)) {
            return;
        }
            let key = contactsArray[contactIndex].id;
            contactsArray[contactIndex].name = name;
            contactsArray[contactIndex].email = email;
            contactsArray[contactIndex].phone = phone;
            let password = contactsArray[contactIndex].password;
    
            const newContact = {
                name: name,
                email: email,
                phone: phone,
                password: password
            };
    
            await putData(`contacts/${key}`, newContact);
    
           
            let editedContact = {
                oldName: oldName,
                newName: name
            };
    
            await updateContactInTasks(editedContact);  
            await fetchTasks();  
            await fetchContacts();
    
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

function closeCardContactMobile() {
    if (window.innerWidth <= 1150) {
        clearBigContactView(); 
        document.querySelector('.contactview-container').classList.remove('active');
    }
    renderContacts();
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

async function deleteData(path = "") {
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