// tictactoe.controller.js

const logger = require('../../../shared/infrastructure/log/logFacade');
const tictactoeGameUC = require('../../usecase/tictactoe.usecase');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[TicTacToe Controller]';

// //////////////////////////////////////////////////////////////////////////////
// Public Methods
// //////////////////////////////////////////////////////////////////////////////

async function getGameById(req, res, next) {
  try {
    // IN
    const { gameId } = req.params;
    logger.info(`${MODULE_NAME}:${getGameById.name} (IN) -> gameId: ${gameId}`);

    // Execute Business Logic
    const result = await tictactoeGameUC.getGameById(gameId);

    // Return Result
    logger.info(`${MODULE_NAME}:${getGameById.name} (OUT) -> result: ${JSON.stringify(result)}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`${MODULE_NAME}:${getGameById.name} (ERROR) -> error.stack: ${error.stack}`);
    next(new Error('Internal Error'));
  }
}

async function createGame(req, res, next) {
  try {
    // IN
    const data = req.body;
    logger.info(`${MODULE_NAME}:${createGame.name} (IN) -> data: ${JSON.stringify(data)}`);

    // Execute Business Logic
    const result = await tictactoeGameUC.createGame(data);

    // Return Result
    logger.info(`${MODULE_NAME}:${createGame.name} (OUT) -> result: ${JSON.stringify(result)}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`${MODULE_NAME}:${createGame.name} (ERROR) -> error.stack: ${error.stack}`);
    next(new Error('Internal Error'));
  }
}

async function joinGame(req, res, next) {
  try {
    // IN
    const { gameId } = req.params;
    const { playerId } = req.body;
    logger.info(`${MODULE_NAME}:${joinGame.name} (IN) -> gameId: ${gameId}, playerId: ${playerId}`);

    // Execute Business Logic
    const result = await tictactoeGameUC.joinGame(gameId, playerId);

    // Return Result
    logger.info(`${MODULE_NAME}:${joinGame.name} (OUT) -> result: ${JSON.stringify(result)}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`${MODULE_NAME}:${joinGame.name} (ERROR) -> error.stack: ${error.stack}`);
    next(new Error('Internal Error'));
  }
}

async function move(req, res, next) {
  try {
    // IN
    const data = req.body;
    const { gameId } = req.params;
    logger.info(`${MODULE_NAME}:${move.name} (IN) -> data: ${JSON.stringify(data)}, gameId: ${gameId}`);

    // Execute Business Logic
    const result = await tictactoeGameUC.move(data, gameId);

    // Return Result
    logger.info(`${MODULE_NAME}:${move.name} (OUT) -> result: ${JSON.stringify(result)}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`${MODULE_NAME}:${move.name} (ERROR) -> error.stack: ${error.stack}`);
    next(new Error('Internal Error'));
  }
}

module.exports = {
  createGame,
  joinGame,
  move,
  getGameById,
};
