let d_none = true;
let allfiles = [];


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
   removeAllFiles()
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


function fileupload() {
    const filepicker = document.getElementById('Filepicker');
    filepicker.removeEventListener('change', handleFileChange);
    filepicker.addEventListener('change', handleFileChange);
}

async function handleFileChange() {
    console.log('handleFileChange aufgerufen')
    const filepicker = document.getElementById('Filepicker');
    const files = filepicker.files;
     console.log('files:', files)
    const error = document.getElementById('error');
    const container = document.getElementById('uploaded_Files');
    console.log('container:', container);

    if (files.length > 0) {
        Array.from(files).forEach(async file => {
            console.log('file:', file.name, file.type);
            if (!file.type.startsWith('image/')) {
                error.textContent = 'Nur Bilddateien sind erlaubt!';
                return;
            }
            const blob = new Blob([file], { type: file.type });
            console.log('Neue Datei', blob);

            const compressedBase64 = await compressImage(file, 800, 800, 0.8);
            console.log('compressedBase64 fertig');
            const img = document.createElement('img');
            img.src = compressedBase64;
            allfiles.push({
                filename: file.name,
                fileType: blob.type,
                base64: compressedBase64
            });

            const item = document.createElement('div');
            item.classList.add('uploaded_file_item');
            item.innerHTML = `
                <img src="${compressedBase64}" alt="${file.name}">
                <span>${file.name}</span>
                <button onclick="removeFile(this, '${file.name}')">✕</button>
            `;
            container.appendChild(item);
            console.log('item hinzugefügt')
        });
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function removeFile(btn, filename) {
    btn.parentElement.remove();
    allfiles = allfiles.filter(f => f.filename !== filename);
}
function removeAllFiles() {
    document.getElementById('uploaded_Files').innerHTML = '';
    allfiles = [];
}

function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Berechnung der neuen Größe, um die Proportionen beizubehalten
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    } else {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Zeichne das Bild in das Canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Exportiere das Bild als Base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };

            img.onerror = () => reject('Fehler beim Laden des Bildes.');
            img.src = event.target.result;
        };

        reader.onerror = () => reject('Fehler beim Lesen der Datei.');
        reader.readAsDataURL(file);
    });
}

