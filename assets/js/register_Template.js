

/**
 * The function returns a warning message indicating that the password must have a maximum of 6 characters

 */
function passwordToShort() {
  return `
    Passwords must have maximal 6 characters !!!`;
}

/**
 * The function returns a warning message indicating that the two password fields do not match
 */
function passwordNoMatch() {
  return `
    Passwords do not match! !!!`;
}

/**
 * The function returns a warning message indicating that the user must accept the privacy policy to register
 */
function checkboxNoChecked() {
  return `
    You must accept the privacy policy to register !!!`;
}

/**
 * The function displays a success message indicating that the user has signed up successfully
 */
function showSignedUpSuccessfully() {
  document.getElementById(
    "Signedupsuccessfully").innerHTML = `  <div class="Signedupsuccessfully">
    <span class="textstylesuccessfully"> You Signed Up successfully</span>
    <img class="" src="assets/IMG/You Signed Up successfully.png" alt="">   
    </div>`;
}

/**
 * The function returns a warning message indicating that the email address provided is already in use
 */
function emailIsAlreadyAvailable() {
  return `Attention, the email already exists!!!`;
}
/**
 * The function returns a warning message indicating that a valid email address must be provided
 */
function wrongEmailValidation() {
  return `
    Attention, a correct email address must be provided !!!`;
}

/**
 * The function returns a warning message indicating that the user must enter a full name between 3 and 30 letters
 */
function wrongTextValidation() {
  return `              
      Please enter a full name of 3-30 letters`;
}

/**
 * The function sets the visibility image for the password field to "off" state.
 */
function passwordvisbility() {
  document.getElementById("visbilityimg").src =
    "assets/IMG/visibility_off_password.png";
}

/**
 * The function sets the visibility image for the confirm password field to "off" state.
 */
function passwordconfirmvisbility() {
    document.getElementById("visbilityimgconfirm").src =
      "assets/IMG/visibility_off_password.png";
  }