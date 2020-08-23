const express =  require('express');
const engine = require('ejs-mate');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const EventEmmiter = require('events');

// initializations
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const emitter = new EventEmmiter();


module.exports = {
    emitter
}

// settings
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// routes
app.use(require('./src/routes'));

// static files
app.use(express.static(path.join(__dirname, 'src', 'public')));

// dump1090 manager
require('./src/js/dump1090-controller');

// socket
io.on('connection', (socket) => {
    console.log("New socket connection");

    emitter.on('planeDetected', (plane) => {
        socket.emit('planeDetected', plane);
    });
});

emitter.on('test', () => {
    console.log("dentro de test");
});


// starting the server
server.listen(3000, () => {
    console.log("Server on port 3000");
});

// exit
process.on('uncaughtException', () => {
    server.close();
});

process.on('SIGTERM', () => {
    server.close();
});

process.on('exit', () => {
    server.close();
});