const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
  res.render("pages/index");
});

router.get('/play', (req, res) => {
  res.render('pages/chess');
});


module.exports = router;