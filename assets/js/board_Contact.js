/**
 * the function Update contacts List
 */
function updateContactStyles() {
    for (let i = 0; i < contactsArray.length; i++) {
        const contact = contactsArray[i];
        const contactContainer = document.getElementById(`profile-${contact.i}`);
        if (assignedContacts.includes(contact.name)) {
            return contactContainer.classList.add('bg_color', 'color_white');
        } 
    }
}

/**
 * the function show contact List-bar
 * @param {*} name contact name
 * @param {*} index  index array assignedContacts
 *
 */
function showSelectedContainer(name,index) {
    let includedName = assignedContacts.includes(name)
    let contactContainer = document.getElementById(`profile-${index}`);
    if (!contactContainer) {
        return
    }
    if (includedName) {
        contactContainer.classList.add('bg_color');
        contactContainer.classList.add('color_white');  
    }else {
        contactContainer.classList.remove('bg_color');
        contactContainer.classList.remove('color_white');
    }
}

/**
 * the function selected  contact List-bar 
 * @param {*} index index array assignedContacts
 * @param {*} color contact color
 * @param {*} name contact name
 */
function selectedContact(index, color, name) {
    showSelectedContainer(name, index);
    let includedName = assignedContacts.includes(name);

    if (includedName) {
        deselctedtContact(index, color, name);
    } else {
        assignedContacts.push(name);
        showSelectedProfile(color, name, index);
        let contactContainer = document.getElementById(`profile-${index}`);
        contactContainer.classList.add('bg_color');
        contactContainer.classList.add('color_white');
    }
}
/**
 * the function  deselctedt contact List-bar 
 * @param {*} index index array assignedContacts
 * @param {*} name contact name
 * @param {*} nameletter name abbreviation
 * @param {*} color contact name
 */
function deselctedtContact(index, name,nameletter,color) {
    showSelectedContainer(nameletter, index);
    let contactIndex = assignedContacts.indexOf(nameletter);
    if (contactIndex !== -1) {
        assignedContacts.splice(contactIndex, 1);
    }
    showSelectedProfile(color, name, index,color)
    let contactContainer = document.getElementById(`profile-${index}`);

    if (!contactContainer) {
        return;
    }
    contactContainer.classList.remove('bg_color');
    contactContainer.classList.remove('color_white');
    let profileBadge = document.getElementById(`profilebadge_Assign${index}`);
    if (profileBadge) {
        profileBadge.remove();
    }     
}

/**
 * the function update Contacts
 * @param {*} color contact color
 * @param {*} name contact name
 * @param {*} index index array assignedContacts
 */
function showSelectedProfile(color, name, index) {
    clearSelectedProfileContainer();
    displayAssignedContacts();
    updateExtraContactsBadge();
}

/**
 * 
the function deletes the selected profile containers
 */
function clearSelectedProfileContainer() {
    const selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    if (selectedProfileContainer) {
        selectedProfileContainer.innerHTML = '';  
    }
}

/**
 * 
the function shows View assigned contacts
 */
function displayAssignedContacts() {
    const selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    for (let i = 0; i < assignedContacts.length && i < 4; i++) { 
        let contactName = assignedContacts[i];
        let contact = contactsArray.find(c => c.name === contactName);
        if (contact) {
            addContactBadge(selectedProfileContainer, contact, contactName, i);
        }
    }
}

/**
 * the function adds contacts badge
 * @param {*} container container foreach contacts
 * @param {*} contact contact 
 * @param {*} contactName full contact name
 * @param {*} index index array assignedContacts
 */
function addContactBadge(container, contact, contactName, index) {
    let contactColour = contact.color;
    let firstletters = contactName.charAt(0).toUpperCase() + getLastName(contactName).charAt(0).toUpperCase();
    container.innerHTML += `
        <div id="profile_Badge_assign${index}" class="profile_Badge_assign ${contactColour}">${firstletters}</div>
    `;
}
/**
 * the function update extra contacts badge
 */
function updateExtraContactsBadge() {
    const extraContactsBadge = document.getElementById('extra_Contacts_Badge');
    let extraCount = assignedContacts.length - 4;

    if (extraCount > 0) {
        if (extraContactsBadge) {
            extraContactsBadge.textContent = `+${extraCount}`;
        } else {
            createExtraContactsBadge(extraCount);
        }
    } else if (extraContactsBadge) {
        extraContactsBadge.remove();
    }
}
/**
 * the funcktion create extra contacts badge
 * @param {*} extraCount extra contact id
 */
function createExtraContactsBadge(extraCount) {
    const selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    selectedProfileContainer.innerHTML += `
        <div id="extra_Contacts_Badge" class="profile_Badge_assign gray">+${extraCount}</div>
    `;
}
/**
 * the function show scelected profile edit
 * @param {*} name contact name
 */
function showSelectedProfileEdit(name) {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    let findcontact = contactsArray.find(co => co.name === name);
    let color = findcontact.color;
    let index = contactsArray.indexOf(findcontact);
    let profile_Badge_assign = document.getElementById(`profilebadge_Assign${index}`)
    let firstletters = `${name.charAt(0).toUpperCase()}${getLastName(name).charAt(0).toUpperCase()}`;
    if (profile_Badge_assign) {
        profile_Badge_assign.remove();
    } else {
        selectedProfileContainer.innerHTML += showselectedProfileContainer(index, color, firstletters);

    }
}
/**
 * the function show selected profile container
 * @param {*} index index array assignedContacts
 * @param {*} color contac color
 * @param {*} firstletters name fristletter
 * @returns {*}
 */
function showselectedProfileContainer(index, color, firstletters) {
  return `
    <div id="profilebadge_Assign${index}" class="contact-icon${index} ${color} profilebadge">
        <div>${firstletters}</div>
    </div>
`;
}

/**
 * the function deselect all contacts
 */
function deselectAllContacts() {
    for (let contactIndex = 0; contactIndex < contactsArray.length; contactIndex++) {
        let contact = contactsArray[contactIndex];
        deselctedtContact(contactIndex, contact.name, `${contact.name.charAt(0).toUpperCase()}${getLastName(contact.name).charAt(0).toUpperCase()}`, contact.color);
    }
}

/**
 * Renders assigned contacts, showing a max of four.
 * @param {Array} assignedContacts Array of assigned contacts
 */
function renderAssignedContacts(assignedContacts) {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    selectedProfileContainer.innerHTML = '';

    for (let indexcon = 0; indexcon < assignedContacts.length && indexcon < 4; indexcon++) {
        let contact = assignedContacts[indexcon];
        let contactContainer = document.getElementById(`profile-${indexcon}`);
        if (contactContainer) {
            contactContainer.classList.add('bg_color');
            contactContainer.classList.add('color_white');
        }
        showSelectedProfileEdit(contact); 
    }

    handleExtraContacts(selectedProfileContainer, assignedContacts.length);
}

/**
 * Shows a badge for extra contacts if more than 4 contact.
 * @param {HTMLElement} container Container for extra contact
 * @param {number} count Total assigned contacts
 */
function handleExtraContacts(container, count) {
    if (count > 4) {
        let extraCount = count - 4;
        container.innerHTML += `
            <div id="extra_Contacts_Badge" class="profile_Badge_assign gray">+${extraCount}</div>
        `;
    }
}

/**
 * Fetches contacts from the server and organizes them.
 * @param {string} patha API 
 */
async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];
        let colorIndex = index % colors.length;
        let color = colors[colorIndex]
        let alreadyExists = contactsArray.some(existingContact => existingContact.name === contact.name);

        if (!alreadyExists && contact.email !== 'guest@web.de') {
            contactsArray.push({
                name: contact.name,
                color: color,
            });

        }

    }
}
/**
 * Retrieves the last name from a full name.
 * @param {string} fullName Full name of the contact
 */
function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
}
/**
 * Renders contacts grouped by initial letter in the  container.
 */
function getContacts() {
    let showContacts = document.getElementById('Selection_Container');

    if (!showContacts) {
        return;
    }
    showContacts.innerHTML = '';

    
    let sortedContacts = [...contactsArray].sort((a, b) => a.name.localeCompare(b.name));

    
    for (let i = 0; i < sortedContacts.length; i++) {
        let contact = sortedContacts[i];
        showContacts.innerHTML += displayContacts(i, contact.name, getLastName(contact.name), '', contact.color);
        showSelectedContainer(contact.name, i);
    }
}


/**
 * Sortiert und zeigt die Kontakte alphabetisch an.
 */
function letterSorting() {
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    getContacts();
}

/**
 * the function generate small contact field
 * @param {*} assignedContacts assignedContacts elemente
 * 
 */
function generateSmallContactsHtml(assignedContacts) {
    let contactsHtml = '';
    assignedContacts.forEach((contact, index) => {
        let contactParts = contact.split(' ');
        let contactFirstname = contactParts[0] || '';  
        let contactLastname = contactParts.slice(1).join(' ') || '';  

        const color = getRandomColorForContact(); 
        contactsHtml += getSmallContactHtml(index, contactFirstname, contactLastname, color); 
    });
    return contactsHtml;
}
/**
 * the function generate larg contact field with  full name
 * @param {*} assignedContacts assignedContacts Element
 * 
 */
function generateLargeContactsHtml(assignedContacts) {
    let contactsHtml = ''; 

    for (let index = 0; index < assignedContacts.length; index++) {
        contactsHtml += generateContactHtml(assignedContacts[index], index);
    }
  
    return contactsHtml;  
}
/**
 * the function generate full element
 * @param {*} contact full contact
 * @param {*} index assignedContacts id
 * 
 */
function generateContactHtml(contact, index) {
    let nameParts = contact.split(' ');
    let contactFirstname = nameParts[0] || '';  
    let contactLastname = nameParts.slice(1).join(' ') || ''; 
    let checkIndexarray = contactsArray.findIndex(c => c.name === contact);
    let firstLetterForName = contactFirstname.charAt(0).toUpperCase();
    let firstLetterLastName = contactLastname.charAt(0).toUpperCase();
    let color = showTheNameColor(checkIndexarray);
    return getLargeContactHtml(index, firstLetterForName, firstLetterLastName, contactFirstname, contactLastname, color);
}
/**
 * the function show the color name
 * @param {*} checkIndexarray check contact in taskarray and contaclistarray
 * 
 */
function showTheNameColor(checkIndexarray) {
    let contactColor = contactsArray[checkIndexarray].color
    contactColor = convertToValidColor(contactColor);
    return contactColor;
}