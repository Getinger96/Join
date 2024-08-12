
let description = [];

let todos = [{
    'id': 0,
    'title': 'Putzen',
    'category': 'open'
}, {
    'id': 1,
    'title': 'Kochen',
    'category': 'open'
}, {
    'id': 2,
    'title': 'Einkaufen',
    'category': 'closed'
}];

let currentDraggedElement;

document.addEventListener("DOMContentLoaded", function () {
    updateHTML();
});

function includeHTML() {// funktion für die templates
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


//add Task
function addTask() {
    let task = document.getElementById('addTask');
    task.innerHTML = '';
    for(let i = 0; i < todos.length; i++) {
        let title = todos[i][title];
        let description = description[i];
    }
    task.innerHTML += addNewTaskHTML(title, description)
}

//Task
function updateHTML() {
    let open = todos.filter(t => t['category'] == 'open');
    document.getElementById('open').innerHTML = '';
    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += generateTodoHTML(element);
    }

    let progress = todos.filter(t => t['category'] == 'progress');
    document.getElementById('progress').innerHTML = '';
    for (let index = 0; index < progress.length; index++) {
        const element = progress[index];
        document.getElementById('progress').innerHTML += generateTodoHTML(element);
    }

    let awaitFeedback = todos.filter(t => t['category'] == 'awaitFeedback');
    document.getElementById('awaitFeedback').innerHTML = '';
    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('awaitFeedback').innerHTML += generateTodoHTML(element);
    }

    let closed = todos.filter(t => t['category'] == 'closed');
    document.getElementById('closed').innerHTML = '';
    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += generateTodoHTML(element);
    }
    includeHTML();
}

//Drag & Drop
function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos.find(todo => todo.id === currentDraggedElement).category = category;
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

