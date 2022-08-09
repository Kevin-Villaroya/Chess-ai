const express = require('express');
let router = express.Router();;

const Player = require('./chess/model/Player');

var db = require('./dbAccess');

/* ======================= UTILS ========================== */

function createErrorRequest(isSuccess, messageError){
  return {success : isSuccess, message : messageError||""};
}

/* ====================== ROUTES ========================= */

router.post('/login', (req, res) => {
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
  
router.post('/register', (req, res) => {
  console.log(req.body);

  let messageError = "";
  let password = req.body.password;

  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if(req.body.nickname == "" || req.body.email == "" || req.body.country == "" || password == ""){
    messageError = "Please fill all fields";
  }else if(!req.body.email.match(mailformat)){
    messageError = "Email is not valid";
  }else if(password == ''){
    messageError = 'Password is required';
  }else if(password.length < 6 || password.length > 20){
    messageError = 'Password must be between 6 and 20 characters';
  }else if(!password.match(/\d+/g)){
    messageError = 'Password must contain at least one number';
  }else if(!password.match(/[a-zA-Z]+/g)){
    messageError = 'Password must contain at least one letter';
  }else if(!password.match(/[^a-zA-Z0-9]+/g)){
    messageError = 'Password must contain at least one special character';
  }

  console.log(messageError);
  console.log(password);
  console.log(password.length);

  db.existUser(req.body.email, req.body.nickname, (exist) => {
    if(exist == "nickname" && messageError == ""){
      messageError = "Nickname already registered";
    }else if(exist == "email" && messageError == ""){
      messageError = "Email already registered";
    }

    if(messageError == ""){
      req.body.icone = "default";

      db.addUser(req.body.email, req.body.nickname, req.body.country, req.body.password);
      res.redirect("/login/?error=" + 'Account created');
    }else{
      res.redirect("/login/?error=" + messageError + '&type=register');
    }
  });
});

module.exports = router;