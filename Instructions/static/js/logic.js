var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" );
    }

    function styleinfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getcolour(feature.properties.mag),
            color: "black",
            radius: getradius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        }
    }
    function getcolour(magnitude) {
        if (magnitude > 5) {
            return "#ea2c2c"
        } else if (magnitude > 4) {
            return "#ea822c"
        }
        else if (magnitude > 3) {
            return "#ee9c00"
        } else if (magnitude > 2) {
            return "#eecc00"
        } else if (magnitude > 1) {
            return "#d4ee00"
        } else {
            return "#98ee00"

        }
    }

    function getradius(magnitude) {
        if (magnitude === 0) {
            return 1 
        } 
        return magnitude * 4
    } 
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlong) {
            return L.circleMarker(latlong)
        },
        style: styleinfo,
        onEachFeature: onEachFeature
    }); //embed inside function  
    //layer group for tectonic plates
    //d3.json for tectonic plates and add an inline function, d 
    //inside function do the L.geojson (inside only have color:co and weight:we), at the end of geojson function will do another .addTo(tectonicplates)
    // pass tectonicplates into createMap with earthquakes
    createMap(earthquakes);
}

function createMap(earthquakes) {
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Light Map": lightmap,
    "Satellite Map": satellitemap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
    //tectonic plates
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellitemap, earthquakes]
  });

  lightmap.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0,1,2,3,4,5];
    var colors = ["#98ee00","#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
    for (var i = 0; i < grades.length; i++) { 
        div.innerHTML += "<i style='background: "+ colors[i] + "'></i>" + 
        grades[i] + (grades[i + 1]? "&ndash;" +  grades[i + 1] + "<br>" : "+");
    }
    
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);


}


// add a new layer,
 //add second d3.json
 //specify the weight and color
 //get data on borders 