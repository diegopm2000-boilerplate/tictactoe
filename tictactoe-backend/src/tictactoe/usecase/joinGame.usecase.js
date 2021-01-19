// joinGame.usecase.js

const TicTacToe = require('../domain/TicTacToe');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[joinGame UC]';

// //////////////////////////////////////////////////////////////////////////////
// Public Methods
// //////////////////////////////////////////////////////////////////////////////

async function execute(logger, presenter, schemaValidator, repository, gameId, playerId) {
  // IN
  logger.debug(`${MODULE_NAME}:${execute.name} (IN)  -> gameId: ${gameId}, playerId: ${playerId}`);

  // Load game from repository
  const objectDB = await repository.getById(gameId);
  if (objectDB == null) {
    return presenter.presentObjectNotFound();
  }

  // TODO los repositorios no deberían devolver objetos del schema de mongoose --> corregir esto en el repo
  const data = JSON.parse(JSON.stringify(objectDB));

  // Create Domain Object
  const objectDO = new TicTacToe(data, schemaValidator);
  if (objectDO.errors && objectDO.errors.length > 0) {
    return presenter.presentConflict(objectDO.errors);
  }

  // Join game
  const resultJoin = objectDO.joinPlayer(playerId);
  if (resultJoin.error) {
    return presenter.presentConflict(resultJoin.error.message);
  }

  // Persistence
  const innerResult = await repository.update(objectDO, gameId);
  logger.debug(`${MODULE_NAME} (MID) -> innerResult: ${JSON.stringify(innerResult)}`);

  // Load the updated object
  const updatedObj = await repository.getById(gameId);

  // Build & Return result
  const result = presenter.presentObject(updatedObj);
  logger.debug(`${MODULE_NAME} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

module.exports = {
  execute,
};
