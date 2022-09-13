let utils = {}

utils.createErrorRequest = function createErrorRequest(isSuccess, messageError){
  return {success : isSuccess, message : messageError||""};
}

module.exports = utils;