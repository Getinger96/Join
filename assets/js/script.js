
let colorLetter = {
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

/**
 * Includes HTML files specified in elements with the attribute `w3-include-html`.
 *
 */
async function includeHTML() {
    let z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return
        }
    }
    setActiveLink();
};

/**
 * Initializes the application by fetching contacts, including HTML, and checking login status.
 */
async function init() {
    fetchContacts();
    includeHTML();
    checkIfLoggedIn();
    fetchTasks();
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        let initials = loggedInUser.name.split(' ').map(n => n[0].toUpperCase()).join('');
        let headerBadge = document.getElementById('loginUserId');
        if (loggedInUser.photo) {
            headerBadge.innerHTML = `<img src="${loggedInUser.photo}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        } else {
            headerBadge.textContent = initials;
        }
    }
}

/**
 * Toggles the visibility of the logout section in the UI.
 */
function showLogOutSection() {
    let toggleLogout = document.getElementById('logoutId');
    if (logOutVisibleBoolean) {
        toggleLogout.innerHTML = '';
    } else {

        toggleLogout.innerHTML = toggleLogoutHtml();
    }
    logOutVisibleBoolean = !logOutVisibleBoolean;
}


/**
 * Hides the logout section if the click is outside of it.
 */
document.addEventListener('click', function (event) {
    let toggleLogout = document.getElementById('logoutId');
    let loginUser = document.querySelector('.logInUser_Container');

    if (!loginUser.contains(event.target) && !toggleLogout.contains(event.target)) {
        toggleLogout.innerHTML = '';
        logOutVisibleBoolean = false;
    }
});

/**
 * Displays the initials of the logged-in user.
 * @param {Object} loggedInUser - The logged-in user object containing user details.
 */
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

/**
 * Sets the color of the user's initials based on the first letter of their name.
 * @param {string} firstName - The first letter of the user's first name.
 */
function showTheNameInitialInColor(firstName) {
    let userSign = document.getElementById('loginUserId');
    let currentColor = colorLetter[firstName];
    userSign.style.color = currentColor;
}
/**
 * Checks if a user is logged in and displays their initials.
 */
function checkIfLoggedIn() {
    let loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        loggedInUser = JSON.parse(loggedInUser);

        showTheNameInitial(loggedInUser);
    } else {
        return;
    }
}

function htmlacountForm() {
    let loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        loggedInUser = JSON.parse(loggedInUser);
    } else {
        return;
    }

    let userIndex = contactsArray.findIndex(c => c.email === loggedInUser.email);

    document.querySelector('.addcontactheadline').textContent = 'My account';
    document.querySelector('.addcontactsecondline').style.display = 'none';

    // Badge anzeigen + Initialen setzen
    document.getElementById('accountBadgeSide').style.display = 'flex';
    const initials = loggedInUser.name.split(' ').map(n => n[0].toUpperCase()).join('');
    document.getElementById('accountInitials').textContent = initials;

    if (loggedInUser.photo) {
        document.getElementById('accountPhoto').src = loggedInUser.photo;
        document.getElementById('accountPhoto').style.display = 'block';
        document.getElementById('accountInitials').style.display = 'none';
    } else {
        document.getElementById('accountPhoto').style.display = 'none';
        document.getElementById('accountInitials').style.display = 'block';
    }

    document.getElementById('name').value = loggedInUser.name;
    document.getElementById('mail').value = loggedInUser.email;
    document.getElementById('telephone').value = loggedInUser.phone;

    document.getElementById('name').disabled = true;
    document.getElementById('mail').disabled = true;
    document.getElementById('telephone').disabled = true;

    document.querySelector('.addNewContactimg').style.display = 'none';

    document.querySelector('.two-buttons').innerHTML = `
       <button type="button" class="cancel-button" style="width: 250px;" onclick="openDeleteModal()">
    Delete my account
    <img class="close-button" src="assets/IMG/iconoir_cancel.png">
</button>
        <button type="button" class="createContact-button" onclick="htmlEditAccountForm(${userIndex})">
            Edit
            <img src="assets/IMG/check.svg">
        </button>
    `;

    let newContactOverlay = document.getElementById('newContact');
    newContactOverlay.classList.add('transition-in-from-right');
    newContactOverlay.style.display = 'flex';
}

function htmlEditAccountForm(userIndex) {
    // Felder wieder aktivieren
    document.getElementById('name').disabled = false;
    document.getElementById('mail').disabled = false;
    document.getElementById('telephone').disabled = false;

    document.querySelector('.addcontactheadline').textContent = 'Edit account';

    // Buttons mit bestehenden Funktionen verdrahten
    document.querySelector('.two-buttons').innerHTML = `
        <button type="button" class="cancel-button" onclick="closeCardContact()">
            Cancel
            <img class="close-button" src="assets/IMG/iconoir_cancel.png">
        </button>
        <button type="button" class="createContact-button" onclick="saveEditedContact(${userIndex})">
            Save
            <img src="assets/IMG/check.svg">
        </button>
    `;
}
/**
 * Navigates the user to the summary page.
 */
function goToSummary() {
    window.location.href = 'summary.html';
}

/**
 * Navigates the user to the login page and clears local storage.
 */
function goToLogin() {
    window.location.href = 'login.html';
    localStorage.clear();
}


function openDeleteModal() {
    document.getElementById('deleteAccountModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteAccountModal').style.display = 'none';
}

async function confirmDeleteAccount() {
    closeDeleteModal();
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let userIndex = contactsArray.findIndex(c => c.email === loggedInUser.email);
    await deleteContact(userIndex);
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

