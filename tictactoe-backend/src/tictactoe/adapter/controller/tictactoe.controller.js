// tictactoe.controller.js

const uniqIdGenerator = require('../../../shared/infrastructure/util/uniqIdGenerator');
const schemaValidator = require('../../../shared/infrastructure/util/schemaValidator');

const logger = require('../../../shared/infrastructure/log/logFacade');
const presenter = require('../../../shared/adapter/presenter/httpPresenter');

const createGameUC = require('../../usecase/createGame.usecase');

const repository = require('../repository/mongoose/tictactoe.mongoose.repository');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[TicTacToe Controller]';

// //////////////////////////////////////////////////////////////////////////////
// Public Methods
// //////////////////////////////////////////////////////////////////////////////

async function createGame(req, res, next) {
  try {
    // IN
    const data = req.body;
    logger.info(`${MODULE_NAME}:${createGame.name} (IN) -> data: ${JSON.stringify(data)}`);

    // Execute Business Logic
    const result = await createGameUC.execute(logger, presenter, uniqIdGenerator, schemaValidator, repository, data);

    // Return Result
    logger.info(`${MODULE_NAME}:${createGame.name}} (OUT) -> result: ${JSON.stringify(result)}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`${MODULE_NAME}:${createGame.name}} (ERROR) -> error.stack: ${error.stack}`);
    next(new Error('Internal Error'));
  }
}

module.exports = {
  createGame,
};
