const Rook = require('./piece/Rook');
const Knight = require('./piece/Knight');
const Bishop = require('./piece/Bishop');
const Queen = require('./piece/Queen');
const King = require('./piece/King');
const Pawn = require('./piece/Pawn');
const { positionFromString } = require('./Position');
const Position = require('./Position');

/** ============================== INIT  ============================== **/

module.exports = class Chess {

  constructor(type, player1, player2){
    this.type = type;

    this.player1 = player1;
    if(this.type != 'local'){
      this.player2 = player2;
    }else{
      this.player2 = player1;
    }

    this.initGame();
    this.listen();
  }

  initGame(){
    this.pieces = new Array();
    this.colorTurn = 'white';

    this.setPlayerColors();

    this.pieces.push(new Rook('white', 'a1'));
    this.pieces.push(new Rook('white', 'h1'));
    this.pieces.push(new Knight('white', 'b1'));
    this.pieces.push(new Knight('white', 'g1'));
    this.pieces.push(new Bishop('white', 'c1'));
    this.pieces.push(new Bishop('white', 'f1'));
    this.pieces.push(new Queen('white', 'd1'));
    this.pieces.push(new King('white', 'e1'));

    this.pieces.push(new Pawn('white', 'a2:!'));
    this.pieces.push(new Pawn('white', 'b2'));
    this.pieces.push(new Pawn('white', 'c2'));
    this.pieces.push(new Pawn('white', 'd2'));
    this.pieces.push(new Pawn('white', 'e2'));
    this.pieces.push(new Pawn('white', 'f2'));
    this.pieces.push(new Pawn('white', 'g2'));
    this.pieces.push(new Pawn('white', 'h2'));

    this.pieces.push(new Rook('black', 'a8'));
    this.pieces.push(new Rook('black', 'h8'));
    this.pieces.push(new Knight('black', 'b8'));
    this.pieces.push(new Knight('black', 'g8'));
    this.pieces.push(new Bishop('black', 'c8'));
    this.pieces.push(new Bishop('black', 'f8'));
    this.pieces.push(new Queen('black', 'd8'));
    this.pieces.push(new King('black', 'e8'));

    this.pieces.push(new Pawn('black', 'a7'));
    this.pieces.push(new Pawn('black', 'b7'));
    this.pieces.push(new Pawn('black', 'c7'));
    this.pieces.push(new Pawn('black', 'd7'));
    this.pieces.push(new Pawn('black', 'e7'));
    this.pieces.push(new Pawn('black', 'f7'));
    this.pieces.push(new Pawn('black', 'g7'));
    this.pieces.push(new Pawn('black', 'h7'));
  }

  setPlayerColors(){
    let rand = Math.floor(Math.random() * 2);

    if(this.type == 'local'){
      this.player1.color = 'white';
    }else if(this.type == 'test'){
      if(this.player1.color != undefined && this.player1.color != ''){
        this.player1.color = this.player1.color;
        this.player2.color = this.player1.color == 'white' ? 'black' : 'white';
      }else if(this.player2.color != undefined && this.player2.color != ''){
        this.player2.color = this.player2.color;
        this.player1.color = this.player2.color == 'white' ? 'black' : 'white';
      }
    }else{
      if(rand == 0){
        this.player1.color = 'white';
        this.player2.color = 'black';
      }else{
        this.player1.color = 'black';
        this.player2.color = 'white';
      }
    }
  }

  /** ============================== SOCKET  ============================== **/

  getDataPieces(){
    let dataPieces = new Array();

    for(let piece of this.pieces){
      if(piece.color != this.colorTurn){
        dataPieces.push(piece.getData());
      }else{
        dataPieces.push(piece);
      }
    }

    return dataPieces;
  }

  startGame(){
    this.setAllPossibleMoves();

    this.player1.socket.emit('startGame', {
      pieces: this.getDataPieces(),
      colorPlayer: this.player1.color,
      colorTurn: this.colorTurn,
      player1: this.player1.data(),
      player2: this.player2.data()
    });

    if(this.type == 'online'){
      this.player2.socket.emit('startGame', {
        pieces: this.pieces,
        colorPlayer: this.player2.color,
        colorTurn: this.colorTurn,
        player1: this.player1.data(),
        player2: this.player2.data()
      });
    }
  }

  sendGameState(positionInit, positionFinal){
    let gameState = {
      posInit: positionInit,
      posFinal: positionFinal,
      pieces: this.getDataPieces(),
      colorTurn: this.colorTurn,
    }

    this.player1.getSocket().emit('gameState', gameState);

    if(this.type != 'local'){
      this.player2.getSocket().emit('gameState', gameState);
    }
  }

  sendGameOver(){
    let gameOver = {
      winner: this.winner,
    }

    this.player1.getSocket().emit('gameOver', gameOver);

    if(this.type != 'local'){
      this.player2.getSocket().emit('gameOver', gameOver);
    }
  }

  listen(){
    if(this.type == 'local'){
      this.listenLocal();
    }else if(this.type == 'online'){
      this.listenOnline();
    }
  }

  listenLocal(){
    this.player1.getSocket().on('move', (positionInit, positionFinal) => {
      this.movePiece(positionInit, positionFinal);
    });

    this.player1.getSocket().on('changePawn', (posInit, posFinal, pieceType) => {
      this.changePawn(posInit, posFinal, pieceType);
    });
  }

  listenOnline(){
    this.player1.getSocket().on('move', (data) => {
      this.movePiece(data.positionInit, data.positionFinal);
    });

    this.player2.getSocket().on('move', (data) => {
      this.movePiece(data.positionInit, data.positionFinal);
    });

    this.player1.getSocket().on('changePawn', (posInit, posFinal, pieceType) => {
      this.changePawn(posInit, posFinal, pieceType);
    });

    this.player2.getSocket().on('changePawn', (posInit, posFinal, pieceType) => {
      this.changePawn(posInit, posFinal, pieceType);
    });
  }

  /** ============================== MECANICS  ============================== **/

  getPiece(position){
    for(let piece of this.pieces){      
      if(piece.position.equals(position)){
        return piece;
      }
    }
    
    return null;
  }

  verifyIfGameOver(){
    let king;

    for(let piece of this.pieces){
      if(piece.color == this.colorTurn){
        if(piece.moves.length > 0){
          return null;
        }
        if(piece.type == 'king'){
          king = piece;
        }
      }
    }

    if(king.inCheck(this.pieces)){
      return this.colorTurn == 'white' ? 'black' : 'white';
    }else{
      return 'pat';
    }
  }

  setAllPossibleMoves(){
    let king;

    for (let piece of this.pieces) {
      if(piece.color != this.colorTurn){
        piece.setPossibleMoves(this.pieces);
      }
    }

    for(let piece of this.pieces){
      if(piece.color == this.colorTurn){
        if(piece.type == 'king'){
          king = piece;
        }else{
          piece.setPossibleMoves(this.pieces);
          piece.verifyIfMovesAreValid(this.pieces);
        }
      }
    }

    king.setPossibleMoves(this.pieces);
    king.verifyIfMovesAreValid(this.pieces);
  }

  movePiece(positionInit, positionFinal){
    let piece = this.getPiece(positionFromString(positionInit));

    if(piece != null && piece != undefined && piece.color == this.colorTurn && piece.canMove(positionFromString(positionFinal))){
      this.unsetDoubleMoves();

      let pieceToRemove = this.getPiece(positionFromString(positionFinal));

      if(piece.move(positionFromString(positionFinal), this.pieces)){
        if(pieceToRemove != null && pieceToRemove != piece){
          this.pieces.splice(this.pieces.indexOf(pieceToRemove), 1);
        }

        this.changeTurn();
        this.setAllPossibleMoves();

        let winner = this.verifyIfGameOver();

        if(winner){     
          this.winner = winner;

          this.sendGameState(positionInit, positionFinal);
          this.sendGameOver();
        }else{
          this.sendGameState(positionInit, positionFinal);
        }
      }
    }
  }

  changePawn(posInit, posFinal, pieceType){
    let position = Position.positionFromString(posInit);
      let positionFinal = Position.positionFromString(posFinal);
      let piece = this.getPiece(position);

      if(piece != undefined && piece.type == 'pawn' && piece.canMove(positionFinal) && positionFinal.isBorder()){
        var newPiece = this.create(pieceType, piece.color, posInit);
        newPiece.moves = piece.moves;

        this.pieces.push(newPiece);
        this.pieces.splice(this.pieces.indexOf(piece), 1);

        this.movePiece(posInit, posFinal);
      }
  }

  changeTurn(){
    if(this.colorTurn == 'white'){
      this.colorTurn = 'black';
    }else{
      this.colorTurn = 'white';
    }
  }

  unsetDoubleMoves(){
    for(let piece of this.pieces){
      if(piece.type == 'pawn'){
        if(piece.doubleMovementInThisTurn){
          piece.doubleMovementInThisTurn = false;
        }else if(piece.doubleMovement){
          piece.doubleMovement = false;
        }
      }
    }
  }

  /** ============================== MECANICS  ============================== **/

  create(type, color, pos){
    switch(type){
      case 'pawn':
        return new Pawn(color, pos);
        break;
      case 'rook':
        return new Rook(color, pos);
        break;
      case 'bishop':
        return new Bishop(color, pos);
        break;
      case 'knight':
        return new Knight(color, pos);
        break;
      case 'queen':
        return new Queen(color, pos);
        break;
      case 'king':
        return new King(color, pos);
        break;
      default:
        return null;
    }
  }
}