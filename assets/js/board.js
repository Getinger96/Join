

/**
 * Updates the view by clearing old elements, updating HTML, and rendering subtasks.
 */
async function updatedView() {
    removeAllElement();
    await updateHtml();
    renderSubtask();

}

/**
 * Clears all elements in the drag area 
 */
function removeAllElement() {
    let allElements = document.querySelectorAll('.drag-area');
    allElements.forEach(element => element.innerHTML = '');
}

/**
 * Renders subtasks for each task
 */
function renderSubtask() {
    let idSubtask = 0
    for (let index = 0; index < tasksArray.length; index++) {
        idSubtask++;
        let subtaskElement = tasksArray[index].subtask;
        localStorage.removeItem(`task-${id}-subtasks`);
        if (subtaskElement === undefined) {
            subtaskElement = [];
        }
        subtask.push(
            {
                id: idSubtask,
                subtask: subtaskElement,
            }
        )
    }
}
/**
 * Updates HTML by filtering tasks into status categories and rendering t.
 */
async function updateHtml() {
    let statusCategories = ['open', 'progress', 'awaitFeedback', 'closed'];
    for (let index = 0; index < statusCategories.length; index++) {
        let category = statusCategories[index];
        let filteredTasks = tasksArray.filter(t => t.status === category);
        let currentCategoryElement = document.getElementById(category)

        if (!currentCategoryElement) {
            return
        }

        currentCategoryElement.innerHTML = '';

        filteredTasks.forEach(task => {
            let taskHTML = generateTodoHTML(task, task.idTask);
            document.getElementById(category).insertAdjacentHTML('afterbegin', taskHTML);
            getassignecontacts(task, task.idTask);
        });
    }
    updateAndCheckEmptyFields();
    await initializeAllProgress();
}

/**
 * Updates fields to check if they are empty 
 */
function updateAndCheckEmptyFields() {
    let fields = [
        { id: "open", text: "No tasks open" },
        { id: "progress", text: "No tasks in progress" },
        { id: "awaitFeedback", text: "No tasks awaiting feedback" },
        { id: "closed", text: "No tasks done" }
    ];

    fields.forEach(field => {
        let container = document.getElementById(field.id);
        let hasTodo = container.querySelector('.todo');
        let emptyMessage = container.querySelector('.fiedIsempty');
        checkAndDisplayEmptyMessage(container, hasTodo, field.text, emptyMessage);

    });
}
/**
 * Checks if the container has tasks, then displays or hides an empty message.
 * @param {Element} container The container element
 * @param {boolean} hasTodo Whether the container has tasks
 * @param {string} messageText Text for the empty message
 * @param {Element} emptyMessage The empty message element
 */
function checkAndDisplayEmptyMessage(container, hasTodo, messageText, emptyMessage) {
        
    if (!hasTodo) {
            if (!emptyMessage) {
                container.innerHTML = `
                    <div class="fiedIsempty"> 
                        <p>${messageText}</p>
                    </div>`;
            } else {
                emptyMessage.classList.remove('visibleContainer');
            }
        } else {
            if (emptyMessage) {
                emptyMessage.classList.add('visibleContainer');
            }
        }
    }
/**
 * Creates HTML for an empty field 
 * @param {string} text The message text
 */
function showEmptyFields(text) {
    return ` 
    <div class="fiedIsempty"> 
        <p>${text}</p>
           </div>`;
}

/**
 * Toggles task details overlay for the selected task.
 * @param {number} taskIndex Index of the task to open
 */
function openTask(taskIndex) {
    currentTaskIndex = taskIndex;
    let taskDiv = document.getElementById('boardAddTask');
    let darkOverlay = document.getElementById('darkOverlay');

    if (taskDiv.style.display === 'none' || taskDiv.style.display === '') {
        boardAddTask.classList.add('visible');
        darkOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    } else {
        boardAddTask.classList.remove('visible');
        darkOverlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }

}

/**
 * Closes the task overlay and resets the input fields.
 */
async function closeTaskUpdate() {
    let boardAddTask = document.getElementById('boardAddTask');
    let darkOverlay = document.getElementById('darkOverlay');

    boardAddTask.classList.remove('visible');
    darkOverlay.classList.remove('visible');
    document.body.style.overflow = 'auto';

    clearTask();
    clearMissingFieldContent();
}

/**
 * Shows or hides the menu based on the screen width.
 * @param {number} idTask - The ID of the task 
 */
function showMoveTheElements(idTask) {
    event.stopPropagation();

    if (window.innerWidth <= 1410) {
        toggleMenu(idTask);
    } else if (window.innerWidth > 1410 && window.innerWidth <= 1420) {
        hideMenu(idTask);
    }
}

/**
 * Toggles the display of the menu for  task.
 * @param {number} idTask - The id of the task 
 */
function toggleMenu(idTask) {
    let fieldsContainer = document.getElementById(`fields_${idTask}`);
    let existingMenu = fieldsContainer.querySelector('.showsmallFieldBar');

    if (existingMenu) {
        fieldsContainer.innerHTML = '';
    } else {
        fieldsContainer.innerHTML =fieldsContainerhtml(idTask);
    }
}


/**
 * Hides the menu task 
 * @param {number} idTask - The id of the task 
 */
function hideMenu(idTask) {
    let fieldsContainer = document.getElementById(`fields_${idTask}`);
    let existingMenu = fieldsContainer.querySelector('.showsmallFieldBar');

    if (existingMenu) {
        fieldsContainer.innerHTML = '';
    }
}

// Event listener to close the menu when clicking outside of it
document.addEventListener('click', function(event) {
    const openMenu = document.querySelector('.showsmallFieldBar');
    if (openMenu && !openMenu.contains(event.target)) {
        openMenu.remove();
    }
});

/**
 * Handles the window resize event
 */
function handleResize() {
    const windowWidth = window.innerWidth;
    const openMenu = document.querySelector('.showsmallFieldBar');

    if (windowWidth > 1410) {
        if (openMenu) {
            openMenu.remove();
        }
    }
}
/**
 * Moves a task to a new status and updates 
 * @param {number} idTask - The id of the task 
 * @param {string} newStatus - The new status 
 * @param {Event} event - The click event that triggered this function.
 */
 async function moveTaskTo(idTask, newStatus, event) {
    event.stopPropagation();  
    idTask++;
    let taskIndex = tasksArray.findIndex(task => task.idTask === idTask);
    
    if (taskIndex !== -1) {
        tasksArray[taskIndex].status = newStatus;
        let key =tasksArray[taskIndex].taskKey;
        await putDataTask(`tasks/${key}/Status`, newStatus);
        updateBoard(newStatus, tasksArray[taskIndex]);
    }
    
}
/**
 * Gets the icon based on the priority level of a task.
 * @param {string} priority - The priority level of the task.
 */
function getPriorityIcon(priority) {
    let checkPriority = priority;
    let priorityIcon = '';
    if (checkPriority === 'urgent') {
        priorityIcon = './assets/IMG/Priority symbols (1).png';
    } else if (checkPriority === 'medium') {
        priorityIcon = './assets/IMG/Priority symbols (2).png';
    } else if (checkPriority === 'low') {
        priorityIcon = './assets/IMG/Priority symbols.png';
    } else {
        priorityIcon = './assets/IMG/Priority symbols.png';
    }
    return priorityIcon;
}

/**
 * Gets the color with a specific task category.
 * @param {string} category - The category of the task.
 */
function getCategoryColor(category) {
    if (category === 'Technical Task') {
        return '#1FD7C1';
    }
    return '#0038FF';
}

/**
 * Fetches assigned contacts for a task and updates the display.
 * @param {object} task - The task object 
 * @param {number} taskIndex - The id of the task 
 */
async function getassignecontacts(task, taskIndex) {
    let assignedContacts = task.Assigned;
    if (assignedContacts === undefined) {
        return
    }
    let maxContact = 4;
    let remainingContacts = assignedContacts.length - maxContact;

    updateGetAssigneContacts(assignedContacts, taskIndex, maxContact, remainingContacts);
}
/**
 * Updates the display of assigned contacts for a task.
 * @param {Array} assignedContacts - List of contacts assigned to the task.
 * @param {number} taskIndex - The id of the task 
 * @param {number} maxContact - The maximum number of contacts to display.
 * @param {number} remainingContacts - The number of remaining contacts to be displayed as a number.
 */
async function updateGetAssigneContacts(assignedContacts, taskIndex, maxContact, remainingContacts) {
    for (let index = 0; index < assignedContacts.length; index++) {
        if (index === maxContact) {
            break;
        }
        let contact = assignedContacts[index];

        if (contactsArray.length === 0) {
            await fetchContacts();
        }   
        let checkIndexarray = contactsArray.findIndex(c => c.name === contact);
        nameParts = contact.split(" ");
        let colorid = `contactIcon_${taskIndex}_${index}`;

        if (nameParts.length >= 2) {
            getAssignCcontactsForAndLastName(taskIndex, nameParts ,colorid)
        } else {
            getAssignCcontactsForName(taskIndex, colorid)
        }
        showTheNameInitialInColorBoard(checkIndexarray, colorid);
    }
    if (assignedContacts.length > 4) {
        showTheNearestContactsAsNumbers(taskIndex, remainingContacts)
    }
}
/**
 * Creates and displays contact icons for contacts with both first and last names.
 * @param {number} taskIndex - The id of the task 
 * @param {Array} nameParts - The array containing first and last name parts.
 * @param {string} colorid - The id for the contact color element.
 */
function getAssignCcontactsForAndLastName(taskIndex, nameParts ,colorid ) {
    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);
    let firstLetterForName;
    let firstLetterLastName;

    firstLetterForName = nameParts[0].charAt(0).toUpperCase();
    firstLetterLastName = nameParts[1].charAt(0).toUpperCase();
    asignedContainer.innerHTML += `<div id="${colorid}"class="contact-iconBoard">
            <span>${firstLetterForName}${firstLetterLastName}</span>
        </div>`;
}
/**
 * Creates and displays contact icons for contacts with only a first name.
 * @param {number} taskIndex - The id of the task 
 * @param {string} colorid - The Id for the contact icon element.
 */
function getAssignCcontactsForName(taskIndex, colorid ) {
    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);
    let firstLetterForName;

    firstLetterForName = nameParts[0].charAt(0).toUpperCase();
    asignedContainer.innerHTML += `<div id="${colorid}" class="contact-iconBoard">
            <span>${firstLetterForName}</span>
        </div>`;

}
/**
 * Displays the number of remaining contacts if more than the maximum are assigned.
 * @param {number} taskIndex - The index of the task in the tasks array.
 * @param {number} remainingContacts - The number of remaining contacts.
 */
function showTheNearestContactsAsNumbers(taskIndex, remainingContacts) {
    let asignedContainer = document.getElementById(`assignedContacts${taskIndex}`);

    asignedContainer.innerHTML += `<div id="colorName" class="contact-iconBoard">
    <span> +${remainingContacts} </span>
</div>`
}
/**
 * Changes the background color of the based on the contact's color.
 * @param {number} checkIndexarray - The index of the contact in the contacts array.
 * @param {string} colorid - The ID for the contact icon element.
 */
function showTheNameInitialInColorBoard(checkIndexarray, colorid) {
    let nameColorContainer = document.getElementById(colorid);
    let contactColor = contactsArray[checkIndexarray].color
    contactColor = convertToValidColor(contactColor);
    nameColorContainer.style.backgroundColor = contactColor;
}
/**
 * Converts color names to valid hex color codes.
 * @param {string} color - The color name to convert.
 */
function convertToValidColor(color) {
    const colorMap = {
        "hellorange": "#FFA07A",
        "türkis": "#40E0D0",
        "gelb": "#FFC300",
        "grün": "#008000",
        "blau": "#0000FF",
        "pink": "#FF33A1",
        "orange": "#FF5733",
        "lila": "#A133FF"
    };
    return colorMap[color];
}

