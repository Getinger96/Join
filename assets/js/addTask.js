const colors = [
    'orange',
    'gelb',
    'grün',
    'türkis',
    'blau',
    'lila',
    'pink',
    'hellorange'
];

const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];
let subtasks = [];
let assignedContacts = [];
let prio = [];
let allfiles = [];


/**
 * This function set the standard prio of the task to medium 
 * 
 */
function setPrioMediumAndRender() {
    renderSelectionContainer();
    renderPrioButtons();

    const medium = document.getElementById('medium');
    medium.innerHTML = `
        Medium
        <img src="assets/IMG/PRio_Medium_WHITE.svg" alt="">
    `;
    medium.classList.add('color_white', 'bg_Medium');
    prio = 'medium';
}


function func1(event) {
    event.stopPropagation();
}
let d_none = true;

/**
 * This function opens the contact list where you can asigne contacts to a task
 * 
 */
function openList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    selecCon.classList.toggle('d_none');

    if (d_none == true) {
        arrowCon.innerHTML = `<img class="arrow_drop_downaa" src="assets/IMG/arrow_drop_up.svg" alt="">`;
        d_none = false;
    } else {
        arrowCon.innerHTML = `<img class="arrow_drop_up" src="./assets/IMG/arrow_drop_downaa.svg" alt="">`;
        d_none = true;
    }
}

/**
 * This function closes the list with the contacts
 * 
 */
function closelist() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = '';
    arrowCon.innerHTML = `<img class="arrow_drop_downaa" src="assets/IMG/arrow_drop_downaa.svg" alt="">`;
    selecCon.classList.add('d_none');
    d_none = true;
}

/**
 * this function opens the list where you can choose the category of the task
 * 
 */
function openCategoryLIst() {

    let seleCon = document.getElementById('Selection_Container_Category');
    seleCon.classList.toggle('d_none');
}

/**
 * This function delivers the text "User Story"if you choosed the div wit the category "User Story"
 * 
 */
function choosedUserStory() {

    let userStory = document.getElementById('Category');
    userStory.textContent = "User Story";
    closelistCategory();
}
/**
 * This function delivers the text "Technical Task"if you choosed the div wit the category "Technical Task"
 * 
 */
function choosedTechnicalTask() {

    let technicalTask = document.getElementById('Category');
    technicalTask.textContent = "Technical Task";
    closelistCategory();
}

/**
 * This function closes the list with teh Categorys
 * 
 */
function closelistCategory() {

    let seleCon = document.getElementById('Selection_Container_Category');
    seleCon.classList.add('d_none');
}

/**
 * This Function trims the name into 1 parts to get the Lastname of the name
 * 
 * @param {String} name Name of the contact
 * @returns {string} returns the lastname 
 */
function getLastName(name) {
    let lastName = name.trim().split(' ');
    return lastName[lastName.length - 1];
}

/**
 * This function iterate thru the contacts Array and delivers data from the objects of the array
 * 
 * @returns if profiles not exist 
 * 
 */
function renderSelectionContainer() {
    let profiles = document.getElementById('Selection_Container');
    if (!profiles) {
        console.error('Selection_Container not found');
        return;
    }
    profiles.innerHTML = ' ';
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let name = contact.name;
        let contactColour = contacts[i].color;
        let forNAme = name.charAt(0);
        let forNAmebig = forNAme.toUpperCase();
        let lastname = getLastName(name);
        let firstletterlastname = lastname.charAt(0);
        let firstletterlastnameBIG = firstletterlastname.toUpperCase();
        let firstletters = forNAmebig + firstletterlastnameBIG;
        profiles.innerHTML += renderContacts(i, contactColour, firstletters, name);
    }
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
                showToast();
                setTimeout(hideToast, 3000);
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

function showToast() {
  const toast = document.getElementById('error-toast');
  toast.classList.add('show');
  
}

function hideToast() {
  document.getElementById('error-toast').classList.remove('show');
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

/**
 * The validation of the dateinput that only allows present or future dates
 * 
 */
function dateinput() {
    let duedate = document.getElementById('dueDate');
    duedate.min = new Date().toISOString().split('T')[0];
}

/**
 * This function intiliases the rendering of the Prio buttons 
 * 
 */
function renderPrioButtons() {
    let prioButtonContainer = document.getElementById('Prio_btn_Container');
    prioButtonContainer.innerHTML = renderPrioButtonsHtml();
}


/**
 * This function starts  when you  onclick the button urgent. Then it start the function renderpriobuttons() and changes the style of the button
 * 
 */
function chossedurgent() {
    renderPrioButtons();
    let urgent = document.getElementById('urgent');
    urgent.innerHTML =
        `
     Urgent
     <img src="./assets/IMG/Prio_urgent_WHITE.svg" alt="">
     `;

    urgent.classList.add('bg_urgent_selected');
    urgent.classList.add('color_white')
    prio = 'urgent';
};



/**
 * This function starts  when you  onclick the button medium. Then it start the function renderpriobuttons() and changes the style of the button
 * 
 */
function choossedmedium() {
    renderPrioButtons();
    let medium = document.getElementById('medium');
    medium.innerHTML =
        `
    Medium
    <img src="assets/IMG/PRio_Medium_WHITE.svg" alt="">
    `;
    medium.classList.add('color_white');
    medium.classList.add('bg_Medium');
    prio = 'medium';
}


/**
 * This function starts  when you  onclick the button low. Then it start the function renderpriobuttons() and changes the style of the button
 * 
 */
function choosedlow() {
    renderPrioButtons();
    let low = document.getElementById('low');
    low.innerHTML =
        `
    Low
    <img src="./assets/IMG/Prio_LOW_WHITE.svg" alt="">
    `;
    low.classList.add('color_white');
    low.classList.add('bg_Low');
    prio = 'low';
}


/**
 * This function posts data to the firabse database
 * 
 * @param {string} path this is the path where you wana post the data
 * @param {string} data that get pushed into the firebase database
 * @returns  {boolean}
 */
async function postData(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return responsASJson = await response.json();
}


/**
 * This function checks if the input of the task ist valid if not  function validate task starts if ist valid function get starts to create the task
 * 
 * @param {*} event 
 * @returns {boolean} wether or not true
 */
async function createTask(event) {
    event.preventDefault();
    let newTask = createNewTask();
    if (!validateTask(newTask.Titel, newTask.Category, newTask.Date)) {
        return;
    }
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';

    await saveTask(newTask);
    clearTask();
    gotoBoard();
}


/**
 * This function collects the data of the task that you wants to create
 * 
 * @returns {boolean}
 * 
 */
function createNewTask() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let guest = { "email": "guest@web.de", "name": "guest", "password": "guest123456" };
    let titel = document.getElementById('title').value;
    let description = document.getElementById('Description').value;
    let assignedContact = assignedContacts;
    let files = allfiles;
    let date = document.getElementById('dueDate').value;
    let category = document.getElementById('Category').innerHTML;
    let subtask = subtasks;
    let status = 'open';
    let newTask = newTaskObject(titel, description, assignedContact, date, files, prio, category, subtask, status)


    if (JSON.stringify(loggedInUser) === JSON.stringify(guest)) {
        localStorage.setItem('guestTasks', JSON.stringify(newTask));
    }
    return newTask;
}


/**
 * This function stores the collected data into an object 
 * 
 * @param {string} titel  value of the input titel 
 * @param {string} description value of the input description
 * @param {object} assignedContact  contacts of the array assigned contacts
 * @param {number} date value of the date input
 * @param {string} prio value of prio buttons
 * @param {string} category value of the category
 * @param {string} subtask  value of the strings
 * @param {*} status status of the task
 * @returns {boolean}
 */
function newTaskObject(titel, description, assignedContact, date, files, prio, category, subtask, status) {
    return newTask = {
        Titel: titel,
        Description: description,
        AssignedContact: assignedContact,
        Date: date,
        Files: files,
        Prio: prio,
        Category: category,
        Subtask: subtask,
        Status: status
    };
}


/**
 * This function initilises the post function 
 * 
 * @param {object} newTask the object that gets  postedt
 */
async function saveTask(newTask) {
    clearMissingFieldContent();
    await postData(`tasks`, newTask);
}

/**
 * this function initiliases  functions to clear all input fields
 * 
 */
async function clearTask() {


    clearFormFields();
    removeAllFiles();
    resetAddTask();
}

/**
 * Tis function empty all input fields
 * 
 */
function clearFormFields() {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    selectedProfileContainer.innerHTML = '';
    let inpuSubtask = document.getElementById('input_Subtasks');
    inpuSubtask.value = "";
    let list = document.getElementById('ul_subtasks');
    list.innerHTML = '';
    let titel = document.getElementById('title');
    let description = document.getElementById('Description')
    let date = document.getElementById('dueDate');
    let category = document.getElementById('Category');
    titel.value = "";
    description.value = "";
    assignedContacts = [];
    date.value = "";
    category.innerHTML = "Select Category";
    subtasks = [];
    prio = [];
}

/**
 *This function resets the addtask side
 * 
 */
function resetAddTask() {
    renderPrioButtons();
    clearMissingFieldContent();
    clearWarningField();
    choossedmedium();
    renderSelectionContainer();
}

/**
 * 
 * This function empty the subtask input fields 
 */
function emptySubtask() {
    let currentSubtask = document.getElementById('input_Subtasks')
    currentSubtask.value = '';
}

