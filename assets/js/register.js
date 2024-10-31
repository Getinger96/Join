
/**
 * Base URL for the API.
 * @type {string}
 */
const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Array to store contacts.
 * @type {Array}
 */
let contacts = [];

/**
 * Loads users from the specified path and populates the contacts array.
 * @async
 * @param {string} [path=''] - The path to fetch user data from.
 */
async function loadUsers(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);
    
    for (let index = 0; index < userAsArray.length; index++) {
        let contact = userAsArray[index];
        contacts.push({
            email: contact.email,
            name: contact.name,
            password: contact.password,
        });
    }
}

/**
 * Posts data to the specified path.
 * @async
 * @param {string} [path=''] - The path to post data to.
 * @param {Object} data - The data to post.
 * @returns {Object} The JSON response from the server.
 */
async function postData(path = "", data = {}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

/**
 * Checks registration form fields and adds a new user if validation passes.
 * @async
 */
async function checkRegistration() {
    let username = document.getElementById('username');
    let usermail = document.getElementById('usermail');
    let userpassword = document.getElementById('userpassword');
    let userconfirmpassword = document.getElementById('userconfirmpassword');
    let checkbox = document.getElementById('checkbox');
    let sigUpInfo = document.getElementById('signupinfotext');

    let user = contacts.find(u => u.email === usermail.value);

    if (!sigUpValidation(user, username, usermail, userpassword, userconfirmpassword, checkbox)) {
        return;
    }
    sigUpInfo.innerHTML = '';
    addNewUser(username, usermail, userpassword, userconfirmpassword, checkbox);
}

/**
 * Adds a new user to the database and updates the UI upon successful signup.
 * @async
 * @param {HTMLInputElement} username - The username input element.
 * @param {HTMLInputElement} usermail - The user email input element.
 * @param {HTMLInputElement} userpassword - The user password input element.
 * @param {HTMLInputElement} userconfirmpassword - The confirm password input element.
 * @param {HTMLInputElement} checkbox - The terms acceptance checkbox.
 */
async function addNewUser(username, usermail, userpassword, userconfirmpassword, checkbox) {
    let newContact = {
        name: username.value,
        email: usermail.value,
        password: userpassword.value
    };
    await postData(`contacts`, newContact);
    emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
    showSignedUpSuccessfully();
    setTimeout(() => { window.location.href = 'login.html' }, 3000);
    await loadUsers('users');
}

/**
 * Disables the signup button.
 */
function ButtonDisabledSet() {
    let signUpButton = document.getElementById('signUpButton');
    signUpButton.classList.remove('enabledbutton');
    signUpButton.classList.add('disabledbutton');
}

/**
 * Checks if all required form fields are completed and enables/disables the signup button accordingly.
 */
function checkFormCompletion() {
    let username = document.getElementById('username').value.trim();
    let usermail = document.getElementById('usermail').value.trim();
    let userpassword = document.getElementById('userpassword').value.trim();
    let userconfirmpassword = document.getElementById('userconfirmpassword').value.trim();
    let checkbox = document.getElementById('checkbox').checked;
    let signUpButton = document.getElementById('signUpButton');

    if (username !== "" && usermail !== "" && userpassword !== "" && userconfirmpassword !== "" && checkbox) {
        signUpButton.disabled = false;
        signUpButton.classList.remove('disabledbutton');
        signUpButton.classList.add('enabledbutton');
    } else {
        signUpButton.disabled = true;
        signUpButton.classList.remove('enabledbutton');
        signUpButton.classList.add('disabledbutton');
    }
}

/**
 * Empties the input fields and unchecks the checkbox.
 * @param {HTMLInputElement} username - The username input element.
 * @param {HTMLInputElement} usermail - The user email input element.
 * @param {HTMLInputElement} userpassword - The user password input element.
 * @param {HTMLInputElement} userconfirmpassword - The confirm password input element.
 * @param {HTMLInputElement} checkbox - The terms acceptance checkbox.
 */
function emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox) {
    username.value = '';
    usermail.value = '';
    userpassword.value = '';
    userconfirmpassword.value = '';
    checkbox.checked = false;
}
function passwordvisbility() {
    document.getElementById("visbilityimg").src = "assets/IMG/visibility_off_password.png";
    
}


/**
 * Toggles the visibility of the password field.
 */
function showVisbility() {
    let userpassword = document.getElementById('userpassword');
    let visibilityImg = document.getElementById('visbilityimg');
    if (userpassword.type === "password") {
        userpassword.type = "text";
        visibilityImg.src = "assets/IMG/visibility_on.png";
    } else {
        userpassword.type = "password";
        visibilityImg.src = "assets/IMG/visibility_off_password.png";
    }
}

function passwordconfirmvisbility() {
    document.getElementById("visbilityimgconfirm").src = "assets/IMG/visibility_off_password.png";
    
}
function showVisbilityconfirmpassword() {
    let userpassword = document.getElementById('userconfirmpassword');
    let visibilityImg = document.getElementById('visbilityimgconfirm');
    
    if (userpassword.type === "password") {
        userpassword.type = "text"
        visibilityImg.src = "assets/IMG/visibility_on.png"; 
    } else {
        userpassword.type = "password"
        visibilityImg.src = "assets/IMG/visibility_off_password.png"; 
    }
}






/**
 * Validates the username input for format and length requirements.
 */
function validateUsername() {
    let username = document.getElementById('username').value.trim();
    if (!nameIsNotValid(username) || username.length < 3 || username.length > 30) {
        document.getElementById('inputNameMistake').innerText = wrongTextValidation();
        document.getElementById('inputNameMistake').style.display = 'flex';
        changeBorderName();
    } else {
        document.getElementById('inputNameMistake').innerText = '';
        document.getElementById("inputenamesectionId").style.border = '';
        document.getElementById('inputNameMistake').style.display = 'none';
    }
    checkFormCompletion();
}
function validateEmail() {
    let usermail = document.getElementById('usermail').value.trim();
    if (!emailIsNotCorrect(usermail)) {
        document.getElementById('inputEmailMistake').innerText = wrongEmailValidation();
        document.getElementById('inputEmailMistake').style.display ='flex';
        changeBorderEmail();
    } else {
        document.getElementById('inputEmailMistake').innerText = '';
        document.getElementById("inputemailsectionId").style.border= '';
        document.getElementById('inputEmailMistake').style.display ='none';
    }
    checkFormCompletion();
}

function validatePassword() {
    let userpassword = document.getElementById('userpassword').value.trim();
    if (userpassword.length <= 5) {
        document.getElementById('inputPasswordMistake').innerText = passwordToShort();
        changeBorderPassword();
        document.getElementById('inputPasswordMistake').style.display ='flex';
    } else {
        document.getElementById('inputPasswordMistake').innerText = '';
        document.getElementById("inputpasswordsectionId").style.border= '';
        document.getElementById('inputPasswordMistake').style.display ='none';
    }
    checkFormCompletion();
}

function validateConfirmPassword() {
    let userpassword = document.getElementById('userpassword').value.trim();
    let userconfirmpassword = document.getElementById('userconfirmpassword').value.trim();
    if (userpassword !== userconfirmpassword || userconfirmpassword== '') {
        document.getElementById('inputConfirmPasswordMistake').innerText = passwordNoMatch();
        document.getElementById('inputConfirmPasswordMistake').style.display ='flex';
        changeBorderConfirmPassword();
    } else {
        document.getElementById('inputConfirmPasswordMistake').innerText = '';
        document.getElementById("inputpasswordconfirmsectionId").style.border= '';
        document.getElementById('inputConfirmPasswordMistake').style.display ='none';
    }
    checkFormCompletion();
}


function changeBorderName() {
    document.getElementById("inputenamesectionId").style.border= "3px solid red";

}

function changeBorderEmail() {
    document.getElementById("inputemailsectionId").style.border= "3px solid red";

}


function changeBorderPassword() {
    document.getElementById("inputpasswordsectionId").style.border= "3px solid red";

}

function changeBorderConfirmPassword() {
    document.getElementById("inputpasswordconfirmsectionId").style.border= "3px solid red";

}


function passwordToShort() {
    return `
    Passwords must have maximal 6 characters !!!`;
    
    }

function passwordNoMatch() {
    return `
    Passwords do not match! !!!`;

}

function checkboxNoChecked() {
    return `
    You must accept the privacy policy to register !!!`;

}


function showSignedUpSuccessfully() {
    document.getElementById('Signedupsuccessfully').innerHTML =`  <div class="Signedupsuccessfully">
    <span class="textstylesuccessfully"> You Signed Up successfully</span>
    <img class="" src="assets/IMG/You Signed Up successfully.png" alt="">   


    </div>`;
}

function emailIsAlreadyAvailable() {
return `Attention, the email already exists!!!`
}

function goBackToLogin() {
    window.location.href = "login.html";
}

function nameIsNotValid(username) {
    const nameCheck = /^[A-Za-zäöüÄÖÜß]+\s[A-Za-zäöüÄÖÜß]+$/;
    return nameCheck.test(username);
}

function emailIsNotCorrect(usermail) {
        let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailCheck.test(usermail); 
}

function wrongEmailValidation() {
    return `
    Attention, a correct email address must be provided !!!`;
}

function wrongTextValidation() {           
    return `
      Please enter a full name of 3-30 letters`;                   
                   }


function validateUserName(username) {
    let sigUpInfo = document.getElementById('signupinfotext');
    
    if (!nameIsNotValid(username.value) || username.value.length < 3 || username.value.length > 30) {
        sigUpInfo.innerHTML = wrongTextValidation();
        ButtonDisabledSet();
        return false;
    }
    
    sigUpInfo.innerHTML = ''; 
    return true;
}

/**
 * Validates the user's email input and provides feedback if invalid.
 * @param {HTMLInputElement} usermail - The email input field.
 * @returns {boolean} - Returns true if the email is valid; false if not.
 */
function validateUserEmail(usermail) {
    let sigUpInfo = document.getElementById('signupinfotext');
    
    if (!emailIsNotCorrect(usermail.value)) {
        sigUpInfo.innerHTML = wrongEmailValidation();
        ButtonDisabledSet();
        return false;
    }
    sigUpInfo.innerHTML = '';
    return true;
}

/**
 * Validates the user's password and confirmation password input.
 * Checks for minimum length and if passwords match.
 * @param {HTMLInputElement} userpassword - The password input field.
 * @param {HTMLInputElement} userconfirmpassword - The confirm password input field.
 * @returns {boolean} - Returns true if password meets all conditions; false if not.
 */
function validateUserPassword(userpassword, userconfirmpassword) {
    let sigUpInfo = document.getElementById('signupinfotext');
    
    if (userpassword.value.length <= 5) {
        sigUpInfo.innerHTML = passwordToShort();
        ButtonDisabledSet();
        return false;
    }
    
    if (userpassword.value !== userconfirmpassword.value) {
        sigUpInfo.innerHTML = passwordNoMatch();
        ButtonDisabledSet();
        return false;
    }
    sigUpInfo.innerHTML = '';
    return true;
}

