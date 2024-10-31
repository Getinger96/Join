/**
 * The function checks if a user already exists with the provided email.
 * @param {Object} user - The user object.
 * @param {HTMLElement} sigUpInfo - Element to display signup information.
 */
function sigUpValidationUser(user, sigUpInfo) {
    if (user) {
      sigUpInfo.innerHTML = emailIsAlreadyAvailable();
      ButtonDisabledSet();
    return false;
  }
  return true;
}
  
  /**
   * The function validates if the username meets length and format requirements.
   * @param {HTMLElement} username - The username input element.
   * @param {HTMLElement} sigUpInfo - Element to display signup information.
   */
  function sigUpValidationnameIsNotValid(username, sigUpInfo) {
    if (!nameIsNotValid(username.value) ||username.value.length < 3 ||username.value.length > 30) {
      sigUpInfo.innerHTML = wrongTextValidation();
      ButtonDisabledSet();
      return false;
    }
    return true;
  }
  
  
  /**
   * The function validates if the email format is correct.
   * @param {HTMLElement} usermail - The email input element.
   * @param {HTMLElement} sigUpInfo - Element to display signup information.
   */
  function sigUpValidationEmailIsNotCorrect(usermail, sigUpInfo) {
    if (!emailIsNotCorrect(usermail.value)) {
      sigUpInfo.innerHTML = wrongEmailValidation();
      ButtonDisabledSet();
      return false;
    }
    return true;
  }
  
  /**
   * The function checks if the password length meets the minimum requirement.
   * @param {HTMLElement} userpassword - The password input element.
   * @param {HTMLElement} sigUpInfo - Element to display signup information.
   */
  function sigUpValidationUserPasswordLength(userpassword, sigUpInfo) {
    if (userpassword.value.length <= 5) {
      sigUpInfo.innerHTML = passwordToShort();
      ButtonDisabledSet();
      return false;
    }
    return true;
  }
  
  /**
   * The function validates if the password and confirmation password match.
   * @param {HTMLElement} userpassword - The password input element.
   * @param {HTMLElement} userconfirmpassword - The confirm password input element.
   * @param {HTMLElement} sigUpInfo - Element to display signup information.
   */
  function sigUpValidationUserPasswordAndConfirmPassword(userpassword,userconfirmpassword,sigUpInfo) {
    if (userpassword.value !== userconfirmpassword.value) {
      sigUpInfo.innerHTML = passwordNoMatch();
      ButtonDisabledSet();
      return false;
    }
    return true;
  }
  
  /**
   * The function checks if the checkbox is checked to confirm user agreement.
   * @param {HTMLElement} checkbox - The checkbox input element.
   * @param {HTMLElement} sigUpInfo - Element to display signup information.
   */
  function sigUpValidationCheckbox(checkbox, sigUpInfo) {
    if (!checkbox.checked) {
      sigUpInfo.innerHTML = checkboxNoChecked();
      ButtonDisabledSet();
      return false;
    }
    return true;
  }
  /**
   * The function validates all fields in the signup form and checks if all conditions are met.
   * @param {Object} user - The user object.
   * @param {HTMLElement} username - The username input element.
   * @param {HTMLElement} usermail - The email input element.
   * @param {HTMLElement} userpassword - The password input element.
   * @param {HTMLElement} userconfirmpassword - The confirm password input element.
   * @param {HTMLElement} checkbox - The checkbox input element.
   */
  function sigUpValidation(user, username, usermail, userpassword,userconfirmpassword,checkbox) {
    let sigUpInfo = document.getElementById("signupinfotext");
  
    if (!sigUpValidationUser(user, sigUpInfo)) return false;
    if (!sigUpValidationnameIsNotValid(username, sigUpInfo)) return false;
    if (!sigUpValidationEmailIsNotCorrect(usermail, sigUpInfo)) return false;
    if (!sigUpValidationUserPasswordLength(userpassword, sigUpInfo)) return false;
    if (
      !sigUpValidationUserPasswordAndConfirmPassword(
        userpassword,
        userconfirmpassword,
        sigUpInfo
      )
    )
      return false;
    if (!sigUpValidationCheckbox(checkbox, sigUpInfo)) return false;
  
    return true;
  }
  