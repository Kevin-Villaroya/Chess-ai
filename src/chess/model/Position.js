module.exports = class Position {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  static positionFromString(string) {
    let row = string.charCodeAt(0) - 64;
    let column = parseInt(string.charAt(1));

    return new Position(row, column);
  }

  getColumn() {
    return this.column;
  }

  getRow() {
    var letter = String.fromCharCode(this.row + 64).toLowerCase();

    return letter;
  }

  setRow(row) {
    this.row = row;
  }

  setColumn(column) {
    this.column = column;
  }

  addColumn(value){
    this.column += value;
  }

  addRow(value){
    this.row += value;
  }

  equals(position) {
    return this.row == position.getRow() && this.column == position.getColumn();
  }

  getString() {
    return '' + this.getRow() + this.getColumn();
  }
}