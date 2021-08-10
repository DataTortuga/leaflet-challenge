// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data);
  createFeatures(data.features)
});

function createFeatures(earthquakeData) {

    var quakes = [];

    color = 'blue'
    for (var i = 0; i < earthquakeData.length;i++) {
        coor = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]];
        depth = earthquakeData[i].geometry.coordinates[3];
        quakes.push(L.circle(coor, {
        fillOpacity: 0.75,
        color: "black",
        fillColor: color,
        // Adjust the radius.
        radius: Math.sqrt(earthquakeData[i].properties.mag) * 100000
        }).bindPopup(`<h3>${earthquakeData[i].properties.place}</h3><hr><p>${new Date(earthquakeData[i].properties.time)}</p>`));
    
    }

    earthquakes = L.layerGroup(quakes);

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes, earthquakeData);
  }
  
  function createMap(earthquakes, e_data) {
  
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    
  }