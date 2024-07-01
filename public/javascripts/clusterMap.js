// Set the access token for Mapbox
mapboxgl.accessToken = mapToken;

// Initialize the map
const map = new mapboxgl.Map({
  container: "cluster-map", // HTML container ID
  style: "mapbox://styles/mapbox/light-v10", // Map style
  center: [-103.59179687498357, 40.66995747013945], // Initial map center in [lng, lat]
  zoom: 3, // Initial zoom level
});

// Add navigation controls (zoom and rotation) to the map
map.addControl(new mapboxgl.NavigationControl());

// Wait for the map to load
map.on("load", function () {
  // Add a new source from our GeoJSON data and enable clustering
  map.addSource("campgrounds", {
    type: "geojson",
    // Point to GeoJSON data
    data: campgrounds,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  // Add a layer for the clusters
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions to implement different circle colors and sizes based on point count
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#00BCD4", // Blue for point count < 10
        10,
        "#2196F3", // Yellow for point count between 10 and 30
        30,
        "#3F51B5", // Pink for point count >= 30
      ],
      "circle-radius": [
        "step",
        ["get", "point_count"],
        15, // 15px for point count < 10
        10,
        20, // 20px for point count between 10 and 30
        30,
        25, // 25px for point count >= 30
      ],
    },
  });

  // Add a layer for the cluster count labels
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}", // Display the abbreviated point count
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"], // Font for the text
      "text-size": 12, // Text size
    },
  });

  // Add a layer for the unclustered points
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da", // Circle color
      "circle-radius": 4, // Circle radius
      "circle-stroke-width": 1, // Circle stroke width
      "circle-stroke-color": "#fff", // Circle stroke color
    },
  });

  // Inspect a cluster on click
  map.on("click", "clusters", function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  // When a click event occurs on a feature in the unclustered-point layer, open a popup at the location of the feature
  map.on("click", "unclustered-point", function (e) {
    const { popUpMarkup } = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
    // the popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
  });

  // Change the cursor to a pointer when hovering over clusters
  map.on("mouseenter", "clusters", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  // Reset the cursor when it leaves the clusters layer
  map.on("mouseleave", "clusters", function () {
    map.getCanvas().style.cursor = "";
  });
});
