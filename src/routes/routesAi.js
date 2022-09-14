const express = require('express');
let router = express.Router();

var db = require('../dbAccess/dbAccess');
var utils = require('../utils/utils');

router.post("/evalAI", async (req, res) => {
    let player = await db.getUserBySession(req.sessionID);
    //find the player in the rooms
    //get the idRoom
    //get the game
    //evaluate ai
});

module.exports = router;