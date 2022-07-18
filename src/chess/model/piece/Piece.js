const { positionFromString } = require('../Position');
const Position = require('../Position');

module.exports = class Piece{
  constructor(color, position){
    this.color = color;
    this.position = positionFromString(position);
    this.moves = new Array();
  }

  getColor(){
    return this.color;
  }

  getMoves(){
    return this.moves;
  }
  
  move(position){
    this.position = position;
  }

  addMoves(moves){
    for(let move in movesToAdd){
      this.addMove(move);
    }
  }

  addMove(move){
    this.moves.push(move);
  }

  setPossibleMoves(pieces){
    this.moves = new Array();
  }
  
  verifyIfMovesAreValid(pieces){
    //verify if after the move of the piece, the king is in check
    let movesToDelete = new Array();

    if(this.position.getString() == "c2"){
      console.log(this.moves);
   }

    for(let move of this.moves){
      let newPieces = pieces.slice();

      let newPiece = Object.create(this);
      newPiece.move(move);

      newPieces.splice(newPieces.indexOf(this), 1);
      newPieces.push(newPiece);

      for (let piece of newPieces) {
        if(piece.color != this.color){
          piece.setPossibleMoves(newPieces);
        }
      }

      if(this.inCheckMate(newPieces, this.color)){
        movesToDelete.push(move);
      }
    }

    for(let move of movesToDelete){
      this.moves.splice(this.moves.indexOf(move), 1);
    }
  }

  getPiece(pieces, position){
    for(let piece of pieces){      
      if(piece.position.equals(position)){
        return piece;
      }
    }
    
    return null;
  }

  inCheckMate(pieces, color){
    let king;

    for(let piece of pieces){
      if(piece.color == color && piece.type == "King"){
        king = piece;
      }
    }

    for(let piece of pieces){
      if(piece.color != color){
        for(let move of piece.moves){
          if(move.equals(king.position)){
            return true;
          }
        }
      }
    }

    return false;
  }

  enemieCanMove(pieces, color, position){
    for(let piece of pieces){
      if(piece.color != color){
        for(let move of piece.moves){
          if(move.equals(position)){
            return true;
          }
        }
      }
    }

    return false;
  }

  outOfBounds(position){
    return position.column < 1 || position.column > 8 || position.getRow() < 'a' || position.getRow() > 'h';
  }

}