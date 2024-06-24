// Set the access token for Mapbox
mapboxgl.accessToken = mapToken;

// Initialize a new Mapbox map
const map = new mapboxgl.Map({
  container: "cluster-map", // ID of the HTML element to contain the map
  style: "mapbox://styles/mapbox/light-v11", // Map style to use
  center: [-103.5917, 40.6699], // Initial center of the map [longitude, latitude]
  zoom: 3, // Initial zoom level of the map
});

// Add navigation control (zoom and rotation controls) to the map
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-right"); // Position the navigation controls at the top-right corner

// Event listener for when the map has loaded all necessary resources
map.on("load", () => {
  // Add a new data source to the map for campgrounds with clustering enabled
  map.addSource("campgrounds", {
    type: "geojson", // Type of data source
    data: campgrounds, // GeoJSON data for the campgrounds
    cluster: true, // Enable clustering of data points
    clusterMaxZoom: 14, // Max zoom level for clustering
    clusterRadius: 50, // Radius of each cluster when clustering points
  });

  // Add a layer to display clusters of campgrounds
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"], // Only show clusters (not individual points)
    paint: {
      // Use step expressions to style the clusters differently based on the number of points in the cluster
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#0BCD4f", // Green for clusters with fewer than 10 points
        10,
        "#2196F3", // Blue for clusters with 10-29 points
        30,
        "#3F51B5", // Purple for clusters with 30 or more points
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25], // Radius of the clusters
    },
  });

  // Add a layer to display the number of points in each cluster
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"], // Only show cluster counts
    layout: {
      "text-field": ["get", "point_count_abbreviated"], // Display the abbreviated point count
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"], // Font for the text
      "text-size": 12, // Size of the text
    },
  });

  // Add a layer to display individual unclustered points
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]], // Only show unclustered points
    paint: {
      "circle-color": "#11b4da", // Color of the points
      "circle-radius": 4, // Radius of the points
      "circle-stroke-width": 1, // Width of the stroke around the points
      "circle-stroke-color": "#fff", // Color of the stroke around the points
    },
  });

  // Event listener for clicking on clusters
  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        // Zoom into the cluster when clicked
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  // Event listener for clicking on unclustered points
  map.on("click", "unclustered-point", (e) => {
    const { popUpMarkup } = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that the popup appears over the correct copy of the feature
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Create a popup at the location of the feature
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
  });

  // Change the cursor to a pointer when hovering over clusters
  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change the cursor back when not hovering over clusters
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
});
