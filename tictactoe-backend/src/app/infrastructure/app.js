// app.js

const express = require('express');
const expressOpenapi = require('express-openapi');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const logger = require('../../shared/infrastructure/log/logFacade');
const presenter = require('../../shared/adapter/presenter/httpPresenter');

const healthcheckController = require('../../healthcheck/adapter/controller/healthcheck.controller');
const tictactoeController = require('../../tictactoe/adapter/controller/tictactoe.controller');

const tictactoeMongooseRepository = require('../../tictactoe/adapter/repository/mongoose/tictactoe.mongoose.repository');

const webSecurity = require('../../shared/infrastructure/util/webSecurity');
const mongoInfra = require('../../shared/infrastructure/database/mongo/mongo.infra');
const uniqIdGenerator = require('../../shared/infrastructure/util/uniqIdGenerator');
const schemaValidator = require('../../shared/infrastructure/util/schemaValidator');

const healthcheckUC = require('../../healthcheck/usecase/healthcheck.usecase');
const tictactoeUC = require('../../tictactoe/usecase/tictactoe.usecase');

// //////////////////////////////////////////////////////////////////////////////
// PROPERTIES & CONSTANTS
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[App]';

const API_DOCUMENT = './src/app/infrastructure/openapi.yaml';

// //////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
// //////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(`${MODULE_NAME}:${errorHandler.name} (ERROR) --> error: ${err.stack}`);

  const status = (err.status) ? err.status : 500;
  const errorObj = { code: status, message: err.message };
  res.status(status).json(errorObj);
}

// eslint-disable-next-line no-unused-vars
function routeNotFoundErrorHandler(req, res, next) {
  const errorObj = { code: 404, message: `Cannot ${req.method} ${req.path}` };
  res.status(404).json(errorObj);
}

function initExpress(expressConfig) {
  logger.debug(`${MODULE_NAME}:${initExpress.name} (IN) -> expressConfig: ${JSON.stringify(expressConfig)}`);
  const expressApp = express();

  expressApp.listen(expressConfig.port);

  logger.debug(`${MODULE_NAME}:${initExpress.name} (OUT) -> expressApp: <<expressApp>>`);
  return expressApp;
}

function initExpressOpenAPI(expressApp) {
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
      joinGame: tictactoeController.joinGame,
      getGameById: tictactoeController.getGameById,
    },
  };

  expressOpenapi.initialize(options);
  logger.debug(`${MODULE_NAME}:${initExpressOpenAPI.name} (OUT) -> Done`);
}

function initSwaggerUI(expressApp) {
  const swaggerDocument = YAML.load(API_DOCUMENT);
  expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

function initHealthcheckUC() {
  logger.debug(`${MODULE_NAME}:${initHealthcheckUC.name} (IN) -> no params`);

  healthcheckUC.init(logger, presenter);

  logger.debug(`${MODULE_NAME}:${initHealthcheckUC.name} (OUT) -> Done`);
}

function initTicTacToeUC() {
  logger.debug(`${MODULE_NAME}:${initTicTacToeUC.name} (IN) -> no params`);

  tictactoeUC.init(logger, presenter, tictactoeMongooseRepository, uniqIdGenerator, schemaValidator);

  logger.debug(`${MODULE_NAME}:${initTicTacToeUC.name} (OUT) -> Done`);
}

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
  await mongoInfra.init({ mongoURL: process.env.MONGO_URL });

  // 9. User UseCases
  initHealthcheckUC();
  initTicTacToeUC();

  // 7. App Start Result
  const result = true;
  logger.debug(`${MODULE_NAME}:init (OUT) -> App started: ${JSON.stringify(result)}`);
  return result;
};

require('make-runnable/custom')({
  printOutputFrame: false,
});
