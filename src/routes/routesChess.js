const express = require('express');
let router = express.Router();

const db = require('../dbAccess/dbAccess');
const Player = require('../chess/model/Player');

var utils = require('../utils/utils');
const { type } = require('os');

//routes for the index page
router.get('/local', async (req, res) => {
  let user = await db.getUserBySession(req.sessionID);
  let player1 = new Player();

  if(user != null){
    player1.initByDatabase(user);
  }

  res.render("pages/chess", {
    type: 'local',
    title: 'Chess - Local Game',
    player: player1.data(),
    player1: player1.data(),
    player2: player1.data()
  });
});

router.get('/test/:typeGame/:colorAI/:aiToTest', async (req, res) => {
  let user = await db.getUserBySession(req.sessionID);
  
  let player1 = new Player();
  let player;
  let player2;

  if(user != null){
    player1.initByDatabase(user);
  }else{
    res.send(utils.createErrorRequest(false, "Error you need to be connected"));
  }

  let aiPlayer = player1;
  aiPlayer.setHasAI();

  if(req.params.colorAI == 'white'){
    player2 = player1;
    player1 = aiPlayer;
    player = player2;
  }else{
    player2 = aiPlayer;
    player1 = player2;
    player = player1;
  }

  res.render("pages/chess", {
    type: 'test',
    title: 'Chess - Test Game',
    player: player.data(),
    player1: player1.data(),
    player2: player2.data()
  });
});

module.exports = router;