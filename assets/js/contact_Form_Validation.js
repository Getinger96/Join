/**
 * Validates if the name is in the correct format with two words separated by a space.
 * @param {string} name - The full name to validate.
 * @returns {boolean} - Returns true if the name is valid, otherwise false.
 */
function nameIsNotValid(name) {
    const nameCheck = /^[A-Za-zäöüÄÖÜß]+\s[A-Za-zäöüÄÖÜß]+$/;
    return nameCheck.test(name);
}

/**
 * Validates if the email format is correct.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function emailIsNotCorrect(email) {
    let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailCheck.test(email); 
}

/**
 * Validates if the phone number contains only digits.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 */
function phoneNumberIsNotCorrect(phone) {
    let phoneCheck = /^\d+$/;
    return phoneCheck.test(phone); 
}

/**
 * Displays an error message for invalid email on the web page.
 */
function wrongEmailValidation() {
    let showEmailMistake = document.getElementById("wrongEmail");
    showEmailMistake.innerHTML = `<div>
                                    <span class="mistakeInput"> Attention, a correct email address must be provided</span>
                                  </div>`;
}

/**
 * Displays an error message for invalid phone number on the web page.
 */
function wrongPhoneValidation() {
    let showPhoneMistake = document.getElementById("wrongPhone");
    showPhoneMistake.innerHTML = `<div>
                                    <span class="mistakeInput"> The phone number must consist of 6-15 numbers.</span>
                                  </div>`;
}

/**
 * Displays an error message for invalid name input on the web page.
 */
function wrongTextValidation() {
    let showTextMistake = document.getElementById("wrongText");
    showTextMistake.innerHTML = `<div>
                                    <span class="mistakeInput"> Please enter a full name of 3-30 letters</span>
                                 </div>`;
}

/**
 * Mobile-specific versions of the above functions
 * 
 *
 */ 
function wrongEmailValidationMobile() {
    let showEmailMistake = document.getElementById("wrongEmailMobile");
    showEmailMistake.innerHTML = `<div>
                                    <span class="mistakeInput"> Attention, a correct email address must be provided</span>
                                  </div>`;
}

function wrongPhoneValidationMobile() {
    let showPhoneMistake = document.getElementById("wrongPhoneMobile");
    showPhoneMistake.innerHTML = `<div>
                                    <span class="mistakeInput"> The phone number must consist of 6-15 numbers.</span>
                                  </div>`;
}

function wrongTextValidationMobile() {
    let showTextMistake = document.getElementById("wrongTextMobile");
    showTextMistake.innerHTML = `<div>
                                    <span class="mistakeInput"> Please enter a full name of 3-30 letters</span>
                                 </div>`;
}

/**
 * Sets the border color of the email input field to red for visual feedback on error.
 */
function changeColorMail() {
    document.getElementById("mailInput").style.border= "2px solid red";
}

function changeColorText() {
    document.getElementById("textInput").style.border= "2px solid red";
}

function changeColorPhone() {
    document.getElementById("phoneInput").style.border= "2px solid red";
}

/**
 * Validates contact information fields (name, email, phone) and displays errors if invalid.
 * @param {string} name - The name to validate.
 * @param {string} email - The email to validate.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - Returns true if all fields are valid, otherwise false.
 */
function validateContact(name, email, phone) {
    if (!nameIsNotValid(name) || name.length < 3 || name.length > 30) {
        wrongTextValidation();
        changeColorText();
        return false; 
    } else {
        document.getElementById("wrongText").innerHTML = '';
        document.getElementById("textInput").style.border = "";
    }

    if (!emailIsNotCorrect(email)) {
        wrongEmailValidation();
        changeColorMail();
        return false; 
    } else {
        document.getElementById("wrongEmail").innerHTML = '';
        document.getElementById("mailInput").style.border = "";
    }

    if (!phoneNumberIsNotCorrect(phone) || phone.length < 6 || phone.length > 15 ) {
        wrongPhoneValidation(); 
        changeColorPhone();
        return false; 
    } else {
        document.getElementById("wrongPhone").innerHTML = '';
        document.getElementById("phoneInput").style.border = "";
    }

    return true; 
}

/**
 *  Mobile-specific validation function, Same functionality as `validateContact`, but for mobile elements
 * 
 */

function validateContactMobileVersion(name, email, phone) {
    if (!nameIsNotValid(name) || name.length < 3 || name.length > 30) {
        wrongTextValidationMobile();
        changeColorTextMobile();
        return false; 
    } else {
        document.getElementById("wrongTextMobile").innerHTML = '';
        document.getElementById("textInputMobile").style.border = "";
    }
    if (!emailIsNotCorrect(email)) {
        wrongEmailValidationMobile();
        changeColorMailMobile();
        return false; 
    } else {
        document.getElementById("wrongEmailMobile").innerHTML = '';
        document.getElementById("mailInputMobile").style.border = "";
    }
    if (!phoneNumberIsNotCorrect(phone) || phone.length < 6 || phone.length > 15 ) {
        wrongPhoneValidationMobile(); 
        changeColorPhoneMobile();
        return false; 
    } else {
        document.getElementById("wrongPhoneMobile").innerHTML = '';
        document.getElementById("phoneInputMobile").style.border = "";
    }

    return true; 
}

/**
 * Mobile-specific color change functions
 * 
 */
function changeColorPhoneMobile() {
    document.getElementById("phoneInputMobile").style.border= "2px solid red";
}

function changeColorMailMobile() {
    document.getElementById("mailInputMobile").style.border= "2px solid red";
}

function changeColorTextMobile() {
    document.getElementById("textInputMobile").style.border= "2px solid red";
}

/**
 * Clears all warning messages and resets the input field borders on mobile.
 */
function closeAllWarningMessageMobile() {
    document.getElementById("wrongPhoneMobile").innerHTML = '';
    document.getElementById("phoneInputMobile").style.border = "";
    document.getElementById("wrongEmailMobile").innerHTML = '';
    document.getElementById("mailInputMobile").style.border = "";
    document.getElementById("wrongTextMobile").innerHTML = '';
    document.getElementById("textInputMobile").style.border = "";
}

/**
 * Clears all warning messages and resets the input field borders.
 */
function closeAllWarningMessage() {
    document.getElementById("wrongText").innerHTML = '';
    document.getElementById("textInput").style.border = "";
    document.getElementById("wrongEmail").innerHTML = '';
    document.getElementById("mailInput").style.border = "";
    document.getElementById("wrongPhone").innerHTML = '';
    document.getElementById("phoneInput").style.border = "";
}

/**
 * Updates a contact's name in all assigned tasks.
 * @param {Object} editedContact - The edited contact object.
 * @param {string} editedContact.oldName - The previous name of the contact.
 * @param {string} editedContact.newName - The new name of the contact.
 */
async function updateContactInTasks(editedContact) {
    // Fetch tasks and update contact in each assigned task
}



/**
 * Deletes a contact from all tasks in the board.
 * @param {number} index - The index of the contact in `contactsArray`.
/**
 * @param {number} index - The index of the contact in `contactsArray`.
 */
async function deleteContactInBoard(index) {
    const contactToDelete = contactsArray[index].name; // Nur der Name!
        const response = await fetch(`${base_URL}/tasks.json`);
        if (!response.ok) throw new Error('Fehler beim Laden der Aufgaben.');
        const tasks = await response.json();

        for (let taskId in tasks) {
            let task = tasks[taskId];
            if (task.AssignedContact && Array.isArray(task.AssignedContact)) {
                console.log(`Task ID: ${taskId}, assignedContact:`, task.AssignedContact);

                const updatedContacts = task.AssignedContact.filter(
                    name => name !== contactToDelete
                );
                if (updatedContacts.length !== task.AssignedContact.length) {
                    await updateTaskInFirebase(taskId, {
                        ...task,
                        AssignedContact: updatedContacts
                    });
                }
            }
        }
 
}


/**
 * Updates a specific task in Firebase with new task data.
 * 
 * This function sends a PUT request to Firebase to update the entire task object,
 * typically used to update the assigned contacts or other task-related fields.
 *
 * @param {string} taskId - The ID/path of the task in Firebase to be updated.
 * @param {Object} updatedTask - The updated task object (e.g. with modified assignedContact).
 * @returns {Promise<Object>} - Returns the updated task data from Firebase as a JSON object.
 */
async function updateTaskInFirebase(taskId, updatedTask) {
    const url = `${base_URL}/tasks/${taskId}.json`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    });


    return await response.json();
}


/**
 * Fetches tasks from Firebase and populates the global `tasksArray`.
 * @param {string} [path=''] - The path to fetch tasks from.
 */
async function fetchTasks(path = '') {
    tasksArray = [];
    let userJSON = await fetchTasksData(path);
    if (!userJSON.tasks) return;
    populateTasksArray(userJSON);
}

/**
 * Fetches raw task data from Firebase.
 * @param {string} path - The path to fetch data from.
 * @returns {Promise<Object>} - Returns the fetched task data as JSON.
 */
async function fetchTasksData(path) {
    let response = await fetch(base_URL + path + ".json");
    return await response.json();
}

/**
 * Populates `tasksArray` with tasks from the fetched JSON.
 * @param {Object} userJSON - The JSON object containing task data.
 */
function populateTasksArray(userJSON) {
    let tasksAsarray = Object.values(userJSON.tasks);
    let keysArrayTask = Object.keys(userJSON.tasks);
    currentDraggedElement = 0;
    id = 0;

    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];
        let keyTask = keysArrayTask[index];
        id++;
        addTaskToArray(task, keyTask);
    }
}

/**
 * Adds a unique task to the global `tasksArray`.
 * @param {Object} task - The task to add.
 * @param {string} keyTask - The unique key for the task.
 */
function addTaskToArray(task, keyTask) {
    let saveTask = tasksArray.filter(t => t.Title === task.Titel && t.Description === task.Description);
    if (saveTask.length === 0) {
        tasksArray.push({
            taskKey: keyTask,
            idTask: id,
            Title: task.Titel,
            Description: task.Description,
            Assigned: task.AssignedContact,
            duedate: task.Date,
            Prio: task.Prio,
            Category: task.Category,
            subtask: task.Subtask,
            status: task.Status,
        });
    }
}

/**
 * Saves the edited contact data and updates the contact list.
 * @param {number} index - The index of the contact to save.
 */
async function saveEditedContact(index) {
    const oldName = contactsArray[index].name,
          name = document.getElementById('name').value.trim(),
          email = document.getElementById('mail').value.trim(),
          phone = document.getElementById('telephone').value.trim();

    if (!name || !email || !phone || !validateContact(name, email, phone)) return;

    const key = contactsArray[index].id,
          password = contactsArray[index].password;

    Object.assign(contactsArray[index], { name, email, phone });

    await putData(`contacts/${key}`, { name, email, phone, password });
    await updateContactInTasks({ oldName, newName: name });

    await fetchTasks();
    await fetchContacts();
    closeCardContact();
    getContactBig(index);
}

