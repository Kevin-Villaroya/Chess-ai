let utils = {}

const db = require('../dbAccess/dbAccess');

utils.createErrorRequest = function (isSuccess, messageError){
  return {success : isSuccess, message : messageError||""};
}

utils.sendHomeIfNotConnected = async function (req, res){
  if(req.session.id == undefined){
    res.redirect('/');
    return true;
  }

  let user = await db.getUserBySession(req.sessionID);

  if(user == null){
    res.redirect('/');
    return true;
  }

  return false;
}

module.exports = utils;