// Funksjon for å sette og lagre visningsposisjon i localStorage
function saveMapPosition() {
  const center = map.getCenter();
  const zoom = map.getZoom();
  localStorage.setItem('lastMapPosition', JSON.stringify({
    lat: center.lat,
    lng: center.lng,
    zoom: zoom
  }));
}

// Funksjon for å hente den siste lagrede posisjonen
function getSavedMapPosition() {
  const savedPosition = localStorage.getItem('lastMapPosition');
  return savedPosition ? JSON.parse(savedPosition) : null;
}

// Initialiser Leaflet-kartet med posisjonen lagret i localStorage, eller standardposisjon
const savedPosition = getSavedMapPosition();
const initialPosition = savedPosition ? [savedPosition.lat, savedPosition.lng] : [59.91, 10.75]; // Default til Oslo
const initialZoom = savedPosition ? savedPosition.zoom : 10; // Default zoom

const map = L.map("map").setView(initialPosition, initialZoom); // Bruker den lagrede posisjonen eller standard

// Legg til OpenStreetMap-lag
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Funksjon for å hente og vise steder på kartet
async function loadPlaces() {
  try {
    const response = await fetch("http://localhost:5000/api/places"); // Henter fra backend
    const places = await response.json();

    // Fjern eksisterende markører før vi laster inn nye
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    places.forEach((place) => {
      const marker = L.marker([place.latitude, place.longitude])
        .addTo(map)
        .bindPopup(`<b>${place.name}</b><br>${place.description}<br><button onclick="deletePlace(${place.id})">Slett sted</button>`); // Legger til slett knapp
    });
  } catch (error) {
    console.error("Feil ved henting av steder:", error);
  }
}

// Funksjon for å legge til et nytt sted
async function addPlace(name, description, latitude, longitude) {
  try {
    const response = await fetch("http://localhost:5000/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        description: description,
        latitude: latitude,
        longitude: longitude,
      }),
    });

    if (!response.ok) {
      throw new Error("Kunne ikke lagre sted!");
    }

    const place = await response.json();
    console.log("Sted lagret:", place);

    // Legg til markør på kartet
    L.marker([place.latitude, place.longitude])
      .addTo(map)
      .bindPopup(`<b>${place.name}</b><br>${place.description}<br><button onclick="deletePlace(${place.id})">Slett sted</button>`); // Legger til slett knapp
  } catch (error) {
    console.error("Feil ved lagring:", error);
  }
}

// Funksjon for å slette et sted
async function deletePlace(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/places/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Kunne ikke slette stedet');
    }

    console.log('Sted slettet');
    loadPlaces(); // Oppdater kartet etter sletting
  } catch (error) {
    console.error('Feil ved sletting:', error);
  }
}

// Legg til sted ved klikk på kartet
map.on("click", async function (e) {
  const name = prompt("Navn på stedet:");
  const description = prompt("Beskrivelse:");

  if (name && description) {
    await addPlace(name, description, e.latlng.lat, e.latlng.lng);
  }
});

// Lagre kartposisjon når kartet blir beveget
map.on("moveend", saveMapPosition);

// Last inn steder ved oppstart
loadPlaces();
