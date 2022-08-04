const express = require('express');
let router = express.Router();;

const Player = require('./chess/model/Player');

const saltRounds = 10;

var db = require('./dbAccess');

/* ======================= UTILS ========================== */

function createErrorRequest(isSuccess, messageError){
  return {success : isSuccess, message : messageError||""};
}

/* ====================== ROUTES ========================= */

router.post('/login', (req, res) => {
  let dataPlayer = null;

  db.getUser(req.body.id, req.body.password, (user) => {
    if(user != null){
      user.id = user._id;
      
      let player = new Player();
      player.initByDatabase(user);

      req.session.player = player;
      res.redirect("/home");
    }else{
      res.redirect("/login/?error=" + 'Incorect password or id');
    }
  });
});
  
router.post('/register', async (req, res) => {
  let messageError = "";
  let password = req.body.password;

  if(req.body.nickname == "" || req.body.email == "" || req.body.country == "" || password == ""){
    messageError = "Please fill all fields";
  }else if(password.length < 6 || password.length > 20 && password.match(/\d+/g) && password.match(/[a-zA-Z]+/g) && password.match(/[^a-zA-Z0-9]+/g)){
    messageError = "Password must be between 6 and 20 characters and must contain at least one number, one letter and one special character"
  }

  let exist = await db.existUser(req.body.email, req.body.nickname, (exist) => {
    if(exist == "nickname" && messageError == ""){
      messageError = "Nickname already registered";
    }else if(exist == "email" && messageError == ""){
      messageError = "Email already registered";
    }

    if(messageError == ""){
      req.body.icone = "default";

      db.addUser(req.body.email, req.body.nickname, req.body.country, req.body.password);
      res.json(createErrorRequest(true, "Registration complete"));
    }else{
      res.json(createErrorRequest(false, messageError));
    }
  });
});

module.exports = router;