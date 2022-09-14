const bcrypt = require('bcrypt');
const saltRounds = 10;

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

var db;
var dbAccess = {};

var utils = require('../utils/utils');

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

/*=========================  DB ACCESS USER FUNCTIONS  ================================*/

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

dbAccess.getUserById = async function (id){
  let query = { _id : id };

  let res = await db.collection('users').findOne(query);

  return res;
}
 
dbAccess.addUser = function addUser(email, nickname, country, password){
  hashPassword(password, (hash) => {
    let user = {
      email: email,
      nickname: nickname,
      password: hash,
      country: country,
      elo: 600,
      icone: 'default',
      ai: '',
      root : new Array()
    }

    db.collection('users').insertOne(user);

  });
}

dbAccess.getUserBySession = async function (sessionID){
  let session = await db.collection('sessions').findOne({_id : sessionID});

  if(session == null || session == undefined){
    return null;
  }

  let user = await this.getUserById(session.session.playerId);
  return user;
}


/*=========================  DB ACCESS FILES FUNCTIONS  ================================*/

dbAccess.getFile = async function (fileName, path, idSession){
  let user = await this.getUserBySession(idSession);

  if(user == null){
    return null;
  }

  let file = getFileAt(user.root, path, fileName);

  if(file.type == 'file'){
    return file;
  }

  return null;
}

dbAccess.saveFile = async function(fileReceived, path , idSession){
  let user = await this.getUserBySession(idSession);

  if(user == null || fileReceived == null){
    return null;
  }

  let file = getFileAt(user.root, path, fileReceived.name);

  if(file == null){
    return null;
  }

  file.content = fileReceived.content;

  db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
}

dbAccess.setMainAI = async function (fileReceived, path, idSession){
  let user = await this.getUserBySession(idSession);

  if(user == null){
    return null;
  }

  let file = getFileAt(user.root, path, fileReceived.name);

  if(file == null){
    return null;
  }

  let aiMain = utils.pathToString(path, fileReceived.name);

  db.collection('users').updateOne({_id : user._id}, {$set : {ai : aiMain}});
}

function hashPassword(password, callback){
  bcrypt.hash(password, saltRounds, function(err, hash) {
      callback(hash);
  });
}

dbAccess.addFile = async function (file, path, idSession, callback){
  let user = await this.getUserBySession(idSession);

  if(user == null){
    return null;
  }

  let fileExist = getFileAt(user.root, path, file.name);
  let folder = getFolderAt(user.root, path);
  
  let correctFile = {
    name : file.name,
    type : 'file',
    content : ""
  }

  if(fileExist == null){
    if(folder == null){
      callback(false);
    }else{
      if(folder.content == null || folder.content == undefined){
        folder.push(correctFile);
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
      }else{
        folder.content.push(correctFile);
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
      }
    }
  }else{
    callback(false);
  }
};

dbAccess.addFolder = async function (folder, path, idSession, callback){
  let user = await this.getUserBySession(idSession);
  let pathNewFolder = path.slice(0, path.length-1);
  pathNewFolder.push(folder.name);

  if(user == null){
    return null;
  }

  let folderExist = getFolderAt(user.root, pathNewFolder);

  let folderToAdd = {
    name : folder.name,
    type : 'folder',
    content : new Array()
  }

  if(folderExist == null || folderExist == undefined){
    if(path == undefined || path.length == 0){
      user.root.unshift(folderToAdd);

      db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
      callback(true);
    }else{
      let folder = getFolderAt(user.root, path);

      if(folder == null){
        callback(false);
      }else{
        folder.content.unshift(folderToAdd);
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
      }
    }
  }else{
    callback(false);
  }
};

dbAccess.deleteFolder = async function (path, idSession, callback){ 
  let user = await this.getUserBySession(idSession);

  if(user == null){
    return null;
  }

  let folder = getFolderAt(user.root, path);

  if(folder == null){
    callback(false);
    return;
  }

  let folderParent = getFolderAt(user.root, path.slice(0, path.length-1));

  if(folderParent == null){
    callback(false);
    return;
  }

  if(folderParent.content == null || folderParent.content == undefined){
    for(let i = 0; i < folderParent.length; i++){
      if(folderParent[i].name == folder.name){
        folderParent.splice(i, 1);
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
        return;
      }
    }
  }else{
    for(let i = 0; i < folderParent.content.length; i++){
      if(folderParent.content[i].name == folder.name){
        folderParent.content.splice(i, 1);
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
        return;
      }
    }
  }

  db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
  callback(true);
};

dbAccess.deleteFile = async function (path, fileName, idSession, callback){
  let user = await this.getUserBySession(idSession);

  if(user == null){
    return null;
  }

  let file = getFileAt(user.root, path, fileName);
  let folder = getFolderAt(user.root, path);
  
  if(file == null){
    callback(false);
    return;
  }

  if(folder == null){
    callback(false);
    return;
  }
  
  if(folder.content == null || folder.content == undefined){
    for(let i = 0; i < folder.length; i++){
      if(folder[i].name == file.name){
        folder.splice(i, 1);
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
        return;
      }
    }
  }else{
    for(let i = 0; i < folder.content.length; i++){
      if(folder.content[i].name == file.name){
        folder.content.splice(i, 1);
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
        return;
      }
    }
  }
  db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
  callback(true);
};

dbAccess.renameFile = async function (path, fileName, newName, idSession, callback){
  let user = await this.getUserBySession(idSession);

  if(user == null){
    return null;
  }

  let file = getFileAt(user.root, path, fileName);
  let folder = getFolderAt(user.root, path);

  if(folder == null){
    callback(false);
    return;
  }
  
  if(file == null){
    folder.name = newName;
    db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
    callback(true);
    return;
  }

  if(folder.content == null || folder.content == undefined){
    for(let i = 0; i < folder.length; i++){
      if(folder[i].name == file.name){
        folder[i].name = newName;
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
        return;
      }
    }
  }else{
    for(let i = 0; i < folder.content.length; i++){
      if(folder.content[i].name == file.name){
        folder.content[i].name = newName;
        db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
        callback(true);
        return;
      }
    }
  }
  db.collection('users').updateOne({_id : user._id}, {$set : {root : user.root}});
  callback(true);
};

/*===================== UTILS ========================*/
/*===================== UTILS FILES ========================*/

function getFolderAt(root, path){ 
  if(path == undefined || path.length == 0){
    return root;
  }

  if(root.content == null || root.content == undefined){
    for(let i = 0; i < path.length; i++){
      for(let j = 0; j < root.length; j++){
        if(root[j].name == path[i]){
          return getFolderAt(root[j], path.slice(i+1));
        }
      }
    }
  }else{
    for(let i = 0; i < path.length; i++){
      for(let j = 0; j < root.content.length; j++){
        if(root.content[j].name == path[i]){
          return getFolderAt(root.content[j], path.slice(i+1));
        }
      }
    }
  }
  
}

function getFileAt(root, path, fileName){
  let folderDest = getFolderAt(root, path);

  if(folderDest == null || folderDest == undefined){
    return null;
  }

  if(folderDest != null && folderDest != undefined && folderDest.length > 0){
    folderDest.content = folderDest;
  }

  if(folderDest.content == null || folderDest.content == undefined){
    for(let i = 0; i < folderDest.length; i++){
      if(folderDest[i].name == fileName){
        return folderDest[i];
      }
    }
  }else{
    for(let i = 0; i < folderDest.content.length; i++){
      if(folderDest.content[i].name == fileName){
        return folderDest.content[i];
      }
    }
  }

  return null;
}

module.exports = dbAccess;