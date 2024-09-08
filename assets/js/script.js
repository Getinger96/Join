



async function includeHTML() {
    checkIfLoggedIn();
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
};


async function init() {
    
    fetchContacts();
    
    includeHTML();
   
}


logOutVisibleBoolean = false;


function showLogOutSection() {

let toggleLogout = document.getElementById('logoutId');


if (logOutVisibleBoolean) {
    toggleLogout.innerHTML ='';

} else {
    toggleLogout.innerHTML = `<div class="logoutSection">

    <a class="logoutsectionlink" href="legal_notes.html"> Legal Notice </a>
    <a class="logoutsectionlink" href="privacy_policy.html"> Privacy Policy</a>
    <a class="logoutsectionlinklogouttext"  href="login.html"> Log out </a>

</div>
`;
}

logOutVisibleBoolean =!logOutVisibleBoolean;

}


async function showTheNameInitial(loggedInUser) {
    console.log(loggedInUser);
    

   let userSign = document.getElementById('loginUserId');

   let fullName = loggedInUser.name; 

   let nameParts = fullName.split(" ");

   if (nameParts.length >= 2) {
    let firstName = nameParts[0].charAt(0).toUpperCase();  
    let lastName = nameParts[1].charAt(0).toUpperCase();
    userSign.innerHTML = `${firstName} ${lastName}`;
    
   } else {
    let firstName = nameParts[0].charAt(0).toUpperCase();  
    userSign.innerHTML = `${firstName}`;
   }

    
}


async function checkIfLoggedIn() {
    let loggedInUser = localStorage.getItem('loggedInUser'); 
    if (loggedInUser) {
        loggedInUser = JSON.parse(loggedInUser); 
        console.log(loggedInUser);
      await  showTheNameInitial(loggedInUser);
     
      
    } else {
        console.log('Kein Benutzer ist eingeloggt');
    }
}


