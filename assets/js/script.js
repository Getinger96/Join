let colorLetter = [
    { letter: 'A', color: 'red' },     // A -> Red
    { letter: 'B', color: 'blue' },    // B -> Blue
    { letter: 'C', color: 'blue' },    // C -> Blue
    { letter: 'D', color: 'red' },     // D -> Red
    { letter: 'E', color: 'red' },     // E -> Red
    { letter: 'F', color: 'red' },     // F -> Red
    { letter: 'G', color: 'green' },   // G -> Green
    { letter: 'H', color: 'yellow' },  // H -> Yellow
    { letter: 'I', color: 'orange' },  // I -> Orange
    { letter: 'J', color: 'violet' },  // J -> Violet
    { letter: 'K', color: 'blue' },    // K -> Blue
    { letter: 'L', color: 'blue' },    // L -> Blue
    { letter: 'M', color: 'green' },   // M -> Green
    { letter: 'N', color: 'yellow' },  // N -> Yellow
    { letter: 'O', color: 'orange' },  // O -> Orange
    { letter: 'P', color: 'violet' },  // P -> Violet
    { letter: 'Q', color: 'green' },   // Q -> Green
    { letter: 'R', color: 'yellow' },  // R -> Yellow
    { letter: 'S', color: 'orange' },  // S -> Orange
    { letter: 'T', color: 'violet' },  // T -> Violet
    { letter: 'U', color: 'green' },   // U -> Green
    { letter: 'V', color: 'yellow' },  // V -> Yellow
    { letter: 'W', color: 'orange' },  // W -> Orange
    { letter: 'X', color: 'violet' },  // X -> Violet
    { letter: 'Y', color: 'green' },   // Y -> Green
    { letter: 'Z', color: 'yellow' }   // Z -> Yellow
];


async function includeHTML() {
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
            return
        }
    }
    setActiveLink();
};


async function init() {


    fetchContacts();
    includeHTML();
    checkIfLoggedIn();
    fetchTasks();
   


}


logOutVisibleBoolean = false;


function showLogOutSection() {

    let toggleLogout = document.getElementById('logoutId');



    if (logOutVisibleBoolean) {
        toggleLogout.innerHTML = '';

    } else {



        toggleLogout.innerHTML = `<div class="logoutSection">
            <a class="logoutsectionlinkHelp d_none" href="help.html"> Help </a>
            <a class="logoutsectionlink" href="legal_notes.html"> Legal Notice </a>
            <a class="logoutsectionlink" href="privacy_policy.html"> Privacy Policy</a>
            <a  class="logoutsectionlinklogouttext"  href="login.html"> Log out </a>
        
         </div>
                        `;


    }



    logOutVisibleBoolean = !logOutVisibleBoolean;


}



async function showTheNameInitial(loggedInUser) {


    let userSign = document.getElementById('loginUserId');

    let fullName = loggedInUser.name;

    let nameParts = fullName.split(" ");

    let firstName;

    if (nameParts.length >= 2) {
        firstName = nameParts[0].charAt(0).toUpperCase();
        let lastName = nameParts[1].charAt(0).toUpperCase();
        userSign.innerHTML = `${firstName} ${lastName} `;


    } else {
        firstName = nameParts[0].charAt(0).toUpperCase();
        userSign.innerHTML = `${firstName} `;
    }

    showTheNameInitialInColor(firstName);
}

function showTheNameInitialInColor(firstName) {

    let userSign = document.getElementById('loginUserId');
    colorLetter.forEach(colorLetterItem => {



        if (firstName === colorLetterItem.letter) {
            let currentColor = colorLetterItem.color;
            userSign.style.color = currentColor;
        }
    });
}


function checkIfLoggedIn() {
    let loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        loggedInUser = JSON.parse(loggedInUser);
       
        showTheNameInitial(loggedInUser);


    } else {
        console.log('Kein Benutzer ist eingeloggt');
    }
}


function goToSummary() {
    window.location.href = 'summary.html';
}

function goToLogin() {
    window.location.href = 'login.html';
    localStorage.clear();
}
