const Position = require('../Position');
const Piece = require('./Piece');

module.exports = class Pawn extends Piece{
    constructor(color, position){
        super(color, position);
        this.type = "pawn";

        this.moved = false;

        this.doubleMovement = false;
        this.doubleMovementInThisTurn = false;
    }

    copy(){
        let copy = new Pawn(this.color, this.position.getString());
        //copy.moves = this.moves;
        copy.moved = this.moved;
        copy.doubleMovement = this.doubleMovement;
        copy.doubleMovementInThisTurn = this.doubleMovementInThisTurn;

        return copy;
    }

    move(position, pieces){
        let positionInit = this.position;
        let isEnPassant = this.verifyIsEnPassant(position, pieces);

        let canMove = super.move(position);

        if(canMove){
            this.moved = true;

            if(Math.abs(positionInit.column - position.column) == 2){
                this.doubleMovement = true;
                this.doubleMovementInThisTurn = true
            }

            if(isEnPassant == 'left'){
                pieces.splice(pieces.indexOf(pieces.find(piece => piece.position.equals(positionInit.addRow(-1)))), 1);
            }else if(isEnPassant == 'right'){
                pieces.splice(pieces.indexOf(pieces.find(piece => piece.position.equals(positionInit.addRow(1)))), 1);
            }
        }

        return canMove;
    }

    setPossibleMoves(pieces){
        super.setPossibleMoves(pieces);

        let positionForward = this.position.addColumn(1);
        let positionForward2 = this.position.addColumn(2);

        if(this.color == 'white'){
            positionForward = this.position.addColumn(1);
            positionForward2 = this.position.addColumn(2);

            let canMove = this.checkMoveValidityOfNormalMove(positionForward, pieces);
            if(canMove){
                this.checkMoveValidityOfDoubleMove(positionForward2, pieces);
            }
            
            
        }else{
            positionForward = this.position.addColumn(-1);
            positionForward2 = this.position.addColumn(-2);

            let canMove = this.checkMoveValidityOfNormalMove(positionForward, pieces);
            if(canMove){
                this.checkMoveValidityOfDoubleMove(positionForward2, pieces);
            }
        }

        this.setEatMoves(pieces);
        this.setEnPassantMoves(pieces);
    }

    setEatMoves(pieces){
        if(this.color == 'white'){
            let positionLeft = this.position.addRow(-1);
            positionLeft = positionLeft.addColumn(1);
            let pieceLeft = this.getPiece(pieces, positionLeft);

            let positionRight = this.position.addRow(1);
            positionRight = positionRight.addColumn(1);
            let pieceRight = this.getPiece(pieces, positionRight);

            if(pieceLeft != null && pieceLeft.color != this.color){
                this.addMove(positionLeft);
            }

            if(pieceRight != null && pieceRight.color != this.color){
                this.addMove(positionRight);
            }
        }else{
            let positionLeft = this.position.addRow(-1);
            positionLeft = positionLeft.addColumn(-1);
            let pieceLeft = this.getPiece(pieces, positionLeft);

            let positionRight = this.position.addRow(1);
            positionRight = positionRight.addColumn(-1);
            let pieceRight = this.getPiece(pieces, positionRight);

            if(pieceLeft != null && pieceLeft.color != this.color){
                this.addMove(positionLeft);
            }

            if(pieceRight != null && pieceRight.color != this.color){
                this.addMove(positionRight);
            }
        }
    }

    setEnPassantMoves(pieces){
        let positionLeft = this.position.addRow(-1);
        let pieceLeft = this.getPiece(pieces, positionLeft);

        let positionRight = this.position.addRow(1);
        let pieceRight = this.getPiece(pieces, positionRight);

        if(this.color == 'white'){
            if(pieceLeft != null && pieceLeft.type == 'pawn' && pieceLeft.color != this.color && pieceLeft.doubleMovement){
                this.addMove(new Position(positionLeft.row, positionLeft.column + 1));
            }

            if(pieceRight != null && pieceRight.type == 'pawn' && pieceRight.color != this.color && pieceRight.doubleMovement){
                this.addMove(new Position(positionRight.row, positionRight.column + 1));
            }
        }else{
            if(pieceLeft != null && pieceLeft.type == 'pawn' && pieceLeft.color != this.color && pieceLeft.doubleMovement){
                this.addMove(new Position(positionLeft.row, positionLeft.column - 1));
            }

            if(pieceRight != null && pieceRight.type == 'pawn' && pieceRight.color != this.color && pieceRight.doubleMovement){
                this.addMove(new Position(positionRight.row, positionRight.column - 1));
            }
        }
    }

    verifyIsEnPassant(position, pieces){
        let positionLeft = this.position.addRow(-1);
        let positionRight = this.position.addRow(1);

        let pieceLeft = this.getPiece(pieces, positionLeft);
        let pieceRight = this.getPiece(pieces, positionRight);

        let eatLeft = this.position.row - position.row == 1 && pieceLeft;
        let eatRight = this.position.row - position.row == -1 && pieceRight;

        if(eatLeft && pieceLeft != null && pieceLeft.type == 'pawn' && pieceLeft.color != this.color && pieceLeft.doubleMovement){
            return 'left';
        }else if(eatRight &&pieceRight != null && pieceRight.type == 'pawn' && pieceRight.color != this.color && pieceRight.doubleMovement){
            return 'right';
        }

        return false;
    }

    checkMoveValidityOfNormalMove(position, pieces){
        if(!position.outOfBounds()){
            let pieceForward =this.getPiece(pieces, position);
            
            if(pieceForward == null){
                this.addMove(position);
                return true;
            }
        }

        return false;
    }

    checkMoveValidityOfDoubleMove(position, pieces){
        if(!position.outOfBounds()){
            let pieceForward2 = this.getPiece(pieces, position);

            if(pieceForward2 == null && !this.moved){
                this.addMove(position);
            }
        }
    }
}