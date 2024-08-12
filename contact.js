const base_URL = "https://join-37803-default-rtdb.europe-west1.firebasedatabase.app";
let contactsArray = []; // Richtige Schreibweise

async function fetchContacts() {
    try {
        let response = await fetch(base_URL + "/contacts.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let contacts = await response.json();

        // Füge alle Kontakte direkt zum Array hinzu
        contactsArray.push(...contacts);

        // Zeige die Kontakte an
        displayContacts(contactsArray);
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
    }
}
