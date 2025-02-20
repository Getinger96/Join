

/**
 * the function show subTask container
 * @param {*} subtasks subtaks Element
 * @param {*} i  subtask id
 *
 */
function showSubTaskContainer(subtasks, i) {
    return `<div class="editSubtaskheadlineContainer" id="boderSubtaskId${i}">
            <div class="editSubtask" id="subTaskValueId${i}">
                <ul>
                <li>${subtasks[i]}</li>
                </ul>
                </div>
            <div class="subtaskEditDiv">
                <button type="button" class="Subtasks_Btn" onclick="deleteSubtask(${i})">
                    <img src="./assets/IMG/delete.png" alt="Delete">
                </button>

            
              <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                    <img src="./assets/IMG/edit.png" alt="Edit">
                </button>
            </div>
            </div>`;
}

/**
 *  the function show warning info
 */
function allInputFieldMissing() {
    let showTileMissing = document.getElementById("InputFieldsMissing")
    showTileMissing.innerHTML = `<div>
                                     <span class="missingInput"> Please fill in or select the marked fields</span>
                                </div>`;
 
}
/**
 * the function show invalid date message
 */
function showInvalidDateMessage() {
    let showWrongCurrentDate = document.getElementById("WrongCurrentDateId")
    showWrongCurrentDate.innerHTML = `<div>
                                     <span class="missingInput"> No date in the past may be specified</span>
                                </div>`;
    
}

/**
 * the function show change img checkedIcon
 *  * @param {*} i  subtask id
 */
function ShowChangeImgCheckedIcon(i) {
    return `
       <button type="button" class="EditSubtaskButton" onclick="enterNewSubtask(${i})">
                        <img class="imgCheckedIcon" id="changeImgEdit${i}" src="./assets/IMG/checkAddTask.png" alt="check">
                    </button>`
    }
    
    /**
     * the function show subTask value edit
     * *  @param {*} subtasks subtaks Element
     *  * @param {*} i  subtask id
     */
    function showSubTaskValueEdit(subtasks, i) {
        return `
        <li>
        <input id="subtaskValue${i}" class="subTaskInput" type="text" value="${subtasks[i]}"
        onblur="validateSubtask(${i})">
        </li>
        <div id="subtasksValidation${i}"></div> `
    }


    /**
 * the function show edit button
 *  * @param {*} i  subtask id
 */    
function ShowChangeImgEdit(i) {
    return `
            <button type="button" class="EditSubtaskButton" onclick="editSubtask(${i})">
                <img src="./assets/IMG/edit.png" alt="Edit">
            </button>
        `;
}
/**
 * the function show warning empty field
 */
function pleaseEnterASubtask() {
    document.getElementById(`SubtaskLengthReached`).innerHTML =`<span class="showShubtaskError">Please Enter a full subtask`;
}


/**
 * Generates HTML for displaying a single contact.
 * @param {number} contactIndex - The index of the contact in the contact list.
 * @param {string} contactsName - The first name of the contact.
 * @param {string} contactLastname - The last name of the contact.
 * @param {string} selectedClass - CSS class indicating if the contact is selected.
 * @param {string} color - Background color for the contact icon.
 */
function displayContacts(contactIndex, contactsName, contactLastname, selectedClass, color) {
    return `<div class= "Contact-Container"  id="profile-${contactIndex}" onclick="selectedContact(${contactIndex}, '${color}', '${contactsName}')">
                <div class="contact-icon ${color} profilebadge">
                    <span>${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
                </div>
                <div class="contact-content">
                    <span class="contactname">${contactsName}</span>
                </div>
            </div>`;
}


/**
 * the function generate the samll contact
 * @param {*} index assignedContacts id
 * @param {*} firstname firstname contact
 * @param {*} lastname  lastname contact
 * @param {*} color contact color
 * @returns {*}
 */
function getSmallContactHtml(index, firstname, lastname, color) {
    const initials = `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;
    return `
        <div class="contactCircle" style="background-color: ${color};">
            ${initials}
        </div>
    `;
}


/**
 * the function show the html element contact
 * @param {*} index assignedContacts id
 * @param {*} firstLetterForName firstname initial
 * @param {*} firstLetterLastName lastname initial
 * @param {*} contactFirstname firstname contact
 * @param {*} contactLastname lastname contact
 * @param {*} color contact color
 */
function getLargeContactHtml(index, firstLetterForName, firstLetterLastName, contactFirstname, contactLastname, color) {

    return `
        <div class="contact-box">
            <div class="contact-icon" style="background-color: ${color};">
                ${firstLetterForName}${firstLetterLastName}  
            </div>
            <div class="contact-content">
                <span class="contactname">${contactFirstname} ${contactLastname}</span>
            </div>
        </div>
    `;
}


/**
 * 
 * the funtion show the html card 
 * @param {*} title task title
 * @param {*} description task description
 * @param {*} dueDate task dueDate
 * @param {*} priority task priority
 * @param {*} priorityIcon task priorityIcon
 * @param {*} category task category
 * @param {*} categoryColor task categoryColor
 * @param {*} contactsHtml task contactsHtml
 * @param {*} subtasksHtml task subtasksHtml
 * @param {*} taskIndex task taskIndex
 * @returns {*}
 */
function generateCardHtml(title, description, dueDate, priority, priorityIcon, category, categoryColor, contactsHtml, subtasksHtml, taskIndex) {
    return `
        <div class="todo-detail">
            <div>
                <div class="divKategorieCard" style="background-color: ${categoryColor};">${category}</div>
                <button onclick="closeOverlay(${taskIndex})" class="close-button"><img src="./assets/IMG/iconoir_cancel.png" alt=""></button>
            </div>
            <div>
                <h2>${title}</h2>
            </div>
            <div class="responsiveDescription">
                <p><strong>Description:</strong> ${description}</p>
            </div>
            <p><strong>Due Date:</strong> ${dueDate}</p>
            <div class="prioicon">
                <p><strong>Priority:</strong> 
                    <span class="">${priority}</span> 
                    <div class="prioicon-imgSection">
                        <img src="${priorityIcon}" alt="${priority} Priority">
                    </div> 
                </p>
            </div>
            <p><strong>Assigned To:</strong></p>
            <div class="assigned-contacts">
                ${contactsHtml}
            </div>
            <p class="subtaskstext"><strong>Subtasks:</strong></p>
            <div class="subtasks-container">
                ${subtasksHtml} <!-- Hier werden die Subtasks eingefügt -->
            </div>
        </div>
        <div class="actionBigTodo">
            <button class="actionBigButton" onclick="deleteTask(${taskIndex})">
                <img class="iconTodoBig" src="./assets/IMG/delete.png">
                <p>Delete</p>
            </button>
            <div></div>
            <button class="actionBigButton" onclick="EditData(${taskIndex})">
                <img class="iconTodoBig" src="./assets/IMG/edit.png">
                <p>Edit</p>
            </button>
        </div>
    `;
}


/**
 * the function show subtask html
 * @param {*} taskIndex task id
 * @param {*} subtaskIndex subtask id
 * @param {*} isChecked checkbox is checked
 * @param {*} subtask subtask element
 * @returns {*}
 */
function showSubtasksHtml(taskIndex, subtaskIndex, isChecked, subtask) {
    return `
    <div class="subtask-item">
        <input class="checkbox" type="checkbox" id="subtask-${taskIndex}-${subtaskIndex}" ${isChecked ? 'checked' : ''} 
        onchange="subtaskChecked(${taskIndex}, ${subtaskIndex})" />
        <label class="checkboxtext" for="subtask-${taskIndex}-${subtaskIndex}">${subtask}</label>
    </div>
`;
}


/**
 * Changes the add task button to show edit options.
 * @param {number} index Index of the task to edit
 */
function changeAddtaskButton(index) {
    let buttonaddtask = document.getElementById('DibButtomAddtask');
    buttonaddtask.innerHTML = `
          <button onclick="clearTask()" class="buttonContainerWhite curser">Clear <img
                            src="./assets/IMG/x_icon_clear.svg"></button>
                    <button  onclick="createEdittask(${index})" class="buttonContainerdark curser">Edit Task <img
                            src="assets/IMG/clear_Img.svg"></button>`
}
/**
 * Resets the add task button to default.
 */
function setCreateTaskButton() {
    let buttonaddtask = document.getElementById('DibButtomAddtask');
    buttonaddtask.innerHTML = `
            <button onclick="clearTask()" class="buttonContainerWhite curser">Clear <img
                src="./assets/IMG/x_icon_clear.svg"></button>
            <button onclick="createTask(event)" class="buttonContainerdark curser">Create Task <img
                src="assets/IMG/clear_Img.svg"></button>`;
}


/**
 * Generates the HTML content for a task.
 * @param {Object} task Task object with details
 * @param {number} taskIndex Index of the task
 */
function generateTodoHTML(task, taskIndex) {
    const title = task.Title;
    const description = task.Description || "";
    const priority = task.Prio;
    const category = task.Category;
    const priorityIcon = getPriorityIcon(priority);
    const categoryColor = getCategoryColor(category);
    const progressHtml = generateProgressHtml(task);

    return `
       <div class="todo" id="task_${task.idTask - 1}Element" draggable="true" ondragstart="startDragging(${task.idTask})" onclick="openToDo(${task.idTask})">
           ${generateHeader(category, categoryColor, task.idTask)}
           <h3 id="task_Title${task.idTask - 1}" class="title">${title}</h3>
           <p class="description">${description}</p>
           ${progressHtml} <!-- Fortschritts-HTML wird hier eingefügt -->
           ${generateFooter(priorityIcon, task.idTask)}
       </div>`;
}

/**
 * Generates HTML for the task header
 * @param {string} category Task category
 * @param {string} categoryColor Color  category
 * @param {number} taskId Task id
 */
function generateHeader(category, categoryColor, taskId) {
    return `
        <div class="boardCardheadlinesmall">  
            <div>
                <div class="divKategorie"> 
                    <div class="categoryheadline" style="background-color: ${categoryColor};">
                        <span>${category} </span>
                    </div>
                    <div class="mobileCategory" onclick="showMoveTheElements(${taskId - 1})"> 
                        <img class="iconcategorybar" src="./assets/IMG/Menu Contact options.png" alt=""> 
                    </div>
                </div>
                <div id="fields_${taskId - 1}"></div> 
            </div>
        </div>`;
}

/**
 * Generates HTML for the task footer
 * @param {string} priorityIcon  priority icon image
 * @param {number} taskId Task id
 */
function generateFooter(priorityIcon, taskId) {
    return `
        <div class="task-footer">
            <div class="boardContacts" id="assignedContacts${taskId}"></div>  
            <div class="priority-icon">
                <img src="${priorityIcon}" alt="${taskId} Priority">
            </div>
        </div>`;
}
/**
 * Generates HTML for the task progress bar 
 * @param {Object} task Task object
 */
function generateProgressHtml(task) {
    const subtasks = task.subtask || [];
    const totalSubtasks = subtasks.length;
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${task.idTask - 1}-subtasks`)) || {};
    const completedSubtasks = Object.values(subtaskStatus).filter(isChecked => isChecked).length;
    const progressPercentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;

    if (totalSubtasks > 0) {
        return `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress" id="progressbarline-${task.idTask - 1}" style="width: ${progressPercentage}%;"></div>
                </div>
                <span class="progresstext" id="progress-text-${task.idTask - 1}">Subtasks ${completedSubtasks}/${totalSubtasks}</span>
            </div>
        `;
    }
    return '';
}


/**
 * Generates the HTML structure for the task status menu
 * @param {number} idTask - The id of the task 
 */
function fieldsContainerhtml(idTask) {
    return`
            <div id="existingmenu" class="showsmallFieldBar" onclick="event.stopPropagation()">
                <div class="headlsmallField"></div>
                <div class="fieldElement"> <span class="statusField" onclick="moveTaskTo(${idTask}, 'open', event)">todo</span></div>
                <div class="fieldElement"> <span class="statusField" onclick="moveTaskTo(${idTask}, 'progress', event)">Progress</span></div>
                <div class="fieldElement"> <span class="statusField" onclick="moveTaskTo(${idTask}, 'awaitFeedback', event)">awaitFeedback</span></div>
                <div class="fieldElement"> <span class="statusField" onclick="moveTaskTo(${idTask}, 'closed', event)">done</span></div>
            </div>`
}
