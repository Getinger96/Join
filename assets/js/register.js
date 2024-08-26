
const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];


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

async function  addnewUser() {
    let username = document.getElementById('username');
    let usermail = document.getElementById('usermail');
    let userpassword = document.getElementById('userpassword');
    let userconfirmpassword = document.getElementById('userconfirmpassword');
    let checkbox = document.getElementById('checkbox');
    let sigUpInfo = document.getElementById('signupinfotext');



    if (userpassword.value.length <= 5) {
        sigUpInfo.innerHTML = passwordToShort();
        emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
        return;
    }


    if (userpassword.value !== userconfirmpassword.value) {
        sigUpInfo.innerHTML = passwordNoMatch();
        emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
        return;
    }

    if (checkbox.checked = false) {
        sigUpInfo.innerHTML = checkboxNoChecked();
        emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);
        return;
    }




    
    let contactCurrentNumber = contacts.length +1;
    let contactKey = `contact_${contactCurrentNumber}`;

  
    let newContact  = {
        name: username.value,
        email: usermail.value,
        password: userpassword.value
    };


    await postData(`contacts/${contactKey}`, newContact)



    emptyTheInputFields(username, usermail, userpassword, userconfirmpassword, checkbox);


    await loadUsers('users');
  
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