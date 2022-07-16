const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);

const RoomManager = require('./chess/controller/RoomManager');

const routes = require('./routes');
const chessRoutes = require('./chess/routes');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/", routes);
app.use("/play", chessRoutes);

app.set('view engine', 'ejs');
app.use(express.static('public'));

var rooms = new RoomManager(io);

module.exports = rooms;
module.exports = server;