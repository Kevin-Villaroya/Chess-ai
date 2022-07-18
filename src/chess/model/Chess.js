const Rook = require('./piece/Rook');
const Knight = require('./piece/Knight');
const Bishop = require('./piece/Bishop');
const Queen = require('./piece/Queen');
const King = require('./piece/King');
const Pawn = require('./piece/Pawn');

/** ============================== INIT  ============================== **/

module.exports = class Chess {

  constructor(type, player1, player2){
    this.type = type;

    this.player1 = player1;
    if(this.type != 'local'){
      this.player2 = player2;
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
    this.pieces.push(new Knight('white', 'c3'));
    this.pieces.push(new Knight('white', 'g1'));
    this.pieces.push(new Bishop('white', 'c4'));
    this.pieces.push(new Bishop('white', 'f1'));
    this.pieces.push(new Queen('white', 'a5'));
    this.pieces.push(new King('white', 'e1'));

    this.pieces.push(new Pawn('white', 'a2'));
    this.pieces.push(new Pawn('white', 'b2'));
    this.pieces.push(new Pawn('white', 'c2'));
    this.pieces.push(new Pawn('white', 'd5'));
    this.pieces.push(new Pawn('white', 'e2'));
    this.pieces.push(new Pawn('white', 'f2'));
    this.pieces.push(new Pawn('white', 'g2'));
    this.pieces.push(new Pawn('white', 'h2'));

    this.pieces.push(new Rook('black', 'a8'));
    this.pieces.push(new Rook('black', 'h8'));
    this.pieces.push(new Knight('black', 'b8'));
    this.pieces.push(new Knight('black', 'g8'));
    this.pieces.push(new Bishop('black', 'h4'));
    this.pieces.push(new Bishop('black', 'f8'));
    this.pieces.push(new Queen('black', 'd3'));
    this.pieces.push(new King('black', 'e8'));

    this.pieces.push(new Pawn('black', 'a7'));
    this.pieces.push(new Pawn('black', 'b7'));
    this.pieces.push(new Pawn('black', 'c7'));
    this.pieces.push(new Pawn('black', 'd7'));
    this.pieces.push(new Pawn('black', 'e4'));
    this.pieces.push(new Pawn('black', 'f7'));
    this.pieces.push(new Pawn('black', 'g7'));
    this.pieces.push(new Pawn('black', 'h7'));
  }

  setPlayerColors(){
    let rand = Math.floor(Math.random() * 2);

    if(this.type == 'local'){
      this.player1.color = 'white';
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

  startGame(){
    this.setAllPossibleMoves();

    this.player1.socket.emit('startGame', {
      pieces: this.pieces,
      colorPlayer: this.player1.color,
      colorTurn: this.colorTurn
    });

    if(this.type != 'local'){
      this.player2.socket.emit('startGame', {
        pieces: this.pieces,
        colorPlayer: this.player2.color,
        colorTurn: this.colorTurn
      });
    }
  }

  sendGameState(){
    for (let piece in this.pieces) {
      this.checkValidityOfPossibleMoves(piece);
    }

    let gameState = {
      pieces: this.pieces,
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
  }

  listenOnline(){
    this.player1.getSocket().on('move', (data) => {
      this.movePiece(data.positionInit, data.positionFinal);
    });

    this.player2.getSocket().on('move', (data) => {
      this.movePiece(data.positionInit, data.positionFinal);
    });
  }

  /** ============================== MECANICS  ============================== **/

  setAllPossibleMoves(){
    let king;

    for (let piece of this.pieces) {
      if(piece.color != this.colorTurn){
        piece.setPossibleMoves(this.pieces);
      }
    }

    for(let piece of this.pieces){
      if(piece.color == this.colorTurn){
        if(piece.type == 'King'){
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


}