// user.controller.js

const logger = require('../../../shared/infrastructure/log/logFacade');
const userUC = require('../../usecase/user.usecase');

// //////////////////////////////////////////////////////////////////////////////
// Properties & Constants
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[User Controller]';

// //////////////////////////////////////////////////////////////////////////////
// Public Methods
// //////////////////////////////////////////////////////////////////////////////

async function registerUser(req, res, next) {
  try {
    // IN
    const newUserData = req.body;
    logger.info(`${MODULE_NAME}:${registerUser.name} (IN)  ->  newUserData: ${JSON.stringify(newUserData)}`);

    // Execute Business Logic
    const result = await userUC.registerUser(newUserData);

    // Return Result
    logger.info(`${MODULE_NAME}:${registerUser.name} (OUT) -> result: ${JSON.stringify(result)}`);
    res.status(result.status).json(result.data);
  } catch (error) {
    logger.error(`${MODULE_NAME}:${registerUser.name} (ERROR) -> error.stack: ${error.stack}`);
    next(new Error('Internal Error'));
  }
}

module.exports = {
  registerUser,
};
