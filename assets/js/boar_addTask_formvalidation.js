function validateTask(titel,category, date) {


    let selectedDate = new Date(date.value);
    let currentDate = new Date(); 

    currentDate.setHours(0, 0, 0, 0);

    if (titel.value === '' ||category.value === '' || date.value === '') {
        allInputFieldMissing();
        showInvalidDateMessage();
        changeColorBorder();
        return false;
    } else {
        document.getElementById("taskTitle").style.border= '';
        document.getElementById("InputFieldsMissing").innerHTML = '';
    }
    

    if (selectedDate < currentDate ) {
        showInvalidDateMessage();
        return false;
    }

    document.getElementById("taskDueDate").style.border= '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';

 return true;
}

function allInputFieldMissing() {

    let showTileMissing = document.getElementById("InputFieldsMissing")
    
    showTileMissing.innerHTML = `<div>
                                     <span class="missingInput"> Please fill in or select the marked fields</span>
                                </div>`;
    
}

function showInvalidDateMessage() {

    
    let showWrongCurrentDate = document.getElementById("WrongCurrentDateId")
    
    showWrongCurrentDate.innerHTML = `<div>
                                     <span class="missingInput"> No date in the past may be specified</span>
                                </div>`;
    
}

function changeColorBorder() {


    document.getElementById("taskTitle").style.border = "2px solid red";
    document.getElementById("taskDueDate").style.border = "2px solid red";
  
  
}

function changColorPrioIcons() {
    document.getElementById("urgent").style.border = "2px solid red";
    document.getElementById("low").style.border = "2px solid red";
    document.getElementById("medium").style.border = "2px solid red";
}   

 function returnColorPrioIcons() {
    document.getElementById("urgent").style.border = '';
    document.getElementById("low").style.border = '';
    document.getElementById("medium").style.border = '';
}   


function clearMissingFieldContent() {
    document.getElementById("taskTitle").style.border= '';
    document.getElementById("taskDueDate").style.border= '';
    document.getElementById("InputFieldsMissing").innerHTML = '';
    document.getElementById("WrongCurrentDateId").innerHTML = '';

    let SubtaskLengthReachedElement = document.getElementById('SubtaskLengthReached')

    if (SubtaskLengthReachedElement) {
        SubtaskLengthReachedElement.innerHTML ='';
    }

  
}

