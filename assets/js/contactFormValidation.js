function nameIsNotValid(name) {
    const nameCheck = /^[A-Za-zäöüÄÖÜß\s]+$/; // Nur Buchstaben und Leerzeichen
    return nameCheck.test(name);

}


function emailIsNotCorrect(email) {
        let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailCheck.test(email); 
    

}

function phoneNumberIsNotCorrect(phone) {
    let phoneCheck = /^\d*$/;
    return phoneCheck.test(phone); 


}


function wrongEmailValidation() {

let showEmailMistake = document.getElementById("wrongEmail")

showEmailMistake.innerHTML = `<div>
                                <span class="mistakeInput"> Achtung eine richtige Mail Adresse muss angegeben !!!</span>
                            </div>`;

}

function wrongPhoneValidation() {

    let showEmailMistake = document.getElementById("wrongPhone")
    
    showEmailMistake.innerHTML = `<div>
                                    <span class="mistakeInput"> Die Telefonnummer muss aus 6-15 Zahlen bestehen .!!!</span>
                                </div>`;
    
    }


function wrongTextValidation() {

    let showEmailMistake = document.getElementById("wrongText")
    
    showEmailMistake.innerHTML = `<div>
                                     <span class="mistakeInput"> Der Name muss aus 3-30 Buchstaben bestehen. und darf keine Zahlen enthalten !!!</span>
                                </div>`;
        
        }


function changeColorMail() {

    document.getElementById("mailInput").style.border= "2px solid red";
}


function changeColorText() {

    document.getElementById("textInput").style.border= "2px solid red";
}



function changeColorPhone() {

    document.getElementById("phoneInput").style.border= "2px solid red";
}

