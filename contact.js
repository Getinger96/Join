const BASE_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app";

async function fetchContacts() {
    try {
        let response = await fetch(BASE_URL + "/contacts.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let contacts = await response.json();
        console.log('Abgerufene Kontakte:', contacts);
        displayContacts(contacts);
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
    }
}