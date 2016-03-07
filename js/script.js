
  var basemapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

  //map 3 NYC Bike Route Install Date from NYCDOT Shapefile

  //initialize map3
  var map3 = L.map('map3', {
    scrollWheelZoom: true
  }).setView( [40.706913,-73.987513], 14)
    map3.locate({setView: true, maxZoom: 13});

  //CartoDB Basemap
  L.tileLayer(basemapUrl,{
    attribution: attribution
  }).addTo(map3);

  var geojson;

  //this function is set to run when a user mouses over any polygon; Think I have issues with this. 
  //would like to be able to select one bike trail segment at a time. Linestring?
  function mouseoverFunction(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

var year = layer.feature.properties.InstDate.substring(0,4);
var fromstreet = layer.feature.properties.FROMSTREET;
var style = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};




    //update the text in the infowindow with whatever was in the data
    // console.log(layer.feature.properties.name);
    $('#infoWindow').text('Installed: ' + year);
    $('#infoWindow2').text(fromstreet);

  }

  //this runs on mouseout
  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  //this is executed once for each feature in the data, and adds listeners
  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: mouseoverFunction,
        mouseout: resetHighlight
    });
  }

  var myStyle = {
 "color": "#00FF00",
 "weight": 5,
 "opacity": 0.65
};

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map3)
        .bindPopup("You are here").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map3.on('locationfound', onLocationFound);
                       

  //all of the helper functions are defined and ready to go, so let's get some data and render it!

  //be sure to specify style and onEachFeature options when calling L.geoJson().
  $.getJSON('data/nyc-bike-routes-2015.geojson', function(bike_route) {
    geojson = L.geoJson(bike_route,{
      style: myStyle,
      onEachFeature: onEachFeature
    }).addTo(map3);
  });


  
 