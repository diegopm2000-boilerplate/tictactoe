// app.js

const express = require('express');
const expressOpenapi = require('express-openapi');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const logger = require('../../shared/infrastructure/log/logFacade');

const healthcheckController = require('../../healthcheck/adapter/controller/healthcheck.controller');
const tictactoeController = require('../../tictactoe/adapter/controller/tictactoe.controller');

const webSecurity = require('../../shared/infrastructure/util/webSecurity');
const mongoInfra = require('../../shared/infrastructure/database/mongo/mongo.infra');

// //////////////////////////////////////////////////////////////////////////////
// PROPERTIES & CONSTANTS
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[App]';

const API_DOCUMENT = './src/app/infrastructure/openapi.yaml';

// //////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
// //////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(`${MODULE_NAME} (ERROR) --> error: ${err.stack}`);

  const status = (err.status) ? err.status : 500;
  const errorObj = { code: status, message: err.message };
  res.status(status).json(errorObj);
};

// eslint-disable-next-line no-unused-vars
const routeNotFoundErrorHandler = (req, res, next) => {
  const errorObj = { code: 404, message: `Cannot ${req.method} ${req.path}` };
  res.status(404).json(errorObj);
};

const initExpress = (expressConfig) => {
  logger.debug(`${MODULE_NAME}:${initExpress.name} (IN) -> expressConfig: ${JSON.stringify(expressConfig)}`);
  const expressApp = express();

  expressApp.listen(expressConfig.port);

  return expressApp;
};

const initExpressOpenAPI = (expressApp) => {
  logger.debug(`${MODULE_NAME}:${initExpressOpenAPI.name} (IN) -> expressApp: <<expressApp>>`);

  const options = {
    app: expressApp,
    apiDoc: API_DOCUMENT,
    consumesMiddleware: { 'application/json': bodyParser.json() },
    errorMiddleware: errorHandler,
    operations: {
      healthcheck: healthcheckController.healthcheck,
      createGame: tictactoeController.createGame,
      move: tictactoeController.move,
      getGameById: tictactoeController.getGameById,
    },
  };

  expressOpenapi.initialize(options);
};

const initSwaggerUI = (expressApp) => {
  const swaggerDocument = YAML.load(API_DOCUMENT);
  expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
// //////////////////////////////////////////////////////////////////////////////

exports.init = async () => {
  // 1. Init default logger
  logger.defaultInit();
  logger.debug(`${MODULE_NAME}:init (IN) --> no params`);

  // 2. Load Config from environment
  const expressPort = process.env.EXPRESS_PORT;
  logger.debug(`${MODULE_NAME}:init (MID) --> expressPort: ${expressPort}`);

  // 3. Init Express
  const expressConfig = { port: expressPort };
  const expressApp = initExpress(expressConfig);

  // 4. Init Web Security
  webSecurity.init(expressApp);

  // 5. Init ExpressOpenApi
  await initExpressOpenAPI(expressApp);

  // 6. Expose documentation using swagger-ui-express
  initSwaggerUI(expressApp);

  // 7. Route for handle the 404 route not found
  expressApp.use(routeNotFoundErrorHandler);

  // 8. Mongo init
  const mongoOptions = {
    mongoURL: process.env.MONGO_URL,
  };
  await mongoInfra.init(mongoOptions);

  // 7. App Start Result
  const result = true;
  logger.debug(`${MODULE_NAME}:init (OUT) -> App started: ${JSON.stringify(result)}`);
  return result;
};

require('make-runnable/custom')({
  printOutputFrame: false,
});
