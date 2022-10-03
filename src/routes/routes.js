const express = require('express');
let router = express.Router();

const Player = require('../chess/model/Player');
const db = require('../dbAccess/dbAccess');
const utils = require('../utils/utils');

//routes for the index page

router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', async (req, res) => {
  let playerDB = await db.getUserBySession(req.sessionID);
  let player = new Player();

  if(playerDB != null || playerDB != undefined){
    player.initByDatabase(playerDB);
  }

  res.render('pages/index', {
    title: 'Home - Chess AI',
    player: player.data()
  });
});

router.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Login',
    error: req.query.error,
    type: req.query.type
  });
});

router.get('/disconnect', (req, res) => {
  req.session.destroy();
  
  res.redirect('/home');
});

router.get('/editAI', async (req, res) => {
  let hasToSendHome = await utils.sendHomeIfNotConnected(req, res);

  if(hasToSendHome){
    console.log("here");
    return;
  }

  let user = await db.getUserBySession(req.sessionID);
  let player = new Player();

  player.initByDatabase(user);

  res.render("pages/editAI", {
    player: player.data(),
    root: user.root,
    title : 'edit AI'
  });
});

module.exports = router;