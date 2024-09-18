const colors = [
    '#FF5733', // Orange
    '#FFC300', // Gelb
    '#33FF57', // Grün
    '#33FFF3', // Türkis
    '#3357FF', // Blau
    '#A133FF', // Lila
    '#FF33A1', // Pink
    '#FF8F33'  // Hellorange
];

const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contactsArray = [];
let beginningLetter = [];
let groupedContacts = [];
let selectedContactIndices = [];

let currentPriority = 'none';
let currentCategory = 'open';
let path = "tasks";


// Funktion, um eine neue Aufgabe hinzuzufügen und in die Firebase-Datenbank zu speichern


function createTask() {
    // Hole die Werte aus den Formularfeldern
    const titleElement = document.getElementById('taskTitle');
    const dueDateElement = document.getElementById('taskDueDate');
    const kategorieElement = document.getElementById('kategorie');

    if (!titleElement || !dueDateElement || !kategorieElement) {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
    }

    const title = titleElement.value.trim();
    const dueDate = dueDateElement.value.trim();
    const kategorie = kategorieElement.value.trim();

    if (!title || !dueDate || !kategorie) {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
    }

    const descriptionElement = document.getElementById('description');
    const description = descriptionElement ? descriptionElement.value.trim() : '';
    const priority = currentPriority;  // Verwende die aktuelle Priorität
    const subtasks = Array.from(document.querySelectorAll('#list li')).map(li => li.textContent);

    const validCategories = ['open', 'progress', 'awaitFeedback', 'closed'];
    const status = validCategories.includes(kategorie) ? kategorie : 'open';

    const newTodo = {
        id: generateUniqueId(),
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        kategorie: kategorie,
        subtasks: subtasks,
        status: status
    };

  
   

    // Aktualisiere die HTML-Darstellung
   
    // Formular zurücksetzen
    resetForm();

    // Schließe das Formular
    closeTask();
}




// Rufe loadTodos beim Laden der Seite auf





// Aktualisiert die HTML-Darstellung

// Funktion, um leere Bereiche mit einem Hinweis zu versehen
function emptyTasks(category) {
    let container = document.getElementById(category);
    let noTasksElement = document.querySelector(`.noTasks[category="${category}"]`);

    if (noTasksElement) {
        if (container && container.innerHTML.trim() === '') {
            noTasksElement.style.display = 'block';
        } else {
            noTasksElement.style.display = 'none';
        }
    } else {
        console.error(`Element mit category="${category}" nicht gefunden.`);
    }
}


// Board Contacts
async function fetchContacts(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);

    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];


        contactsArray.push({
            name: contact.name,
        })

        letterSorting()

    }
}

function getLastName(fullName) {
    let nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
}

function getContacts() {
    let showContacts = document.getElementById('Selection_Container');

    if (!showContacts) {
        console.error("Element with ID 'Selection_Container' not found.");
        return;
    }

    showContacts.innerHTML = '';

    let groupedContacts = {};
    contactsArray.forEach((contact, index) => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        let colorIndex = index % colors.length;
        let color = colors[colorIndex];

        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }

        groupedContacts[firstLetter].push({ ...contact, index, color });
    });

    let beginningLetter = Object.keys(groupedContacts).sort();

    for (let index = 0; index < beginningLetter.length; index++) {
        let letter = beginningLetter[index];
        showContacts.innerHTML += `<h2 class="letter">${letter}</h2>`;

        groupedContacts[letter].forEach(contact => {
            showContacts.innerHTML += displayContacts(contact.index, contact.name, getLastName(contact.name), '', contact.color);
        });
    }
}

function openList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = `<img onclick="closelist()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_up.svg" alt="">`;
    selecCon.classList.remove('d_none');

}

function closelist() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = '';
    arrowCon.innerHTML = `<img onclick="openList()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_downaa.svg" alt="">`;
    selecCon.classList.add('d_none');
}


function displayContacts(contactIndex, contactsName, contactLastname, selectedClass, color) {
    const isSelected = selectedContactIndices.includes(contactIndex);
    const backgroundColor = isSelected ? '#2A3647' : '';  // Hintergrundfarbe für ausgewählte Kontakte
    const textColor = isSelected ? 'white' : 'black';  // Textfarbe für ausgewählte Kontakte

    return `<div id="contact-${contactIndex}" onclick="selectContact(${contactIndex}, '${contactsName}', '${contactLastname}', '${color}')" class="single-contact-box ${isSelected ? 'selected' : ''}" style="background-color:${backgroundColor};">
                <div class="contact-icon" style="background-color:${color};">
                    <span style="color: ${textColor};">${contactsName.charAt(0).toUpperCase()}${contactLastname.charAt(0).toUpperCase()}</span>
                </div>
                <div class="contact-content">
                    <span class="contactname" style="color:${textColor};">${contactsName}</span>
                </div>
            </div>`;
}



function selectContact(index, name, lastname, color) {
    const contact = contactsArray[index];
    const selectedIndex = selectedContactIndices.indexOf(index);

    if (selectedIndex > -1) {
        // Wenn bereits ausgewählt, dann abwählen und Informationen übergeben
        deselctedtContact(index, name, lastname, color);
        selectedContactIndices.splice(selectedIndex, 1); // Entferne den Kontakt aus der ausgewählten Liste
    } else {
        // Wenn noch nicht ausgewählt, dann auswählen
        selectedContactIndices.push(index); // Füge den Kontakt zur ausgewählten Liste hinzu
        showSelectedProfile(); // Aktualisiere die Anzeige der ausgewählten Profile
    }

    getContacts(); // Kontakte neu rendern, um die Markierung zu aktualisieren
}


function letterSorting() {
    contactsArray.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();

        if (beginningLetter.indexOf(firstLetter) === -1) {
            beginningLetter.push(firstLetter);
            groupedContacts.push({
                letter: firstLetter,
                contacts: [contact]
            });
        } else {
            let group = groupedContacts.find(contacts => contacts.letter === firstLetter);
            if (group) {
                group.contacts.push(contact);
            }
        }
    });

    beginningLetter.sort();
    getContacts();
}



function deselctedtContact(index, lastname, color) {
    const selectedIndex = selectedContactIndices.indexOf(index);
    if (selectedIndex > -1) {
        selectedContactIndices.splice(selectedIndex, 1);
    // Hier verwenden wir die übergebenen Parameter (index, name, lastname, color)
    let profileContainer = document.getElementById(`contact-${index}`);
    
    // Setze die Hintergrundfarbe und Textfarbe auf Standard zurück
    if (profileContainer) {
        profileContainer.style.backgroundColor = ''; // Hintergrundfarbe zurücksetzen
        profileContainer.querySelector('.contact-icon').style.backgroundColor = color; // Iconfarbe bleibt unverändert
        profileContainer.querySelector('.contactname').style.color = 'black'; // Textfarbe auf Standard zurücksetzen
        profileContainer.querySelector('.contact-icon span').style.color = 'black'; // Initialen ebenfalls auf Standard
    }

    

    showSelectedProfile(lastname, index); // Aktualisiere die Anzeige der ausgewählten Profile
}
}

function showSelectedProfile() {
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    selectedProfileContainer.innerHTML = '';

    if (selectedContactIndices.length === 0) {
        selectedProfileContainer.style.display = 'none'; // Verstecke, wenn keine Kontakte ausgewählt sind
        return;
    }

    selectedProfileContainer.style.display = 'flex'; // Stelle sicher, dass der Container sichtbar ist
    selectedContactIndices.forEach(index => {
        let contact = contactsArray[index];
        let firstletters = `${contact.name.charAt(0).toUpperCase()}${getLastName(contact.name).charAt(0).toUpperCase()}`;

        let colorIndex = index % colors.length;
        let color = colors[colorIndex];

        selectedProfileContainer.innerHTML += `
            <div class="contact-icon" style="background-color:${color};">
                <div>${firstletters}</div>
            </div>
        `;
    });
}



function updateHTMLBoard() {
    console.log("Aktuelle Todos:", tasksArray);

    // Container für verschiedene Status
    const containers = {
        open: document.getElementById('open'),
        progress: document.getElementById('progress'),
        awaitFeedback: document.getElementById('awaitFeedback'),
        closed: document.getElementById('closed')
    };

    // Leere alle Container
    Object.values(containers).forEach(container => {
        if (container) {
            container.innerHTML = '';
        } else {
            console.error('Container nicht gefunden.');
        }
    });

    // Aufgaben durchgehen und dem richtigen Container hinzufügen
    tasksArray.forEach(task => {
        console.log("Aktuelle Aufgabe:", task);
        if (containers[task.status]) {  // Verwende 'status' für die Zuordnung
            const taskHTML = generateTodoHTML(task);
            containers[task.status].innerHTML += taskHTML;
        } else {
            console.error(`Container für Status "${todo.status}" nicht gefunden.`);
        }
    });

    // Überprüfen, ob die Kategorien leer sind, um leere Aufgaben anzuzeigen
    ['open', 'progress', 'awaitFeedback', 'closed'].forEach(category => {
        emptyTasks(category);
    });
}

// Funktion, um leere Bereiche mit einem Hinweis zu versehen
function emptyTasks(category) {
    let container = document.getElementById(category);
    let noTasksElement = document.querySelector(`.noTasks[category="${category}"]`);

    if (noTasksElement) {
        if (container && container.innerHTML.trim() === '') {
            noTasksElement.style.display = 'block';
        } else {
            noTasksElement.style.display = 'none';
        }
    } else {
        console.error(`Element mit category="${category}" nicht gefunden.`);
    }
}