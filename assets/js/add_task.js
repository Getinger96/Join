const BAse_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/"
let Contacts = [];



async function onloadfunc() {

    let userResponse = await loadcontacts("contacts");
    console.log(userResponse)
    let UserKeyArray = Object.keys(userResponse)


    for (let index = 0; index < UserKeyArray.length; index++) {
        Contacts.push(
            {
                id: UserKeyArray[index],
                user: userResponse[UserKeyArray[index]],
            }
        )

    }
    console.log(Contacts)
    renderSelectionContainer();


}

async function loadcontacts(path) {
    let response = await fetch(BAse_URL + path + ".json")
    let responseToJson = await response.json();
    return responseToJson;


}




function openList() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = `<img onclick="closelist()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_up.svg" alt="">`;
    selecCon.classList.remove('d_none');

}

function closelist() {
    let selecCon = document.getElementById('Selection_Container');
    let arrowCon = document.getElementById('arrow_img_container');
    arrowCon.innerHTML = '';
    arrowCon.innerHTML = `<img onclick="openList()"class="arrow_drop_downaa" src="assets/IMG/arrow_drop_downaa.svg" alt="">`;
    selecCon.classList.add('d_none');



}

function renderSelectionContainer() {
    let profiles = document.getElementById('Selection_Container');
    profiles.innerHTML = '';

    for (let i = 0; i < Contacts.length; i++) {
        let contact = Contacts[i];
        let name = contact.user.name;
        let forNAme = contact.user.forname;
        let lastName = contact.user.lastname;
        let firstletterforname = forNAme.charAt(0);
        let firstletterlastname = lastName.charAt(0);
        let firstletters = firstletterforname + firstletterlastname;

        profiles.innerHTML += `
       <div id="profile_Container${i}" onclick="selectedContact(${i},'${name}','${firstletters}')" class="profile_Container">
         <div class="profile_container_header">
          <div class="profile_Badge_assign">${firstletters}</div>
          <div>${name}</div>
         </div>
          <div>
          <img id="checkImg${i}"  class="check_img  " src="assets/IMG/Check button.svg" alt="">
          <img  id="checkedImg${i}" class="checked_img d_none" src="assets/IMG/Checked button.svg" alt="">
         </div>
         
      
        </div>`;
    }
}

function selectedContact(i, name, firstletters) {


    let profileContainer = document.getElementById(`profile_Container${i}`);
    let checkImg = document.getElementById(`checkImg${i}`);
    let checkedImg = document.getElementById(`checkedImg${i}`);

    checkImg.classList.toggle('d_none');
    checkedImg.classList.toggle('d_none');



    profileContainer.classList.toggle('bg_color');
    profileContainer.classList.toggle('color_white');

    showSelectedProfile(firstletters, i);

}


function showSelectedProfile(firstletters, i) {

    let selectedProfileContainer = document.getElementById('Selected_profiles_Container');
    let profilebadgeassign = document.getElementById(`profile_Badge_assign${i}`)

    if (profilebadgeassign) {

        profilebadgeassign.remove();

    } else {
        selectedProfileContainer.innerHTML += `

    <div id="profile_Badge_assign${i}" class="profile_Badge_assign">${firstletters}</div>
    `;
    }


}



function selectedDificultyUrgent() {

    let urgent= document.getElementById('Urgent_container');
    urgent.classList.toggle('color_white');
    urgent.classList.toggle('bg_urgent');

}

