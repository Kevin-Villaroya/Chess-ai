/** =========================================  GLOBAL VARIABLES  ==================================================== **/
const socket = io();

var hasToDisplayId = true;
var idSquareSelected = null;
var idSquareMovementSelected = null;

var possibleMovements = {};
var pieces = new Array();

var colorPlayer;
var colorTurn;

var typeGame = document.getElementById('typeGame').innerHTML;
/** =========================================  INIT CALLS  ==================================================== **/

initChessBoard();
enterRoom();

/** =========================================  SOCKET FUNCTIONS  ==================================================== **/

function setTypeGame(type){
  setCookie("type", type);
}

async function enterRoom(){
  let idSession = await getCookie("connect.sid");
  idSession = idSession.split(":")[1];
  idSession = idSession.split(".")[0];

  socket.emit("play", typeGame , idSession);

  socket.on("enterInRoom", (idRoom) => {
    setCookie('idRoom', idRoom);
  })

  socket.on("startGame", (data) => {
    colorPlayer = data.colorPlayer;
    colorTurn = data.colorTurn;
    newPieces = data.pieces;

    pieces = convertPiecesMoves(newPieces);

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
    if(getPiece(idSquareSelected).type == 'pawn' && isBorderSquare(idSquareMovementSelected)){
      toggleChoosePiece(idSquareMovementSelected, (pieceType) => {
        socket.emit("changePawn", idSquareSelected, idSquareMovementSelected, pieceType);
      });
    }else{
      socket.emit("move", idSquareSelected, idSquareMovementSelected);
    }
  }
}

async function listenGameSate(){
  socket.on("gameState", (data) => {
    colorTurn = data.colorTurn;
    let newPieces = data.pieces;

    newPieces = convertPiecesMoves(newPieces);

    movePieces(data.posInit, data.posFinal, () => {
      displayMovements([]);

      if(typeGame == 'local'){
        rotateBoard();
      }
  
      pieces = newPieces;
      displayPieces(newPieces);

      setCapturedPieces();
    });
  });
}

function listenGameOver(){
  socket.on("gameOver", (data) => {
    let gameOverContainer = document.getElementById('game-over-container');
    let gameOverText = document.getElementById('game-over-winner-text');

    if(typeGame != 'local'){
      if(data.winner == "pat"){
        gameOverContainer.classList.add('pat-game-over');
        gameOverText.innerHTML = "It's a draw !";
      }else if(data.winner == colorPlayer){
        gameOverContainer.classList.add('win-game-over');
        gameOverText.innerHTML = "You win !";
      }else{
        gameOverContainer.classList.add('lose-game-over');
        gameOverText.innerHTML = "You lose !";
      }
    }else{
      if(data.winner == "pat"){
        gameOverContainer.classList.add('pat-game-over');
        gameOverText.innerHTML = "It's a draw !";
      }else if(data.winner == "white"){
        gameOverContainer.classList.add('white-game-over');
        gameOverText.innerHTML = "White win !";
      }else{
        gameOverContainer.classList.add('black-game-over');
        gameOverText.innerHTML = "Black win !";
      }
    }

    toggleGameOverAlert();
  });
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
  if(document.getElementById('game-over').style.display == ""){
    document.getElementById('game-over').style.display = 'none';
  }

  if(document.getElementById("game-over").style.display == "flex" || document.getElementById("game-over").style.display == ""){
    document.getElementById("game-over").style.display = "none";
  }else{
    document.getElementById("game-over").style.display = "flex";
    console.log("display");
  }
}

async function toggleChoosePiece(idSquare, callback){
  let element = document.getElementById('choosePiece');
  let square = document.getElementById(idSquare);
  let board = document.getElementById('chess-table');

  let top = square.getBoundingClientRect().top - board.getBoundingClientRect().top - element.clientHeight / 4;
  let left = square.getBoundingClientRect().left - board.getBoundingClientRect().left;

  element.style.display = 'flex';
  element.style.top = top + 'px';
  element.style.left = left + 'px';

  element.addEventListener('click', function handleClick(event) {
    if(event.target.parentElement.id == 'choosePiece'){
      element.style.display = 'none';
      callback(event.target.name)
    }
  });
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
  let playerScore = document.getElementById('chess-game-container');

  if(window.getComputedStyle(board).flexDirection != 'column'){
    board.style.flexDirection = 'column';
    playerScore.style.flexDirection = 'column';
  }else{
    board.style.flexDirection = 'column-reverse';
    playerScore.style.flexDirection = 'column-reverse';
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

  for(let piece of pieces){
    addPiece(piece.position, piece.type, piece.color);
  }
}

function movePieces(posInit, posFinal, callback){
  pieceHtml = document.getElementById(posInit).getElementsByTagName('img')[0];

  let start = Date.now();

  pieceHtml.style.position = 'absolute';
  pieceHtml.style.zIndex = 1000;

  let finalSquare = document.getElementById(posFinal);
  let initSquare = document.getElementById(posInit);

  let top = pieceHtml.getBoundingClientRect().top - initSquare.getBoundingClientRect().top;
  let left = pieceHtml.getBoundingClientRect().left - initSquare.getBoundingClientRect().left;

  let topFinal = pieceHtml.getBoundingClientRect().top - finalSquare.getBoundingClientRect().top;
  let leftFinal = pieceHtml.getBoundingClientRect().left - finalSquare.getBoundingClientRect().left;

  let timer = setInterval(function() {
    let timePassed = Date.now() - start;
    let timeAnimation = 300;

    let timePercentLeft = timePassed / timeAnimation;

    if (timePercentLeft <= 1){
      pieceHtml.style.top = top + ((top - topFinal) * timePercentLeft) + 'px';
      pieceHtml.style.left = left + ((left - leftFinal) * timePercentLeft) + 'px';
    }

    if (timePercentLeft > 1.2){
      clearInterval(timer);
      pieceHtml.style.position = 'relative';
      pieceHtml.style.left = '0px';
      pieceHtml.style.top = '0px';
      callback();
    }
  }, 20);
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

function convertPiecesMoves(pieces){
  let piecesSetted = [];

  for(let piece of pieces){
    let moves = new Array();
    let pieceSetted = piece;

    piece.moves.forEach(move => {
      moves.push(positionToKey(move));
    });

    pieceSetted.moves = moves;
    pieceSetted.position = positionToKey(piece.position);

    piecesSetted.push(pieceSetted);
  }

  return piecesSetted;
}

function positionToKey(position){
  var letter = String.fromCharCode(position.row + 64).toLowerCase();
  var number = position.column;

  return letter + number;
}

function isBorderSquare(idSquare){
  return idSquare[1] == '1' || idSquare[1] == '8'
}