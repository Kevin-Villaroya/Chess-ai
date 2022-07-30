const express = require('express');
let router = express.Router();

//routes for the index page
router.get('/local', (req, res) => {
  res.render("pages/chess", {
    type: 'local',
    title: 'Chess',
  });
});

module.exports = router;