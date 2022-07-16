const express = require('express');
let router = express.Router();

//routes for the index page
router.get('/', (req, res) => {
  res.render("pages/chess");
});

module.exports = router;