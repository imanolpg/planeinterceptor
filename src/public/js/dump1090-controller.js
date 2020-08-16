const path = require('path');
const { spawn, exec } = require('child_process');
const net = require('net');

const { insertInDatabase, updateInDatabase, countInDatabase } = require('./database-controller');

exec("pkill -f dump1090");  // kills the computer process if existed

setTimeout(main, 1000);

function main() {

    const dump1090Process = spawn('dump1090', ["--net"]);
    
    dump1090Process.on("close", code => {
        console.log("child process exited with code" + code);
    });

    dump1090Process.stdout.on('data', function(data) {
        //console.log("DAT: " + data);
    });

    dump1090Process.stderr.on('data', function(data) {
        if (data.toString().includes("No supported RTLSDR devices found."))
            process.kill(0);
        console.log("ERR: " + data);
    });

    dump1090Process.on('error', (err) => console.log(err));

    setTimeout(() => {
        
        const client = new net.Socket();
        
        client.connect({host: 'localhost', port: 30003}, function() {
            console.log("TCP connection established with the server.");
        });

        client.on('error', (error) => {
            console.log(error);
        });

        client.on('data', (chunk) => {
            data = chunk.toString().replace('\r\n', '').split(',');
            plane = {
                messageType: data[0],
                transmissionType: data[1],
                sessionID: data[2],
                aircraftID: data[3],
                hexIdentification: data[4],
                flightID: data[5],
                dateMessageGenerated: data[6],
                timeMessageGenerated: data[7],
                dateMessageLogged: data[8],
                timeMessageLogged: data[9],
                callsign: data[10],
                altitude: data[11],
                groundSpeed: data[12],
                track: data[13],
                latitude: data[14],
                longitude: data[15],
                verticalRate: data[16],
                squawk: data[17],
                alertSquawkChange: data[18],
                emergency: data[19],
                SPIident: data[20],
                isOnGround: data[21]
            }
            countInDatabase({hexIdentification: plane.hexIdentification})
            .then( (result) => {
                if (result === 0){
                    insertInDatabase(plane);
                    console.log("plane added")
                } 
                else {
                    if (plane.messageType !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {messageType: plane.messageType});
                    if (plane.transmissionType !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {transmissionType: plane.transmissionType});
                    if (plane.sessionID !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {sessionID: plane.sessionID});
                    if (plane.aircraftID !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {aircraftID: plane.aircraftID});
                    if (plane.hexIdentification !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {flightID: plane.flightID});
                    if (plane.dateMessageGenerated !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {dateMessageGenerated: plane.dateMessageGenerated});
                    if (plane.timeMessageGenerated !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {timeMessageGenerated: plane.timeMessageGenerated});
                    if (plane.dateMessageLogged !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {dateMessageLogged: plane.dateMessageLogged});
                    if (plane.timeMessageLogged !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {timeMessageLogged: plane.timeMessageLogged});
                    if (plane.callsign !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {callsign: plane.callsign});
                    if (plane.altitude !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {altitude: plane.altitude});
                    if (plane.groundSpeed !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {groundSpeed: plane.groundSpeed});
                    if (plane.track !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {track: plane.track});
                    if (plane.latitude !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {latitude: plane.latitude});
                    if (plane.longitude !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {longitude: plane.longitude});
                    if (plane.verticalRate !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {verticalRate: plane.verticalRate});
                    if (plane.squawk !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {squawk: plane.squawk});
                    if (plane.alertSquawkChange !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {alertSquawkChange: plane.alertSquawkChange});
                    if (plane.emergency !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {emergency: plane.emergency});
                    if (plane.SPIident !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {SPIident: plane.SPIident});
                    if (plane.isOnGround !== "") updateInDatabase({hexIdentification: plane.hexIdentification}, {SPIident: plane.SPIident});
                    console.log("plane updated")
                }
            })
            .catch((err) => console.log(err));
        });
    }, 5000);
}