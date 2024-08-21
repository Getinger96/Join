
const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];

async function loadUsers(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await response.json();
    let userAsArray = Object.keys(userJSON.contacts);
    console.log(userAsArray);
    
  
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



    if (userpassword.value.length <= 5) {
        alert("Passwords must have maximal 6 characters");
        username.value = '';
        usermail.value = '';
        userpassword.value = '';
        userconfirmpassword.value = '';
        checkbox.checked = false;
        
        return;
    }


    if (userpassword.value !== userconfirmpassword.value) {
        alert("Passwords do not match!")
        username.value = '';
        usermail.value = '';
        userpassword.value = '';
        userconfirmpassword.value = '';
        checkbox.checked = false;
        return;
    }

    if (checkbox.checked = false) {
        alert("You must accept the privacy policy to register.");
        username.value = '';
        usermail.value = '';
        userpassword.value = '';
        userconfirmpassword.value = '';
        checkbox.checked = false;
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

