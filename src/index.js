const path = require('path')

require('dotenv').config({path:__dirname+'../../env/.local.env'});

const server = require('./server');

const port = process.env.PORT || 8080;

const startServer = () => {
  server.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
  });
};

startServer();