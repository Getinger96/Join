
const base_URL = "https://join-login-3f057-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];

async function loadUsers(path = '') {
    let response = await fetch(base_URL + path + ".json");
    let userJSON = await  response.json();
    users = userJSON; 
    console.log(users);
    
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
    let username = document.getElementById('username').value;
    let usermail = document.getElementById('usermail').value;
    let userpassword = document.getElementById('userpassword').value;
    let userconfirmpassword = document.getElementById('userconfirmpassword').value;
    let checkbox = document.getElementById('checkbox').checked;



    if (userpassword.length <= 5) {
        alert("Passwords must have maximal 6 characters");
        username.value = '';
        usermail.value = '';
        userpassword.value = '';
        userconfirmpassword.value = '';
        checkbox.checked = false;
        
        return;
    }


    if (userpassword !== userconfirmpassword) {
        alert("Passwords do not match!")
        return;
    }

    if (!checkbox) {
        alert("You must accept the privacy policy to register.");
        return;
    }


    let newUser = {
        name: username,
        email: usermail,
        password: userpassword
    };


    await postData("users", newUser)
    console.log(responsASJson);
    await loadUsers('users');

}