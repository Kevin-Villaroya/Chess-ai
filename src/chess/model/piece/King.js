const Piece = require('./Piece');
const Position = require('../Position');

module.exports = class King extends Piece{
    constructor(color, position){
        super(color, position);
        this.type = "King";
        this.moved = false;
    }

    copy(){
        let copy = new King(this.color, this.position.getString());
        copy.moves = this.moves;
        copy.moved = this.moved;

        return copy;
    }

    move(position, pieces){
        let verifyRockCastle = this.verifyRockCastle(position);
        let canMove = super.move(position);
        
        if(canMove){
            this.moved = true;
        }

        if(verifyRockCastle == 'left'){
            let rookPosition = new Position(this.position.row - 2, this.position.column);
            let rook = this.getPiece(pieces, rookPosition);

            rook.move(new Position(this.position.row + 1, this.position.column), pieces);
        }else if(verifyRockCastle == 'right'){
            let rookPosition = new Position(this.position.row + 1, this.position.column);
            let rook = this.getPiece(pieces, rookPosition);

            rook.move(new Position(this.position.row - 1, this.position.column), pieces);
        }
        
        return canMove;
    }

    setPossibleMoves(pieces){
        super.setPossibleMoves(pieces);

        this.checkValidityOfPosition(pieces, new Position(1, 1));
        this.checkValidityOfPosition(pieces, new Position(1, 0));
        this.checkValidityOfPosition(pieces, new Position(1, -1));
        this.checkValidityOfPosition(pieces, new Position(0, 1));
        this.checkValidityOfPosition(pieces, new Position(0, -1));
        this.checkValidityOfPosition(pieces, new Position(-1, 1));
        this.checkValidityOfPosition(pieces, new Position(-1, 0));
        this.checkValidityOfPosition(pieces, new Position(-1, -1));

        this.checkValidityOfRookCastleLeft(pieces);
        this.checkValidityOfRookCastleRight(pieces);
    }

    verifyRockCastle(position){
        if(position.row - this.position.row == 2){
            return 'right';
        }else if(position.row - this.position.row == -2){
            return 'left';
        }

        return true;
    }

    checkValidityOfPosition(pieces, position){
        position = position.addColumn(this.position.column);
        position = position.addRow(this.position.row);

        if(position.outOfBounds()){
            return;
        }

        let piece = this.getPiece(pieces, position);

        if(piece == null){
            this.addMove(position);
        }else if(piece.getColor() != this.color){
            this.addMove(position);
        }
    }

    checkValidityOfRookCastleLeft(pieces){
        if(this.moved){
            return;
        }
        
        let positionLeft = new Position(this.position.row - 1, this.position.column);
        let pieceLeft = this.getPiece(pieces, positionLeft);

        let positionLeft2 = new Position(this.position.row - 2, this.position.column);
        let pieceLeft2 = this.getPiece(pieces, positionLeft2);

        let positionLeft3 = new Position(this.position.row - 3, this.position.column);
        let pieceLeft3 = this.getPiece(pieces, positionLeft3);

        let positionLeft4 = new Position(this.position.row - 4, this.position.column);
        let pieceLeft4 = this.getPiece(pieces, positionLeft4);

        if(positionLeft.outOfBounds() || positionLeft2.outOfBounds() || positionLeft3.outOfBounds() || positionLeft4.outOfBounds()){
            return;
        }

        if(this.inCheckMate(pieces, this.color)  || this.enemieCanMove(pieces, this.color, positionLeft) || this.enemieCanMove(pieces, this.color, positionLeft2)){
            return;
        }

        if(pieceLeft != null || pieceLeft2 != null || pieceLeft3 != null){
            return;
        }

        if(pieceLeft4 != null && pieceLeft4.type == "Rook" && pieceLeft4.color == this.color && !pieceLeft4.moved){
            this.addMove(positionLeft2);
        }
    }

    checkValidityOfRookCastleRight(pieces){
        if(this.moved){
            return;
        }
        
        let positionRight = new Position(this.position.row + 1, this.position.column);
        let pieceRight = this.getPiece(pieces, positionRight);

        let positionRight2 = new Position(this.position.row + 2, this.position.column);
        let pieceRight2 = this.getPiece(pieces, positionRight2);

        let positionRight3 = new Position(this.position.row + 3, this.position.column);
        let pieceRight3 = this.getPiece(pieces, positionRight3);

        if(positionRight.outOfBounds() || positionRight2.outOfBounds() || positionRight3.outOfBounds()){
            return;
        }

        if(this.inCheckMate(pieces, this.color)  || this.enemieCanMove(pieces, this.color, positionRight) || this.enemieCanMove(pieces, this.color, positionRight2)){
            return;
        }

        if(pieceRight != null || pieceRight2 != null){
            return;
        }

        if(pieceRight3 != null && pieceRight3.type == "Rook" && pieceRight3.color == this.color && !pieceRight3.moved){
            this.addMove(positionRight2);
        }
    }
}