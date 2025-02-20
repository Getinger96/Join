/**
 * This function generate the links for the header 
 * 
 * @returns {*}
 */
function includeHTML() {
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
            return;
        }
    }
};

/**
 * This function changes the location for the window to the summary.html
 * 
 */
function goToSummary() {
    window.location.href = 'summary.html'; 
}
/**
 * This function changes the location for the window to the login.html
 * 
 */
function goToLogin() {
    window.location.href = 'login.html'; 
}

