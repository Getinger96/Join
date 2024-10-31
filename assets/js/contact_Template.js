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