const LOG = require("../log/log.config");
const EXPRESS_APP_BEAN = require("../express/expressapp").ExpressApp;
const jsonwebtoken = require("jsonwebtoken");
const Context = require("../context/context.module");
const CREATE_APP_ELECTRON = require("./electron/createappelectron");
const CREATE_APP_REST = require("./rest/createapprest");

/**
 * Mhetod to create express app
 * @param {*} mapProperties map properties to use in creation express
 */
function create_express_app(mapProperties) {
  // Properties
  const MAP_PROPERTIES = require("../express/properties.express")
    .MAP_PROPERTIES;
  const MAP_PROPERTIES_STATUS_HTTP = require("../express/properties.express")
    .MAP_PROPERTIES_STATUS_HTTP;
  const MAP_PROPERTIES_CREATE_EXPRESS = Object.assign({}, MAP_PROPERTIES);

  // If the properties are not null, overwrite existing ones
  if (mapProperties != null && mapProperties != undefined) {
    Object.entries(mapProperties).forEach(([key, value]) => {
      MAP_PROPERTIES_CREATE_EXPRESS[key] = value;
    });
  }

  // Create logger for application
  const LOGGER = LOG.log.createLogger(
    MAP_PROPERTIES_CREATE_EXPRESS.EXPRESS_REST_NAME,
    MAP_PROPERTIES_CREATE_EXPRESS.PATH_LOG,
    MAP_PROPERTIES_CREATE_EXPRESS.MAX_SIZE_LOG,
    MAP_PROPERTIES_CREATE_EXPRESS.MAX_FILES_LOG
  );

  let app = null;
  let express = null;
  let router = null;

  // Create express electron app
  if (MAP_PROPERTIES_CREATE_EXPRESS.EXPRESS_APP_IS_ELECTRON) {
    // If is elecotrn app not expire session
    MAP_PROPERTIES_CREATE_EXPRESS.TIME_EXPIRE_JSON_WEB_TOKEN = null;
    express = require("./electron/electron.module");
    // Create electron  app
    app = new express();
    // Create express app electron
    router = CREATE_APP_ELECTRON.create_express_app_electron(
      express,
      app,
      MAP_PROPERTIES_CREATE_EXPRESS,
      MAP_PROPERTIES_STATUS_HTTP
    );
    // Create express app electron
  } else {
    // Crete express rest app
    // Get express dependency
    express = require("express");
    // Create express app
    app = express();
    // Create express app rest
    router = CREATE_APP_REST.create_express_app_rest(
      express,
      app,
      MAP_PROPERTIES_CREATE_EXPRESS,
      MAP_PROPERTIES_STATUS_HTTP
    );
  }

  // Create object ExpressApp to create express app
  const EXPRESS_APP = new EXPRESS_APP_BEAN();

  // Add variables to app express
  EXPRESS_APP.mapProperties = MAP_PROPERTIES_CREATE_EXPRESS;
  EXPRESS_APP.app = app;
  EXPRESS_APP.express = express;
  EXPRESS_APP.router = router;

  // If is electron app add express app for this
  if (EXPRESS_APP.isElectronApp()) {
    EXPRESS_APP.router.epxressApp = EXPRESS_APP;
    CREATE_APP_ELECTRON.createSecureRouterElectron(
      EXPRESS_APP.router,
      MAP_PROPERTIES_CREATE_EXPRESS,
      MAP_PROPERTIES_STATUS_HTTP
    );
  }

  // Add logger created for express app
  EXPRESS_APP.logger = LOGGER;
  // Set logger to context
  Context.logger = LOGGER;

  // Create routes login and regresh token if jwt security is enabled
  if (MAP_PROPERTIES_CREATE_EXPRESS.CREATE_JWT_ROUTES_SECURITY) {
    EXPRESS_APP.createRoutesJwtSecurity(
      MAP_PROPERTIES_CREATE_EXPRESS.FUNCTION_SECURITY_LOGIN
    );
  }

  // Create route for log request
  EXPRESS_APP.createRoutesLog();

  return EXPRESS_APP;
}

module.exports = {
  create_express_app: create_express_app,
};
