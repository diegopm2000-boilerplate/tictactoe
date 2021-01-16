// move.usecase.js

const TicTacToe = require('../domain/TicTacToe');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[move UC]';

// //////////////////////////////////////////////////////////////////////////////
// Public Methods
// //////////////////////////////////////////////////////////////////////////////

async function execute(logger, presenter, schemaValidator, repository, dataIN, id) {
  // IN
  logger.debug(`${MODULE_NAME}:${execute.name} (IN)  -> dataIN: ${JSON.stringify(dataIN)}, id: ${id}`);

  // Load game from repository
  const objectDB = await repository.getById(id);
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

  // Execute movement
  const resultMove = objectDO.move(dataIN.idPlayer, dataIN.row, dataIN.column);
  if (resultMove.error) {
    return presenter.presentConflict(resultMove.error.message);
  }

  // Persistence
  const innerResult = await repository.update(objectDO, id);
  logger.debug(`${MODULE_NAME} (MID) -> innerResult: ${JSON.stringify(innerResult)}`);

  // Load the updated object
  const updatedObj = await repository.getById(id);

  // Build & Return result
  const result = presenter.presentObject(updatedObj);
  logger.debug(`${MODULE_NAME} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

module.exports = {
  execute,
};
