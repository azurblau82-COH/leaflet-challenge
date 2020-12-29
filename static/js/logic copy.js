var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function createMap(data){

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var satelite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });


  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
    "Outdoors": outdoor,
    "Satelite": satelite
  };

 // Create an overlayMap object to hold the earthquake bubbles
 var overlayMaps = {
    "Quakes": data
  };

// Create the map object with options
var map = L.map("map", {
    center: [39.5, -110],
    zoom: 6,
    layers: [lightmap, data]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our quake intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
          '<i style="background:' + getColor(grades[i]) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(map);  

}

function getColor(data){
    var color = ""
    if (data < 1){
        color = "#27ae60"
    }
    else if (data < 2){
        color = "#2ecc71"
    }
    else if (data < 3){
        color = "#f1c40f"
    }
    else if (data < 4){
        color = "#e67e22"
    }
    else if (data < 5){
        color = "#d35400"
    }
    else {
        color = "#c0392b"
    }
return color
}

function createQuakes(response) {

    // Pull the quake properties off of response.data
    var quakes = response.features;
  
    // Initialize an array to hold quake bubbles
    var quakeBubbles = [];
  
    // Loop through the quakes array
    for (var index = 0; index < quakes.length; index++) {
      var quake = quakes[index];
  
      // For each quake, create a cirlce, set radius tied to magnitude. Get color from function getColor()
      var quakeBubble = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],
        {
        color: getColor(quake.properties.mag),
        radius: quake.properties.mag * 5000,
        fillcolor: getColor(quake.properties.mag),
        fillOpacity: 1
        })
        .bindPopup("<h3>" + "Mag: " + quake.properties.mag + "</h3>" + "<hr>" + 
        "<h5>" + "Place: " + quake.properties.place + "</br>" +
        "Lat: " + quake.geometry.coordinates[1] + "</br>" + "Lon: " + quake.geometry.coordinates[0] + "</h5>");
  
      // Add the marker to the bikeMarkers array
      quakeBubbles.push(quakeBubble);
    }
    console.log(quakeBubbles);
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeBubbles));
  }



d3.json(link, createQuakes);
