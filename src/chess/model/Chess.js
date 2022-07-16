const Piece = require('./Piece');
const { positionFromString } = require('./Position');
const Position = require('./Position');

module.exports = class Chess {

  constructor(type, player1, player2){
    this.initGame();

    this.type = type;
    this.colorTurn = 'white';

    this.player1 = player1;
    if(this.type != 'local'){
      this.player2 = player2;
    }

    this.setPlayerColors();

    this.listen();
  }

  initGame(){
    this.pieces = {};

    this.pieces['a2'] = new Piece('white', 'pawn');
    this.pieces['b2'] = new Piece('white', 'pawn');
    this.pieces['c2'] = new Piece('white', 'pawn');
    this.pieces['d2'] = new Piece('white', 'pawn');
    this.pieces['e2'] = new Piece('white', 'pawn');
    this.pieces['f2'] = new Piece('white', 'pawn');
    this.pieces['g2'] = new Piece('white', 'pawn');
    this.pieces['h2'] = new Piece('white', 'pawn');

    this.pieces['a1'] = new Piece('white', 'rook');
    this.pieces['b1'] = new Piece('white', 'knight');
    this.pieces['c1'] = new Piece('white', 'bishop');
    this.pieces['d1'] = new Piece('white', 'queen');
    this.pieces['e1'] = new Piece('white', 'king');
    this.pieces['f1'] = new Piece('white', 'bishop');
    this.pieces['g1'] = new Piece('white', 'knight');
    this.pieces['h1'] = new Piece('white', 'rook');
    

    this.pieces['a7'] = new Piece('black', 'pawn');
    this.pieces['b7'] = new Piece('black', 'pawn');
    this.pieces['c7'] = new Piece('black', 'pawn');
    this.pieces['d7'] = new Piece('black', 'pawn');
    this.pieces['e7'] = new Piece('black', 'pawn');
    this.pieces['f7'] = new Piece('black', 'pawn');
    this.pieces['g7'] = new Piece('black', 'pawn');
    this.pieces['h7'] = new Piece('black', 'pawn');

    this.pieces['a8'] = new Piece('black', 'rook');
    this.pieces['b8'] = new Piece('black', 'knight');
    this.pieces['c8'] = new Piece('black', 'bishop');
    this.pieces['d8'] = new Piece('black', 'queen');
    this.pieces['e8'] = new Piece('black', 'king');
    this.pieces['f8'] = new Piece('black', 'bishop');
    this.pieces['g8'] = new Piece('black', 'knight');
    this.pieces['h8'] = new Piece('black', 'rook');

    this.findAllMoves();
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

  getPieces(position){
    return this.pieces[position.getString()];
  }

  outOfBounds(position){
    return position.getRow() > 'h' || position.getRow() < 'a' || position.getColumn() < 1 || position.getColumn() > 8;
  }

  changeTurn(){
    if(this.colorTurn == 'white'){
      this.colorTurn = 'black';
    }
    else{
      this.colorTurn = 'white';
    }
  }

  findAllMoves(){
    for(let key in this.pieces){
      let piece = this.pieces[key];

      piece.moves = this.findMoves(key);
    }

    for(let key in this.pieces){
      let piece = this.pieces[key];

      if(this.getPieces(positionFromString(key)).type == 'king'){
        piece.addMoves(this.findRooksMoves(key));
      }
    }
  }

  findMoves(key){
    let piece = this.pieces[key];
    let moves = [];

    if(piece.type == 'pawn'){
      moves = this.findPawnMoves(key);
    }else if(piece.type == 'rook'){
      moves = this.findRookMoves(key);
    }else if(piece.type == 'knight'){
      moves = this.findKnightMoves(key);
    }else if(piece.type == 'bishop'){
      moves = this.findBishopMoves(key);
    }else if(piece.type == 'queen'){
      moves = this.findQueenMoves(key);
    }else if(piece.type == 'king'){
      moves = this.findKingMoves(key);
    }

    return moves;
  }

  findPawnMoves(key){
    let moves = [];
    let piece = this.pieces[key];

    if(piece.color == 'white'){
      moves = this.findWhitePawnMoves(key);
    }else{
      moves = this.findBlackPawnMoves(key);
    }
    
    for(key of this.findEnPassantMoves(key)){
      moves.push(key);
    }

    return moves;
  }

  findWhitePawnMoves(key){
    let moves = [];
    let piece = this.pieces[key];

    let position = Position.positionFromString(key);

    let positionCheckForward = new Position(position.row, position.column + 1);
      let canMoveForward = !this.outOfBounds(positionCheckForward) && this.getPieces(positionCheckForward) == undefined;

      let positionCheckForward2 = new Position(position.row, position.column + 2);
      let canMoveTwoCase = canMoveForward && piece.isFirstMove() && !this.outOfBounds(positionCheckForward2) && this.getPieces(positionCheckForward2) == undefined;

      let positionCheckEatRight = new Position(position.row + 1, position.column + 1);
      let canEatRight = !this.outOfBounds(positionCheckEatRight) && this.getPieces(positionCheckEatRight) != undefined && this.getPieces(positionCheckEatRight).color == 'black';

      let positionCheckEatLeft = new Position(position.row - 1, position.column + 1);
      let canEatLeft = !this.outOfBounds(positionCheckEatLeft) && this.getPieces(positionCheckEatLeft) != undefined && this.getPieces(positionCheckEatLeft).color == 'black';

      if(canMoveForward){
        moves.push(positionCheckForward.getString());
      }

      if(canMoveTwoCase){
        moves.push(positionCheckForward2.getString());
      }

      if(canEatRight){
        moves.push(positionCheckEatRight.getString());
      }
      
      if(canEatLeft){
        moves.push(positionCheckEatLeft.getString());
      }

      return moves;
  }

  findBlackPawnMoves(key){
    let moves = [];
    let piece = this.pieces[key];

    let position = Position.positionFromString(key);

    let positionCheckForward = new Position(position.row, position.column - 1);
      let canMoveForward = !this.outOfBounds(positionCheckForward) && this.getPieces(positionCheckForward) == undefined;

      let positionCheckForward2 = new Position(position.row, position.column - 2);
      let canMoveTwoCase = canMoveForward && piece.isFirstMove() && !this.outOfBounds(positionCheckForward2) && this.getPieces(positionCheckForward2) == undefined;

      let positionCheckEatRight = new Position(position.row + 1, position.column - 1);
      let canEatRight = !this.outOfBounds(positionCheckEatRight) && this.getPieces(positionCheckEatRight) != undefined && this.getPieces(positionCheckEatRight).color == 'white';

      let positionCheckEatLeft = new Position(position.row - 1, position.column - 1);
      let canEatLeft = !this.outOfBounds(positionCheckEatLeft) && this.getPieces(positionCheckEatLeft) != undefined && this.getPieces(positionCheckEatLeft).color == 'white';

      if(canMoveForward){
        moves.push(positionCheckForward.getString());
      }

      if(canMoveTwoCase){
        moves.push(positionCheckForward2.getString());
      }

      if(canEatRight){
        moves.push(positionCheckEatRight.getString());
      }
      
      if(canEatLeft){
        moves.push(positionCheckEatLeft.getString());
      }

      return moves;
  }

  findEnPassantMoves(key){
    let moves = [];
    let position = Position.positionFromString(key);
    let piece = this.getPieces(position);

    let positionLeft = new Position(position.row - 1, position.column);

    if(!this.outOfBounds(positionLeft) && this.getPieces(positionLeft) != undefined && this.getPieces(positionLeft).color != piece.color && this.getPieces(positionLeft).type == 'pawn' && this.getPieces(positionLeft).didMoveTwoCases()){
      if(piece.color == 'white'){
        moves.push(new Position(positionLeft.row, positionLeft.column + 1).getString());
      }else{
        moves.push(new Position(positionLeft.row, positionLeft.column - 1).getString());
      }
    }

    let positionRight = new Position(position.row + 1, position.column);

    if(!this.outOfBounds(positionRight) && this.getPieces(positionRight) != undefined && this.getPieces(positionRight).color != piece.color && this.getPieces(positionRight).type == 'pawn' && this.getPieces(positionRight).didMoveTwoCases()){
      if(piece.color == 'white'){
        moves.push(new Position(positionRight.row, positionRight.column + 1).getString());
      }else{
        moves.push(new Position(positionRight.row, positionRight.column - 1).getString());
      }
    }

    return moves;
  }

  findRookMoves(key){
    let moves = [];

    let canMoveUp = true;
    let canMoveDown = true;
    let canMoveLeft = true;
    let canMoveRight = true;

    let position = Position.positionFromString(key);

    for(let i = 1; i < 8; i++){
      let positionCheckLeft = new Position(position.row - i, position.column);
      let positionCheckRight = new Position(position.row + i, position.column);
      let positionCheckUp = new Position(position.row, position.column + i);
      let positionCheckDown = new Position(position.row, position.column - i);

      if(canMoveUp && !this.outOfBounds(positionCheckUp) && this.getPieces(positionCheckUp) == undefined){
        moves.push(positionCheckUp.getString());
      }else if(canMoveUp && this.getPieces(positionCheckUp) != undefined && this.getPieces(positionCheckUp).color != this.pieces[key].color){
        moves.push(positionCheckUp.getString());
        canMoveUp = false;
      }else{
        canMoveUp = false;
      }

      if(canMoveDown && !this.outOfBounds(positionCheckDown) && this.getPieces(positionCheckDown) == undefined){
        moves.push(positionCheckDown.getString());
      }else if(canMoveDown && this.getPieces(positionCheckDown) != undefined && this.getPieces(positionCheckDown).color != this.pieces[key].color){
        moves.push(positionCheckDown.getString());
        canMoveDown = false;
      }else{
        canMoveDown = false;
      }

      if(canMoveLeft && !this.outOfBounds(positionCheckLeft) && this.getPieces(positionCheckLeft) == undefined){
        moves.push(positionCheckLeft.getString());
      }else if(canMoveLeft && this.getPieces(positionCheckLeft) != undefined && this.getPieces(positionCheckLeft).color != this.pieces[key].color){
        moves.push(positionCheckLeft.getString());
        canMoveLeft = false;
      }else{
        canMoveLeft = false;
      }

      if(canMoveRight && !this.outOfBounds(positionCheckRight) && this.getPieces(positionCheckRight) == undefined){
        moves.push(positionCheckRight.getString());
      }else if(canMoveRight && this.getPieces(positionCheckRight) != undefined && this.getPieces(positionCheckRight).color != this.pieces[key].color){
        moves.push(positionCheckRight.getString());
        canMoveRight = false;
      }else{
        canMoveRight = false;
      }
    }

    return moves;
  }



  findKnightMoves(key){
    let moves = [];
    let position = Position.positionFromString(key);

    let positionCheckUpLeft = new Position(position.row - 1, position.column - 2);
    let canMoveUpLeft = !this.outOfBounds(positionCheckUpLeft) && (this.getPieces(positionCheckUpLeft) == undefined || this.getPieces(positionCheckUpLeft).color != this.pieces[key].color);

    let positionCheckUpRight = new Position(position.row - 1, position.column + 2);
    let canMoveUpRight = !this.outOfBounds(positionCheckUpRight) && (this.getPieces(positionCheckUpRight) == undefined || this.getPieces(positionCheckUpRight).color != this.pieces[key].color);

    let positionCheckDownLeft = new Position(position.row + 1, position.column - 2);
    let canMoveDownLeft = !this.outOfBounds(positionCheckDownLeft) && (this.getPieces(positionCheckDownLeft) == undefined || this.getPieces(positionCheckDownLeft).color != this.pieces[key].color);

    let positionCheckDownRight = new Position(position.row + 1, position.column + 2);
    let canMoveDownRight = !this.outOfBounds(positionCheckDownRight) && (this.getPieces(positionCheckDownRight) == undefined || this.getPieces(positionCheckDownRight).color != this.pieces[key].color);

    let positionCheckLeftUp = new Position(position.row - 2, position.column - 1);
    let canMoveLeftUp = !this.outOfBounds(positionCheckLeftUp) && (this.getPieces(positionCheckLeftUp) == undefined || this.getPieces(positionCheckLeftUp).color != this.pieces[key].color);

    let positionCheckLeftDown = new Position(position.row + 2, position.column - 1);
    let canMoveLeftDown = !this.outOfBounds(positionCheckLeftDown) && (this.getPieces(positionCheckLeftDown) == undefined || this.getPieces(positionCheckLeftDown).color != this.pieces[key].color);

    let positionCheckRightUp = new Position(position.row - 2, position.column + 1);
    let canMoveRightUp = !this.outOfBounds(positionCheckRightUp) && (this.getPieces(positionCheckRightUp) == undefined || this.getPieces(positionCheckRightUp).color != this.pieces[key].color);

    let positionCheckRightDown = new Position(position.row + 2, position.column + 1);
    let canMoveRightDown = !this.outOfBounds(positionCheckRightDown) && (this.getPieces(positionCheckRightDown) == undefined || this.getPieces(positionCheckRightDown).color != this.pieces[key].color);

    if(canMoveUpLeft){
      moves.push(positionCheckUpLeft.getString());
    }

    if(canMoveUpRight){
      moves.push(positionCheckUpRight.getString());
    }

    if(canMoveDownLeft){
      moves.push(positionCheckDownLeft.getString());
    }

    if(canMoveDownRight){
      moves.push(positionCheckDownRight.getString());
    }

    if(canMoveLeftUp){
      moves.push(positionCheckLeftUp.getString());
    }

    if(canMoveLeftDown){
      moves.push(positionCheckLeftDown.getString());
    }

    if(canMoveRightUp){
      moves.push(positionCheckRightUp.getString());
    }

    if(canMoveRightDown){
      moves.push(positionCheckRightDown.getString());
    }

    return moves;
  }

  findBishopMoves(key){
    let moves = [];
    let position = Position.positionFromString(key);

    let canMoveUp = true;
    let canMoveDown = true;
    let canMoveLeft = true;
    let canMoveRight = true;

    for(let i = 1; i < 8; i++){
      let positionCheckUp = new Position(position.row - i, position.column + i);
      let positionCheckDown = new Position(position.row + i, position.column - i);
      let positionCheckLeft = new Position(position.row - i, position.column - i);
      let positionCheckRight = new Position(position.row + i, position.column + i);

      if(canMoveUp && !this.outOfBounds(positionCheckUp) && this.getPieces(positionCheckUp) == undefined){
        moves.push(positionCheckUp.getString());
      }else if(canMoveUp && this.getPieces(positionCheckUp) != undefined && this.getPieces(positionCheckUp).color != this.pieces[key].color){
        moves.push(positionCheckUp.getString());
        canMoveUp = false;
      }else{
        canMoveUp = false;
      }

      if(canMoveDown && !this.outOfBounds(positionCheckDown) && this.getPieces(positionCheckDown) == undefined){
        moves.push(positionCheckDown.getString());
      }else if(canMoveDown && this.getPieces(positionCheckDown) != undefined && this.getPieces(positionCheckDown).color != this.pieces[key].color){
        moves.push(positionCheckDown.getString());
        canMoveDown = false;
      }else{
        canMoveDown = false;
      }

      if(canMoveLeft && !this.outOfBounds(positionCheckLeft) && this.getPieces(positionCheckLeft) == undefined){
        moves.push(positionCheckLeft.getString());
      }else if(canMoveLeft && this.getPieces(positionCheckLeft) != undefined && this.getPieces(positionCheckLeft).color != this.pieces[key].color){
        moves.push(positionCheckLeft.getString());
        canMoveLeft = false;
      }else{
        canMoveLeft = false;
      }

      if(canMoveRight && !this.outOfBounds(positionCheckRight) && this.getPieces(positionCheckRight) == undefined){
        moves.push(positionCheckRight.getString());
      }else if(canMoveRight && this.getPieces(positionCheckRight) != undefined && this.getPieces(positionCheckRight).color != this.pieces[key].color){
        moves.push(positionCheckRight.getString());
        canMoveRight = false;
      }else{
        canMoveRight = false;
      } 

      if(!canMoveUp && !canMoveDown && !canMoveLeft && !canMoveRight){
        break;
      }
    }

    return moves;
  }

  findQueenMoves(key){
    let moves = [];
    let position = Position.positionFromString(key);

    let canMoveUp = true;
    let canMoveDown = true;
    let canMoveLeft = true;
    let canMoveRight = true;
    let canMoveUpLeft = true;
    let canMoveUpRight = true;
    let canMoveDownLeft = true;
    let canMoveDownRight = true;

    for(let i = 1; i < 8; i++){
      let positionCheckLeft = new Position(position.row - i, position.column);
      let positionCheckRight = new Position(position.row + i, position.column);
      let positionCheckUp = new Position(position.row, position.column + i);
      let positionCheckDown = new Position(position.row, position.column - i);
      let positionCheckUpLeft = new Position(position.row - i, position.column - i);
      let positionCheckUpRight = new Position(position.row + i, position.column + i);
      let positionCheckDownLeft = new Position(position.row + i, position.column - i);
      let positionCheckDownRight = new Position(position.row - i, position.column + i);

      if(canMoveUp && !this.outOfBounds(positionCheckUp) && this.getPieces(positionCheckUp) == undefined){
        moves.push(positionCheckUp.getString());
      }else if(canMoveUp && this.getPieces(positionCheckUp) != undefined && this.getPieces(positionCheckUp).color != this.pieces[key].color){
        moves.push(positionCheckUp.getString());
        canMoveUp = false;
      }else{
        canMoveUp = false;
      }

      if(canMoveDown && !this.outOfBounds(positionCheckDown) && this.getPieces(positionCheckDown) == undefined){
        moves.push(positionCheckDown.getString());
      }else if(canMoveDown && this.getPieces(positionCheckDown) != undefined && this.getPieces(positionCheckDown).color != this.pieces[key].color){
        moves.push(positionCheckDown.getString());
        canMoveDown = false;
      }else{
        canMoveDown = false;
      }

      if(canMoveLeft && !this.outOfBounds(positionCheckLeft) && this.getPieces(positionCheckLeft) == undefined){
        moves.push(positionCheckLeft.getString());
      }else if(canMoveLeft && this.getPieces(positionCheckLeft) != undefined && this.getPieces(positionCheckLeft).color != this.pieces[key].color){
        moves.push(positionCheckLeft.getString());
        canMoveLeft = false;
      }else{
        canMoveLeft = false;
      }

      if(canMoveRight && !this.outOfBounds(positionCheckRight) && this.getPieces(positionCheckRight) == undefined){
        moves.push(positionCheckRight.getString());
      }else if(canMoveRight && this.getPieces(positionCheckRight) != undefined && this.getPieces(positionCheckRight).color != this.pieces[key].color){
        moves.push(positionCheckRight.getString());
        canMoveRight = false;
      }else{
        canMoveRight = false;
      }

      if(canMoveUpLeft && !this.outOfBounds(positionCheckUpLeft) && this.getPieces(positionCheckUpLeft) == undefined){
        moves.push(positionCheckUpLeft.getString());
      }else if(canMoveUpLeft && this.getPieces(positionCheckUpLeft) != undefined && this.getPieces(positionCheckUpLeft).color != this.pieces[key].color){
        moves.push(positionCheckUpLeft.getString());
        canMoveUpLeft = false;
      }else{
        canMoveUpLeft = false;
      }

      if(canMoveUpRight && !this.outOfBounds(positionCheckUpRight) && this.getPieces(positionCheckUpRight) == undefined){
        moves.push(positionCheckUpRight.getString());
      }else if(canMoveUpRight && this.getPieces(positionCheckUpRight) != undefined && this.getPieces(positionCheckUpRight).color != this.pieces[key].color){
        moves.push(positionCheckUpRight.getString());
        canMoveUpRight = false;
      }else{
        canMoveUpRight = false;
      }

      if(canMoveDownLeft && !this.outOfBounds(positionCheckDownLeft) && this.getPieces(positionCheckDownLeft) == undefined){
        moves.push(positionCheckDownLeft.getString());
      }else if(canMoveDownLeft && this.getPieces(positionCheckDownLeft) != undefined && this.getPieces(positionCheckDownLeft).color != this.pieces[key].color){
        moves.push(positionCheckDownLeft.getString());
        canMoveDownLeft = false;
      }else{
        canMoveDownLeft = false;
      }

      if(canMoveDownRight && !this.outOfBounds(positionCheckDownRight) && this.getPieces(positionCheckDownRight) == undefined){
        moves.push(positionCheckDownRight.getString());
      }else if(canMoveDownRight && this.getPieces(positionCheckDownRight) != undefined && this.getPieces(positionCheckDownRight).color != this.pieces[key].color){
        moves.push(positionCheckDownRight.getString());
        canMoveDownRight = false;
      }else{
        canMoveDownRight = false;
      }

    }

    return moves;
  }

  findKingMoves(key){
    let moves = [];

    let position = Position.positionFromString(key);

    let positionCheckUp = new Position(position.row - 1, position.column);
    let positionCheckDown = new Position(position.row + 1, position.column);
    let positionCheckLeft = new Position(position.row, position.column - 1);
    let positionCheckRight = new Position(position.row, position.column + 1);
    let positionCheckUpLeft = new Position(position.row - 1, position.column - 1);
    let positionCheckUpRight = new Position(position.row - 1, position.column + 1);
    let positionCheckDownLeft = new Position(position.row + 1, position.column - 1);
    let positionCheckDownRight = new Position(position.row + 1, position.column + 1);

    if(!this.outOfBounds(positionCheckUp) && this.getPieces(positionCheckUp) == undefined || this.getPieces(positionCheckUp) != undefined && this.getPieces(positionCheckUp).color != this.pieces[key].color){
      moves.push(positionCheckUp.getString());
    }

    if(!this.outOfBounds(positionCheckDown) && this.getPieces(positionCheckDown) == undefined || this.getPieces(positionCheckDown) != undefined && this.getPieces(positionCheckDown).color != this.pieces[key].color){
      moves.push(positionCheckDown.getString());
    }

    if(!this.outOfBounds(positionCheckLeft) && this.getPieces(positionCheckLeft) == undefined || this.getPieces(positionCheckLeft) != undefined && this.getPieces(positionCheckLeft).color != this.pieces[key].color){
      moves.push(positionCheckLeft.getString());
    }

    if(!this.outOfBounds(positionCheckRight) && this.getPieces(positionCheckRight) == undefined || this.getPieces(positionCheckRight) != undefined && this.getPieces(positionCheckRight).color != this.pieces[key].color){
      moves.push(positionCheckRight.getString());
    }

    if(!this.outOfBounds(positionCheckUpLeft) && this.getPieces(positionCheckUpLeft) == undefined || this.getPieces(positionCheckUpLeft) != undefined && this.getPieces(positionCheckUpLeft).color != this.pieces[key].color){
      moves.push(positionCheckUpLeft.getString());
    }

    if(!this.outOfBounds(positionCheckUpRight) && this.getPieces(positionCheckUpRight) == undefined || this.getPieces(positionCheckUpRight) != undefined && this.getPieces(positionCheckUpRight).color != this.pieces[key].color){
      moves.push(positionCheckUpRight.getString());
    }

    if(!this.outOfBounds(positionCheckDownLeft) && this.getPieces(positionCheckDownLeft) == undefined || this.getPieces(positionCheckDownLeft) != undefined && this.getPieces(positionCheckDownLeft).color != this.pieces[key].color){
      moves.push(positionCheckDownLeft.getString());
    }

    if(!this.outOfBounds(positionCheckDownRight) && this.getPieces(positionCheckDownRight) == undefined || this.getPieces(positionCheckDownRight) != undefined && this.getPieces(positionCheckDownRight).color != this.pieces[key].color){
      moves.push(positionCheckDownRight.getString());
    }

    return moves;
  }

  findRooksMoves(key){
    let moves = [];
    let position = Position.positionFromString(key);

    let piece = this.getPieces(position);

    let canRook = piece.isFirstMove && !this.enemieCanAttack(piece.color, position);
    let canRookLeft = this.canRookLeft(key);
    let canRookRight = this.canRookRight(key);

    if(canRook && canRookLeft){
      moves.push(new Position(position.row - 2, position.column).getString());
    }

    if(canRook && canRookRight){
      moves.push(new Position(position.row + 2, position.column).getString());
    }

    return moves;
  }

  canRookLeft(key){
    
    let canRookLeft = true;

    let position = Position.positionFromString(key);
    let color = this.pieces[key].color;

    for(let i = 1; i <= 4 && canRookLeft; i++){
      let positionCheck = new Position(position.row - i, position.column);
      let piece = this.getPieces(positionCheck);

      if((i == 1 || i ==2) && this.enemieCanAttack(color, positionCheck)){
        canRookLeft = false;
      }

      if((i == 1 || i == 2 | i == 3) && piece != undefined){
        canRookLeft = false;
      }else if(i == 4 && (piece != undefined && piece.color != this.pieces[key].color && piece.type != 'rook') && piece.isFirstMove()){
        canRookLeft = false;
      }
    }

    return canRookLeft;
  }

  canRookRight(key){
    let canRookRight = true;

    let position = Position.positionFromString(key);
    let color = this.pieces[key].color;

    for(let i = 1; i <= 3 && canRookRight; i++){
      let positionCheck = new Position(position.row + i, position.column);
      let piece = this.getPieces(positionCheck);

      if((i == 1 || i ==2) && this.enemieCanAttack(color, positionCheck)){
        canRookRight = false;
      }

      if((i == 1 || i == 2) && piece != undefined){
        canRookRight = false;
      }else if(i == 3 && (piece != undefined && piece.color != this.pieces[key].color && piece.type != 'rook') && piece.isFirstMove()){
        canRookRight = false;
      }
    }

    return canRookRight;
  }

  enemieCanAttack(color, position){
    let canAtack = false;

    Object.keys(this.pieces).forEach(key => {
      if(this.pieces[key].color != color){
        let moves = this.getPieces(Position.positionFromString(key)).getMoves();

        Object.keys(moves).forEach(key => {
          if(moves[key] == position.getString()){
            canAtack =  true;
          }
        });
      }
    });

    return canAtack;
  }

  startGame(){
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

  movePiece(keyInit, keyFinal){
    let piece = this.getPieces(positionFromString(keyInit));

    if(piece != undefined && piece.color == this.colorTurn && piece.getMoves().includes(keyFinal)){
      this.resetMoveTwoCase();
      this.checkMoveTwoCase(keyInit, keyFinal);

      this.verifyEnPassant(keyInit, keyFinal);

      delete this.pieces[keyInit];
      this.pieces[keyFinal] = piece;
      piece.move();

      this.verifyRookCastling(keyInit, keyFinal);

      this.changeTurn();
      this.findAllMoves();

      this.sendGameState();
    }
  }

  verifyEnPassant(keyInit, keyFinal){
    let positionInit = Position.positionFromString(keyInit);
    let positionFinal = Position.positionFromString(keyFinal);

    let piece = this.getPieces(positionInit);

    if(Math.abs(positionInit.row - positionFinal.row) == 1 && Math.abs(positionInit.column - positionFinal.column) == 1){
      if(this.getPieces(positionFinal) == undefined){
        let keyEnPassant = new Position(positionFinal.row, positionInit.column).getString();
        delete this.pieces[keyEnPassant];
      }
    }
  }

  verifyRookCastling(keyInit, keyFinal){
    let positionInit = Position.positionFromString(keyInit);
    let positionFinal = Position.positionFromString(keyFinal);

    let piece = this.getPieces(positionFinal);

    if(piece.type == 'king' && Math.abs(positionFinal.row - positionInit.row) == 2){
      if(positionFinal.row > positionInit.row){
        let keyRook = new Position(positionFinal.row + 1, positionFinal.column);
        let rook = this.getPieces(keyRook);
        let posLeftOfKing = new Position(positionFinal.row - 1, positionFinal.column);

        this.pieces[posLeftOfKing.getString()] = rook;
        delete this.pieces[keyRook.getString()];
        
        rook.move();
      }else{
        let keyRook = new Position(positionFinal.row - 2, positionFinal.column);
        let rook = this.getPieces(keyRook);
        let posRightOfKing = new Position(positionFinal.row + 1, positionFinal.column);

        this.pieces[posRightOfKing.getString()] = rook;
        delete this.pieces[keyRook.getString()];

        rook.move();
      }
    }
  }
  
  checkMoveTwoCase(keyInit, keyFinal){
    let positionInit = Position.positionFromString(keyInit);
    let positionFinal = Position.positionFromString(keyFinal);

    let piece = this.getPieces(positionInit);

    if(piece != undefined && piece.type == 'pawn' && (Math.abs(positionInit.column - positionFinal.column) == 2)){
      piece.moveTwoCase = true;
    }
  }

  resetMoveTwoCase(){
    Object.keys(this.pieces).forEach(key => {
      if(this.pieces[key].type == 'pawn'){
        this.pieces[key].moveTwoCase = false;
      }
    });
  }

  sendGameState(){
    let gameState = {
      pieces: this.pieces,
      colorTurn: this.colorTurn,
    }

    this.player1.getSocket().emit('gameState', gameState);

    if(this.type != 'local'){
      this.player2.getSocket().emit('gameState', gameState);
    }

    //TODO this.checkGameOver();
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

}