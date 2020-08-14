const express =  require('express');
const engine = require('ejs-mate');
const path = require('path');
const http = require('http');

// initializations
const app = express();
const server = http.createServer(app);

// settings
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// routes
app.use(require('./src/routes'));

//static files
app.use(express.static(path.join(__dirname, 'src', 'public')));

//dump1090 manager
require('./src/public/js/dump1090-manager')();

// starting the server
server.listen(3000, () => {
    console.log("Server on port 3000");
});