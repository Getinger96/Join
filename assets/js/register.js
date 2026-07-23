const base_URL =
  "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];

/**
 * Loads user data from Firebase database.
 * @param {string} [path=''] - The path to fetch user data from.
 */
async function loadUsers(path = "") {
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
 * Posts data to the Firebase database.
 * @param {string} [path=""] - The path to post data to.
 * @param {Object} data - The data object to post.
 */
async function postData(path = "", data = {}) {
  let response = await fetch(base_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return (responsASJson = await response.json());
}
/**
 * The function checks the registration form fields for validity and initiates user addition if valid.
 */
async function checkRegistration() {
  if (validateRegistrationInputs()) {
    await processRegistration();
  }
}


/**
* The function validates the user inputs 
*/
function validateRegistrationInputs() {
  let username = document.getElementById("username");
  let usermail = document.getElementById("usermail");
  let userpassword = document.getElementById("userpassword");
  let userconfirmpassword = document.getElementById("userconfirmpassword");
  let checkbox = document.getElementById("checkbox");
  let sigUpInfo = document.getElementById("signupinfotext");
  let user = contacts.find((u) => u.email === usermail.value);

  if (!sigUpValidation(user, username, usermail, userpassword, userconfirmpassword, checkbox)) {
    return false;
  }

  sigUpInfo.innerHTML = "";
  return true;
}

/**
 * The function initiates user registration if validation is successful.
 */
async function processRegistration() {
  let username = document.getElementById("username");
  let usermail = document.getElementById("usermail");
  let userpassword = document.getElementById("userpassword");
  let userconfirmpassword = document.getElementById("userconfirmpassword");
  let checkbox = document.getElementById("checkbox");

  if (validateRegistrationInputs()) {
    await addNewUser(username, usermail, userpassword, userconfirmpassword, checkbox);
  }
}

/**
 * The function handles the user registration process by creating a new user
 * @param {HTMLElement} username - The username input element.
 * @param {HTMLElement} usermail - The email input element.
 * @param {HTMLElement} userpassword - The password input element.
 * @param {HTMLElement} userconfirmpassword - The confirm password input element.
 * @param {HTMLElement} checkbox - The checkbox input element.
 */
async function addNewUser(username, usermail, userpassword, userconfirmpassword, checkbox) {
  await createUser(username, usermail, userpassword);
  postRegistrationActions(username, usermail, userpassword, userconfirmpassword, checkbox);
}


/**
 * The function creates a new user object
 * @param {HTMLElement} username - The username input element.
 * @param {HTMLElement} usermail - The email input element.
 * @param {HTMLElement} userpassword - The password input element.
 */
async function createUser(username, usermail, userpassword) {
  let newContact = {
    name: username.value,
    email: usermail.value,
    password: userpassword.value,
  };
  await postData(`contacts`, newContact);
}

/**
 * The function handles post-registration actions
 * @param {HTMLElement} username - The username input element.
 * @param {HTMLElement} usermail - The email input element.
 * @param {HTMLElement} userpassword - The password input element.
 * @param {HTMLElement} userconfirmpassword - The confirm password input element.
 * @param {HTMLElement} checkbox - The checkbox input element.
 */
function postRegistrationActions(username, usermail, userpassword, userconfirmpassword, checkbox) {
  emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
  showSignedUpSuccessfully();
  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
}

/**
 * Disables the sign-up button
 */
function ButtonDisabledSet() {
  let signUpButton = document.getElementById("signUpButton");
  signUpButton.classList.remove("enabledbutton");
  signUpButton.classList.add("disabledbutton");
}

/**
 * Checks if form fields are completed to enable or disable the sign-up button
 */
function checkFormCompletion() {
  let username = document.getElementById("username").value.trim();
  let usermail = document.getElementById("usermail").value.trim();
  let userpassword = document.getElementById("userpassword").value.trim();
  let userconfirmpassword = document
    .getElementById("userconfirmpassword").value.trim();
  let checkbox = document.getElementById("checkbox").checked;
  let signUpButton = document.getElementById("signUpButton");
  if (
    username !== "" &&
    usermail !== "" &&
    userpassword !== "" &&
    userconfirmpassword !== "" &&
    checkbox
  ) {
    signUpButton.disabled = false;
    signUpButton.classList.remove("disabledbutton");
    signUpButton.classList.add("enabledbutton");
  } else {
    signUpButton.disabled = true;
    signUpButton.classList.remove("enabledbutton");
    signUpButton.classList.add("disabledbutton");
  }
}

/**
 * Empties the input fields and resets the checkbox
 * @param {HTMLElement} username - The username input element.
 * @param {HTMLElement} usermail - The email input element.
 * @param {HTMLElement} userpassword - The password input element.
 * @param {HTMLElement} userconfirmpassword - The confirm password input element.
 * @param {HTMLElement} checkbox - The checkbox input element.
 */
function emptyTheInputFields(
  username,
  usermail,
  userpassword,
  userconfirmpassword,
  checkbox
) {
  username.value = "";
  usermail.value = "";
  userpassword.value = "";
  userconfirmpassword.value = "";
  checkbox.checked = false;
}

/**
 * Toggles the visibility of the password field.
 */
function showVisbility() {
  let userpassword = document.getElementById("userpassword");
  let visibilityImg = document.getElementById("visbilityimg");

  if (userpassword.type === "password") {
    userpassword.type = "text";
    visibilityImg.src = "assets/IMG/visibility_on.png";
  } else {
    userpassword.type = "password";
    visibilityImg.src = "assets/IMG/visibility_off_password.png";
  }
}

/**
 * Toggles the visibility of the password field.
 */
function showVisbilityconfirmpassword() {
  let userpassword = document.getElementById("userconfirmpassword");
  let visibilityImg = document.getElementById("visbilityimgconfirm");

  if (userpassword.type === "password") {
    userpassword.type = "text";
    visibilityImg.src = "assets/IMG/visibility_on.png";
  } else {
    userpassword.type = "password";
    visibilityImg.src = "assets/IMG/visibility_off_password.png";
  }
}

/**
 * Validates the username based on length and regex match.
 */
function validateUsername() {
  let username = document.getElementById("username").value.trim();
  let mistakeField = document.getElementById("inputNameMistake");
  let isValid = nameIsNotValid(username) && username.length >= 3 && username.length <= 30;

  if (!isValid) {
    mistakeField.innerText = wrongTextValidation();
    mistakeField.style.display = "flex";
  } else {
    mistakeField.innerText = "";
    document.getElementById("inputenamesectionId").style.border = "";
    mistakeField.style.display = "none";
  }
  checkFormCompletion();
}

/**
 * Validates the email format.
 */
/**
 * Validates the username based on length and regex match.
 */
function validateUsername() {
  let username = document.getElementById("username").value.trim();
  let mistakeField = document.getElementById("inputNameMistake");
  let isValid =
    nameIsNotValid(username) && username.length >= 3 && username.length <= 30;

  if (!isValid) {
    mistakeField.innerText = wrongTextValidation();
    mistakeField.style.display = "flex";
  } else {
    mistakeField.innerText = "";
    document.getElementById("inputenamesectionId").style.border = "";
    mistakeField.style.display = "none";
  }
  checkFormCompletion();
}

/**
 * Validates the email format.
 */
function validateEmail() {
  let usermail = document.getElementById("usermail").value.trim();
  let mistakeField = document.getElementById("inputEmailMistake");

  if (!emailIsNotCorrect(usermail)) {
    mistakeField.innerText = wrongEmailValidation();
    mistakeField.style.display = "flex";
  } else {
    mistakeField.innerText = "";
    document.getElementById("inputemailsectionId").style.border = "";
    mistakeField.style.display = "none";
  }
  checkFormCompletion();
}

/**
 * Validates the password based on minimum length.
 */
function validatePassword() {
  let userpassword = document.getElementById("userpassword").value.trim();
  let mistakeField = document.getElementById("inputPasswordMistake");

  if (userpassword.length <= 5) {
    mistakeField.innerText = passwordToShort();
    mistakeField.style.display = "flex";
  } else {
    mistakeField.innerText = "";
    document.getElementById("inputpasswordsectionId").style.border = "";
    mistakeField.style.display = "none";
  }
  checkFormCompletion();
}

/**
 * Validates the password confirmation matches the original password.
 */
function validateConfirmPassword() {
  let userpassword = document.getElementById("userpassword").value.trim();
  let userconfirmpassword = document
    .getElementById("userconfirmpassword")
    .value.trim();
  let mistakeField = document.getElementById("inputConfirmPasswordMistake");

  if (userpassword !== userconfirmpassword || userconfirmpassword === "") {
    mistakeField.innerText = passwordNoMatch();
    mistakeField.style.display = "flex";
    
  } else {
    mistakeField.innerText = "";
    document.getElementById("inputpasswordconfirmsectionId").style.border = "";
    mistakeField.style.display = "none";
  }
  checkFormCompletion();
}

/**
 * The function redirects the user to the login page.
 */
function goBackToLogin() {
  window.location.href = "login.html";
}


/**
 * The function validates if the username follows a specific format 
 * @param {string} username - The username to validate.
 */
function nameIsNotValid(username) {
  const nameCheck = /^[A-Za-zäöüÄÖÜß]+\s[A-Za-zäöüÄÖÜß]+$/;
  return nameCheck.test(username);
}

/**
 * The function checks if the provided email follows a valid email format.
 * @param {string} usermail - The email to validate.
 */
function emailIsNotCorrect(usermail) {
  let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailCheck.test(usermail);
}
