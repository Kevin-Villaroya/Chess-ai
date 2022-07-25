const express = require('express');
let router = express.Router();


//routes for the index page

router.get('/', (req, res) => {
  res.render("pages/index", {nickname : 'Pentheos'});
});

router.get('/editAI', (req, res) => {
  res.render("pages/editAI", {nickname : 'Pentheos'});
});

module.exports = router;