module.exports = class Piece{
  constructor(color, type){
    this.color = color;
    this.type = type;
    this.firstMove = true;
    this.moves = {};
  }

  getColor(){
    return this.color;
  }

  getType(){
    return this.type;
  }

  isFirstMove(){
    return this.firstMove;
  }

  getMoves(){
    return this.moves;
  }
  
  addMoves(movesToAdd){
    for(let move in movesToAdd){
      this.moves.push(movesToAdd[move]);
    }
  }

  didMoveTwoCases(){
    if(this.moveTwoCase != undefined && this.moveTwoCase){
      return true;
    }

    return false;
  }

  move(){
    this.firstMove = false;
  }
}