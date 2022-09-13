const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config();
const uuid = require('uuid').v4;

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);

const RoomManager = require('./chess/controller/RoomManager');

const routes = require('./routes/routes');
const chessRoutes = require('./routes/routes');
const apiRoutesUser = require('./routes/routesApiUser');
const apiRoutesFile = require('./routes/routesApiFilesManager');

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
app.use("/api", apiRoutesUser);
app.use("/api", apiRoutesFile);

app.set('view engine', 'ejs');
app.use(express.static('public'));

var rooms = new RoomManager(io);

module.exports = rooms;
module.exports = server;