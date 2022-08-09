const { positionFromString } = require('../Position');
const Position = require('../Position');

module.exports = class Piece{
  constructor(color, position){
    this.color = color;

    if(position instanceof Position){
      this.position = position;
    }else{
      this.position = positionFromString(position);
    }
    
    this.moves = new Array();
  }

  move(position){
    this.position = position;

    return true;
  }

  canMove(pos){
    let canMove = false;

    this.moves.forEach( (move) => {
      if(move.equals(pos)){
        canMove =  true;
      }
    });

    return canMove;
  }

  getColor(){
    return this.color;
  }

  getMoves(){
    return this.moves;
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

  getPiece(pieces, position){
    for(let piece of pieces){      
      if(piece.position.equals(position)){
        return piece;
      }
    }
    
    return null;
  }

  getData(){
    return {
      color: this.color,
      position: this.position,
      moves: [],
      type: this.type
    }
  }

  verifyIfMovesAreValid(pieces){
    //verify if after the move of the piece, the king is in check
    let movesToDelete = new Array();
    let newPieces = new Array();

    for(let move of this.moves){
      newPieces = new Array();

      for(let piece of pieces){
        newPieces.push(piece.copy());
      }

      let newPiece = this.getPiece(newPieces, this.position);
      let pieceEated = this.getPiece(newPieces, move);

      newPiece.move(move, newPieces);

      if(pieceEated != null){
        newPieces.splice(newPieces.indexOf(pieceEated), 1);
      }

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

  inCheckMate(pieces, color){
    let king;

    for(let piece of pieces){
        if(piece.color == color && piece.type == "king"){
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
}