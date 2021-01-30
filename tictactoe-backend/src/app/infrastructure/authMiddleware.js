// authMiddleware.js

const axios = require('axios');

const logger = require('../../shared/infrastructure/log/logFacade');

// //////////////////////////////////////////////////////////////////////////////
// PROPERTIES & CONSTANTS
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Auth Middleware]';

let tokenVerifyEndpoint;
let tokenRefreshEndpoint;
let getUserByTokenEndpoint;

// //////////////////////////////////////////////////////////////////////////////
// Private Methods
// //////////////////////////////////////////////////////////////////////////////

function handleAxiosError(funcName, error, res) {
  if (error.response) {
    logger.debug(`${MODULE_NAME}:${funcName} (ERROR) -> error.response.data: ${JSON.stringify(error.response.data)}, error.response.status: ${error.response.status}`);

    let jsonResult;
    let statusResult;
    if (error.response.status === 400) {
      jsonResult = {
        error: 'Not authenticated in the system',
      };
      statusResult = 403;
    } else {
      jsonResult = {
        error: error.response.data,
      };
      statusResult = error.response.status;
    }

    res.status(statusResult).send(jsonResult);
  }
}

async function verifyToken(securityHeader) {
  // Call Verify Endpoint
  logger.debug(`${MODULE_NAME} ${verifyToken.name} (IN) --> tokenVerifyEndpoint: ${tokenVerifyEndpoint}, securityHeader: ${securityHeader}`);
  const innerAxiosData = await axios.get(`${tokenVerifyEndpoint}`,
    {
      headers: {
        token: securityHeader,
      },
    });
  const innerAxiosDataVerify = innerAxiosData.data;
  logger.debug(`${MODULE_NAME}:${verifyToken.name} (MID) -> innerAxiosDataVerify: ${JSON.stringify(innerAxiosDataVerify)}`);

  logger.debug(`${MODULE_NAME}:${verifyToken.name} (OUT) -> Done!`);
}

async function refreshToken(securityHeader, res) {
  // Call Verify Endpoint
  logger.debug(`${MODULE_NAME} ${refreshToken.name} (IN) --> tokenVerifyEndpoint: ${tokenVerifyEndpoint}, securityHeader: ${securityHeader}`);
  const innerAxiosData = await axios.post(`${tokenRefreshEndpoint}`, {},
    {
      headers: {
        token: securityHeader,
      },
    });
  const innerAxiosDataRefresh = innerAxiosData.data;
  logger.debug(`${MODULE_NAME}:${refreshToken.name} (MID) -> innerAxiosDataRefresh: ${JSON.stringify(innerAxiosDataRefresh)}`);
  res.setHeader('authorization', `Bearer ${innerAxiosDataRefresh}`);

  logger.debug(`${MODULE_NAME}:${refreshToken.name} (OUT) -> Done!`);
}

async function getUserByToken(securityHeader, req) {
  // Call getUserInToken Endpoint
  logger.debug(`${MODULE_NAME} ${getUserByToken.name} (IN) --> getUserByTokenEndpoint: ${getUserByTokenEndpoint}, securityHeader: ${securityHeader}`);
  const innerAxiosData = await axios.get(`${getUserByTokenEndpoint}`,
    {
      headers: {
        token: securityHeader,
      },
    });
  const innerAxiosDataUser = innerAxiosData.data;
  logger.debug(`${MODULE_NAME}:${getUserByToken.name} (MID) -> innerAxiosDataUser: ${JSON.stringify(innerAxiosDataUser)}`);
  req.headers.userId = innerAxiosDataUser.id;

  logger.debug(`${MODULE_NAME}:${getUserByToken.name} (OUT) -> Done!`);
}

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
// //////////////////////////////////////////////////////////////////////////////

function init(tokenVerifyEndpointIN, tokenRefreshEndpointIN, getUserByTokenEndpointIN) {
  tokenVerifyEndpoint = tokenVerifyEndpointIN;
  tokenRefreshEndpoint = tokenRefreshEndpointIN;
  getUserByTokenEndpoint = getUserByTokenEndpointIN;
}

async function authenticate(req, res, next) {
  try {
    logger.debug(`${MODULE_NAME} ${authenticate.name} (IN) --> no params`);

    const securityHeader = req.headers.authorization;
    logger.debug(`${MODULE_NAME} ${authenticate.name} (MID) --> securityHeader: ${securityHeader}`);

    await verifyToken(securityHeader);

    await getUserByToken(securityHeader, req);

    await refreshToken(securityHeader, res);

    logger.debug(`${MODULE_NAME} ${authenticate.name} (OUT) --> under construction!`);
    next();
  } catch (error) {
    handleAxiosError(authenticate.name, error, res, next);
  }
}

module.exports = {
  init,
  authenticate,
};
