// TicTacToe.js

const { BaseDomainObj } = require('../../shared/domain/BaseDomainObj');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const NAME_DOMAIN_OBJ = 'TicTacToe';

const DEFAULT_BOARD = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' '],
];

const STATUS_DRAW = 'STATUS_DRAW';
const STATUS_PLAYER_X_WON = 'STATUS_PLAYER_X_WON';
const STATUS_PLAYER_O_WON = 'STATUS_PLAYER_O_WON';
const STATUS_ALIVE = 'STATUS_ALIVE';
const STATUS_PLAYER_X_TURN = 'PLAYER_X_TURN';
const STATUS_PLAYER_O_TURN = 'PLAYER_O_TURN';
const X_LINE = 'XXX';
const O_LINE = 'OOO';

const ERR_WRONG_TURN = 'Wrong turn';
const ERR_STATUS_IS_NOT_ALIVE = 'Status is not alive. The game has finished.';
const ERR_SQUARE_NOT_EMPTY = 'Square is not empty';

const SCHEMA = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 45 },
    idPlayerX: { type: 'string', maxLength: 45 },
    idPlayerO: { type: 'string', maxLength: 45 },
    status: { type: 'string', maxLength: 45 }, // TODO debe coger uno de los valores permitidos
    board: { type: 'array' }, // TODO ver si se puede limitar el número de filas y columnas en el esquema
  },
  required: ['id', 'idPlayerX', 'idPlayerO', 'status'],
  additionalProperties: false,
};

// TODO ver si conviene meter estas funciones dentro de la clase como funciones privadas (hay que usar un trick, ya que ECmaScript 6 no lo soporta)

function stringifiedRow(board, numRow) {
  return `${board[numRow][0]}${board[numRow][1]}${board[numRow][2]}`;
}
function stringifiedColumn(board, numColumn) {
  return `${board[0][numColumn]}${board[1][numColumn]}${board[2][numColumn]}`;
}

function stringifiedDiagonalA(board) {
  return `${board[0][0]}${board[1][1]}${board[2][2]}`;
}

function stringifiedDiagonalB(board) {
  return `${board[2][0]}${board[1][1]}${board[0][2]}`;
}

function rowIsCompleted(board, numRow) {
  return board[numRow][0] !== ' ' && board[numRow][1] !== ' ' && board[numRow][2] !== ' ';
}

function checkPlayerSymbolWins(board, symbol) {
  const symbolLine = (symbol === 'X') ? X_LINE : O_LINE;
  return stringifiedRow(board, 0) === symbolLine
  || stringifiedRow(board, 1) === symbolLine
  || stringifiedRow(board, 2) === symbolLine
  || stringifiedColumn(board, 0) === symbolLine
  || stringifiedColumn(board, 1) === symbolLine
  || stringifiedColumn(board, 2) === symbolLine
  || stringifiedDiagonalA(board, 2) === symbolLine
  || stringifiedDiagonalB(board, 2) === symbolLine;
}

function checkIsDraw(board) {
  return rowIsCompleted(board, 0) && rowIsCompleted(board, 1) && rowIsCompleted(board, 2);
}

// //////////////////////////////////////////////////////////////////////////////
// Class Implementation
// //////////////////////////////////////////////////////////////////////////////

class TicTacToe extends BaseDomainObj {
  constructor(data, schemaValidator) {
    super(data, schemaValidator, SCHEMA, NAME_DOMAIN_OBJ);
    // this.id = data.id;
    // this.idPlayerX = data.idPlayerX;
    // this.idPlayerO = data.idPlayerO;
    // this.status = data.status;
    // this.board = (data.board != null) ? data.board : DEFAULT_BOARD;
  }

  // get status() {
  //   return this.status;
  // }

  move(idPlayer, row, column) {
    // Check if the game is alive
    if (this.status !== STATUS_ALIVE) {
      throw new Error(ERR_STATUS_IS_NOT_ALIVE);
    }
    // Check if the turn is correct
    if ((idPlayer === this.idPlayerX && this.status === STATUS_PLAYER_O_TURN)
    || (idPlayer === this.idPlayerO && this.status === STATUS_PLAYER_X_TURN)) {
      throw new Error(ERR_WRONG_TURN);
    }
    // Check if the square is empty
    if (this.board[row][column] !== ' ') {
      throw new Error(ERR_SQUARE_NOT_EMPTY);
    }

    const playerSymbol = (idPlayer === this.idPlayerX) ? 'X' : 'O';

    // Apply move
    this.board[row][column] = playerSymbol;

    // Check if player wins
    if (checkPlayerSymbolWins(this.board, playerSymbol)) {
      this.status = (idPlayer === this.idPlayerX) ? STATUS_PLAYER_X_WON : STATUS_PLAYER_O_WON;
    }

    // check if is a draw
    if (checkIsDraw(this.board)) {
      this.status = STATUS_DRAW;
    }
  }
}

module.exports = TicTacToe;
