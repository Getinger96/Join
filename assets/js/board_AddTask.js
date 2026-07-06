let d_none = true;


function func1(event) {
    event.stopPropagation();
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeList();
});

document.addEventListener('focusin', (e) => {
    let selecCon = document.getElementById('Selection_Container');
    let selectContainer = document.getElementById('select_container');
    if (!selecCon.contains(e.target) && e.target !== selectContainer) {
        closeList();
    }
});

/**
 * This function open Add Task
 * 
 */
function openTaskBoard() {
    addtask = true;
    document.documentElement.classList.add('no-scroll'); // html
    document.body.classList.add('no-scroll');
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

    if (taskDiv.classList.contains('visible')) {
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
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
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
    document.body.classList.add('no-scroll')
}

/**
 * the function goes to AddTask HTML
 */
function redirect() {
    let width = window.innerWidth;
    if (addtask == true) {
        if (width < 1230) {
            window.location = "http://127.0.0.1:5500/add_task.html"
        }
    }
}
/**
 * the function open contacts List
 */
function openList() {
    let selecCon = document.getElementById('Selection_Container');
    if (d_none == true) {
        let arrowCon = document.getElementById('arrow_img_container');
        selecCon.classList.remove('d_none');
        arrowCon.innerHTML = `<img class="arrow_drop_up" src="assets/IMG/arrow_drop_up.svg" alt="">`;
        d_none = false;
        getContacts();
        updateContactStyles();
    } else {
        closeList();
    }
}

function closeList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    selecCon.classList.add('d_none');
    arrowCon.innerHTML = `<img class="arrow_drop_downaa" src="./assets/IMG/arrow_drop_downaa.svg" alt="">`;
    d_none = true;
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
function clearBoardTask() {
    deselectAllContacts();
    clearCurrentTask();
    clearFormFields();
    resetAdditionalSettings();
    resetDataArrays();
    getContacts();
    clearMissingFieldContent();
    returnColorPrioIcons();
    medium();
    removeAllFilesBoard()
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
    resetCategorySelection();
    clearSubtaskContainer();
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
function resetCategorySelection() {
    document.getElementById('Category').textContent = 'Select Category';
    document.getElementById('select_containerId').classList.remove('missing-input-border');
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

/**
 * Registers the file input change listener.
 * Removes any existing listener first to avoid duplicates.
 */
function fileuploadBoard() {
    const filepicker = document.getElementById('Filepicker');
    filepicker.removeEventListener('change', handleFileChangeBoard);
    filepicker.addEventListener('change', handleFileChangeBoard);
}
/**
 * Converts a file size in bytes to a human-readable string.
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted string e.g. '204.8 KB', '1.2 MB', '512 B'
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB


/**
 * Handles file input changes. Finds the upload container relative to the
 * input element, validates type and size, compresses valid images and
 * appends them to the upload container. Resets the input after processing.
 * @async
 * @param {Event} event - The change event from the file input
 * @returns {Promise<void>}
 */
async function handleFileChangeBoard(event) {
    const input = event.target;
    const container = input.closest('.File_Upload_Container');
    const uploadedFilesContainer = container.querySelector('#uploaded_Files');
    const files = input.files;

    if (files.length === 0) return;

    for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
            showToastBoard('Dieses Dateiformat ist nicht erlaubt!');
            continue;
        }

        if (file.size > MAX_SIZE_BYTES) {
            showToastBoard('Upload-Limit von 1MB überschritten!');
            continue;
        }

        const compressedBase64 = await compressImageBoard(file, file.type, 800, 800, 0.8);

        allfiles.push({
            filename: file.name,
            fileType: file.type,
            fileSize: formatFileSize(file.size), // ← z.B. "204.8 KB"
            base64: compressedBase64
        });



        const item = document.createElement('div');
        item.classList.add('uploaded_file_item');
        item.innerHTML = `
            <img src="${compressedBase64}" alt="${file.name}">
            <span>${file.name}</span>
            <button onclick="removeFileBoard(this, '${file.name}')">✕</button>
        `;
        uploadedFilesContainer.appendChild(item);
    }

    input.value = '';
}

function removeFileBoard(btn, filename) {
    btn.parentElement.remove();
    allfiles = allfiles.filter(f => f.filename !== filename);
}

/**
 * Removes a file from the UI and from the allfiles array.
 * @param {HTMLButtonElement} btn - The remove button that was clicked
 * @param {string} filename - Name of the file to remove
 */
function removeAllFilesBoard() {
    document.querySelectorAll('#uploaded_Files').forEach(c => c.innerHTML = '');
    allfiles = [];
}


/**
 * Shows a toast notification for 3 seconds using the board toast element.
 * @param {string} [message='Dieses Dateiformat ist nicht erlaubt!'] - Message to display
 */
function showToastBoard(message = 'Dieses Dateiformat ist nicht erlaubt!') {
    const toast = document.getElementById('board-error-toast');
    if (!toast) return;
    document.getElementById('board-toast-title').textContent = message;
    toast.classList.add('show');
    setTimeout(hideBoardToast, 3000);
}


/**
 * Hides the board toast notification.
 */
function hideBoardToast() {
    const toast = document.getElementById('board-error-toast');
    if (!toast) return;
    toast.classList.remove('show');
}



/**
 * Compresses an image to fit within max dimensions at a given quality.
 * Maintains aspect ratio. Returns a base64 data URL.
 * @param {File} file - The image file to compress
 * @param {string} fileType - MIME type e.g. 'image/jpeg'
 * @param {number} [maxWidth=800] - Maximum width in px
 * @param {number} [maxHeight=800] - Maximum height in px
 * @param {number} [quality=0.8] - Compression quality between 0 and 1
 * @returns {Promise<string>} Base64 encoded compressed image
 */
function compressImageBoard(file, fileType, maxWidth = 800, maxHeight = 800, quality = 0.8) {
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
                const compressedBase64 = canvas.toDataURL(fileType, quality);
                resolve(compressedBase64);
            };

            img.onerror = () => reject('Fehler beim Laden des Bildes.');
            img.src = event.target.result;
        };

        reader.onerror = () => reject('Fehler beim Lesen der Datei.');
        reader.readAsDataURL(file);
    });
}


function toggleCategoryList(event) {
    event.stopPropagation();
    document.getElementById('Selection_Container_Category-List').classList.toggle('d_none');
}

function selectUserStory(event) {
    event.stopPropagation();
    document.getElementById('Category').textContent = 'User Story';
    document.getElementById('select_containerId').classList.remove('missing-input-border');
    document.getElementById('InputFieldsMissing').innerHTML = '';
    document.getElementById('Selection_Container_Category-List').classList.add('d_none');
}

function selectTechnicalTask(event) {
    event.stopPropagation();
    document.getElementById('Category').textContent = 'Technical Task';
    document.getElementById('select_containerId').classList.remove('missing-input-border');
    document.getElementById('InputFieldsMissing').innerHTML = '';
    document.getElementById('Selection_Container_Category-List').classList.add('d_none');
}

document.addEventListener('click', () => {
    document.getElementById('Selection_Container_Category-List').classList.add('d_none');
});