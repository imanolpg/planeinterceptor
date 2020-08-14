const map = L.map('mapid').setView([51.505, -0.09], 12);

L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png ').addTo(map);

map.locate({enableHightAccuracy: true});

map.on('locationfound', e => {
    L.marker([e.latlng.lat, e.latlng.lng]).bindPopup("You").addTo(map);
    map.setView([e.latlng.lat, e.latlng.lng], 13);
    socket.emit('userCoordinates', e.latlng);
});