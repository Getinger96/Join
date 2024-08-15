const BAse_URL= "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app/"



async function loadData() {
    let response = await fetch(BAse_URL + ".json")
    let responseToJson = await response.json();
    console.log( responseToJson);
}