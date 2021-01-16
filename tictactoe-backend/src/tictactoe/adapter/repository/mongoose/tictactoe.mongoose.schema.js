// tictactoe.mongoose.schema.js

const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

const tictactoeSchema = new mongoose.Schema({
  id: String,
  idPlayerX: String,
  idPlayerO: String,
  status: String,
  board: Array,
});

const TicTacToe = mongoose.model('TicTacToe', tictactoeSchema);

tictactoeSchema.plugin(mongooseHidden); // to hidden _id and __v in query results

module.exports = {
  TicTacToe,
};
