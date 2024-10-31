/**
 * This function render the Html for the contacts list where you can assign the contacts for the task
 * 
 * @param {number} i index of the contact
 * @param {string} contactColour color of the contacts badge
 * @param {string} firstletters  the first  letters of the surname and lastname
 * @param {string} name  name of the contact
 * @returns  the html for the list
 */
function renderContacts(i, contactColour, firstletters, name) {
    return `
       <div  onclick="selectedContact(${i},'${name}','${firstletters}','${contactColour}')" id="profile_Container${i}" class="profile_Container">
         <div class="profile_container_header">
          <div class="profile_Badge_assign ${contactColour}">${firstletters}</div>
          <div>${name}</div>
         </div>
          <div id="checkbox${i}">
          <img  class="check_img " src="./assets/IMG/Check button.svg" alt="">
         </div>
        </div>`
}

/**
 * This function returns the Html for the prio buttons 
 * 
 * @returns the Html gets returned
 */
function renderPrioButtonsHtml() {
    return ` <button onclick="chossedurgent()" type="button" id="urgent"  class="Prio_Btn">Urgent <img
                        id="urgentIcon" src="./assets/IMG/Priority symbols (1).png" alt=""></button>
                        <button type="button" id="medium" onclick="choossedmedium()" class="Prio_Btn">Medium <img
                        id="mediumIcon" src="./assets/IMG/Prio_medium(2).svg" alt="">
                        </button>
                        <button type="button" id="low" onclick="choosedlow()" class="Prio_Btn">Low
                            <img id="lowIcon" src="./assets/IMG/Prio_Low(2).svg" alt=""></button>
                             `
}


/**
 * This function generate html about missing inputfields
 * 
 */
function allInputFieldMissing() {
    let showTileMissing = document.getElementById("InputFieldsMissing")
    showTileMissing.innerHTML = `<div>
                                     <span class="missingInput"> Please fill in or select the marked fields</span>
                                </div>`;    
}

/**
 * This function generate html about missing inputfields
 * 
 */

function showInvalidDateMessage() {
    let showWrongCurrentDate = document.getElementById("WrongCurrentDateId")
    showWrongCurrentDate.innerHTML = `<div>
                                     <span class="missingInput"> No date in the past may be specified</span>
                                </div>`;   
}

/**
 * this function returns Html for the add subtask function 
 * 
 * @param {number} i index of the subtask
 * @returns 
 */
function generateSubtaskHTML(i) {
    return `
        <div class="ChangeSubtask" id="changeColorId${i}">
            <div id="subTaskValueId${i}" class="li subtaskError">${subtasks[i]}</div>
            <div class="changeButtonDeleteAndEdit">
                <button type="button" class="deleteSubtask_Btn" onclick="deleteItem(${i})">
                    <img src="./assets/IMG/delete.png" class="deleteButton">
                </button>
                <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                    <img src="./assets/IMG/edit.png" class="deleteButton" alt="Edit">
                </button>
            </div>            
        </div>`;
}


/**
 * genrate html for not valid subtasks
 * 
 */
function pleaseEnterASubtask() {
    document.getElementById(`SubtaskLengthReached`).innerHTML =`<span class="showShubtaskError">Please Enter a full subtask`;
}

/**
 * function to edit the subtasks
 * 
 * @param {number} i index of the subtask
 */
function editSubtask(i) {
    let subtaskElement = document.getElementById(`subTaskValueId${i}`);

    subtaskElement.innerHTML = `
        <input id="subtaskValue${i}" class="subTaskInput" type="text" value="${subtasks[i]}">
        <div id="subtasksValidation${i}" class="subtaskError"></div>  <!-- Platz für Fehlermeldung -->
    `;

    let change = document.getElementById(`changeImgEdit${i}`);
    change.innerHTML = `<img class="imgCheckedIcon" src="./assets/IMG/checkAddTask.png" alt="check" onclick="enterNewSubtask(${i})">`;
}

/**
 * Function to change the Subtask
 * 
 * @param {number} i index of the subtask
 * @returns 
 */
function enterNewSubtask(i) {
    event.stopPropagation();
    let newSubTask = document.getElementById(`subtaskValue${i}`).value.trim();

    let errorMessageElement = document.getElementById(`subtasksValidation${i}`);

    if (newSubTask === '') {
        errorMessageElement.innerHTML = '<span class= "subtaskempty" style="color:red;">Subtask cannot be empty</span>';  // Zeige Fehlermeldung in rot
        return;
    }
    subtasks[i] = newSubTask;
    errorMessageElement.innerHTML = '';
    updateSubtaskElement(i);
}

/**
 * Function to update the Subtaskelement
 * 
 * @param {number} i  index of the Subtask
 */
function updateSubtaskElement(i) {
    let subtaskElement = document.getElementById(`changeColorId${i}`);

    subtaskElement.innerHTML = `
        <div id="subTaskValueId${i}" class="li">${subtasks[i]}</div>
        <div class="changeButtonDeleteAndEdit">
            <button type="button" class="Subtasks_Btn" onclick="deleteItem(${i})">
                <img src="./assets/IMG/delete.png">
            </button>
            <button type="button" id="changeImgEdit${i}" class="EditSubtaskButton" onclick="editSubtask(${i})">
                <img src="./assets/IMG/edit.png" class="deleteButton" alt="Edit">
            </button>
        </div>`;
}
