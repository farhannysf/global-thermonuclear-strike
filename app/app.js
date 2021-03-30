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
  var textnode = document.createTextNode("© Farhan Yusuf Nugroho 2021");
  var cesium_textContainer = document.getElementsByClassName("cesium-widget-credits");
  node.appendChild(textnode);
  cesium_textContainer[0].appendChild(node);
}

function createButtons(ammo, buttonTitle, buttonId, func, elementId) {
  document.getElementById("ammoCount").textContent = ammo;
  var btn = document.createElement("BUTTON");
  btn.innerHTML = buttonTitle;
  btn.id = buttonId;
  btn.onclick = function() {func()};
  var detonateNuke = document.getElementById(elementId);
  detonateNuke.replaceWith(btn)
}
function detonateText() {
  var detonateText = document.createElement("P");
  detonateText.id = "detonateText";
  detonateText.textContent = "RIGHT CLICK / DOUBLE TAP ON MAP TO DETONATE WARHEAD";
  var armNuke_button = document.getElementById("armNuke_button");
  armNuke_button.replaceWith(detonateText);
}

function kmtom(kilometer){
  var meter = kilometer*1000;
  return meter
}

function estimatedCasualties(headerText, bodyText, reload) {
  document.getElementById("estimatedCasualties").textContent = headerText
  document.getElementById("totalPopulation").textContent = bodyText
  var img = document.createElement("img");
  img.id = "yield-distance-effect"
  img.src = "assets/yield-distance-effect.png"; // Graphs of Nuclear Weapons Effects by Dr. Wm. Robert Johnston http://www.johnstonsarchive.net/nuclear/nukgr3.pdf
  img.className = "img"
  if (reload === true) {
    document.getElementById("yield-distance-effect").remove()
    return
  }
  document.getElementById("image").appendChild(img);
}

function ringDescription(kpa, blast_structuralDamage) {
  var ringDescription_text =
  `<h3>\
    Peak overpressure level:\
  </h3>\
  <p>\
    ${kpa} kPa\
  </p>\
  <h3>\
    Estimated Blast Structural Damage:\
  </h3>\
  <p>\
    ${blast_structuralDamage}
  </p>`
  return ringDescription_text // The Effects of Nuclear Weapons. (1977). United States: Department of Defense.
}

function infoboxDescription(img, mc_headDescription, mc_stemDescription, ringDescription_text) {
  var infoboxDescription = `\
  <img\
    width="50%"\
    style="float:right; margin: 0px -0.75em 0em 0px;"\
    src="${img}"/>\
  ${mc_headDescription}
  ${mc_stemDescription}
  ${ringDescription_text}`
  return infoboxDescription
}

function ring(ringId, positionCartographic, ringRadius_km, img, ringDescription_text, ringRadius_m, ringColor, ringColor_alpha) {
  viewer.entities.add({
    id: ringId,
    position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, 10),
    name: ringRadius_km.toFixed(1) + " km radius",
    description: infoboxDescription(img, '', '', ringDescription_text),
    ellipse: {
      semiMinorAxis: ringRadius_m,
      semiMajorAxis: ringRadius_m,
      material: Cesium.Color[ringColor].withAlpha(ringColor_alpha),
    },
  });
}

function cesiumMarker(labelId, labelName, positionCartographic, detonationAltitude) {
  viewer.entities.add({
    id: labelId,
    name : labelName,
    position : Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, detonationAltitude),
    point : {
      pixelSize : 5,
      color : Cesium.Color.RED,
      outlineColor : Cesium.Color.WHITE,
      outlineWidth : 2,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND 
    },
    label : {
      text : labelName,
      font : '14pt monospace',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth : 2,
      verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
      pixelOffset : new Cesium.Cartesian2(0, -9),
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND 
    }
  });  
}

function removeObjects_iterator(value, index, array) {
  viewer.entities.removeById(value)
}

function reloadWeapon() {
  var objectsId = ["hypocenter", "airburst", "mcstem", "mchead", "ring1", "ring2", "ring3", "ring4", "ring5"];
  objectsId.forEach(removeObjects_iterator);
  estimatedCasualties(null, null, reload=true);
  createButtons(1, "Arm Warhead", "armNuke_button", armNuke, "reloadButton");
}

var viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
      url:
      "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
  }),
});

appendFarhan();
viewer.scene.primitives.add(Cesium.createOsmBuildings());
var warheadYield = 100;
var detonationAltitude = 750

// Fuzing mechanism 
function armNuke() {
  var countsClicked = 0;
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
  var ringImg = "assets/overpressure-distance.png"
  var ring1Id = "ring1"
  var ring1Radius_km = Math.pow(warheadYield,0.33)*0.24; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring1Radius_km)
  var ring1Radius_m = kmtom(ring1Radius_km);
  var ring1_kpa = 137.89; // 20 psi
  var ring1_blast_structuralDamage = "Heavily built concrete buildings are severely damaged or demolished.";
  var ring1Description_text = ringDescription(ring1_kpa, ring1_blast_structuralDamage);
  // console.log(ring1Radius_m)
  ring1Color = "RED";
  ring1Color_alpha = 0.3;
  ring(ring1Id, positionCartographic, ring1Radius_km, ringImg, ring1Description_text, ring1Radius_m, ring1Color, ring1Color_alpha);

  var ring2Id = "ring2"
  var ring2Radius_km = Math.pow(warheadYield, 0.33) * 0.37; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring2Radius_km)
  var ring2Radius_m = kmtom(ring2Radius_km);
  // console.log(ring2Radius_m)
  var ring2_kpa = 68.95; // 10 psi
  var ring2_blast_structuralDamage = "Reinforced concrete buildings are severely damaged or demolished.";
  var ring2Description_text = ringDescription(ring2_kpa, ring2_blast_structuralDamage);
  var ring2Color = "RED";
  var ring2Color_alpha = 0.2;
  ring(ring2Id, positionCartographic, ring2Radius_km, ringImg, ring2Description_text, ring2Radius_m, ring2Color, ring2Color_alpha);

  var ring3Id = "ring3"
  var ring3Radius_km = Math.pow(warheadYield,0.33)*0.57; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring3Radius_km);
  var ring3Radius_m = kmtom(ring3Radius_km);
  // console.log(ring3Radius_m)
  var ring3_kpa = 34.47; // 5 psi
  var ring3_blast_structuralDamage = "Most buildings collapse.";
  var ring3Description_text = ringDescription(ring3_kpa, ring3_blast_structuralDamage);
  var ring3Color = "RED";
  var ring3Color_alpha = 0.2;
  ring(ring3Id, positionCartographic, ring3Radius_km, ringImg, ring3Description_text, ring3Radius_m, ring3Color, ring3Color_alpha);

  var ring4Id = "ring4"
  var ring4Radius_km = Math.pow(warheadYield,0.33)*0.79; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring4Radius_km);
  ring4Radius_m = kmtom(ring4Radius_km);
  // console.log(ring4Radius_m)
  var ring4_kpa = 20.68; // 3 psi
  var ring4_blast_structuralDamage = "Residential structures collapse.";
  var ring4Description_text = ringDescription(ring4_kpa, ring4_blast_structuralDamage);
  var ring4Color = "RED";
  var ring4Color_alpha = 0.3;
  ring(ring4Id, positionCartographic, ring4Radius_km, ringImg, ring4Description_text, ring4Radius_m, ring4Color, ring4Color_alpha);

  var ring5Id = "ring5"
  var ring5Radius_km = Math.pow(warheadYield, 0.33) * 1.66; // Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/104
  // console.log(ring5Radius_km)
  ring5Radius_m = kmtom(ring5Radius_km);
  // console.log(ring5Radius_m)
  var ring5_kpa = 6.89; // 1 psi
  var ring5_blast_structuralDamage = "Window glass shatters.";
  var ring5Description_text = ringDescription(ring5_kpa, ring5_blast_structuralDamage);
  var ring5Color = "YELLOW";
  var ring5Color_alpha = 0.2;
  ring(ring5Id, positionCartographic, ring5Radius_km, ringImg, ring5Description_text, ring5Radius_m, ring5Color, ring5Color_alpha);

  var mcImg = "assets/stabilized-cloud-dimensions.png";
  var fireballRadius = (Math.pow(warheadYield, 0.4) * 110) * 0.3048; // Nuclear Fireball Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT https://nuclearweaponsedproj.mit.edu/Node/105
  // console.log(fireballRadius)
  var fireball_radiusFixed = fireballRadius.toFixed(1);
  var fireball_kpa = 1378.95;
  var fireball_blast_structuralDamage = "Anything inside the fireball is effectively vaporized."
  var fireballDescription_text = ringDescription(fireball_kpa, fireball_blast_structuralDamage);
  // console.log(fireball_radiusFixed)
  var mc_stemDescription =
  `<h3>\
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
  </p>\ ` // Nukemap by Alex Wellerstein https://nuclearsecrecy.com/nukemap/

  viewer.entities.add({
    id:"mcstem",
    name: "Fireball Radius, Mushroom Cloud Stem",
    description: infoboxDescription(mcImg, '', mc_stemDescription, fireballDescription_text),
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

  var mc_headDescription =
  '<h3>\
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
  </p>'; // Nukemap by Alex Wellerstein https://nuclearsecrecy.com/nukemap/

  viewer.entities.add({
    id: "mchead",
    name: "Mushroom Cloud Head",
    description: infoboxDescription(mcImg, mc_headDescription, '', ''),
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
      totalPopulation = demographicsData.TOTPOP.toLocaleString()
      var estimatedCasualties_headerText = "Estimated Casualties:";
      var estimatedCasualties_bodyText = `${totalPopulation} people within 3.6 km radius dead`;
      estimatedCasualties(estimatedCasualties_headerText, estimatedCasualties_bodyText, reload=false);
      createButtons(0, "Reload Weapon", "reloadButton", reloadWeapon, "detonateText");
    }
    catch (err) {
      var error_headerText = "Cannot Estimate Casualties:";
      var error_bodyText = "No population data found"
      estimatedCasualties(error_headerText, error_bodyText, reload=false)
      createButtons(0, "Reload Weapon", "reloadButton", reloadWeapon, "detonateText");
    }
    // console.log(demographicsData);
  });

  var hypocenterMarker_id = "hypocenter";
  var hypocenterLabel_name = "HYPOCENTER"
  cesiumMarker(hypocenterMarker_id, hypocenterLabel_name, positionCartographic, null);

  var airburstMarker_id = "airburst";
  var airburstLabel_name = "AIRBURST";
  cesiumMarker(airburstMarker_id, airburstLabel_name, positionCartographic, detonationAltitude);
}

// Start off looking at Beijing.
viewer.scene.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(116.383331, 39.916668, 15000)
}); 