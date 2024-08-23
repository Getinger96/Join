
async function loadUsers(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.keys(userJSON.contacts);
    console.log(userAsArray);
    screenLogo();
  
    Object.keys(userJSON.contacts).forEach(key => {
        let contactGroup = userJSON.contacts[key];

        // Überprüfe, ob die Kontaktgruppe verschachtelte Kontakte enthält
        if (!contactGroup.email ) {
            // Es ist ein verschachteltes Objekt, durchlaufe alle verschachtelten Kontakte
            Object.keys(contactGroup).forEach(subKey => {
                contacts.push(contactGroup[subKey]);
            });
        } else {
            // Es ist ein einfacher Kontakt
            contacts.push(contactGroup);
        }
    });
    console.log(contacts);
}

async function loginAction() {
    let loginMail = document.getElementById('emaillogin');
    let loginPassword = document.getElementById('passwordlogin');
    let loginInfo = document.getElementById('incorrectentry');

    // Stelle sicher, dass users ein Array ist
    let user = contacts.find(u => u.email === loginMail.value && u.password === loginPassword.value);

    if(user) {
        loginInfo.innerText = loginSuccesfull();
        emptyTheInputFields(loginMail,loginPassword);

    } else {
        loginInfo.innerText = wrongPasswordOrEmail();
        emptyTheInputFields(loginMail,loginPassword);
        
    }
}


function screenLogo() {

document.getElementById("logoscreen").classList.add("loginlogo");
    
  document.getElementById("logoscreensection").classList.add("logoscreennone");
  document.getElementById("myopacity").style.opacity = "1";


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
