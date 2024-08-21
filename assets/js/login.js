
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

    // Stelle sicher, dass users ein Array ist
    let user = contacts.find(u => u.email === loginMail.value && u.password === loginPassword.value);

    if(user) {
        alert("Login successful: " + contacts.name);
        // Weiterleitung oder weitere Aktionen bei erfolgreichem Login
    } else {
        console.log("Login failed: No matching user found.");
        alert("Incorrect email or password!");
    }
}


function screenLogo() {

    setTimeout(() => {
       document.getElementById("logoscreen").classList.add("loginlogo");
   }, 1500);

    
  document.getElementById("logoscreensection").classList.add("logoscreennone");
}