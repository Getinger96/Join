/**
 * Fetches user data from the given path, processes it, and adds it to the `contacts` array.
 * @param {string} path - The API path to fetch user data from.
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
 * Validates the login email format and displays a message if invalid.
 * @param {HTMLElement} loginMail - The email input element.
 * @param {HTMLElement} loginPassword - The password input element.
 * @param {HTMLElement} loginInfo - The element displaying login feedback.
 * @returns {boolean} - Returns true if the email is valid; otherwise, false.
 */
async function validateLoginEmail(loginMail, loginPassword, loginInfo) {
    if (!emailIsCorrect(loginMail.value)) {
        loginInfo.innerText = 'Please enter a valid email address!';
        emptyTheInputFields(loginMail, loginPassword);
        changeColorHrAndBorderMistake();
        return false;
    }
    return true;
}

/**
 * Checks if the provided email and password match any existing user credentials.
 * @param {HTMLElement} loginMail - The email input element.
 * @param {HTMLElement} loginPassword - The password input element.
 * @returns {Object|undefined} - Returns the matching user object if found; otherwise, undefined.
 */
function checkUserCredentials(loginMail, loginPassword) {
    return contacts.find(u => u.email === loginMail.value && u.password === loginPassword.value);
}

/**
 * Handles the login result by redirecting on success or displaying an error message.
 * @param {Object} user - The user object if login credentials are valid.
 * @param {HTMLElement} loginMail - The email input element.
 * @param {HTMLElement} loginPassword - The password input element.
 * @param {HTMLElement} loginInfo - The element displaying login feedback.
 */
function handleLoginResult(user, loginMail, loginPassword, loginInfo) {
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        emptyTheInputFields(loginMail, loginPassword);
        loginUpSuccessfully();
        setTimeout(() => {
            window.location.href = "summary.html";
        }, 2000);
    } else {
        loginInfo.innerText = wrongPasswordOrEmail();
        emptyTheInputFields(loginMail, loginPassword);
        changeColorHrAndBorderMistake();
    }
}

/**
 * Initiates the login process by validating inputs and checking credentials.
 */
async function loginAction() {
    let loginMail = document.getElementById('emaillogin');
    let loginPassword = document.getElementById('passwordlogin');
    let loginInfo = document.getElementById('incorrectentry');
    
    if (!await validateLoginEmail(loginMail, loginPassword, loginInfo)) return;

    if (loginMail.value === '' && loginPassword.value === '') {
        emptyTheInputFields(loginMail, loginPassword);
        changeColorHrAndBorderMistake();
        return;
    }

    let user = checkUserCredentials(loginMail, loginPassword);
    handleLoginResult(user, loginMail, loginPassword, loginInfo);
}

/**
 * Populates login fields with guest credentials.
 */
function guestLogin() {
    let loginMail = document.getElementById('emaillogin');
    let loginPassword = document.getElementById('passwordlogin');
    loginMail.value = "guest@web.de";
    loginPassword.value = "guest123456";
}

/**
 * Validates the email format for login and updates the login information display.
 */
function validateEmailLogin() {
    let loginMail = document.getElementById('emaillogin');
    let loginInfo = document.getElementById('validateEmail');

    if (!emailIsCorrect(loginMail.value)) {
        loginInfo.innerText = 'Please enter a valid email address!';
        return;
    }
    loginInfo.innerText = '';
}

/**
 * Validates the login password length and updates the login information display.
 */
function validatePasswordLogin() {
    let loginPassword = document.getElementById('passwordlogin');
    let loginInfo = document.getElementById('validatePassword');
    if (loginPassword.value.length <= 5) {
        loginInfo.innerHTML = passwordToShort();
        return;
    }
    loginInfo.innerText = '';
}

/**
 * Returns a message for when the password is too short.
 * @returns {string} - Password length warning message.
 */
function passwordToShort() {
    return `
    Passwords must have maximal 6 characters !!!`;
}

/**
 * Displays a success message upon successful login.
 */
function loginUpSuccessfully() {
    document.getElementById('loginupsuccessfully').innerHTML = `
    <div class="loginUpsuccessfully">
        <span class="loginstylesuccessfully" id="showTheRightTimeLogin"></span>
    </div>`;
    showTheCurrentTime();
}

/**
 * Shows a greeting message based on the current time of day.
 */
function showTheCurrentTime() {
    let currentTime = new Date().getHours();
    let greetingText = document.getElementById('showTheRightTimeLogin');

    if (currentTime < 12) {
        greetingText.innerHTML = "Good Morning !!!";
    } else if (currentTime < 18) {
        greetingText.innerHTML = "Good Afternoon !!!";
    } else {
        greetingText.innerHTML = "Good Evening !!!";
    }
}

/**
 * Changes border and line colors to red, indicating an input error.
 */
function changeColorHrAndBorderMistake() {
    document.getElementById("loginHr").style.color = "red";
    document.getElementById("inputmailsection").style.border = "3px solid red";
    document.getElementById("inputpasswordsection").style.border = "3px solid red";
}

/**
 * Changes border and line colors to green, indicating input is correct.
 */
function changeColorHrAndBorderCorrect() {
    document.getElementById("loginHr").style.color = "green";
    document.getElementById("inputmailsection").style.border = "3px solid green";
    document.getElementById("inputpasswordsection").style.border = "3px solid green";
}

/**
 * Checks if the email follows a standard email format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is correctly formatted.
 */
function emailIsCorrect(email) {
    let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailCheck.test(email);
}

/**
 * Returns an error message for incorrect email or password.
 * @returns {string} - Error message for incorrect credentials.
 */
function wrongPasswordOrEmail() {
    return `
    Please note that the password or email address are incorrect !!!`;
}

/**
 * Returns a success message for successful login.
 * @returns {string} - Success message for successful login.
 */
function loginSuccesfull() {
    return `
    logging in worked !!!`;
}

/**
 * Clears the values of the provided email and password input fields.
 * @param {HTMLElement} loginMail - The email input element.
 * @param {HTMLElement} loginPassword - The password input element.
 */
function emptyTheInputFields(loginMail, loginPassword) {
    loginMail.value = '';
    loginPassword.value = '';
}

/**
 * Redirects the user to the registration page.
 */
function redirectToRegister() {
    window.location.href = "register.html";
}

/**
 * Adjusts the display of sign-up sections based on screen width.
 */
function screenWidth() {
    let screenWidth = window.innerWidth;
    let signUpSection = document.querySelector('.signUpsection');
    let signUpSectionMobilVersion = document.querySelector('.signUpsectionmobilversion');

    if (screenWidth <= 900) {
        signUpSection.style.display = 'none';
        signUpSectionMobilVersion.style.display = 'flex';
    } else {
        signUpSection.style.display = 'block';
        signUpSectionMobilVersion.style.display = 'none';
    }
}
