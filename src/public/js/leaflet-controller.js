const map = L.map('mapid').setView([40.342545, -3.764699], 3);
var socket = io();
var planeMarkersList = [];

L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(map); // map to use

// asks the browser location permissions 
map.locate({enableHightAccuracy: true});

// executed when the browser gets the location
map.on('locationfound', (data) => {
    L.marker([data.latlng.lat, data.latlng.lng]).bindPopup("You").addTo(map);
    map.flyTo(L.latLng(data.latlng.lat, data.latlng.lng), 10, {duration: 2, noMoveStart: false});
    socket.emit('userCoordinates', data.latlng);
})

// executed when the socket conection with the server is established
socket.on('connect', () => {
    console.log("socket connection established");
});

// executed when a plane is sent from the server
socket.on('planeDetected', (plane) => {
    if (document.querySelector("div[id='" + plane.hexIdentification + "']") === null)
        addPlane(plane);
    else
        updatePlane(plane);
});

/**
 * Adds a new plane icon to the map
 * @param {number} latitude latitude for the icon
 * @param {number} longitude longitude for the icon
 * @param {string} hexIdentification popup message
 */
function addPlaneMarker(latitude, longitude, hexIdentification) {

    var count = 0;
    planeMarkersList.forEach((planeMarker) => {
        if (planeMarker.hexIdentification === hexIdentification){
            map.removeLayer(planeMarker.markerId);
            planeMarkersList.splice(count, 1);
        }
        count = count + 1;
    });

    planeIcon = L.icon({
        iconUrl: "assets/plane.png",
        iconSize: [30, 30]
    });
    var markerId = L.marker([latitude, longitude], {icon: planeIcon}).addTo(map).bindPopup(hexIdentification);
    planeMarkersList.push({hexIdentification: hexIdentification, markerId: markerId});
}

/**
 * Scans the plane cards in the web and deletes the ones that haven't been updated in the lasts 5 minutes.
 * It also deletes the map icons
 */
function manageOldPlanes() {

    planeCards = document.querySelectorAll("div[class='planeContainer']");
    planeCards.forEach((planeCard) => {
        minuteDifference = new Date().getMinutes() - planeCard.querySelector("p[id='timeMessageLogged']").innerText.split(" ")[1].split(":")[1];
        if (minuteDifference > 2 || minuteDifference < -58){
            planeCard.remove();
            count = 0;
            planeMarkersList.forEach((planeMarker) => {
                if (planeMarker.hexIdentification === planeCard.querySelector("p[id='hexIdentification']").innerHTML.split(" ")[1]){
                    map.removeLayer(planeMarker.markerId);
                    planeMarkersList.splice(count, 1);
                }
                count = count + 1;
            });
        }
    });
}

// executes the function every minute
setInterval(manageOldPlanes, 60 * 1000);

/**
 * Adds a new plane card with de data from the plane parameter
 * @param {object} plane plane object with whe values to show
 */
function addPlane(plane) {
    planesTemplate = document.getElementById("planes-template");

    planeContainer = document.createElement("div");
    planeContainer.className = "planeContainer";
    planeContainer.id = plane.hexIdentification;
    
    row1 = document.createElement("div");
    row1.className = "row";
    p = document.createElement("p");
    p.id = "callsign";
    plane.callsign !== "" ? textToInsert = "Callsign: " + plane.callsign : textToInsert = "Callsign: ";
    p.appendChild(document.createTextNode(textToInsert));
    row1.appendChild(p);
    p = document.createElement("p");
    p.id = "hexIdentification";
    plane.hexIdentification !== "" ? textToInsert = "HexIdentification: " + plane.hexIdentification : textToInsert = "HexIdentification: ";
    p.appendChild(document.createTextNode(textToInsert));
    row1.appendChild(p);

    row2 = document.createElement("div");
    row2.className = "row";
    p = document.createElement("p");
    p.id = "altitude";
    plane.altitude !== "" ? textToInsert = "Altitude: " + plane.altitude : textToInsert = "Altitude: ";
    p.appendChild(document.createTextNode(textToInsert));
    row2.appendChild(p);
    p = document.createElement("p");
    p.id = "groundSpeed";
    plane.groundSpeed !== "" ? textToInsert = "Ground speed: " + plane.groundSpeed : textToInsert = "Speed: ";
    p.appendChild(document.createTextNode(textToInsert));
    row2.appendChild(p);
    p = document.createElement("p");
    p.id = "latitude";
    plane.latitude !== "" ? textToInsert = "Latitude: " + plane.latitude : textToInsert = "Latitude: ";
    p.appendChild(document.createTextNode(textToInsert));
    row2.appendChild(p);
    p = document.createElement("p");
    p.id = "longitude";
    plane.longitude !== "" ? textToInsert = "Longitude: " + plane.longitude : textToInsert = "Longitude: ";
    p.appendChild(document.createTextNode(textToInsert));
    row2.appendChild(p);

    row3 = document.createElement("div");
    row3.className = "row";
    p = document.createElement("p");
    p.id = "dateMessageGenerated";
    plane.dateMessageGenerated !== "" ? textToInsert = "DateMsgGen: " + plane.dateMessageGenerated : textToInsert = "DateMsgGen: ";
    p.appendChild(document.createTextNode(textToInsert));
    row3.appendChild(p);
    p = document.createElement("p");
    p.id = "timeMessageGenerated";
    plane.timeMessageGenerated !== "" ? textToInsert = "TimeMsgGen: " + plane.timeMessageGenerated : textToInsert = "TimeMsgGen: ";
    p.appendChild(document.createTextNode(textToInsert));
    row3.appendChild(p);
    p = document.createElement("p");
    p.id = "timeMessageLogged";
    plane.timeMessageLogged !== "" ? textToInsert = "TimeMsgLogged: " + plane.timeMessageLogged : textToInsert = "TimeMsgLogged: ";
    p.appendChild(document.createTextNode(textToInsert));
    row3.appendChild(p);

    planeContainer.appendChild(row1);
    planeContainer.appendChild(row2);
    planeContainer.appendChild(row3);

    planesTemplate.appendChild(planeContainer);

    // check latitude and longitude to update map marker
    if(plane.latitude !== "" && plane.longitude !== "")
       addPlaneMarker(plane.latitude, plane.longitude, plane.hexIdentification);
}

/**
 * Updates the data of a plane card with the data from the plane parameter
 * @param {object} plane plane object with the new data
 */
function updatePlane(plane) {
    if (plane.callsign !== "") document.querySelector("div[id='"+ plane.hexIdentification + "']").querySelector("p[id='callsign']").innerHTML = "Callsign: " + plane.callsign;
    if (plane.altitude !== "") document.querySelector("div[id='"+ plane.hexIdentification + "']").querySelector("p[id='altitude']").innerHTML = "Altitude: " + plane.altitude;
    if (plane.groundSpeed !== "") document.querySelector("div[id='"+ plane.hexIdentification + "']").querySelector("p[id='groundSpeed']").innerHTML = "Ground speed: " + plane.groundSpeed;
    if (plane.latitude !== "") document.querySelector("div[id='"+ plane.hexIdentification + "']").querySelector("p[id='latitude']").innerHTML = "Latitude: " + plane.latitude;
    if (plane.longitude !== "") document.querySelector("div[id='"+ plane.hexIdentification + "']").querySelector("p[id='longitude']").innerHTML = "Longitude: " + plane.longitude;
    if (plane.dateMessageGenerated !== "") document.querySelector("div[id='"+ plane.hexIdentification + "']").querySelector("p[id='dateMessageGenerated']").innerHTML = "DateMsgGen: " + plane.dateMessageGenerated;
    if (plane.timeMessageGenerated !== "") document.querySelector("div[id='"+ plane.hexIdentification + "']").querySelector("p[id='timeMessageGenerated']").innerHTML = "TimeMsgGen: " + plane.timeMessageGenerated;
    if (plane.timeMessageLogged !== "") document.querySelector("div[id='"+ plane.hexIdentification + "']").querySelector("p[id='timeMessageLogged']").innerHTML = "TimeMsgLogged: " + plane.timeMessageLogged;

    // check latitude and longitude to update map marker
    if(plane.latitude !== "" && plane.longitude !== "")
        addPlaneMarker(plane.latitude, plane.longitude, plane.hexIdentification);
}