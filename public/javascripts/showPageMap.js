// Set the access token for Mapbox
mapboxgl.accessToken = mapToken;

// Initialize the map
const map = new mapboxgl.Map({
  container: "map", // HTML container ID for the map
  style: "mapbox://styles/mapbox/light-v10", // Map style
  center: campground.geometry.coordinates, // Initial map center in [lng, lat]
  zoom: 10, // Initial zoom level
});

// Add navigation controls (zoom and rotation) to the map
map.addControl(new mapboxgl.NavigationControl());

// Create a new marker at the campground's coordinates
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates) // Set the marker position
  .setPopup(
    // Attach a popup to the marker
    new mapboxgl.Popup({ offset: 25 }) // Set the offset of the popup
      .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>` // Set the HTML content of the popup
      )
  )
  .addTo(map); // Add the marker to the map
