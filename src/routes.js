const express = require('express');
let router = express.Router();

const Player = require('./chess/model/Player');

//routes for the index page

router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'Chess'
  });
});

router.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Login'
  });
});

router.get('/editAI', (req, res) => {
  res.render("pages/editAI", {nickname : 'Pentheos'});
});

module.exports = router;