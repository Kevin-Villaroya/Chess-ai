function numberToLetterAlphabet(number){
  var letter = String.fromCharCode(number + 64).toLowerCase();

  return letter;
}

function getCookie(key) {
  let name = key + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(key, value) {
  const d = new Date();
  d.setTime(d.getTime() + (1*24*60*60*1000));
  
  let expires = "expires="+ d.toUTCString();
  document.cookie = key + "=" + value + ";" + expires + ";path=/";
}