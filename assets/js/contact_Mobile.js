/**
 * Toggles the display of the context menu when the menu button is clicked.
 */
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

/**
 * Shows the context menu and hides the menu button.
 * @param {HTMLElement} menuButton - The button element that toggles the menu.
 * @param {HTMLElement} contextMenu - The context menu element to show.
 */
function showMenu(menuButton, contextMenu) {
    contextMenu.style.display = "block";
    contextMenu.classList.add('show');
    menuButton.style.display = "none";
}

/**
 * Hides the context menu and shows the menu button.
 * @param {HTMLElement} menuButton - The button element that toggles the menu.
 * @param {HTMLElement} contextMenu - The context menu element to hide.
 */
function hideMenu(menuButton, contextMenu) {
    contextMenu.classList.remove('show');
    contextMenu.classList.add('hide');
    setTimeout(() => {
        contextMenu.style.display = "none";
        contextMenu.classList.remove('hide');
        menuButton.style.display = "block";
    }, 300); 
}

/**
 * Closes the context menu if a click is detected outside of it.
 */
document.addEventListener('click', function(event) {
    const menuButton = document.querySelector('.menu-button-img');
    const contextMenu = document.querySelector('#contextMenu');

    if (contextMenu && menuButton && !contextMenu.contains(event.target) && !menuButton.contains(event.target) && contextMenu.classList.contains('show')) {
        hideMenu(menuButton, contextMenu);
    }
});

/**
 * Closes the mobile new contact overlay and clears any warning messages.
 */
function closeMobileNewContact() {
    let overlay = document.getElementById("mobileNewContactOverlay");
    overlay.classList.add("mobileNewContactOverlay-hidden");
    overlay.style.display = 'none';
    closeAllWarningMessageMobile();
}

/**
 * Displays the overlay for adding a new contact on mobile, or directly adds the contact if on desktop.
 * @param {Event} event - The click event to stop propagation.
 */
function mobileAddContact(event) {
    event.stopPropagation(); 

    if (window.innerWidth <= 1150) {
        showMobileNewContactOverlay();
    } else {
        addNewContact();
    }
}

/**
 * Creates a new contact from mobile input fields, validates it, and saves it to the contacts list.
 */
async function createContactMobile() {
    const name = document.getElementById('mobileName').value.trim();
    const email = document.getElementById('mobileMail').value.trim();
    const phone = document.getElementById('mobilePhone').value.trim();

    if (!validateContactMobileVersion(name, email, phone)) {
        return;
    }

    const newContact = { name, email, phone };
    contactsArray.push(newContact);
    await postData('contacts', newContact);
    closeMobileNewContact();
    await fetchContacts();
}

/**
 * Shows the mobile overlay for creating a new contact, resetting fields and display settings.
 */
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

/**
 * Shows the mobile overlay for editing an existing contact.
 * @param {number} contactIndex - The index of the contact in the contacts array.
 */
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

/**
 * Saves an edited contact's information on mobile, updating relevant tasks and refreshing the display.
 * @param {number} contactIndex - The index of the contact in the contacts array.
 */
async function saveEditedContactMobile(contactIndex) {
    const oldName = contactsArray[contactIndex].name,
          name = document.getElementById('mobileName').value.trim(),
          email = document.getElementById('mobileMail').value.trim(),
          phone = document.getElementById('mobilePhone').value.trim();

    if (!name || !email || !phone || !validateContactMobileVersion(name, email, phone)) return;
    const key = contactsArray[contactIndex].id,
    password = contactsArray[contactIndex].password;
    Object.assign(contactsArray[contactIndex], { name, email, phone });

    await putData(`contacts/${key}`, { name, email, phone, password });
    await updateContactInTasks({ oldName, newName: name });
    await fetchTasks();
    await fetchContacts();
    closeMobileNewContact();
    getContactBig(contactIndex);
}

/**
 * Deletes a contact from the contacts list and updates the display.
 * @param {number} contactIndex - The index of the contact in the contacts array.
 */
async function deleteContactMobile(contactIndex) {
    if (contactIndex > -1) {
        const contact = contactsArray[contactIndex];
        await deleteData(`contacts/${contact.id}`);
        contactsArray.splice(contactIndex, 1);
        sortContactsByLetter();
        closeMobileNewContact();
    }
}

/**
 * Closes the contact view card on mobile.
 */
function closeCardContactMobile() {
    if (window.innerWidth <= 1150) {
        clearBigContactView(); 
        document.querySelector('.contactview-container').classList.remove('active');
    }
    renderContacts();
}

/**
 * Sends a POST request to Firebase to add new data.
 * @param {string} path - The Firebase path to post data to.
 * @param {Object} data - The data object to post.
 * @returns {Promise<Object>} - Returns the response as JSON.
 */
async function postData(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}

/**
 * Sends a DELETE request to Firebase to delete data at the specified path.
 * @param {string} path - The Firebase path to delete data from.
 * @returns {Promise<Object>} - Returns the response as JSON.
 */
async function deleteData(path = "") {
    let response = await fetch(base_URL + path + ".json", {
        method: "DELETE",
    });

    return await response.json();
}

/**
 * Sends a PUT request to Firebase to update data at the specified path.
 * @param {string} path - The Firebase path to update data at.
 * @param {Object} data - The data object to update with.
 * @returns {Promise<Object>} - Returns the response as JSON.
 */
async function putData(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}
