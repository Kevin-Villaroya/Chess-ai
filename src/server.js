const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);

app.set('view engine', 'ejs');
app.use(express.static('public'));

module.exports = app;