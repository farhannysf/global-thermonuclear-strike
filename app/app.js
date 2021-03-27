Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNTJhMGZlYS03YzBhLTRkMDItYjdhNy1jNTY5YzYzMmYxMzEiLCJpZCI6NDYzODMsImlhdCI6MTYxNjA4MDAwMX0.mEt-nrCRpc-SR9SkguIhjLOAJkLoWDienK5kOGWZjXo';
const apiKey = "AAPKeb55cb51637e49d3bca9d10b1254eaa6yaEpF2Mf1aXs85FffEZcBXZl_Me1REzmg_5czbl5QqSQQ7KcdlKvWOlKHnhdm4Lz"; // Referrer header restricted

const authentication = new arcgisRest.ApiKey({
  key: apiKey
});

function appendFarhan() {
  var node = document.createElement("A");
  node.id = "Farhan";
  node.href = "https://github.com/farhannysf/global-thermonuclear-strike"
  node.target = "_blank"
  var textnode = document.createTextNode("By Farhan Yusuf Nugroho");
  var cesium_textContainer = document.getElementsByClassName("cesium-widget-credits");
  node.appendChild(textnode);
  cesium_textContainer[0].appendChild(node);;
}

function createreloadButton() {
  document.getElementById("ammoCount").textContent = 0
  var btn = document.createElement("BUTTON");
  btn.innerHTML = "Reload Weapon";
  btn.onclick = function() {window.location.reload()};
  var detonateNuke = document.getElementById("detonateText");
  detonateNuke.replaceWith(btn)
}

function detonateText() {
  var detonateText = document.createElement("P");
  detonateText.id = "detonateText";
  detonateText.textContent = "RIGHT CLICK / DOUBLE TAP ON MAP TO DETONATE WARHEAD";
  var detonateNuke = document.getElementById("detonateNuke");
  detonateNuke.replaceWith(detonateText);
}

function kmtom(kilometer){
  var meter = kilometer*1000;
  return meter
}

var viewer = new Cesium.Viewer("cesiumContainer", {
terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
    url:
    "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
}),
});
appendFarhan();
viewer.scene.primitives.add(Cesium.createOsmBuildings());
var countsClicked = 0;
var warheadYield = 100;
var detonationAltitude = 750

function armNuke() {
  detonateText();
  viewer.scene.canvas.addEventListener('contextmenu', (event) => {
    if (countsClicked == 1) {
      return;
    }
    ++countsClicked;
    // console.log(countsClicked)
    event.preventDefault();
    const clickPosition = new Cesium.Cartesian2(event.clientX, event.clientY);
    const selectedLocation = viewer.scene.pickPosition(clickPosition);
    
    setMarkerInPos(Cesium.Cartographic.fromCartesian(selectedLocation));
  }, false);
    
  viewer.scene.canvas.addEventListener("touchstart", tapHandler)
    
  var tapedTwice = false;
    
  function tapHandler(event) {
    if (countsClicked == 1) {
      return;
    }
    
    if (!tapedTwice) {
      tapedTwice = true;
      setTimeout(function () { tapedTwice = false; }, 300);
      return false;
    }
    event.preventDefault();
    ++countsClicked;
    const touchPosition = new Cesium.Cartesian2(event.touches[0].clientX, event.touches[0].clientY);
    const selectedLocation = viewer.scene.pickPosition(touchPosition);
    setMarkerInPos(Cesium.Cartographic.fromCartesian(selectedLocation));
  }
}

function setMarkerInPos(positionCartographic){
  viewer.pickTranslucentDepth = true;

  ring1Radius_km = Math.pow(warheadYield,0.33)*0.24; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring1Radius_km)
  ring1Radius_m = kmtom(ring1Radius_km)
  // console.log(ring1Radius_m)
  var ring1 = viewer.entities.add({
  position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, 10),
  name: ring1Radius_km.toFixed(1) + " km radius",
  description:'\
  <img\
    width="50%"\
    style="float:left; margin: 0 1em 1em 0;"\
    src="assets/overpressure-distance.png"/>\
  <h3>\
    Peak overpressure level:\
  </h3>\
  <p>\
    137.89 kPa\
  </p>\
  <h3>\
    Estimated Blast Structural Damage:\
  </h3>\
  <p>\
    Heavily built concrete buildings are severely damaged or demolished\
  </p>', // The Effects of Nuclear Weapons. (1977). United States: Department of Defense.
  ellipse: {
      semiMinorAxis: ring1Radius_m,
      semiMajorAxis: ring1Radius_m,
      material: Cesium.Color.RED.withAlpha(0.3),
  },
  });

  ring2Radius_km = Math.pow(warheadYield,0.33)* 0.37; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring2Radius_km)
  ring2Radius_m = kmtom(ring2Radius_km);
  // console.log(ring2Radius_m)
  var ring2 = viewer.entities.add({
  position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, 10),
  name: ring2Radius_km.toFixed(1) + " km radius",
  description:'\
  <img\
    width="50%"\
    style="float:left; margin: 0 1em 1em 0;"\
    src="assets/overpressure-distance.png"/>\
  <h3>\
    Peak overpressure level:\
  </h3>\
  <p>\
    68.94 kPa\
  </p>\
  <h3>\
    Estimated Blast Structural Damage:\
  </h3>\
  <p>\
    Reinforced concrete buildings are severely damaged or demolished.\
  </p>', // The Effects of Nuclear Weapons. (1977). United States: Department of Defense.
  ellipse: {
      semiMinorAxis: ring2Radius_m,
      semiMajorAxis: ring2Radius_m,
      material: Cesium.Color.RED.withAlpha(0.2),
  },
  });

  ring3Radius_km = Math.pow(warheadYield,0.33)*0.57; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring3Radius_km);
  ring3Radius_m = kmtom(ring3Radius_km);
  // console.log(ring3Radius_m)
  var ring3 = viewer.entities.add({
  position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, 10),
  name: ring3Radius_km.toFixed(1) + " km radius",
  description:'\
  <img\
    width="50%"\
    style="float:left; margin: 0 1em 1em 0;"\
    src="assets/overpressure-distance.png"/>\
  <h3>\
    Peak overpressure level:\
  </h3>\
  <p>\
    34.47 kPa\
  </p>\
  <h3>\
    Estimated Blast Structural Damage:\
  </h3>\
  <p>\
    Most buildings collapse.\
  </p>', // The Effects of Nuclear Weapons. (1977). United States: Department of Defense.
  ellipse: {
      semiMinorAxis: ring3Radius_m,
      semiMajorAxis: ring3Radius_m,
      material: Cesium.Color.RED.withAlpha(0.2),
  },
  });

  var ring4Radius_km = Math.pow(warheadYield,0.33)*0.79; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring4Radius_km);
  ring4Radius_m = kmtom(ring4Radius_km);
  // console.log(ring4Radius_m)
  var ring4 = viewer.entities.add({
  position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, 10),
  name: ring4Radius_km.toFixed(1) + " km radius",
  description:'\
  <img\
    width="50%"\
    style="float:left; margin: 0 1em 1em 0;"\
    src="assets/overpressure-distance.png"/>\
  <h3>\
    Peak overpressure level:\
  </h3>\
  <p>\
    20.68 kPa\
  </p>\
  <h3>\
    Estimated Blast Structural Damage:\
  </h3>\
  <p>\
    Residential structures collapse.\
  </p>', // The Effects of Nuclear Weapons. (1977). United States: Department of Defense.
  ellipse: {
      semiMinorAxis: ring4Radius_m,
      semiMajorAxis: ring4Radius_m,
      material: Cesium.Color.RED.withAlpha(0.3),
  },
  });

  var ring5Radius_km = Math.pow(warheadYield,0.33)*1.66; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring5Radius_km)
  ring5Radius_m = kmtom(ring5Radius_km);
  // console.log(ring5Radius_m)
  var ring5 = viewer.entities.add({
  position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, 10),
  name: ring5Radius_km.toFixed(1) + " km radius",
  description:'\
  <img\
    width="50%"\
    style="float:left; margin: 0 1em 1em 0;"\
    src="assets/overpressure-distance.png"/>\
  <h3>\
    Peak overpressure level:\
  </h3>\
  <p>\
    6.89 kPa\
  </p>\
  <h3>\
    Estimated Blast Structural Damage:\
  </h3>\
  <p>\
    Window glass shatters.\
  </p>', // The Effects of Nuclear Weapons. (1977). United States: Department of Defense.
  ellipse: {
      semiMinorAxis: ring5Radius_m,
      semiMajorAxis: ring5Radius_m,
      material: Cesium.Color.YELLOW.withAlpha(0.2),
  },
  });
  fireballRadius = (Math.pow(warheadYield,0.4)*110)*0.3048; // Nuclear Fireball Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/105
  // console.log(fireballRadius)
  fireball_radiusFixed = fireballRadius.toFixed(1);
  // console.log(fireball_radiusFixed)
  var mcStem = viewer.entities.add({
    name: "Fireball Radius, Mushroom Cloud Stem",
    description:`\
  <img\
    width="50%"\
    style="float:left; margin: 0 1em 1em 0;"\
    src="assets/stabilized-cloud-dimensions.png"/>\
    <h3>\
    Mushroom Cloud Altitude:\
  </h3>\
  <p>\
    11.8 km\
  </p>\
  <h3>\
    Fireball Radius:\
  </h3>\
  <p>\
    ${fireball_radiusFixed} m\
  </p>\
  <h3>\
    Peak overpressure level:\
  </h3>\
  <p>\
    1378.95 kPa\
  </p>\
  <h3>\
    <br>\
    Estimated Blast Structural Damage:\
  </h3>\
  <p>\
    Anything inside the fireball is effectively vaporized.\
  </p>`, // Nukemap by Alex Wellerstein https://nuclearsecrecy.com/nukemap/
    position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude),
    ellipse: {
      semiMinorAxis: fireballRadius,
      semiMajorAxis: fireballRadius,
      extrudedHeight: 11800, // Nukemap by Alex Wellerstein https://nuclearsecrecy.com/nukemap/
      material: Cesium.Color.RED.withAlpha(0.3),
      outline: false,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
    },
  });

  var mcHead = viewer.entities.add({
    name: "Mushroom Cloud Head",
    description:'\
  <img\
    width="50%"\
    style="float:left; margin: 0 1em 1em 0;"\
    src="assets/stabilized-cloud-dimensions.png"/>\
  <h3>\
    Mushroom Cloud Head Diameter:\
  </h3>\
  <p>\
    10.04 km\
  </p>\
  <h3>\
    Mushroom Cloud Head Height:\
  </h3>\
  <p>\
    6.02 km\
  </p>', // Nukemap by Alex Wellerstein https://nuclearsecrecy.com/nukemap/
    position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, 11800), // Nukemap by Alex Wellerstein https://nuclearsecrecy.com/nukemap/
    ellipsoid: {
      radii: new Cesium.Cartesian3(10400, 10400, 6020), // Nukemap by Alex Wellerstein https://nuclearsecrecy.com/nukemap/
      maximumCone: Cesium.Math.PI_OVER_TWO,
      material: Cesium.Color.RED.withAlpha(0.3),
      outline: false,
      heightReference: Cesium.HeightReference.NONE
    },
  });
  var lon = Cesium.Math.toDegrees(positionCartographic.longitude).toFixed(10);
  var lat = Cesium.Math.toDegrees(positionCartographic.latitude).toFixed(10);
  // console.log(lon);
  // console.log(lat);

  arcgisRest.queryDemographicData({
    studyAreas: [{ "areaType":"RingBuffer","bufferUnits":"esriKilometers","bufferRadii":[3.6], "geometry": { "x": lon, "y": lat }}], // Graphs of Nuclear Weapons Effects by Dr. Wm. Robert Johnston http://www.johnstonsarchive.net/nuclear/nukgr3.pdf
    authentication: authentication
  })
  .then((response) => {
    // console.log("Demographics:", response);
    try {
      demographicsData = response["results"][0]['value']['FeatureSet'][0]['features'][0]['attributes'];
    }
    catch(err) {
      document.getElementById("estimatedCasualties").textContent = "Cannot Estimate Casualties:"
      document.getElementById("totalPopulation").textContent = "No population data found"
      createreloadButton();
    }
    totalPopulation = demographicsData.TOTPOP.toLocaleString()
    document.getElementById("estimatedCasualties").textContent = "Estimated Casualties:"
    document.getElementById("totalPopulation").textContent = totalPopulation + " people within 3.6 km radius dead"
    var img = document.createElement("img");
    img.src = "assets/yield-distance-effect.png"; // Graphs of Nuclear Weapons Effects by Dr. Wm. Robert Johnston http://www.johnstonsarchive.net/nuclear/nukgr3.pdf
    img.className = "img"
    var src = document.getElementById("image").appendChild(img);
    createreloadButton();
    // console.log(demographicsData);
  });

  const hypocenterMarker = viewer.entities.add({
  name : 'HYPOCENTER',
  position : Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude),
  point : {
  pixelSize : 5,
  color : Cesium.Color.RED,
  outlineColor : Cesium.Color.WHITE,
  outlineWidth : 2,
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND 
  },
  label : {
  text : 'HYPOCENTER',
  font : '14pt monospace',
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  outlineWidth : 2,
  verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
  pixelOffset : new Cesium.Cartesian2(0, -9),
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND 
  }
  });

  const airburstMarker = viewer.entities.add({
  name : 'AIRBURST',
  position : Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, detonationAltitude),
  point : {
  pixelSize : 5,
  color : Cesium.Color.RED,
  outlineColor : Cesium.Color.WHITE,
  outlineWidth : 2,
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND 
  },
  label : {
  text : 'AIRBURST',
  font : '14pt monospace',
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  outlineWidth : 2,
  verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
  pixelOffset : new Cesium.Cartesian2(0, -9),
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
  }
  });
}

// Start off looking at Beijing.
viewer.scene.camera.flyTo({
destination: Cesium.Cartesian3.fromDegrees(116.383331, 39.916668, 700)
}); 