const Position = require('../Position');
const Piece = require('./Piece');

module.exports = class Pawn extends Piece{
    constructor(color, position){
        super(color, position);
        this.type = "Pawn";

        this.moved = false;
        this.doubleMovement = false;
    }

    setPossibleMoves(pieces){
        super.setPossibleMoves(pieces);

        let positionForward = this.position.addColumn(1);
        let positionForward2 = this.position.addColumn(2);

        if(this.color == 'white'){
            positionForward = this.position.addColumn(1);
            positionForward2 = this.position.addColumn(2);

            this.checkMoveValidityOfNormalMove(positionForward, pieces);
            this.checkMoveValidityOfDoubleMove(positionForward2, pieces);
            
        }else{
            positionForward = this.position.addColumn(-1);
            positionForward2 = this.position.addColumn(-2);

            this.checkMoveValidityOfNormalMove(positionForward, pieces);
            this.checkMoveValidityOfDoubleMove(positionForward2, pieces);
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
            if(pieceLeft != null && pieceLeft.type == 'Pawn' && pieceLeft.color != this.color && pieceLeft.doubleMovement){
                this.addMove(new Position(positionLeft.row, positionLeft.column + 1));
            }

            if(pieceRight != null && pieceRight.type == 'Pawn' && pieceRight.color != this.color && pieceRight.doubleMovement){
                this.addMove(new Position(positionRight.row, positionRight.column + 1));
            }
        }else{
            if(pieceLeft != null && pieceLeft.type == 'Pawn' && pieceLeft.color != this.color && pieceLeft.doubleMovement){
                this.addMove(new Position(positionLeft.row, positionLeft.column - 1));
            }

            if(pieceRight != null && pieceRight.type == 'Pawn' && pieceRight.color != this.color && pieceRight.doubleMovement){
                this.addMove(new Position(positionRight.row, positionRight.column - 1));
            }
        }
    }

    checkMoveValidityOfNormalMove(position, pieces){
        if(!this.outOfBounds(position)){
            let pieceForward =this.getPiece(pieces, position);
            
            if(pieceForward == null){
                this.addMove(position);
            }
        }
    }

    checkMoveValidityOfDoubleMove(position, pieces){
        if(!this.outOfBounds(position)){
            let pieceForward2 =this.getPiece(pieces, position);

            if(pieceForward2 == null && !this.moved){
                this.addMove(position);
            }
        }
    }
}