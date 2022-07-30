const express = require('express');
let router = express.Router();;

const Player = require('./chess/model/Player');

router.get('/login/:email/:password', (req, res) =>{
    let player = new Player();
  
    //TODO DATABASE
  
    if(player == undefined){
      res.send(null);
    }else{
      res.send(player);
    }
  });
  
  router.post('/register', (req, res) => {

    console.log(req.body.nickname);

  });

  module.exports = router;