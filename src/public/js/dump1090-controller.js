const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

module.exports = () => {

    const dump1090Process = spawn('dump1090', ["--net"]);
    
    dump1090Process.on("close", code => {
        console.log(`child process exited with code ${code}`);
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

        client.on('data', function(chunk) {
            data = chunk.toString().split(',');
            console.log("NEW DATA: " + data);

        });
    }, 5000);
}