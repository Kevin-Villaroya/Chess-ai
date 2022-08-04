const express = require('express');
let router = express.Router();

const db = require('../dbAccess');
const Player = require('./model/Player');

//routes for the index page
router.get('/local', async (req, res) => {
  let user = await db.getUserBySession(req.sessionID);
  let player1 = new Player();

  if(user != null){
    player1.initByDatabase(user);
  }

  res.render("pages/chess", {
    type: 'local',
    title: 'Chess',
    player: player1.data(),
    player1: player1.data(),
    player2: player1.data()
  });
});

module.exports = router;