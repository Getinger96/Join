
async function loadUsers(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.values(userJSON.contacts);
    
    for (let index = 0; index < userAsArray.length; index++) {
        let user = userAsArray[index];
        let newUser = Object.keys(user)
        let contact = userAsArray[index][newUser]


        contacts.push({
            email: contact.email,
            name: contact.name,
            password: contact.password,
        })
      

}
}

async function loginAction() {
    let loginMail = document.getElementById('emaillogin');
    let loginPassword = document.getElementById('passwordlogin');
    let loginInfo = document.getElementById('incorrectentry');
  


    if (!emailIsCorrect(loginMail.value)) {
        loginInfo.innerText = 'Please enter a valid email address!';
        emptyTheInputFields(loginMail,loginPassword);
        changeColorHrAndBorderMistake();
        return; // Beende die Funktion, wenn die E-Mail-Adresse ungültig ist
    }


    let user = contacts.find(u => u.email === loginMail.value && u.password === loginPassword.value);



    if (loginMail.value === '' && loginPassword.value === '') {
        emptyTheInputFields(loginMail,loginPassword);
        changeColorHrAndBorderMistake();
    }


    if(user) {
        loginInfo.innerText = loginSuccesfull();
        emptyTheInputFields(loginMail,loginPassword);
        changeColorHrAndBorderCorrect();

    } else {
        loginInfo.innerText = wrongPasswordOrEmail();
        emptyTheInputFields(loginMail,loginPassword);
        changeColorHrAndBorderMistake();
        
    }
}


//function screenLogo() {

//document.getElementById("logoscreen").classList.add("loginlogo");
    
  //document.getElementById("logoscreensection").classList.add("logoscreennone");
  //document.getElementById("myopacity").style.opacity = "1";




function changeColorHrAndBorderMistake() {

    document.getElementById("loginHr").style.color = "red";
    document.getElementById("inputmailsection").style.border= "3px solid red";
    document.getElementById("inputpasswordsection").style.border= "3px solid red";

}

function changeColorHrAndBorderCorrect() {
    document.getElementById("loginHr").style.color = "green";
    document.getElementById("inputmailsection").style.border= "3px solid green";
    document.getElementById("inputpasswordsection").style.border= "3px solid green";

}


function emailIsCorrect(email) {
    let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailCheck.test(email); 
}



function wrongPasswordOrEmail() {
return `
Please note that the password or email address are incorrect !!!`;

}


function loginSuccesfull() {
    return `
    logging in worked !!!`;

}

function  emptyTheInputFields(loginMail,loginPassword) {

    loginMail.value ='';
    loginPassword.value ='';
}


function redirectToRegister() {
    window.location.href = "register.html";
}


function screenWidth() {

   let screenWidth = window.innerWidth;
   let signUpSection = document.querySelector('.signUpsection');
   let signUpSectionMobilVersion = document.querySelector('.signUpsectionmobilversion');


    if (screenWidth <= 900 ) {
        signUpSection.style.display = 'none';
        signUpSectionMobilVersion.style.display = 'flex';

    } else {
         signUpSection.style.display = 'block';
        signUpSectionMobilVersion.style.display = 'none';
        
    }

}
