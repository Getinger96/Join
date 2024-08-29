
const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];


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


async function postData(path="", data={}) {
    let response = await fetch(base_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return responsASJson = await response.json();
    
}

async function  checkRegistration() {
    let username = document.getElementById('username');
    let usermail = document.getElementById('usermail');
    let userpassword = document.getElementById('userpassword');
    let userconfirmpassword = document.getElementById('userconfirmpassword');
    let checkbox = document.getElementById('checkbox');
    let sigUpInfo = document.getElementById('signupinfotext');


    let user = contacts.find(u => u.email === usermail.value);


    if (user) {
        sigUpInfo.innerHTML = emailIsAlreadyAvailable();
        emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
        ButtonDisabledSet();
        return;
    }



    if (userpassword.value.length <= 5) {
        sigUpInfo.innerHTML = passwordToShort();
        emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
        ButtonDisabledSet();
        return;
    }


    if (userpassword.value !== userconfirmpassword.value) {
        sigUpInfo.innerHTML = passwordNoMatch();
        emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
        ButtonDisabledSet();
        return;
    }

    if (!checkbox.checked) {
        sigUpInfo.innerHTML = checkboxNoChecked();
        emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
        ButtonDisabledSet();
        return;
    }

    addNewUser(username, usermail, userpassword, userconfirmpassword, checkbox)
}
   async function addNewUser(username, usermail, userpassword, userconfirmpassword, checkbox) {
    
    let newContact  = {
        name: username.value,
        email: usermail.value,
        password: userpassword.value
    };


    await postData(`contacts`, newContact)



    emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);

    showSignedUpSuccessfully();

    setTimeout(() => {window.location.href ='login.html'
        
    }, 3000);


    await loadUsers('users');
  
}


function ButtonDisabledSet() {
    let signUpButton = document.getElementById('signUpButton');
    signUpButton.classList.remove('enabledbutton');
    signUpButton.classList.add('disabledbutton');

}



function checkFormCompletion() {
    let username = document.getElementById('username').value.trim();
    let usermail = document.getElementById('usermail').value.trim();
    let userpassword = document.getElementById('userpassword').value.trim();
    let userconfirmpassword = document.getElementById('userconfirmpassword').value.trim();
    let checkbox = document.getElementById('checkbox').checked;
    let signUpButton = document.getElementById('signUpButton');

    // Die Bedingung ist jetzt korrigiert, um den Button korrekt zu aktivieren/deaktivieren
    if (username !== "" && usermail !== "" && userpassword !== "" && userconfirmpassword !== "" && checkbox) {
        signUpButton.disabled = false; // Button aktivieren
        signUpButton.classList.remove('disabledbutton');
        signUpButton.classList.add('enabledbutton');
    } else {
        signUpButton.disabled = true; // Button deaktivieren
        signUpButton.classList.remove('enabledbutton');
        signUpButton.classList.add('disabledbutton');
    }
}

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


function showVisbility() {
    let userpassword = document.getElementById('userpassword');
    let visibilityImg = document.getElementById('visbilityimg');
    
    if (userpassword.type === "password") {
        userpassword.type = "text"
        visibilityImg.src = "assets/IMG/visibility_on.png"; 
    } else {
        userpassword.type = "password"
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