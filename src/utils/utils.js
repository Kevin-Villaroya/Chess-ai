let utils = {}

utils.createErrorRequest = function (isSuccess, messageError){
  return {success : isSuccess, message : messageError||""};
}

utils.pathToString = function (path, fileName){
  let pathString = "";

  for(let i = 0; i < path.length; i++){
    pathString += path[i] + "/";
  }

  pathString += fileName;
  
  return pathString;
}

module.exports = utils;