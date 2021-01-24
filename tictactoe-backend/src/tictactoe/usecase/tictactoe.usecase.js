// tictactoe.usecase.js

const TicTacToe = require('../domain/TicTacToe');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[tictactoe UseCase]';

let logger;
let presenter;
let repository;
let uniqIdGenerator;
let schemaValidator;

// //////////////////////////////////////////////////////////////////////////////
// Public Methods
// //////////////////////////////////////////////////////////////////////////////

function init(loggerIN, presenterIN, repositoryIN, uniqIdGeneratorIN, schemaValidatorIN) {
  logger = loggerIN;
  presenter = presenterIN;
  repository = repositoryIN;
  uniqIdGenerator = uniqIdGeneratorIN;
  schemaValidator = schemaValidatorIN;
}

async function createGame(dataIN) {
  // IN
  logger.debug(`${MODULE_NAME}:${createGame.name} (IN)  -> dataIN: ${JSON.stringify(dataIN)}`);

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
  logger.debug(`${MODULE_NAME}:${createGame.name} (MID) -> innerResult: ${JSON.stringify(innerResult)}`);

  // Build & Return result
  const result = presenter.presentCreatedObject(innerResult);
  logger.debug(`${MODULE_NAME}:${createGame.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function getGameById(id) {
  // IN
  logger.debug(`${MODULE_NAME}:${getGameById.name} (IN)  -> id: ${JSON.stringify(id)}`);

  // Get object from repository
  const innerResult = await repository.getById(id);
  logger.debug(`${MODULE_NAME}:${getGameById.name} (MID) -> innerResult: ${JSON.stringify(innerResult)}`);

  if (innerResult == null) {
    logger.debug(`${MODULE_NAME}:${getGameById.name} (OUT) -> object not found`);
    return presenter.presentObjectNotFound();
  }

  // Build & Return result
  const result = presenter.presentObject(innerResult);
  logger.debug(`${MODULE_NAME}:${getGameById.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function joinGame(gameId, playerId) {
  // IN
  logger.debug(`${MODULE_NAME}:${joinGame.name} (IN)  -> gameId: ${gameId}, playerId: ${playerId}`);

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
    logger.error(`${MODULE_NAME}:${joinGame.name} (ERROR) -> conflict: ${JSON.stringify(objectDO.errors)}`);
    return presenter.presentConflict(objectDO.errors);
  }

  // Join game
  const resultJoin = objectDO.joinPlayer(playerId);
  if (resultJoin.error) {
    logger.error(`${MODULE_NAME}:${joinGame.name} (ERROR) -> conflict: ${resultJoin.error.message}`);
    return presenter.presentConflict(resultJoin.error.message);
  }

  // Persistence
  const innerResult = await repository.update(objectDO, gameId);
  logger.debug(`${MODULE_NAME} (MID) -> innerResult: ${JSON.stringify(innerResult)}`);

  // Load the updated object
  const updatedObj = await repository.getById(gameId);

  // Build & Return result
  const result = presenter.presentObject(updatedObj);
  logger.debug(`${MODULE_NAME}:${joinGame.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

async function move(dataIN, id) {
  // IN
  logger.debug(`${MODULE_NAME}:${move.name} (IN)  -> dataIN: ${JSON.stringify(dataIN)}, id: ${id}`);

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
    logger.error(`${MODULE_NAME}:${joinGame.name} (ERROR) -> conflict: ${JSON.stringify(objectDO.errors)}`);
    return presenter.presentConflict(objectDO.errors);
  }

  // Execute movement
  const resultMove = objectDO.move(dataIN.idPlayer, dataIN.row, dataIN.column);
  if (resultMove.error) {
    logger.error(`${MODULE_NAME}:${joinGame.name} (ERROR) -> conflict: ${resultMove.error.message}`);
    return presenter.presentConflict(resultMove.error.message);
  }

  // Persistence
  const innerResult = await repository.update(objectDO, id);
  logger.debug(`${MODULE_NAME} (MID) -> innerResult: ${JSON.stringify(innerResult)}`);

  // Load the updated object
  const updatedObj = await repository.getById(id);

  // Build & Return result
  const result = presenter.presentObject(updatedObj);
  logger.debug(`${MODULE_NAME}:${move.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

module.exports = {
  init,
  createGame,
  getGameById,
  joinGame,
  move,
};
