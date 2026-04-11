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
    let contact = contactsArray[contactIndex];
    let badgeContent = contact.photo 
        ? `<img src="${contact.photo}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`
        : `<span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>`;

    return `<div onclick="selectContact(${contactIndex})" class="single-contact-box ${selectedClass}" style="background-color:${selectedClass ? '#2A3647' : ''};">
                <div class="contact-icon" style="background-color:${contact.photo ? 'transparent' : color};">
                    ${badgeContent}
                </div>
                <div class="contact-content">
                    <span class="contactname" style="color:${selectedClass ? 'white' : 'black'};">${contactsName}</span>
                </div>
             <img src="./assets/IMG/Secondary mobile contact V1.png" alt="Add Contact" class="add-contact-button" onclick="mobileAddContact(event)">
            </div>`;
}

/**
 * Displays detailed information of a contact in a large view.
 * @param {string} contactsName - The name of the contact.
 * @param {string} contactsEmail - The email of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 * @param {string} contactLastname - The last name of the contact.
 * @param {string} color - Background color for the contact icon.
 */
function showContactBig(contactsName, contactsEmail, contactPhone, contactLastname, color, photo) {
    let badgeContent = photo
        ? `<img src="${photo}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`
        : `<span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>`;

    return `
    <div class="largcontactbox">
        <div class="largsingle-contact-box">
            <div class="largcontact-icon" style="background-color:${photo ? 'transparent' : color};">
                ${badgeContent}
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


function showAccountMenu(contactsName, contactsEmail, contactPhone, contactLastname, color) {
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
 * Opens the edit contact form with badge and overlay.
 * @param {string} color - Background color for the contact badge.
 * @param {Object} contact - The contact object to edit.
 * @param {number} index - The index of the contact in contactsArray.
 */
function changehtmlaccountform(color, contact, index) {
    setFormFields(contact);
    setBadge(color, contact, index);
    openOverlay();
}

/**
 * Fills the form fields with the contact's data.
 * @param {Object} contact - The contact object containing name, email and phone.
 */
function setFormFields(contact) {
    document.querySelector('.addcontactheadline').textContent = 'Edit Contact';
    document.querySelector('.addcontactsecondline').style.display = 'none';
    document.getElementById('name').value = contact.name;
    document.getElementById('mail').value = contact.email;
    document.getElementById('telephone').value = contact.phone|| '+1234567890';
    document.querySelector('.createContact-button').innerHTML = 'Save <img src="./assets/IMG/check.svg">';
    document.querySelector('.addNewContactimg').style.display = 'none';
}

/**
 * Sets up the contact badge with initials or photo and handles photo upload.
 * @param {string} color - Background color for the badge if no photo exists.
 * @param {Object} contact - The contact object containing name and photo.
 * @param {number} index - The index used to bind the photo upload handler.
 */
function setBadge(color, contact, index) {
    const initials = contact.name.split(' ').map(n => n[0].toUpperCase()).join('');
    document.getElementById('accountBadge').style.backgroundColor = contact.photo ? 'transparent' : color;
    document.getElementById('accountBadgeSide').style.display = 'flex';
    document.querySelector('.upload-label').style.display = 'flex';
    document.getElementById('accountInitials').textContent = initials;
    document.getElementById('accountPhoto').src = contact.photo || '';
    document.getElementById('accountPhoto').style.display = contact.photo ? 'block' : 'none';
    document.getElementById('accountInitials').style.display = contact.photo ? 'none' : 'block';
    document.getElementById('photoUpload').onchange = (event) => handleContactPhotoUpload(event, index);
}

/**
 * Opens the new contact overlay with a slide-in animation.
 */
function openOverlay() {
    let overlay = document.getElementById('newContact');
    overlay.classList.add('transition-in-from-right');
    overlay.style.display = 'flex';
}


/**
 * Loads the image and triggers compression.
 * @param {string} src - The base64 source of the image.
 * @param {number} index - The index of the contact in contactsArray.
 */
function loadImage(src, index) {
    const img = new Image();
    img.src = src;
    img.onload = () => compressAndSave(img, index);
}

/**
 * Compresses the image and saves it to Firebase and the UI.
 * @param {HTMLImageElement} img - The loaded image element.
 * @param {number} index - The index of the contact in contactsArray.
 */
async function compressAndSave(img, index) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 100;
    canvas.getContext('2d').drawImage(img, 0, 0, 100, 100);
    const base64 = canvas.toDataURL('image/jpeg', 0.5);
    updateBadgeUI(base64);
    await saveContactPhoto(index, base64);
}

/**
 * Updates the badge UI with the new photo.
 * @param {string} base64 - The compressed base64 image.
 */
function updateBadgeUI(base64) {
    document.getElementById('accountPhoto').src = base64;
    document.getElementById('accountPhoto').style.display = 'block';
    document.getElementById('accountInitials').style.display = 'none';
    document.getElementById('accountBadge').style.backgroundColor = 'transparent';
}

/**
 * Saves the photo to Firebase and updates the contact index.
 * @param {number} index - The index of the contact in contactsArray.
 * @param {string} base64 - The compressed base64 image.
 */
async function saveContactPhoto(index, base64) {
    const contact = contactsArray[index];
    contact.photo = base64;
    await putData(`contacts/${contact.id}`, {
        name: contact.name, email: contact.email,
        password: contact.password, phone: contact.phone, photo: base64
    });
    let newIndex = contactsArray.findIndex(c => c.id === contact.id);
    getContactBig(newIndex);
    selectedContactIndex = newIndex;
}
