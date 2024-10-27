const colorLetter = {
    'A': 'red',
    'B': 'blue',
    'C': 'blue',
    'D': 'red',
    'E': 'red',
    'F': 'red',
    'G': 'green',
    'H': 'yellow',
    'I': 'orange',
    'J': 'violet',
    'K': 'blue',
    'L': 'blue',
    'M': 'green',
    'N': 'yellow',
    'O': 'orange',
    'P': 'violet',
    'Q': 'green',
    'R': 'yellow',
    'S': 'orange',
    'T': 'violet',
    'U': 'green',
    'V': 'yellow',
    'W': 'orange',
    'X': 'violet',
    'Y': 'green',
    'Z': 'yellow'
};

logOutVisibleBoolean = false;


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


function showLogOutSection() {
    let toggleLogout = document.getElementById('logoutId');
    if (logOutVisibleBoolean) {
        toggleLogout.innerHTML = '';
    } else {

        toggleLogout.innerHTML = toggleLogoutHtml();
    }
    logOutVisibleBoolean = !logOutVisibleBoolean;
}



function toggleLogoutHtml() {
    return`<div class="logoutSection">
            <a class="logoutsectionlinkHelp d_none" href="help.html"> Help </a>
            <a class="logoutsectionlink" href="legal_notes.html"> Legal Notice </a>
            <a class="logoutsectionlink" href="privacy_policy.html"> Privacy Policy</a>
            <a  class="logoutsectionlinklogouttext"  href="login.html"> Log out </a>W
         </div>
                        `;
}

document.addEventListener('click', function(event) {
    let toggleLogout = document.getElementById('logoutId');
    let loginUser = document.querySelector('.logInUser_Container');

    if (!loginUser.contains(event.target) && !toggleLogout.contains(event.target)) {
        toggleLogout.innerHTML = '';
        logOutVisibleBoolean = false;
    }
});


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
    let currentColor = colorLetter[firstName];
    userSign.style.color = currentColor;
}


function checkIfLoggedIn() {
    let loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        loggedInUser = JSON.parse(loggedInUser);
       
        showTheNameInitial(loggedInUser);
    } else {
        return;
    }
}


function goToSummary() {
    window.location.href = 'summary.html';
}

function goToLogin() {
    window.location.href = 'login.html';
    localStorage.clear();
}
