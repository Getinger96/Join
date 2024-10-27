function showCard(task, taskIndex) {
    let todoBig = document.getElementById('todoBig');
    let showCardHTML = createShowCard(task, taskIndex); 
    todoBig.innerHTML = showCardHTML;

}


function openToDo(taskIndex) {
taskIndex--;
let task = tasksArray[taskIndex];  
let todoBig = document.getElementById('todoBig');
todoBig.classList = 'cardbig'; 
todoBig.innerHTML = '';

document.body.style.overflow = "hidden";
document.getElementById('overlay').classList.remove('d-none');

showCard(task, taskIndex );  
}

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

function generateLargeContactsHtml(assignedContacts) {
    let contactsHtml = ''; 

    for (let index = 0; index < assignedContacts.length; index++) {

        let contact = assignedContacts[index];
        let nameParts = assignedContacts[index].split(' ');
        let contactFirstname = nameParts[0] || '';  
        let contactLastname = nameParts.slice(1).join(' ') || '';  

        let checkIndexarray = contactsArray.findIndex(c => c.name === contact);

        let firstLetterForName = contactFirstname.charAt(0).toUpperCase();
        let firstLetterLastName = contactLastname.charAt(0).toUpperCase();

        let color = showTheNameColor(checkIndexarray);
        
        contactsHtml += getLargeContactHtml(index, firstLetterForName, firstLetterLastName, contactFirstname, contactLastname, color);
    }
  
    return contactsHtml;  
}

function showTheNameColor(checkIndexarray) {

    let contactColor = contactsArray[checkIndexarray].color
    contactColor = convertToValidColor(contactColor);
    
    
    return contactColor;

}





function getSmallContactHtml(index, firstname, lastname, color) {
    const initials = `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;
    return `
        <div class="contactCircle" style="background-color: ${color};">
            ${initials}
        </div>
    `;
}

function getLargeContactHtml(index, firstLetterForName, firstLetterLastName, contactFirstname, contactLastname, color) {// Zeige vollständige Namen

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

function createShowCard(task, taskIndex) {
    let title = task.Title || '';
    let description = task.Description || '';
    let dueDate = task.duedate || '';
    let priority = task.Prio;
    let assignedContacts1 = task.Assigned || [];
    let category = task.Category || '';
    assignedContacts.push(...assignedContacts1);

    


    const priorityIcon = getPriorityIcon(priority);
    const categoryColor = getCategoryColor(category);
    const contactsHtml = generateLargeContactsHtml(assignedContacts1);
    const subtasksHtml = generateSubtasksHtml(task.subtask, taskIndex);

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
         </div>
            </p>
            <p><strong>Assigned To:</strong></p>
            <div class="assigned-contacts">
                ${contactsHtml}
            </div>
            <p class="subtaskstext"> <strong>Subtasks:</strong></p>
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

function closeOverlay(taskIndex) {
    const todoBig = document.getElementById('todoBig');
    const overlay = document.getElementById('overlay');
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');

    todoBig.classList.add('d-none');
    overlay.classList.add('d-none');
    selectedProfileContainer.innerHTML = '';


    document.body.style.overflow = 'auto';
    clearTask();
}

function closeoverlayedit(taskIndex) {
    const todoBig = document.getElementById('todoBig');
    const overlay = document.getElementById('overlay');
    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');

    todoBig.classList.add('d-none');
    overlay.classList.add('d-none');
    selectedProfileContainer.innerHTML = '';


    document.body.style.overflow = 'auto';
}



function generateSubtasksHtml(subtasks, taskIndex) {
    let subtasksHtml = '';
    const totalSubtasks = subtasks ? subtasks.length : 0;

    if (totalSubtasks > 0) {
        subtasks.forEach((subtask, index) => {
            const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
            const isChecked = subtaskStatus[index] || false; 

            subtasksHtml += `
                <div class="subtask-item">
                    <input class="checkbox" type="checkbox" id="subtask-${taskIndex}-${index}" ${isChecked ? 'checked' : ''} 
                    onchange="subtaskChecked(${taskIndex}, ${index})" />
                    <label class="checkboxtext" for="subtask-${taskIndex}-${index}">${subtask}</label>
                </div>
            `;
        });
    }

    return subtasksHtml;
}

function subtaskChecked(taskIndex, subtaskIndex) {
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
    const isChecked = document.getElementById(`subtask-${taskIndex}-${subtaskIndex}`).checked;
    subtaskStatus[subtaskIndex] = isChecked;
    localStorage.setItem(`task-${taskIndex}-subtasks`, JSON.stringify(subtaskStatus));

    updateProgress(taskIndex);
}

function updateProgress(taskIndex) {
    let indexTasksArray = taskIndex +1;
    const task = tasksArray.find(t => t.idTask === indexTasksArray);
    if (!task || !task.subtask) return;

    const totalSubtasks = task.subtask.length;
    const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};
    const completedSubtasks = Object.values(subtaskStatus).filter(status => status).length;
    let progressLine = document.getElementById(`progressbarline-${taskIndex}`);
    if (!progressLine) return;  


    const progressPercentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;
    progressLine.style.width = `${progressPercentage}%`;
    document.getElementById(`progress-text-${taskIndex}`).innerText = `Subtasks: ${completedSubtasks}/${totalSubtasks}`;
}

async function initializeAllProgress() {
    for (let taskIndex = 0; taskIndex < tasksArray.length; taskIndex++) {
        const tasksArrayElement = tasksArray[taskIndex];
        const subtaskStatus = JSON.parse(localStorage.getItem(`task-${taskIndex}-subtasks`)) || {};

        if (tasksArrayElement === undefined) {
            return;
        }
        if (!tasksArrayElement.subtask || tasksArrayElement.subtask.length === 0) {
            continue; 
        }

        tasksArrayElement.subtask.forEach((_, index) => {
            const isChecked = subtaskStatus[index] || false;
            const checkbox = document.getElementById(`subtask-${taskIndex}-${index}`);
            if (checkbox) {
                checkbox.checked = isChecked;
            }
        });
        updateProgress(taskIndex);
    }
}



function search() {
    let search = document.getElementById('searchInput').value;
    let searchTask = search.toLowerCase();

   
    if (searchTask.length >= 3) {
       
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            showTasksSearch(searchTask, todos, todo);
        });
    } else {
       
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            todos.style.display = 'none';
        });
    }

    if (searchTask === '') {
        tasksArray.forEach((todo, index) => {
            let todos = document.getElementById(`task_${index}Element`);
            todos.style.display = 'block';
        });
    }
}
function showTasksSearch(search, todos, todo) {
    let taskTitle = todo.Title.toLowerCase();
    let taskdescription= todo.Description.toLowerCase();

    if (taskTitle.includes(search)  || taskdescription.includes(search) ) {
        todos.style.display = 'block';
    } else {
        todos.style.display = 'none';
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragLeave(ev) {
    const target = ev.target.closest('.drag-area');
    if (target) {
        removeHighlight(target.id);
    }
}

function startDragging(idBoard) {
    currentDraggedElement = idBoard;
}

async function moveTo(event, category) {
    event.preventDefault();
    currentDraggedElement--;
    let task = tasksArray[currentDraggedElement];
    let key = task.taskKey;

    if (task.idTask) {
        task.status = category;
        await putDataTask(`tasks/${key}/Status`, category);
    }
    updateBoard(category, task, event);
    updateAndCheckEmptyFields();
    removeHighlight(category);
}

async function putDataTask(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return responsASJson = await response.json();
}


function handleDragOver(categoryId) {
    let dragArea = document.getElementById(categoryId);
    dragArea.classList.add('dragging-over');

}

function removeHighlight(categoryId) {
    let dragArea = document.getElementById(categoryId);
    dragArea.classList.remove('dragging-over');



}


async function updateBoard(category, task, event) {
    let taskElement = document.getElementById(`task_${task.idTask - 1}Element`);
    if (taskElement) {
        taskElement.remove();
    }
    
    let newCategoryColumn = document.getElementById(category);
    let taskHTML = generateTodoHTML(task, task.idTask);
    
    newCategoryColumn.insertAdjacentHTML('afterbegin', taskHTML);
    
    getassignecontacts(task, task.idTask);
    
    updateAndCheckEmptyFields();
}


function checkEmptyFieldsMoveToUpdate() {
    let fields = ["open", "progress", "awaitFeedback", "closed"];
    fields.forEach(fieldId => {
        let container = document.getElementById(fieldId);
        if (container) {
            if (container.children.length === 0) {
                container.innerHTML = showEmptyFields(fieldId);
            } else {
                let emptyField = container.querySelector('.fiedIsempty');
                if (emptyField) {
                    emptyField.remove();
                }
            }
        }
    });
    updateFields();
    updateAndCheckEmptyFields();
}


function highlight(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('drag-area-highlight');
    }
}


