const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

var db;
var dbAccess = {};

MongoClient.connect(process.env.MONGO_URL, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
        return console.log(err);
    }

    db = client.db('ChessAI');

    console.log(`MongoDB Connected: ` + process.env.MONGO_URL);
});

/*=========================  DB ACCESS FUNCTIONS  ================================*/

dbAccess.existUser = function existUser(email, nickname, callback){
  let queryEmail = { 
   $or:
     [
       { email : email },
       { nickname : email }
     ]
   };
 
   let queryNickname = { 
   $or:
     [
       { email : nickname },
       { nickname : nickname }
     ]
   };
 
  db.collection("users").find(queryEmail).toArray( (err, res) => {
   if(res.length > 0){
     callback("email");
   }else{
     db.collection("users").find(queryNickname).toArray( (err, res) => {
       if(res.length > 0){
         callback("nickname");
       }else{
         callback(false);
       }
     });
   }
  });
}
 
dbAccess.getUser = function getUser(id, password, callback){
  let query = { 
  $or:
    [
      { email : id },
      { nickname : id }
    ]
  };

  db.collection("users").find(query).toArray( (err, res) => {
    if(res.length > 0){

      bcrypt.compare(password, res[0].password).then(function(result) {
        if(result){
          callback(res[0]);
        }else{
          callback(null);
        }
      });
    }else{
      callback(null);
    }
  });
} 
 
dbAccess.addUser = function addUser(email, nickname, country, password){
  hashPassword(password, (hash) => {
    let user = {
      email: email,
      nickname: nickname,
      password: hash,
      country: country,
      elo: 600,
      icone: 'default'
    }

    db.collection('users').insertOne(user);

  });
}

function hashPassword(password, callback){
  bcrypt.hash(password, saltRounds, function(err, hash) {
      callback(hash);
  });
}

dbAccess.getUserBySession = async function (sessionID){
  let session = await db.collection('sessions').findOne({_id : sessionID});

  if(session == null || session == undefined){
    return null;
  }

  return session.session.player;
}

module.exports = dbAccess;