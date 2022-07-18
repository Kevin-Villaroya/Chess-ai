const Position = require('../Position');
const Piece = require('./Piece');

module.exports = class Knight extends Piece{
    constructor(color, position){
        super(color, position);
        this.type = "Knight";
    }

    copy(){
        let copy = new Knight(this.color, this.position.getString());
        copy.moves = this.moves;

        return copy;
    }

    setPossibleMoves(pieces){
        super.setPossibleMoves(pieces);

        let positionNorthEast = new Position(this.position.row + 1, this.position.column + 2);
        let positionNorthWest = new Position(this.position.row - 1, this.position.column + 2);
        let positionSouthEast = new Position(this.position.row + 1, this.position.column - 2);
        let positionSouthWest = new Position(this.position.row - 1, this.position.column - 2);
        let positionEastNorth = new Position(this.position.row + 2, this.position.column + 1);
        let positionEastSouth = new Position(this.position.row - 2, this.position.column + 1);
        let positionWestNorth = new Position(this.position.row + 2, this.position.column - 1);
        let positionWestSouth = new Position(this.position.row - 2, this.position.column - 1);

        this.checkMoveValidity(positionNorthEast, pieces);
        this.checkMoveValidity(positionNorthWest, pieces);
        this.checkMoveValidity(positionSouthEast, pieces);
        this.checkMoveValidity(positionSouthWest, pieces);
        this.checkMoveValidity(positionEastNorth, pieces);
        this.checkMoveValidity(positionEastSouth, pieces);
        this.checkMoveValidity(positionWestNorth, pieces);
        this.checkMoveValidity(positionWestSouth, pieces);
    }

    checkMoveValidity(position, pieces){
        if(position.column >= 1 && position.column <= 8 && position.getRow() >= 'a' && position.getRow() <= 'h'){
            let piece = this.getPiece(pieces, position);
            if(piece == null || piece.color != this.color){
                this.addMove(position);
            }
        }
    }

}