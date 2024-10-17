


function setActiveLink() {
   
    var currentUrl = window.location.pathname;

   
    if (currentUrl.includes("summary.html")) {

      let summary=document.getElementById("navlinkSummary");
      summary.classList.add('active');
    } else if (currentUrl.includes("add_task.html")) {
      let addtask=document.getElementById("navlinkaddTask");
      addtask.classList.add("active");
    } else if (currentUrl.includes("board.html")) {
      let board=document.getElementById("linkBoard");
      board.classList.add("active");
    } else if (currentUrl.includes("contact.html")) {
       let contact= document.getElementById("navlinkContact");
       contact.classList.add("active");
      }

      
  }


 