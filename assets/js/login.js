
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
        return; 
    }


    let user = contacts.find(u => u.email === loginMail.value && u.password === loginPassword.value);



    if (loginMail.value === '' && loginPassword.value === '') {
        emptyTheInputFields(loginMail,loginPassword);
        changeColorHrAndBorderMistake();
    }


    if(user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user)); 
        emptyTheInputFields(loginMail,loginPassword);

        loginUpSuccessfully();
       

        setTimeout(() => { window.location.href = "summary.html";
            
        }, 2000);

        
    } else {
        loginInfo.innerText = wrongPasswordOrEmail();
        emptyTheInputFields(loginMail,loginPassword);
        changeColorHrAndBorderMistake();
    }

}


function guestLogin() {
    let loginMail = document.getElementById('emaillogin');
    let loginPassword = document.getElementById('passwordlogin');
    
    loginMail.value = "guest@web.de";  
    loginPassword.value = "guest123456";  


}

function validateEmailLogin() {
    let loginMail = document.getElementById('emaillogin');

    let loginInfo = document.getElementById('validateEmail');


    if (!emailIsCorrect(loginMail.value)) {
        loginInfo.innerText = 'Please enter a valid email address!';
        return; 
    }

    loginInfo.innerText ='';
}



function validatePasswordLogin() {
    let loginPassword = document.getElementById('passwordlogin');

    let loginInfo = document.getElementById('validatePassword');

    if (loginPassword.value.length <= 5) {
        loginInfo.innerHTML = passwordToShort();
    
        return ;
    }

    loginInfo.innerText ='';
}


function passwordToShort() {
    return `
    Passwords must have maximal 6 characters !!!`;
    
    }

function loginUpSuccessfully() {
    document.getElementById('loginupsuccessfully').innerHTML =`  <div class="loginUpsuccessfully">
    <span class="loginstylesuccessfully" id="showTheRightTimeLogin"></span>

    </div>`;

    showTheCurrentTime();
}


function  showTheCurrentTime(){


    let currentTime = new Date().getHours();
    let greetingText = document.getElementById('showTheRightTimeLogin');
    
    if (currentTime < 12) {
      greetingText.innerHTML = "Good Morning !!!"; 
      
    } else if (currentTime < 18) {
        greetingText.innerHTML = "Good Afternoon !!!"; 
      console.log(greetingText);
    } else {
        greetingText.innerHTML = "Good Evening !!!"; 
    
    }
    
    }


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
