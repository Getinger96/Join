function nameIsNotValid(name) {
    const nameCheck = /^[A-Za-zäöüÄÖÜß]+\s[A-Za-zäöüÄÖÜß]+$/;
    return nameCheck.test(name);

}


function emailIsNotCorrect(email) {
        let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailCheck.test(email); 
    

}

function phoneNumberIsNotCorrect(phone) {
    let phoneCheck = /^\d+$/
    return phoneCheck.test(phone); 


}


function wrongEmailValidation() {

let showEmailMistake = document.getElementById("wrongEmail")

showEmailMistake.innerHTML = `<div>
                                <span class="mistakeInput"> Attention, a correct email address must be provided</span>
                            </div>`;

}

function wrongPhoneValidation() {

    let showPhoneMistake = document.getElementById("wrongPhone")
    
    showPhoneMistake.innerHTML = `<div>
                                    <span class="mistakeInput"> The phone number must consist of 6-15 numbers.</span>
                                </div>`;
    
    }


function wrongTextValidation() {

    let showTextMistake = document.getElementById("wrongText")
    
    showTextMistake.innerHTML = `<div>
                                     <span class="mistakeInput"> Please enter a full name of 3-30 letters</span>
                                </div>`;
        
        }



 function wrongEmailValidationMobile() {
    
    let showEmailMistake = document.getElementById("wrongEmailMobile")
            
         showEmailMistake.innerHTML = `<div>
         <span class="mistakeInput"> Attention, a correct email address must be provided</span>
                                </div>`;
            
            }
            
function wrongPhoneValidationMobile() {
            
    let showPhoneMistake = document.getElementById("wrongPhoneMobile")
                
    showPhoneMistake.innerHTML = `<div>
    <span class="mistakeInput"> The phone number must consist of 6-15 numbers.</span>
                              </div>`;
                
                }
            
            
function wrongTextValidationMobile() {
            
     let showTextMistake = document.getElementById("wrongTextMobile")
                
        showTextMistake.innerHTML = `<div>
        <span class="mistakeInput"> Please enter a full name of 3-30 letters</span>
                                </div>`;
                    
                    }
            
            

function changeColorMail() {

    document.getElementById("mailInput").style.border= "2px solid red";
}


function changeColorText() {

    document.getElementById("textInput").style.border= "2px solid red";
}

function changeColorPhone() {

    document.getElementById("phoneInput").style.border= "2px solid red";
}

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

    
    if (!phoneNumberIsNotCorrect(phone) || phone.length < 6 || phone.length > 15 || phone[0] !== '0') {
        wrongPhoneValidation(); 
        changeColorPhone();
        return false; 
    } else {
        document.getElementById("wrongPhone").innerHTML = '';
        document.getElementById("phoneInput").style.border = "";
    }

    return true; 
}


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



function changeColorPhoneMobile() {

    document.getElementById("phoneInputMobile").style.border= "2px solid red";
}

function changeColorMailMobile() {

    document.getElementById("mailInputMobile").style.border= "2px solid red";
}


function changeColorTextMobile() {

    document.getElementById("textInputMobile").style.border= "2px solid red";
}


async function updateContactInTasks(editedContact) {
    let response = await fetch(base_URL + "/tasks.json");  // Alle Tasks von Firebase holen
    let tasksData = await response.json();
    let keys = Object.keys(tasksData);
    let tasks = Object.values(tasksData);

    for (let index = 0; index < tasks.length; index++) {
        let assignedContacts = tasks[index].AssignedContact || [];
        
        let contactIndex = assignedContacts.findIndex(contact => contact === editedContact.oldName);

        if (contactIndex !== -1) {
        
            assignedContacts[contactIndex] = editedContact.newName;
            let taskId = keys[index];
        
            await updateTaskInFirebase(taskId, tasks[index]);
        }
    }
}

async function updateTaskInFirebase(taskId, updatedTask) {
    await fetch(base_URL + `/tasks/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function deleteContactInBoard(index) {
    let currenContact = contactsArray[index].name;
    let response = await fetch(base_URL + "/tasks.json");
    let userJSON = await response.json();
    let tasksAsArray = Object.values(userJSON);
    let keysArrayTask = Object.keys(userJSON);

    for (let indexTask = 0; indexTask < tasksAsArray.length; indexTask++) {
        let task = tasksAsArray[indexTask];
        let assignedContacts = task.AssignedContact;
        let keyTask = keysArrayTask[indexTask];

        let contactIndex = assignedContacts.findIndex(contact => contact === currenContact);

        if (contactIndex !== -1) {
            assignedContacts.splice(contactIndex, 1);

        
            await updateAssignedContactsInFirebase(`tasks/${keyTask}/AssignedContact`, assignedContacts);
        }
    }
}
async function updateAssignedContactsInFirebase(path, updatedContacts) {
    let response = await fetch(base_URL + path + ".json", {
        method: "PUT",
        body: JSON.stringify(updatedContacts)
    });

    return response.json();
}




async function fetchTasks(path = '') {
    tasksArray = [];
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let tasksAsarray = Object.values(userJSON.tasks)
    let keysArrayTask = Object.keys(userJSON.tasks);
    currentDraggedElement = 0;
    id = 0

    for (let index = 0; index < tasksAsarray.length; index++) {
        let task = tasksAsarray[index];
        let keyTask = keysArrayTask[index];
        id++;
        let saveTask = tasksArray.filter(t => t.Title === task.Titel && t.Description === task.Description);
        if (saveTask.length > 0) {
            console.log(`Task mit Titel "${task.Titel}" existiert bereits.`);

        } else {

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

}