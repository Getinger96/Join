


function setActiveLink() {
   
    var currentUrl = window.location.pathname;

   
    if (currentUrl.includes("summary.html")) {

      let summary=document.getElementById("navlinkSummary");
      let summaryMobile=document.getElementById("navlinkSummarymobil");
      summaryMobile.classList.add('active');
      summary.classList.add('active');
    } else if (currentUrl.includes("add_task.html")) {
      let addtask=document.getElementById("navlinkaddTask");
      let addtaskMobil=document.getElementById('navlinkaddTaskmobil')
      addtaskMobil.classList.add("active");
      addtask.classList.add("active");
    } else if (currentUrl.includes("board.html")) {
      let boardMobile=document.getElementById('navlinkBoardMobile');
      let board=document.getElementById("linkBoard");
      boardMobile.classList.add("active");
      board.classList.add("active");
    } else if (currentUrl.includes("contact.html")) {
       let contact= document.getElementById("navlinkContact");
       let contactMobile=document.getElementById('navlinkContactMobile')
       contactMobile.classList.add("active");
       contact.classList.add("active");
      }

      
  }


 