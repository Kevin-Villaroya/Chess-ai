/** =========================================  GLOBAL VARIABLES  ==================================================== **/
const socket = io();

var hasToDisplayId = true;
var idSquareSelected = null;
var idSquareMovementSelected = null;

var possibleMovements = {};
var pieces;

var colorPlayer;
var colorTurn;

/** =========================================  INIT CALLS  ==================================================== **/

initChessBoard();
enterRoom();

/** =========================================  SOCKET FUNCTIONS  ==================================================== **/

async function enterRoom(){
  socket.emit("play", getCookie('type'), getCookie('idPlayer'));

  socket.on("enterInRoom", (idRoom) => {
    setCookie('idRoom', idRoom);
  })

  socket.on("startGame", (data) => {
    displayPieces(data.pieces);

    colorPlayer = data.colorPlayer;
    colorTurn = data.colorTurn;
    pieces = data.pieces;

    listenGameSate();
  });
}

function makeMove(){  
  if(idSquareSelected != null && idSquareMovementSelected != null){
    socket.emit("move", idSquareSelected, idSquareMovementSelected);
  }
}

function listenGameSate(){
  socket.on("gameState", (data) => {
    colorTurn = data.colorTurn;
    pieces = data.pieces;

    displayPieces(data.pieces);
    displayMovements([]);
  }
  );
}

/** =========================================  INIT FUNCTIONS  ==================================================== **/

async function initChessBoard(){
  initIDSquares();
  initSquareEvent();
  displayIdSquares(hasToDisplayId);
};

function initIDSquares(){
  var idSquare = "";
  for(var letter = 1; letter <= 8; letter++){
    for(var number = 1; number <= 8; number++){
      idSquare = numberToLetterAlphabet(letter) + number;

      var div = document.createElement('div');
      div.className = "piece-square-text";
      div.innerHTML = idSquare;

      document.getElementById(idSquare).appendChild(div);
    }
  }
}

function initSquareEvent(){
  var squares = document.getElementsByClassName("piece-square");
  for(var i = 0; i < squares.length; i++){
    squares[i].addEventListener("click", function(){
      selectSquare(this.id);
    });
  }
}

/** =========================================  INTERACTION FUNCTIONS  ==================================================== **/
function selectSquare(idSquare){
  if(possibleMovements.length > 0 && possibleMovements.includes(idSquare)){
    idSquareMovementSelected = idSquare;
    makeMove();
  }else{
    if(idSquareSelected != null){
      document.getElementById(idSquareSelected).classList.remove("selectedPiece");
    }

    idSquareSelected = idSquare;
    
    var square = document.getElementById(idSquare);
    square.classList.add("selectedPiece");

    if (squareContainPiece(idSquare)){
      displayMovements(getPiece(idSquare).moves);
    }
  }
}

function squareContainPiece(idSquare){
  var square = document.getElementById(idSquare);

  return square.getElementsByTagName('img').length > 0;
}

function getPiece(idSquare){
  var piece = null;

  if(pieces[idSquare] != null){
    piece = pieces[idSquare];
  }

  return piece;
}

/** =========================================  DISPLAY FUNCTIONS  ==================================================== **/

function displayIdSquares(hasToDisplayId){
  if(hasToDisplayId){
    for(let element of document.getElementsByClassName("piece-square-text")){
        element.style.visibility = "visible";
    }
  }else{
    for(let element of document.getElementsByClassName("piece-square-text")){
        element.style.visibility = "hidden";
    }
  }
}

function displayPieces(pieces){
  for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){
      var squareBoard = numberToLetterAlphabet(i + 1) + (j + 1);

      if(pieces[squareBoard] != null){
        removePiece(squareBoard);
        addPiece(squareBoard, pieces[squareBoard].type, pieces[squareBoard].color);
      }else{
        removePiece(squareBoard);
      }
    }
  }
}

function displayMovements(movements){

  for(let i = 0; i < possibleMovements.length; i++){
    var square = document.getElementById(possibleMovements[i]);

    for(element of square.childNodes){
      if(element.classList.contains("possibleMovement") || element.classList.contains("possibleAttack")){
        square.removeChild(element);
      }
    }
  }

  for(let i = 0; i < movements.length; i++){
    var square = document.getElementById(movements[i]);
    var div = document.createElement('div');

    if(getPiece(movements[i]) == null){
      div.classList.add("possibleMovement");
      square.appendChild(div)
    }else{
      div.classList.add("possibleAttack");
      square.appendChild(div)
    }
  }

  possibleMovements = movements;
}

function addPiece(squareBoard, type, color){
  var img = document.createElement('img');
  img.src = getImageOfPiece(type, color);
  img.classList.add("piece");
  img.classList.add(color + '-piece');
  img.classList.add(type);

  document.getElementById(squareBoard).appendChild(img);
}

function removePiece(squareBoard){
  if(document.getElementById(squareBoard).getElementsByTagName('img').length > 0) {
    img = document.getElementById(squareBoard).getElementsByTagName('img')[0];

    document.getElementById(squareBoard).removeChild(img);
  }
}

function getImageOfPiece(type, color){
  var render = "/assets/pieces/" + color + '_' + type + '.png';

  return render;
}