const SECURITY_MODULE = require("./security.config");
const LOG = require("./log.config");
/**
 * Default properties for rest
 */
const MAP_PROPERTIES = {
  // Name for rest app
  EXPRESS_REST_NAME: "EXPRESS_APP",
  // Default port
  EXPRESS_PORT: 3000,
  // Indicate is rest or not
  REST: true,
  // Propertie for facility secure app
  // https://github.com/helmetjs/helmet
  USE_HELMET: true,
  // Disable powered trusted proxy
  DISABLE_POWERED_BY: true,
  // Turx proxy
  TRUX_PROXY: true,
  // Use csrf protection
  USE_CSRF: false,
  // Use router for manage request
  USE_ROUTER: true,
  // Default api url for rest
  API_URL: "/api",
  // Indicates app is secure or not
  SECURE: true,
  // Default path url rest for manage secure protection
  DEFAULT_PATTERN_SECURE: "/secure/",
  // Request max size response
  BODY_PARSER_SIZE_LIMIT: "50mb",
  // Indicate cors configuration for cross side request
  ENABLE_CORS: false,
  // Default security method
  DEFAULT_SECURITY_METHOD: "jsonwebtoken",
  // Secret passwod for jwt. Change if use this security protection
  SECRET_PASSWORD_JSON_WEB_TOKEN:
    "$2y$12$Z8XyhQRBD50hQ2fGcBn.GOLcE4ippoSNFXjjrBDWuvNLK0KaNIS.a",
  // Time expire json web token
  TIME_EXPIRE_JSON_WEB_TOKEN: 60 * 20 * 1,
  // Function to indicates permision for user or not. By default return true
  SEUCRITY_METHOD_INTECERPTOR_PERMISIONS_FUNCTION: null,
  // Path log
  PATH_LOG: null,
  // Max size log
  MAX_SIZE_LOG: 262144000,
  // Max file log
  MAX_FILES_LOG: 5,
  // Services for application
  SERVICES: {}
};

/**
 * Map properties status http
 */
const MAP_PROPERTIES_STATUS_HTTP = {
  ACCESS_DENIED: 401,
  ACCESS_SUCCES: 200,
  BAD_GATEWAY: 400
};

/**
 * Class to save configuration for express app
 */
class ExpressApp {
  constructor() {
    // store epxress object
    this.express = null;
    // store app created by express
    this.app = null;
    // store map properties for rest
    this.mapProperties = {};
    // store router object create by express if use router
    this.router = null;
    // store map status htpp properties
    this.mapStatusHttp = MAP_PROPERTIES_STATUS_HTTP;
    // logger for application
    this.logger = null;
  }

  /**
   * Method to add midleware to router
   * @param {*} functionMidleware is a function to execute in midelware quest
   */
  addMidlewareRouter(functionMidleware) {
    if (!this.routerIsNull()) {
      this.router.use(functionMidleware);
    }
  }

  /**
   * Method to add get request route to app
   * @param {*} route is the route request
   * @param {*} functionRoute is the funcion to execute when catch request
   */
  addGetRoute(route, functionRoute) {
    // if have router configuration add to router
    if (!this.routerIsNull()) {
      this.router.get(route, functionRoute);
      // if not have router add to app if exists
    } else if (!this.appIsNull()) {
      this.app.get(route, functionRoute);
    }
  }

  /**
   * Method to add post request to app
   * @param {*} route is the route request
   * @param {*} functionRoute is the funcion to execute when catch request
   */
  addPostRoute(route, functionRoute) {
    // if have router configuration add to router
    if (!this.routerIsNull()) {
      this.router.post(route, functionRoute);
    } else if (!this.appIsNull()) {
      // if not have router add to app if exists
      this.app.post(route, functionRoute);
    }
  }

  /**
   * Method to start listen server
   * @param {*} port is the port of server
   * @param {*} hostname is th hostame of server
   */
  listen(port, hostname) {
    // check exists app
    if (!this.appIsNull()) {
      let console_log = this.console_log;
      // If router is not null use by star api url
      if (!this.routerIsNull()) {
        this.app.use(this.mapProperties["API_URL"], this.router);
      }
      // If port is null get default port
      if (port == null || port == undefined) {
        port = this.mapProperties["EXPRESS_PORT"];
      }
      const self = this;
      this.app.listen(port, hostname, function() {
        self.logger.info("App on port " + port);
      });
    }
  }

  /**
   * Method to know app is null
   */
  appIsNull() {
    return this.app == null || this.app == undefined;
  }

  /**
   * Method to know router is null
   */
  routerIsNull() {
    return this.router == null || this.router == undefined;
  }

  addService(serviceName, service) {
    if (service != null && service != undefined) {
      // Add logger to services and daos
      service.logger = this.logger;
      if (service.dao != null && service.dao != undefined) {
        service.dao.logger = this.logger;
      }
      // Add service to map services
      this.mapProperties.SERVICES[serviceName] = service;
    }
  }

  /**
   * Function to create routes for crud operations for service db for default object BaseService
   * @param {*} url  is the path for catch request
   * @param {*} serviceName is the name for service
   * @param {*} otherfnCreateService this function use for create other routes from service. This function must be input parameters expressApp(this), url, serviceName
   */
  createRouteService(url, serviceName, otherfnCreateService) {
    return create_route_service_db(
      this,
      url,
      serviceName,
      otherfnCreateService
    );
  }

  /**
   * MEthtod to sign jwt
   * @param {*} tokenData
   */
  signJwt(tokenData) {
    return SECURITY_MODULE.security.signJwtFn(tokenData, this.mapProperties);
  }

  /**
   * Method to decode jwt
   * @param {*} req
   */
  decodeJwt(req) {
    let token =
      req.headers["authorization"] ||
      req.headers["Authorization"] ||
      req.headers["x-access-token"];
    let tokenReturn = null;
    if (token != null && token != undefined) {
      token = token.replace("Bearer ", "");
      tokenReturn = SECURITY_MODULE.security.jsonwebtoken.decode(
        token,
        this.mapProperties.SECRET_PASSWORD_JSON_WEB_TOKEN
      );
    }
    return tokenReturn;
  }

  /**
   * Method to refreshtoken
   * @param {*} req
   * @param {*} res
   */
  async refreshToken(req, res) {
    const error = new Error("Not allowed permission");
    error.stack = "";
    error.name = "ACCESS_DENIED";
    let token =
      req.headers["authorization"] ||
      req.headers["Authorization"] ||
      req.headers["x-access-token"];
    if (token != null && token != undefined) {
      token = token.replace("Bearer ", "");
      let mapPropertiesExp = this.mapProperties;
      let mapPropertiesSta = this.mapStatusHttp;
      await jsonwebtoken.verify(
        token,
        this.mapProperties.SECRET_PASSWORD_JSON_WEB_TOKEN,
        function(err, user) {
          if (err) {
            res.status(mapPropertiesSta.ACCESS_DENIED);
            next(error);
          } else {
            let permissionAllowed = true;
            if (
              mapPropertiesExp.SEUCRITY_METHOD_INTECERPTOR_PERMISIONS_FUNCTION !=
                null &&
              mapPropertiesExp.SEUCRITY_METHOD_INTECERPTOR_PERMISIONS_FUNCTION !=
                undefined
            ) {
              permissionAllowed = mapPropertiesExp.SEUCRITY_METHOD_INTECERPTOR_PERMISIONS_FUNCTION(
                req.originalUrl,
                mapPropertiesExp,
                mapPropertiesSta,
                user
              );
            }
            // console.log(permissionAllowed);
            if (permissionAllowed) {
              return signJwtFn(user, mapPropertiesExp);
            } else {
              res.status(mapPropertiesSta.ACCESS_DENIED);
              next(error);
            }
          }
        }
      );
    }
  }
}

/**
 * Mhetod to create express app
 * @param {*} mapProperties map properties to use in creation express
 */
function create_express_app(mapProperties) {
  const MAP_PROPERTIES_CREATE_EXPRESS = Object.assign({}, MAP_PROPERTIES);

  // If the properties are not null, overwrite existing ones
  if (mapProperties != null && mapProperties != undefined) {
    Object.entries(mapProperties).forEach(([key, value]) => {
      MAP_PROPERTIES_CREATE_EXPRESS[key] = value;
    });
  }

  // Get express dependency
  const express = require("express");
  // Create express app
  const app = express();

  // If rest api use body parsers for manage request resonse
  if (MAP_PROPERTIES_CREATE_EXPRESS.REST) {
    // Body parsers from rest
    const bodyParser = require("body-parser");
    // check if have body parser size limit
    if (
      MAP_PROPERTIES_CREATE_EXPRESS.BODY_PARSER_SIZE_LIMIT != null &&
      MAP_PROPERTIES_CREATE_EXPRESS.BODY_PARSER_SIZE_LIMIT != undefined
    ) {
      // set limit bodyparser json
      app.use(
        bodyParser.json({
          limit: MAP_PROPERTIES_CREATE_EXPRESS.BODY_PARSER_SIZE_LIMIT,
          extended: true
        })
      );

      // set limit bodyparser url
      app.use(
        bodyParser.urlencoded({
          limit: MAP_PROPERTIES_CREATE_EXPRESS.BODY_PARSER_SIZE_LIMIT,
          extended: true
        })
      );
    } else {
      // if not set body parser size limit
      app.use(bodyParser.urlencoded({ extended: true }));
    }

    app.use(bodyParser.json());
  }

  // Use helmet security
  if (MAP_PROPERTIES_CREATE_EXPRESS.USE_HELMET) {
    const helmet = require("helmet");
    app.use(helmet());
  }

  // Disable powered by
  if (MAP_PROPERTIES_CREATE_EXPRESS.DISABLE_POWERED_BY) {
    app.disable("x-powered-by");
  }

  // Trux proxy
  if (MAP_PROPERTIES_CREATE_EXPRESS.TRUX_PROXY) {
    app.set("trust proxy", 1);
  }

  // Use crsf protection
  if (MAP_PROPERTIES_CREATE_EXPRESS.USE_CSRF) {
    let csrf = require("csurf");
    app.use(csrf());
  }

  // Use router handler request
  let router = null;
  if (MAP_PROPERTIES_CREATE_EXPRESS.USE_ROUTER) {
    router = express.Router();
  }

  // If secure, and url contains secure pattern, check user principal credentials
  if (MAP_PROPERTIES_CREATE_EXPRESS.SECURE) {
    // add middelware for intercept all request include secure pattern
    router.use(function(req, res, next) {
      const error = new Error("Not allowed permission");
      error.stack = "";
      error.name = "ACCESS_DENIED";

      // Only intercept secure url when request mehtod distinct to options
      if (req.method != "OPTIONS") {
        // when include secure pattern
        if (
          req.originalUrl.includes(
            MAP_PROPERTIES_CREATE_EXPRESS.DEFAULT_PATTERN_SECURE
          )
        ) {
          if (
            MAP_PROPERTIES_CREATE_EXPRESS.DEFAULT_SECURITY_METHOD != null &&
            MAP_PROPERTIES_CREATE_EXPRESS.DEFAULT_SECURITY_METHOD != undefined
          ) {
            // If use custom security interceptor
            switch (MAP_PROPERTIES_CREATE_EXPRESS.DEFAULT_SECURITY_METHOD) {
              case "custom":
                MAP_PROPERTIES_CREATE_EXPRESS.SEUCRITY_METHOD_INTECERPTOR_FUNCTION(
                  MAP_PROPERTIES_CREATE_EXPRESS,
                  MAP_PROPERTIES_STATUS_HTTP,
                  req,
                  res,
                  next,
                  { errorObject: error }
                );
                break;

              case "jsonwebtoken":
                let token =
                  req.headers["authorization"] ||
                  req.headers["Authorization"] ||
                  req.headers["x-access-token"];
                if (token == null || token == undefined || !token) {
                  res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
                  next(error);
                  break;
                }

                token = token.replace("Bearer ", "");

                jsonwebtoken.verify(
                  token,
                  MAP_PROPERTIES_CREATE_EXPRESS.SECRET_PASSWORD_JSON_WEB_TOKEN,
                  function(err, user) {
                    if (err) {
                      res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
                      if (
                        err != null &&
                        err != undefined &&
                        err.message.includes("jwt expired")
                      ) {
                        res.json("EXPIRED");
                      }
                      next(new Error("Not allowed permission"));
                    } else {
                      let permissionAllowed = true;
                      // Extra function to knwo user has security permisions
                      if (
                        MAP_PROPERTIES_CREATE_EXPRESS.SEUCRITY_METHOD_INTECERPTOR_PERMISIONS_FUNCTION !=
                          null &&
                        MAP_PROPERTIES_CREATE_EXPRESS.SEUCRITY_METHOD_INTECERPTOR_PERMISIONS_FUNCTION !=
                          undefined
                      ) {
                        permissionAllowed = MAP_PROPERTIES_CREATE_EXPRESS.SEUCRITY_METHOD_INTECERPTOR_PERMISIONS_FUNCTION(
                          req.originalUrl,
                          MAP_PROPERTIES_CREATE_EXPRESS,
                          MAP_PROPERTIES_STATUS_HTTP,
                          user
                        );
                      }
                      // console.log(permissionAllowed);
                      if (permissionAllowed) {
                        // TODO if jwt refrehs always in header
                        // token = signJwtFn(user, MAP_PROPERTIES_CREATE_EXPRESS);
                        // res.setHeader("Authorization", token);
                        next();
                      } else {
                        res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
                        next(error);
                      }
                    }
                  }
                );

                break;

              default:
                res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
                next(error);
                break;
            }
          } else {
            // for default if include secure patther throw error permision
            res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
            next(error);
          }
        } else {
          next();
        }
      } else {
        next();
      }
    });
  }

  // if disable cors protection
  if (!MAP_PROPERTIES_CREATE_EXPRESS.ENABLE_CORS) {
    app.use(function(req, res, next) {
      // res.header("Access-Control-Allow-Origin", "*");
      // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
      );
      res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

      next();
    });
  }

  // Error handling
  app.use(function errorHandler(err, req, res, next) {
    if (err != null && err != undefined) {
      res.status(MAP_PROPERTIES_STATUS_HTTP.BAD_GATEWAY);
    }
    next(err);
  });

  // Create object ExpressApp to create express app
  const EXPRESS_APP = new ExpressApp();

  // Add variables to app epxress
  EXPRESS_APP.mapProperties = MAP_PROPERTIES_CREATE_EXPRESS;
  EXPRESS_APP.app = app;
  EXPRESS_APP.express = express;
  EXPRESS_APP.router = router;

  // create logger for app
  EXPRESS_APP.logger = LOG.log.createLogger(
    EXPRESS_APP.EXPRESS_REST_NAME,
    EXPRESS_APP.mapProperties.PATH_LOG,
    EXPRESS_APP.mapProperties.MAX_SIZE_LOG,
    EXPRESS_APP.mapProperties.MAX_FILES_LOG
  );

  return EXPRESS_APP;
}

/**
 * Function to create routes for crud operations for service db for default object BaseService
 * All request have in body param "data". Example: {data: filters: [] .... }
 * @param {*} EXPRESS_APP is the express object aplication
 * @param {*} url is the path for catch request
 * @param {*} serviceName is the name for service
 * @param {*} otherfnCreateService this function use for create other routes from service. This service recive EXPRESS_APP, url and serviceName
 */
function create_route_service_db(
  EXPRESS_APP,
  url,
  serviceName,
  otherfnCreateService
) {
  // Count
  EXPRESS_APP.addPostRoute(url + "/count", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].count(
        req.body.data.filters,
        req.body.data.fetchs
      );

      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // FindAll
  EXPRESS_APP.addPostRoute(url + "/findAll", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findAll(
        req.body.data.filters,
        req.body.data.fetchs,
        req.body.data.orders,
        req.body.data.limits
      );
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // findAllOnlyFields
  EXPRESS_APP.addPostRoute(url + "/findAllOnlyFields", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findAllOnlyFields(
        req.body.data.fields,
        req.body.data.filters,
        req.body.data.fetchs,
        req.body.data.orders,
        req.body.data.limits
      );
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // FindOne
  EXPRESS_APP.addPostRoute(url + "/findOne", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findOne(
        req.body.data.filters,
        req.body.data.fetchs,
        req.body.data.orders,
        req.body.data.limits
      );
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // Destroy
  EXPRESS_APP.addPostRoute(url + "/destroy", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].destroy(req.body.data.element);
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: true, status: 200 });
    })();
  });

  // Save
  EXPRESS_APP.addPostRoute(url + "/save", function(req, res) {
    (async () => {
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].save(
        req.body.data.element
      );
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // Build
  EXPRESS_APP.addPostRoute(url + "/build", function(req, res) {
    (async () => {
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].build();
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // Test
  EXPRESS_APP.addGetRoute(url + "/test", function(req, res) {
    (async () => {
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: "test", status: 200 });
    })();
  });

  // Create rest routes from url
  if (otherfnCreateService != null) {
    otherfnCreateService(EXPRESS_APP, url, serviceName);
  }
}

module.exports = {
  create_express_app: create_express_app,
  status_htpp: MAP_PROPERTIES_STATUS_HTTP,
  create_route_service_db: create_route_service_db
};
