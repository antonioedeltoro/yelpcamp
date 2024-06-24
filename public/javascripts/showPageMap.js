// Set the Mapbox access token
mapboxgl.accessToken = mapToken;

// Create a new Mapbox map instance
const map = new mapboxgl.Map({
  container: "map", // container ID where the map will be displayed
  style: "mapbox://styles/mapbox/light-v10", // style URL for the map appearance
  center: campground.geometry.coordinates, // starting position [lng, lat] of the map
  zoom: 10, // starting zoom level of the map
});

// Add navigation control to the map in the top-right corner
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-right");

// Create a new marker on the map
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates) // set the marker's coordinates
  .setPopup(
    // create a popup associated with the marker
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      // set popup HTML content
      `<h3>${campground.title}</h3><p>${campground.location}</p>` // popup content with campground title and location
    )
  )
  .addTo(map); // add the marker with popup to the map
