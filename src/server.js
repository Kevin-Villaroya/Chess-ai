const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require('express-session')
const dotenv = require('dotenv').config({path:__dirname+'/../env/.local.env'});
const uuid = require('uuid').v4;

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);

const RoomManager = require('./chess/controller/RoomManager');

const routes = require('./routes');
const chessRoutes = require('./chess/routes');
const apiRoutes = require('./routesApi');

var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  databaseName: 'ChessAI',
  collection: 'sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  }
});

app.use(session({
  genid: (req) => {
    return uuid()
  },
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/", routes);
app.use("/play", chessRoutes);
app.use("/api", apiRoutes);

app.set('view engine', 'ejs');
app.use(express.static('public'));

var rooms = new RoomManager(io);

module.exports = rooms;
module.exports = server;