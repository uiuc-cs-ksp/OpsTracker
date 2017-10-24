// enables all the main content area page elements that will be used to show a GeoGebra figure or Leaflet map
// available content height: 885px
function setupBody() {
  pageType = "body";
  
  // don't need this spinner where it is, move it for tag load
  $("#contentHeader").spin(false);
  $("#contentHeader").spin({ scale: 0.35, position: 'relative', top: '10px', left: (((955/2) + (getParameterByName("body").width('bold 32px arial')/2)) + 10) +'px' });

  // setup the dialog box
  // when it is closed, it will return to the top-left of the figure
  $("#figureDialog").dialog({autoOpen: false, 
                      closeOnEscape: true, 
                      resizable: false, 
                      width: "auto",
                      hide: { effect: "fade", duration: 300 }, 
                      show: { effect: "fade", duration: 300 },
                      position: { my: "left top", at: "left top", of: "#contentBox" },
                      close: function( event, ui ) { 
                        $(this).dialog("option", "position", { my: "left top", at: "left top", of: "#contentBox" }); 
                      }});
  // setup the content box
  $("#contentBox").css('top', '40px');
  $("#contentBox").css('height', '885px');
  $("#contentBox").fadeIn();
  
  // load up the GeoGebra figure
  loadBody(getParameterByName("body"));
  
  // spinner for figure & data loading
  $("#contentBox").spin({ position: 'relative', top: '50%', left: '50%' });
  $("#figureDialog").spin({ position: 'relative', top: '45px', left: '50%' });
  
  // uncheck all the filter boxes
  $("#asteroid-filter").prop('checked', false);
  $("#debris-filter").prop('checked', false);
  $("#probe-filter").prop('checked', false);
  $("#ship-filter").prop('checked', false);
  $("#station-filter").prop('checked', false);
  
  // setup footer
  $("#footer").html("<a target='_blank' href='http://www.kerbalspace.agency'>KSA Home Page</a> | 2D Orbit rendering: <a target='_blank' href='http://bit.ly/KSPTOT'>KSPTOT</a> | 3D Orbit Rendering: <a target='_blank' href='http://forum.kerbalspaceprogram.com/index.php?/topic/158826-3d-ksp-solar-system-scale-model-major-update-05202017/'>by Syntax</a> | <a target='_blank' href='https://github.com/KSAMissionCtrl/FlightTracker/wiki/Flight-Tracker-Documentation'>Flight Tracker Wiki</a>");
  $("#footer").fadeIn();
}

// load the data for all the bodies in the Kerbol system
function loadBodyAJAX(xhttp) {

  // separate each of the bodies and their fields
  var bodies = xhttp.responseText.split("|");
  
  // push each body into the array
  bodies.forEach(function(item, index) {
    var body = {};
  
    // separate the fields of this body
    var fields = item.split("`");
    fields.forEach(function(item, index) {
    
      // now get the name/value and assign the object
      var pair = item.split("~");
      if (pair[1] == "") {
        body[pair[0]] = null;
      } else if ($.isNumeric(pair[1])) {
        body[pair[0]] = parseFloat(pair[1]);
      } else {
        body[pair[0]] = pair[1];
      }
    });
    bodyCatalog.push(body);
  });
  isCatalogDataLoaded = true;
  $("#figureDialog").spin(false);
}

// load a new GeoGebra figure into the main content window
function loadBody(body) {
  
  // default to kerbol system
  if (!body.length) { body = "Kerbol-System"; }
  
  // close dialog, reset load flag, checkboxes, page name/title & history
  $("#figureDialog").dialog("close");
  isGGBAppletLoaded = false;
  $("#figureOptions").fadeOut();
  $("#nodes").prop('checked', true);
  $("#labels").prop('checked', true);
  $("#ref").prop('checked', true);
  $("#contentHeader").html(body.replace("-", " "));
  document.title = "KSA Operations Tracker" + " - " + body.replace("-", " ");
  strCurrentBody = body.split("-")[0];
  history.pushState({Type: "body", ID: body}, document.title, "http://www.kerbalspace.agency/Tracker/tracker.asp?body=" + body);
  
  // remove and add the figure container
  $("#figure").remove();
  $("#contentBox").html("<div id='figure'></div>");

  // setup GeoGebra
  // use a random number to always load a new file not from cache
  // can use cookies to check for prev version and load new cache if needed
  var parameters = {"prerelease":false,
                    "width":w2utils.getSize("#contentBox", 'width'),
                    "height":w2utils.getSize("#contentBox", 'height'),
                    "showToolBar":false,
                    "borderColor":null,
                    "showMenuBar":false,
                    "showAlgebraInput":false,
                    "showResetIcon":true,
                    "enableLabelDrags":false,
                    "enableShiftDragZoom":true,
                    "enableRightClick":false,
                    "capturingThreshold":null,
                    "showToolBarHelp":false,
                    "errorDialogsActive":true,
                    "useBrowserForJS":true,
                    "filename":"ggb/" + body + ".ggb"};
  var views = {"is3D":1};
  var applet = new GGBApplet('5.0', parameters, views);
  applet.inject('figure');
  
  // restart spinner so its on top of figure
  $("#contentBox").spin({ position: 'relative', top: '50%', left: '50%' });
}

// called after load and after user clicks the reset
function ggbOnInit(){
  
  // reset all the orbits since the figure itself is reset
  ggbOrbits = [];
  
  // reset all the checkboxes
  $("#nodes").prop('checked', true);
  $("#labels").prop('checked', true);
  $("#ref").prop('checked', true);

  // disable the spinner & show checkboxes if this is the first load
  if (!isGGBAppletLoaded) { 
    $("#contentBox").spin(false); 
    $("#figureOptions").fadeIn();
  }
  
  // hide the filters
  $("#vesselOrbitTypes").fadeOut();

  // loop through and catalog all the pre-made objects
  var bodyIDs = [];
  for (obj=0; obj<ggbApplet.getObjectNumber(); obj++) {

    // is this a unique identifier? Look for a letter followed by a number, ignore A
    if (ggbApplet.getObjectName(obj).charAt(0) != "A" && (bodyIDs.indexOf(ggbApplet.getObjectName(obj).charAt(0)) == -1 && $.isNumeric(ggbApplet.getObjectName(obj).charAt(1)))) {
    
      // add this identifier to the orbits list and also keep track that we've already used it
      ggbOrbits.push({Type: "body", ID: ggbApplet.getObjectName(obj).charAt(0), showName: false, showNodes: false, isHidden: false});
      bodyIDs.push(ggbApplet.getObjectName(obj).charAt(0));
    }
  }
  console.log(ggbOrbits);

  // bring figure body locations up to date
  // account for any time elapsed since page load
  ggbApplet.setValue("UT", currUT());
  
  // listen for any objects clicked on
  ggbApplet.registerClickListener("figureClick");
  
  // ok now for anyplace else to call up the applet
  isGGBAppletLoaded = true;
  
  // load any vessels in orbit around this object
  loadVesselOrbits();
  
  // declutter the view after a few seconds
  // make sure a quick figure switch doesn't declutter things too fast
  clearTimeout(timeoutHandle);
  timeoutHandle = setTimeout(declutterGGB, 2500);
}

// creates an orbit on the currently-loaded GeoGebra figure
function addGGBOrbit(vesselID, orbitData) {
    
    // TODO we can't add the same orbit twice so if this is already created, destroy it
    
    // need the data of the body this vessel is in orbit around
    // get the current body being orbited using its parent node in the menu
    // then look it up in the body catalog
    var strBodyName = w2ui['menu'].get('activeVessels', vesselID).parent.id.split("-")[0];
    var bodyData = [];
    bodyCatalog.forEach(function(item, index) { if (item.Body == strBodyName) { bodyData = item; return; }});
    
    // type of vessel so we can color things appropriately
    var strVesselType = w2ui['menu'].get('activeVessels', vesselID).img.split("-")[1];
    
    // enable this vessel type in the filters menu
    $("#" + strVesselType + "-filter").removeAttr("disabled");
    $("#" + strVesselType + "-filter").prop('checked', true);
    $("#" + strVesselType + "-label").css('color', orbitColors[strVesselType]);
    
    // convert the vessel id to a variable name suitable for GeoGebra then load the vessel into the figure
    ggbID = vesselID.replace("-", "");
    ggbApplet.evalCommand(ggbID + 'id="' + vesselID + '"');
    ggbApplet.evalCommand(ggbID + 'sma=' + orbitData.SMA);
    ggbApplet.evalCommand(ggbID + 'pe=' + (orbitData.Periapsis + bodyData.Radius));
    ggbApplet.evalCommand(ggbID + 'ap=' + (orbitData.Apoapsis + bodyData.Radius));
    ggbApplet.evalCommand(ggbID + 'ecc=' + orbitData.Eccentricity);
    ggbApplet.evalCommand(ggbID + 'inc=' + (orbitData.Inclination * .017453292519943295));
    ggbApplet.evalCommand(ggbID + 'raan=' + (orbitData.RAAN * .017453292519943295));
    ggbApplet.evalCommand(ggbID + 'arg=' + (orbitData.Arg * .017453292519943295));
    ggbApplet.evalCommand(ggbID + 'period=' + orbitData.OrbitalPeriod);
    ggbApplet.evalCommand(ggbID + 'mean=' + toMeanAnomaly(orbitData.TrueAnom * .017453292519943295, orbitData.Eccentricity));
    ggbApplet.evalCommand(ggbID + 'smna=' + ggbID + 'sma sqrt(1 - ' + ggbID + 'ecc^2)');
    ggbApplet.evalCommand(ggbID + 'foci=' + ggbID + 'ap - ' + ggbID + 'pe');
    ggbApplet.evalCommand(ggbID + 'meanmotion=2pi / ' + ggbID + 'period');
    ggbApplet.evalCommand(ggbID + 'obtaxis=Line(origin, Vector((1; ' + ggbID + 'raan - pi / 2; pi / 2 - ' + ggbID + 'inc)))');
    ggbApplet.setVisible(ggbID + 'obtaxis', false);
    ggbApplet.evalCommand(ggbID + 'secondfocus=Rotate(Rotate((' + ggbID + 'foci; 0; 0), ' + ggbID + 'raan, zAxis), ' + ggbID + 'arg + pi, ' + ggbID + 'obtaxis)');
    ggbApplet.setVisible(ggbID + 'secondfocus', false);
    ggbApplet.evalCommand(ggbID + 'refpoint=Rotate(Rotate((' + ggbID + 'sma; 0; 0), ' + ggbID + 'raan, zAxis), ' + ggbID + 'arg - acos(-' + ggbID + 'ecc), ' + ggbID + 'obtaxis)');
    ggbApplet.setVisible(ggbID + 'refpoint', false);
    ggbApplet.evalCommand(ggbID + 'conic=Ellipse(origin, ' + ggbID + 'secondfocus, ' + ggbID + 'refpoint)');
    ggbApplet.setColor(ggbID + 'conic', hexToRgb(orbitColors[strVesselType]).r, hexToRgb(orbitColors[strVesselType]).g, hexToRgb(orbitColors[strVesselType]).b);
    ggbApplet.evalCommand(ggbID + 'penode=Point(' + ggbID + 'conic, 0)');
    ggbApplet.setCaption(ggbID + 'penode', "Pe");
    ggbApplet.setLabelStyle(ggbID + 'penode', 3);
    ggbApplet.setLabelVisible(ggbID + 'penode', true);
    ggbApplet.setColor(ggbID + 'penode', 0, 153, 255);
    ggbApplet.setPointSize(ggbID + 'penode', 3);
    ggbApplet.setFixed(ggbID + 'penode', true, false);
    ggbApplet.evalCommand(ggbID + 'apnode=Point(' + ggbID + 'conic, 0.5)');
    ggbApplet.setCaption(ggbID + 'apnode', "Ap");
    ggbApplet.setLabelStyle(ggbID + 'apnode', 3);
    ggbApplet.setLabelVisible(ggbID + 'apnode', true);
    ggbApplet.setColor(ggbID + 'apnode', 0, 153, 255);
    ggbApplet.setPointSize(ggbID + 'apnode', 3);
    ggbApplet.setFixed(ggbID + 'apnode', true, false);
    ggbApplet.evalCommand(ggbID + 'anode=If(' + ggbID + 'inc != 0, Element({Intersect(xOyPlane, ' + ggbID + 'conic)}, 1), Point(' + ggbID + 'conic, ' + ggbID + 'raan / (2pi)))');
    ggbApplet.setCaption(ggbID + 'anode', "AN");
    ggbApplet.setLabelStyle(ggbID + 'anode', 3);
    ggbApplet.setLabelVisible(ggbID + 'anode', true);
    ggbApplet.setColor(ggbID + 'anode', 51, 255, 0);
    ggbApplet.setPointSize(ggbID + 'anode', 3);
    ggbApplet.setFixed(ggbID + 'anode', true, false);
    ggbApplet.evalCommand(ggbID + 'anodeta=If(' + ggbID + 'arg != 0, Angle(' + ggbID + 'penode, origin, ' + ggbID + 'anode), 0)');
    ggbApplet.evalCommand(ggbID + 'anodeea=If(' + ggbID + 'anodeta > pi, 2pi - acos((' + ggbID + 'ecc + cos(' + ggbID + 'anodeta)) / (1 + ' + ggbID + 'ecc cos(' + ggbID + 'anodeta))), acos((' + ggbID + 'ecc + cos(' + ggbID + 'anodeta)) / (1 + ' + ggbID + 'ecc cos(' + ggbID + 'anodeta))))');
    ggbApplet.evalCommand(ggbID + 'anodema=' + ggbID + 'anodeea - ' + ggbID + 'ecc sin(' + ggbID + 'anodeea)');
    ggbApplet.evalCommand(ggbID + 'dnode=If(' + ggbID + 'inc != 0, Element({Intersect(xOyPlane, ' + ggbID + 'conic)}, 2), Point(' + ggbID + 'conic, (' + ggbID + 'raan + pi) / (2pi)))');
    ggbApplet.setCaption(ggbID + 'dnode', "DN");
    ggbApplet.setLabelStyle(ggbID + 'dnode', 3);
    ggbApplet.setLabelVisible(ggbID + 'dnode', true);
    ggbApplet.setColor(ggbID + 'dnode', 51, 255, 0);
    ggbApplet.setPointSize(ggbID + 'dnode', 3);
    ggbApplet.setFixed(ggbID + 'dnode', true, false);
    ggbApplet.evalCommand(ggbID + 'maut=Mod(' + ggbID + 'mean + ' + ggbID + 'meanmotion (UT-' + orbitData.Eph + '), 2pi)');
    ggbApplet.evalCommand(ggbID + 'eaut=Iteration(M - (M - ' + ggbID + 'ecc sin(M) - ' + ggbID + 'maut) / (1 - ' + ggbID + 'ecc cos(M)), M, {' + ggbID + 'maut}, 20)');
    ggbApplet.evalCommand(ggbID + 'position=Point(' + ggbID + 'conic, ' + ggbID + 'eaut / (2pi))');
    ggbApplet.setCaption(ggbID + 'position', w2ui['menu'].get('activeVessels', vesselID).text.split(" (")[0]);
    ggbApplet.setLabelStyle(ggbID + 'position', 3);
    ggbApplet.setPointSize(ggbID + 'position', 2);
    ggbApplet.setLabelVisible(ggbID + 'position', true);
    ggbApplet.setColor(ggbID + 'position', hexToRgb(orbitColors[strVesselType]).r, hexToRgb(orbitColors[strVesselType]).g, hexToRgb(orbitColors[strVesselType]).b);
    
    // add this vessel type and ID to the orbits array for filtering
    ggbOrbits.push({Type: strVesselType, ID: ggbID, showName: false, showNodes: false, isHidden: false});
}

// remove all the nodes and names for everything in the figure and store them for future use
function declutterGGB() {
  
  // hide figure elements
  // for orbits, local settings override declutter
  ggbApplet.setVisible("RefLine", false);
  ggbOrbits.forEach(function(item, index) { 
    if (!item.showNodes) {
      if (item.Type == "body") {
        ggbApplet.setVisible(item.ID + "26", false);
        ggbApplet.setVisible(item.ID + "27", false);
        ggbApplet.setVisible(item.ID + "28", false);
        ggbApplet.setVisible(item.ID + "32", false);
      } else {
        ggbApplet.setVisible(item.ID + "apnode", false);
        ggbApplet.setVisible(item.ID + "penode", false);
        ggbApplet.setVisible(item.ID + "anode", false);
        ggbApplet.setVisible(item.ID + "dnode", false);
      }
    }
    if (!item.showName) {
      if (item.Type == "body") {
        ggbApplet.setLabelVisible(item.ID + "36", false);
      } else {
        ggbApplet.setLabelVisible(item.ID + "position", false);
      }
    }
  });

  
  // uncheck all the boxes
  $("#nodes").prop('checked', false);
  $("#labels").prop('checked', false);
  $("#ref").prop('checked', false);
  
  // nullify to let anyone else know this has already happened
  timeoutHandle = null;
}

// handle any objects that are clicked in the GeoGebra figure
function figureClick(object) {
  if (object == "RefLine") {
    ggbApplet.evalCommand("SetViewDirection((0,0,1), true)");
    return;
  }
  
  // show label if clicked on an orbit
  // hide label if click on another orbit or the same orbit
  // make sure the labels box is not checked
  if (object.includes("23")) {
    if (!$("#labels").is(":checked")) {
      if (strTinyBodyLabel == object) {
        ggbApplet.setLabelVisible(strTinyBodyLabel.charAt(0) + "36", false);
        ggbOrbits.find(o => o.ID === object.charAt(0)).showName = false;
        strTinyBodyLabel = "";
      } else {
        if (strTinyBodyLabel.length) {
          if (strTinyBodyLabel.includes("23")) {
            ggbApplet.setLabelVisible(strTinyBodyLabel.charAt(0) + "36", false);
          } else {
            var objID = strTinyBodyLabel.replace("conic", "");
            ggbApplet.setLabelVisible(objID + "position", false);
            ggbApplet.setVisible(objID + "penode", false);
            ggbApplet.setVisible(objID + "apnode", false);
            ggbApplet.setVisible(objID + "anode", false);
            ggbApplet.setVisible(objID + "dnode", false);
          }
        }
        ggbOrbits.find(o => o.ID === object.charAt(0)).showName = true;
        ggbApplet.setLabelVisible(object.charAt(0) + "36", true);
        strTinyBodyLabel = object;
      }
    }
    return;
  
  // for a vessel/asteroid
  } else if (object.includes("conic")) {
    if (!$("#labels").is(":checked")) {
      if (strTinyBodyLabel == object) {
        var objID = strTinyBodyLabel.replace("conic", "");
        ggbApplet.setLabelVisible(objID + "position", false);
        ggbApplet.setVisible(objID + "penode", false);
        ggbApplet.setVisible(objID + "apnode", false);
        ggbApplet.setVisible(objID + "anode", false);
        ggbApplet.setVisible(objID + "dnode", false);
        ggbOrbits.find(o => o.ID === objID).showName = false;
        ggbOrbits.find(o => o.ID === objID).showNodes = false;
        strTinyBodyLabel = "";
      } else {
        if (strTinyBodyLabel.length) {
          if (strTinyBodyLabel.includes("23")) {
            ggbApplet.setLabelVisible(strTinyBodyLabel.charAt(0) + "36", false);
          } else {
            var objID = strTinyBodyLabel.replace("conic", "");
            ggbApplet.setLabelVisible(objID + "position", false);
            ggbApplet.setVisible(objID + "penode", false);
            ggbApplet.setVisible(objID + "apnode", false);
            ggbApplet.setVisible(objID + "anode", false);
            ggbApplet.setVisible(objID + "dnode", false);
          }
        }
        var objID = object.replace("conic", "");
        ggbApplet.setLabelVisible(objID + "position", true);
        ggbApplet.setVisible(objID + "penode", true);
        ggbApplet.setVisible(objID + "apnode", true);
        ggbApplet.setVisible(objID + "anode", true);
        ggbApplet.setVisible(objID + "dnode", true);
        ggbOrbits.find(o => o.ID === objID).showName = true;
        ggbOrbits.find(o => o.ID === objID).showNodes = true;
        strTinyBodyLabel = object;
      }
    }
    return;
  }

  // clicked on a planet?
  if (object.includes("36") || object.includes("37")) {

    // show the planet data
    if (isCatalogDataLoaded) {
      var strBodyName = ggbApplet.getCaption(object.charAt(0) + "36");
      var strHTML = "<table style='border: 0px; border-collapse: collapse;'><tr><td style='vertical-align: top; width: 256px;'>";
      var bodyIndex;
      for (bodyIndex=0; bodyIndex<bodyCatalog.length; bodyIndex++) {
        if (strBodyName == bodyCatalog[bodyIndex].Body) { break; }
      }
      if (bodyCatalog[bodyIndex].Image != 'null') {
        strHTML += "<img src='" + bodyCatalog[bodyIndex].Image + "' style='background-color:black;'>";
      } else {
        strHTML += "<img src='nada.png'>";
      }
      strHTML += "<i><p>&quot;" + bodyCatalog[bodyIndex].Desc + "&quot;</p></i><p><b>- Kerbal Astronomical Society</b></p></td>";
      strHTML += "<td style='vertical-align: top; padding: 0px; margin-top: 0px'><b>Orbital Data</b>";
      strHTML += "<p>Apoapsis: " + bodyCatalog[bodyIndex].Ap + " m<br>";
      strHTML += "Periapsis: " + bodyCatalog[bodyIndex].Pe + " m<br>";
      strHTML += "Eccentricity: " + bodyCatalog[bodyIndex].Ecc + "<br>";
      strHTML += "Inclination: "+ bodyCatalog[bodyIndex].Inc + "&deg;<br>";
      strHTML += "Orbital period: " + formatTime(bodyCatalog[bodyIndex].ObtPeriod, false) + "<br>";
      strHTML += "Orbital velocity: " + bodyCatalog[bodyIndex].ObtVel + " m/s</p><p><b>Physical Data</b></p>";
      strHTML += "<p>Equatorial radius: " + numeral(bodyCatalog[bodyIndex].Radius*1000).format('0,0') + " m<br>";
      strHTML += "Mass: " + bodyCatalog[bodyIndex].Mass.replace("+", "e") + " kg<br>";
      strHTML += "Density: " + bodyCatalog[bodyIndex].Density + " kg/m<sup>3</sup><br>";
      gravity = bodyCatalog[bodyIndex].SurfaceG.split(":");
      strHTML += "Surface gravity: " + gravity[0] + " m/s<sup>2</sup> <i>(" + gravity[1] + " g)</i><br>";
      strHTML += "Escape velocity: " + bodyCatalog[bodyIndex].EscapeVel + " m/s<br>";
      strHTML += "Rotational period: " + formatTime(bodyCatalog[bodyIndex].SolarDay, true) + "<br>";
      strHTML += "Atmosphere: " + bodyCatalog[bodyIndex].Atmo + "</p>";
      if (bodyCatalog[bodyIndex].Moons) { strHTML += "<p><b>Moons</b></p><p>" + bodyCatalog[bodyIndex].Moons + "</p>"; }
      if (getParameterByName("body") == "Kerbin-System" && strBodyName == "Kerbin") {
        strHTML += "<p><a href='http://www.kerbalspace.agency/Tracker/body.asp?db=bodies&body=Kerbin&map=true' style='cursor: pointer; color: blue; text-decoration: none;'>View Surface</a> | ";
      } else if (bodyCatalog[bodyIndex].Moons && !$("#contentHeader").html().includes(strBodyName)) {
        strHTML += "<span onclick='loadBody(&quot;" + strBodyName + "-System&quot;)' style='cursor: pointer; color: blue;'>View System</span> | "
      }
      // no nodes to show unless body has an eccentric or inclined orbit
      if ((parseFloat(bodyCatalog[bodyIndex].Ecc) || parseFloat(bodyCatalog[bodyIndex].Inc)) && !$("#contentHeader").html().includes(strBodyName)) {
        if (ggbOrbits.find(o => o.ID === object.charAt(0)).showNodes) {
          strHTML += "<span onclick='nodesToggle(&quot;" + object + "&quot;)' style='cursor: pointer; color: blue;'>Hide Nodes</span>"
        } else {
          strHTML += "<span onclick='nodesToggle(&quot;" + object + "&quot;)' style='cursor: pointer; color: blue;'>Show Nodes</span>"
        }
      } else { strHTML = strHTML.substring(0, strHTML.length-2); }
      strHTML += "</p></td></tr></table>";
    }
    $("#figureDialog").dialog("option", "title", strBodyName);
    $("#figureDialog").html(strHTML);
    $("#figureDialog").dialog("open");
    return;
  }
}

function nodesToggle(object) {
  if ($('#figureDialog').html().includes("Show Nodes")) {
    $('#figureDialog').html($('#figureDialog').html().replace("Show Nodes", "Hide Nodes"));
    if (ggbApplet.getCaption(object.charAt(0) + "36") == "Priax") { object = object.replace("D", "C"); }
    ggbApplet.setVisible(object.charAt(0) + "26", true);
    ggbApplet.setVisible(object.charAt(0) + "27", true);
    ggbApplet.setVisible(object.charAt(0) + "28", true);
    ggbApplet.setVisible(object.charAt(0) + "32", true);
    
    // https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
    ggbOrbits.find(o => o.ID === object.charAt(0)).showNodes = true;
    if (ggbApplet.getCaption(object.charAt(0) + "36") == "Polta") { ggbOrbits.find(o => o.ID === "D").showNodes = true; }
    if (ggbApplet.getCaption(object.charAt(0) + "36") == "Priax") { ggbOrbits.find(o => o.ID === "C").showNodes = true; }
  } else {
    $('#figureDialog').html($('#figureDialog').html().replace("Hide Nodes", "Show Nodes"));
    if (ggbApplet.getCaption(object.charAt(0) + "36") == "Priax") { object = object.replace("D", "C"); }
    
    // don't actually hide if the diagram checkbox is checked
    if (!$("#nodes").is(":checked")) {
      ggbApplet.setVisible(object.charAt(0) + "26", false);
      ggbApplet.setVisible(object.charAt(0) + "27", false);
      ggbApplet.setVisible(object.charAt(0) + "28", false);
      ggbApplet.setVisible(object.charAt(0) + "32", false);
    }
    ggbOrbits.find(o => o.ID === object.charAt(0)).showNodes = false;
    if (ggbApplet.getCaption(object.charAt(0) + "36") == "Polta") { ggbOrbits.find(o => o.ID === "D").showNodes = false; }
    if (ggbApplet.getCaption(object.charAt(0) + "36") == "Priax") { ggbOrbits.find(o => o.ID === "C").showNodes = false; }
  }
}

// handle GeoGebra diagram display options
function toggleNodes(isChecked) {
  ggbOrbits.forEach(function(item, index) { 
    if (!item.showNodes && !item.isHidden) {
      if (item.Type == "body") {
        ggbApplet.setVisible(item.ID + "26", isChecked);
        ggbApplet.setVisible(item.ID + "27", isChecked);
        ggbApplet.setVisible(item.ID + "28", isChecked);
        ggbApplet.setVisible(item.ID + "32", isChecked);
      } else {
        ggbApplet.setVisible(item.ID + "apnode", isChecked);
        ggbApplet.setVisible(item.ID + "penode", isChecked);
        ggbApplet.setVisible(item.ID + "anode", isChecked);
        ggbApplet.setVisible(item.ID + "dnode", isChecked);
      }
    }
  });
}
function toggleLabels(isChecked) {
  ggbOrbits.forEach(function(item, index) { 
    if (!item.showName) {
      if (item.Type == "body") {
        ggbApplet.setLabelVisible(item.ID + "36", isChecked);
      } else {
        ggbApplet.setLabelVisible(item.ID + "position", isChecked);
      }
    }
  });
}
function toggleRefLine(isChecked) {
  ggbApplet.setVisible("RefLine", isChecked);
}
function filterVesselOrbits(id, checked) {
  if (checked) {
    ggbOrbits.forEach(function(item, index) {
      if (id == item.Type) {
        ggbApplet.setVisible(item.ID + "position", true);
        ggbApplet.setVisible(item.ID + "conic", true);
        ggbApplet.setVisible(item.ID + "penode", $("#nodes").is(':checked'));
        ggbApplet.setVisible(item.ID + "apnode", $("#nodes").is(':checked'));
        ggbApplet.setVisible(item.ID + "anode", $("#nodes").is(':checked'));
        ggbApplet.setVisible(item.ID + "dnode", $("#nodes").is(':checked'));
        ggbApplet.setLabelVisible(item.ID + "position", $("#labels").is(':checked'));
        item.isHidden = false;
      }
    });
  } else {
    ggbOrbits.forEach(function(item, index) {
      if (id == item.Type) {
        ggbApplet.setVisible(item.ID + "position", false);
        ggbApplet.setVisible(item.ID + "conic", false);
        ggbApplet.setVisible(item.ID + "penode", false);
        ggbApplet.setVisible(item.ID + "apnode", false);
        ggbApplet.setVisible(item.ID + "anode", false);
        ggbApplet.setVisible(item.ID + "dnode", false);
        ggbApplet.setLabelVisible(item.ID + "position", false);
        item.isHidden = true;
      }
    });
  }
}