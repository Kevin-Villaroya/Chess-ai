const Piece = require('./Piece');
const Position = require('../Position');

module.exports = class Bishop extends Piece{
    constructor(color, position){
        super(color, position);
        this.type = "bishop";
    }

    copy(){
        let copy = new Bishop(this.color, this.position.getString());
        copy.moves = this.moves;

        return copy;
    }

    setPossibleMoves(pieces){
        super.setPossibleMoves(pieces);

        this.checkValidityOfLine(pieces, new Position(1, 1));
        this.checkValidityOfLine(pieces, new Position(1, -1));
        this.checkValidityOfLine(pieces, new Position(-1, 1));
        this.checkValidityOfLine(pieces, new Position(-1, -1));
    }

    checkValidityOfLine(pieces, positionDirection){
        let position = this.position;
        let canGoDirection = true;

        do{
            position = position.addColumn(positionDirection.column);
            position = position.addRow(positionDirection.row);

            canGoDirection = true;

            if(position.outOfBounds()){
                canGoDirection = false;
            }else if(this.getPiece(pieces, position) != null){
                if(this.getPiece(pieces, position).getColor() != this.color){
                    this.addMove(position);
                    canGoDirection = false;
                }else{
                    canGoDirection = false;
                }
                break;
            }else{
                this.addMove(position);
            }
            
        }while(canGoDirection)
    }
}