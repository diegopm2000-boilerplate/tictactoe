// createGame.usecase.js

const TicTacToe = require('../domain/TicTacToe');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[createGame UC]';

// //////////////////////////////////////////////////////////////////////////////
// Public Methods
// //////////////////////////////////////////////////////////////////////////////

async function execute(logger, presenter, uniqIdGenerator, schemaValidator, repository, dataIN) {
  // IN
  logger.debug(`${MODULE_NAME}:${execute.name} (IN)  -> dataIN: ${JSON.stringify(dataIN)}`);

  // Build data
  const data = JSON.parse(JSON.stringify(dataIN));
  data.id = uniqIdGenerator.generateUniqId();

  // Create Domain Object
  const newObjectDO = new TicTacToe(data, schemaValidator);
  if (newObjectDO.errors && newObjectDO.errors.length > 0) {
    return presenter.presentConflict(newObjectDO.errors);
  }

  // Persistence
  const innerResult = await repository.create(newObjectDO);
  logger.debug(`${MODULE_NAME} (MID) -> innerResult: ${JSON.stringify(innerResult)}`);

  // Build & Return result
  const result = presenter.presentCreatedObject(innerResult);
  logger.debug(`${MODULE_NAME} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

module.exports = {
  execute,
};
