const Piece = require('./Piece');
const Position = require('../Position');

module.exports = class Queen extends Piece{
    constructor(color, position){
        super(color, position);
        this.type = "Queen";
    }

    setPossibleMoves(pieces){
        super.setPossibleMoves(pieces);

        //lines
        this.checkValidityOfLine(pieces, new Position(0, 1));
        this.checkValidityOfLine(pieces, new Position(0, -1));
        this.checkValidityOfLine(pieces, new Position(1, 0));
        this.checkValidityOfLine(pieces, new Position(-1, 0));

        //diagonals
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

            if(this.outOfBounds(position)){
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