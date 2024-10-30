


/**
 * Sets the active class on navigation links based on the current URL path.
 */
function setActiveLink() {
  let currentUrl = window.location.pathname;

  if (currentUrl.includes("summary.html")) {
      let summary = document.getElementById("navlinkSummary");
      let summaryMobile = document.getElementById("navlinkSummarymobil");
      summaryMobile.classList.add('active');
      summary.classList.add('active');
  } else if (currentUrl.includes("add_task.html")) {
      addtaskActive();
  } else if (currentUrl.includes("board.html")) {
      boardactive();
  } else if (currentUrl.includes("contact.html")) {
      contactActive();
  }
}

/**
* Adds the "active" class to both desktop and mobile versions of the "Add Task" navigation link.
*/
function addtaskActive() {
  let addtask = document.getElementById("navlinkaddTask");
  let addtaskMobil = document.getElementById('navlinkaddTaskmobil');
  addtaskMobil.classList.add("active");
  addtask.classList.add("active");
}

/**
* Adds the "active" class to both desktop and mobile versions of the "Board" navigation link.
*/
function boardactive() {
  let boardMobile = document.getElementById('navlinkBoardMobile');
  let board = document.getElementById("linkBoard");
  boardMobile.classList.add("active");
  board.classList.add("active");
}

/**
* Adds the "active" class to both desktop and mobile versions of the "Contact" navigation link.
*/
function contactActive() {
  let contact = document.getElementById("navlinkContact");
  let contactMobile = document.getElementById('navlinkContactMobile');
  contactMobile.classList.add("active");
  contact.classList.add("active");
}



 