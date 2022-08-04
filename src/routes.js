const express = require('express');
let router = express.Router();

const Player = require('./chess/model/Player');
const db = require('./dbAccess');

//routes for the index page

router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', async (req, res) => {
  let user = await db.getUserBySession(req.sessionID);
  let player = new Player();
  player.initByDatabase(user);

  res.render('pages/index', {
    title: 'Home - Chess AI',
    player: player.data()
  });
});

router.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Login',
    error: req.query.error
  });
});

router.get('/editAI', (req, res) => {
  res.render("pages/editAI", {nickname : 'Pentheos'});
});

module.exports = router;