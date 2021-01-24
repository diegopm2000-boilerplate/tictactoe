// user.usecase.js

const User = require('../domain/User');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[user UseCase]';

let logger;
let presenter;
let repository;

// //////////////////////////////////////////////////////////////////////////////
// Public Methods
// //////////////////////////////////////////////////////////////////////////////

function init(loggerIN, presenterIN, repositoryIN) {
  logger = loggerIN;
  presenter = presenterIN;
  repository = repositoryIN;
}

async function registerUser(userDataIN) {
  // IN
  logger.debug(`${MODULE_NAME}:${registerUser.name} (IN)  -> userDataIN: ${JSON.stringify(userDataIN)}`);

  // Persistence
  const innerResult = await repository.registerUser(userDataIN);
  logger.debug(`${MODULE_NAME}:${registerUser.name} (MID) -> innerResult: ${JSON.stringify(innerResult)}`);

  // Build & Return result
  const result = presenter.presentCreatedObject(innerResult);
  logger.debug(`${MODULE_NAME}:${registerUser.name} (OUT) -> result: ${JSON.stringify(result)}`);
  return result;
}

module.exports = {
  init,
  registerUser,
};
