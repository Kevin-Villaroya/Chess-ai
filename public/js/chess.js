/** =========================================  GLOBAL VARIABLES  ==================================================== **/
const socket = io();

var hasToDisplayId = true;
var idSquareSelected = null;
var idSquareMovementSelected = null;

var possibleMovements = {};
var pieces = new Array();

var colorPlayer;
var colorTurn;

/** =========================================  INIT CALLS  ==================================================== **/

initChessBoard();
enterRoom();

toggleGameOverAlert();

/** =========================================  SOCKET FUNCTIONS  ==================================================== **/

async function enterRoom(){
  socket.emit("play", getCookie('type'), getCookie('idPlayer'));

  socket.on("enterInRoom", (idRoom) => {
    setCookie('idRoom', idRoom);
  })

  socket.on("startGame", (data) => {
    colorPlayer = data.colorPlayer;
    colorTurn = data.colorTurn;
    pieces = data.pieces;

    convertPiecesMoves();

    displayPieces(pieces);
    listenGameSate();
    listenGameOver();

    if(colorPlayer != "white"){
      rotateBoard();
    }
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

    convertPiecesMoves();

    displayPieces(pieces);
    displayMovements([]);

    if(getCookie('type') == 'local'){
      rotateBoard();
    }

    setCapturedPieces();
  });
}

function listenGameOver(){
  socket.on("gameOver", (data) => {
    
    if(data.winner == "draw"){
      document.getElementsByClassName("game-over-winner-text")[0].innerHTML = "It's a draw !";
    }else{
      document.getElementsByClassName("game-over-winner-text")[0].innerHTML = "The winner is <span class = 'game-over-winner-color'>" + data.winner +  "</span> !";
    }

    toggleGameOverAlert();
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
function toggleGameOverAlert(){
  if(document.getElementById("game-over").style.display == "flex" || document.getElementById("game-over").style.display == ""){
    document.getElementById("game-over").style.display = "none";
  }else{
    document.getElementById("game-over").style.display = "flex";
  }
}

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
  for(let piece of pieces){
    if(piece.position == idSquare){
      return piece;
    }
  }
  return null;
}

function setCapturedPieces(){
  let whitePlayer;
  let blackPlayer;

  whitePieces = [];
  blackPieces = [];

  if(colorPlayer == 'white'){
    whitePlayer = 'player1';
    blackPlayer = 'player2';
  }else{
    whitePlayer = 'player2';
    blackPlayer = 'player1';
  }

  for(let piece of pieces){
    piece.type = piece.type.toLowerCase();

    if(piece.color == 'white'){
      if(whitePieces[piece.type] == undefined){
        whitePieces[piece.type] = 0;
      }
      whitePieces[piece.type] += 1;
    }else{
      if(blackPieces[piece.type] == undefined){
        blackPieces[piece.type] = 0;
      }
      blackPieces[piece.type] += 1;
    }
  }

  displayEatedPieces(whitePlayer, 'white', blackPieces);
  displayEatedPieces(blackPlayer, 'black', whitePieces);

  displayScore(whitePlayer, blackPlayer, whitePieces, blackPieces);
}

function displayEatedPieces(numberPlayer, colorPlayer, piecesOnBoard){
  let colorAdversary = colorPlayer == 'white' ? 'black' : 'white';

  var types = ['rook','bishop', 'knight', 'queen', 'pawn'];
  var quantity = [2, 2, 2, 1, 8];

  for(let i = 0; i < types.length; i++){
    let typeElement = types[i];

    if(piecesOnBoard[typeElement] == undefined){
      piecesOnBoard[typeElement] = 0;
    }

    let elementsEated = quantity[i] - piecesOnBoard[typeElement];

    if(elementsEated > 0){
      let idElement = numberPlayer + '-captured-' + typeElement;
      let element = document.getElementById(idElement);
      element.classList = 'captured-piece';
  
      let elementClass = typeElement + '-' + elementsEated + '-' + colorAdversary;
      element.classList.add(elementClass);
    }
  }
}

function displayScore(whitePlayer, blackPlayer, whitePieces, blackPieces){
  var types = ['rook','bishop', 'knight', 'queen', 'pawn'];
  var quantity = [2, 2, 2, 1, 8];
  var valuePiece = [5, 3, 3, 9, 1];

  let whiteScore = 0;
  let blackScore = 0;

  for(let i = 0; i < types.length; i++){
    let typeElement = types[i];
    let whiteElementEated = quantity[i] - whitePieces[typeElement];
    let blackElementEated = quantity[i] - blackPieces[typeElement];

    whiteScore += blackElementEated * valuePiece[i];
    blackScore += whiteElementEated * valuePiece[i];
  }

  let player = null;

  if(whiteScore > blackScore){
    player = whitePlayer;
    score = whiteScore - blackScore;
  }else if(blackScore > whiteScore){
    player = blackPlayer;
    score = blackScore - whiteScore;
  }

  document.getElementById(whitePlayer + '-captured-score').innerHTML = '';
  document.getElementById(blackPlayer + '-captured-score').innerHTML = '';

  if(player != null){
    document.getElementById(player + '-captured-score').innerHTML = '+' + score;
  }
}

function rotateBoard(){
  let board = document.getElementById('chess-table');

  if(window.getComputedStyle(board).flexDirection != 'column'){
    board.style.flexDirection = 'column';
  }else{
    board.style.flexDirection = 'column-reverse';
  }
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
  for(let i = 1; i <= 8; i++){
    for(let j = 1; j <= 8; j++){
      var idSquare = numberToLetterAlphabet(i) + j;

      removePiece(idSquare);
    }
  }


  for(piece of pieces){
    addPiece(piece.position, piece.type, piece.color);
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
    var movement = movements[i];
    var square = document.getElementById(movement);
    var div = document.createElement('div');

    if(getPiece(movement) == null){
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
  type = type.toLowerCase();
  var render = "/assets/pieces/" + color + '_' + type + '.png';

  return render;
}

function convertPiecesMoves(){

  pieces.forEach(piece => {
    let moves = new Array();

    piece.moves.forEach(move => {
      moves.push(positionToKey(move));
    });
    piece.moves = moves;
    piece.position = positionToKey(piece.position);
  });
}

function positionToKey(position){
  var letter = String.fromCharCode(position.row + 64).toLowerCase();
  var number = position.column;

  return letter + number;
}