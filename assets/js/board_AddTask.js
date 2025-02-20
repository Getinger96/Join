let d_none = true;

/**
 * This function open Add Task
 * 
 */
function openTaskBoard() {
     addtask = true;
    setTaskPriority();
    toggleTaskBoardVisibility();
}

/**
 * 
 * This function set the Prio Icon 
 */
function setTaskPriority() {
    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");
    mediumButton.classList.add("medium")
    mediumIcon.src = "./assets/IMG/Prio media.png";
    currentPriority = 'medium';
}

/**
 * 
 * The function switches on the visibility of the board
 */
function toggleTaskBoardVisibility() {
    let taskDiv = document.getElementById('boardAddTask');
    let overlay = document.getElementById('darkOverlay');

    if (taskDiv.classList.contains('visible')){
        showTaskBoard(taskDiv, overlay);
    } else {
        hideTaskBoard(taskDiv, overlay);
    }
}

/**
 * 
 * The function show AddTask
 * @param {*} taskDiv  addTask Screen
 * @param {*} overlay addTask Screen
 */
function showTaskBoard(taskDiv, overlay) {
    taskDiv.classList.remove('visible');
    overlay.classList.remove('visible');
    document.body.classList.add('no-scroll');
    setCreateTaskButton();
}

/**
 *  The function hide AddTask
 * @param {*} taskDiv addTask Screen
 * @param {*} overlay addTask Screen
 */
function hideTaskBoard(taskDiv, overlay) {
    taskDiv.classList.add('visible');
    overlay.classList.add('visible');
    document.body.classList.remove('no-scroll');
}

/**
 * the function goes to AddTask HTML
 */
function redirect() {
    let width=window.innerWidth;
    if (addtask==true) {
        if (width < 1230) {
            window.location="http://127.0.0.1:5500/add_task.html"
         }
    }
}
/**
 * the function open contacts List
 */
function openList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    selecCon.classList.toggle('d_none');
    if (d_none == true) {
        arrowCon.innerHTML = `<img class="arrow_drop_up" src="assets/IMG/arrow_drop_up.svg" alt="">`;
        d_none = false;
    } else {
        arrowCon.innerHTML = `<img class="arrow_drop_downaa" src="./assets/IMG/arrow_drop_downaa.svg" alt="">`;
        d_none = true;
    }
    getContacts();
    updateContactStyles();
}

/**
 * the function reset all prio button
 */
function resetButtons() {
    let buttons = [
        { id: 'urgent', imgSrc: './assets/IMG/Priority symbols (1).png' },
        { id: 'medium', imgSrc: './assets/IMG/Priority symbols (2).png' },
        { id: 'low', imgSrc: './assets/IMG/Priority symbols.png' }
    ];
    buttons.forEach(button => {
        let btnElement = document.getElementById(button.id);
        let iconElement = document.getElementById(button.id + "Icon");
        
        btnElement.classList.remove('urgent', 'medium', 'low');
        btnElement.classList.add('default');
        iconElement.src = button.imgSrc;
    });
    currentPriority = 'none';
}
/**
 * the function clear Task 
 */
function clearTask() {
    deselectAllContacts();
    clearCurrentTask();
    clearFormFields();
    resetAdditionalSettings();
    resetDataArrays();
    getContacts();
    clearMissingFieldContent();
    returnColorPrioIcons();
    medium();
}

/**
 * the function deselect current task
 */
function clearCurrentTask() {
    let taskIndex = currentTaskIndex;
    if (taskIndex !== undefined && tasksArray[taskIndex]) {
        tasksArray[taskIndex].subtask = [];
        localStorage.removeItem(`task-${taskIndex}-subtasks`);
    }
}
/**
 * the function clear Form input fields
 */
function clearFormFields() {
    clearSelectionContainer();
    clearInputField('taskTitle');
    clearInputField('description');
    resetSelectElement('kategorie');
    clearSubtaskContainer();
    resetSelectElement('select_container');
    clearDateInput();
    clearSelectedProfiles();
}
/**
 * the function clear selection container
 */
function clearSelectionContainer() {
    const selectionContainer = document.getElementById('Selection_Container');
    if (selectionContainer) {
        selectionContainer.innerHTML = '';
    }
}
/**
 * the function clear  input fields
 */
function clearInputField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = '';
    }
}
/**
 * the function creset select Element
 */
function resetSelectElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.selectedIndex = 0;
    }
}
/**
 * the function clear subtask Container
 */
function clearSubtaskContainer() {
    const subtaskContainer = document.getElementById('subtasksContainer');
    if (subtaskContainer) {
        subtaskContainer.innerHTML = '';
    }
}
/**
 * the function clear date Input
 */
function clearDateInput() {
    const dateInput = document.querySelector('.inputTitleDate');
    if (dateInput) {
        dateInput.value = '';
    }
}
/**
 * the function clear selected profiles-Container
 */
function clearSelectedProfiles() {
    const selectedProfilesContainer = document.getElementById('Selected_profiles_Container');
    if (selectedProfilesContainer) {
        selectedProfilesContainer.innerHTML = '';
    }
}
/**
 * the function reset additional settings
 */
function resetAdditionalSettings() {
    resetButtons();
}
/**
 * the function reset subtask and assignedContacts
 */
function resetDataArrays() {
    assignedContacts = [];
    subtasks = [];
}

/**
 * the function change urgent img
 */
function urgent() {
    resetButtons();

    let urgentButton = document.getElementById("urgent");
    let urgentIcon = document.getElementById("urgentIcon");

    urgentButton.classList.add("urgent"); 
    urgentIcon.src = "./assets/IMG/iconUrgentWhite.svg";
    currentPriority = 'urgent';
}
/**
 * the function change medium img
 */
function medium() {
    resetButtons();

    let mediumButton = document.getElementById("medium");
    let mediumIcon = document.getElementById("mediumIcon");

    mediumButton.classList.add("medium");
    mediumIcon.src = "./assets/IMG/Prio media.png";
    currentPriority = 'medium';
}
/**
 * the function change low img
 */
function low() {
    resetButtons();

    let lowButton = document.getElementById("low");
    let lowIcon = document.getElementById("lowIcon");

    lowButton.classList.add("low"); 
    lowIcon.src = "./assets/IMG/Prio_LOW_WHITE.svg";
    currentPriority = 'low';
}

