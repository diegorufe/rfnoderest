const LOG = require("./log.config");
const EXPRESS_APP_BEAN = require("./exressapp").ExpressApp;
const jsonwebtoken = require("jsonwebtoken");

/**
 * Mhetod to create express app
 * @param {*} mapProperties map properties to use in creation express
 */
function create_express_app(mapProperties) {
  const MAP_PROPERTIES = require("./properties.express").MAP_PROPERTIES;
  const MAP_PROPERTIES_STATUS_HTTP = require("./properties.express")
    .MAP_PROPERTIES_STATUS_HTTP;
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

  const LOGGER = LOG.log.createLogger(
    MAP_PROPERTIES_CREATE_EXPRESS.EXPRESS_REST_NAME,
    MAP_PROPERTIES_CREATE_EXPRESS.PATH_LOG,
    MAP_PROPERTIES_CREATE_EXPRESS.MAX_SIZE_LOG,
    MAP_PROPERTIES_CREATE_EXPRESS.MAX_FILES_LOG
  );

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

  // Create object ExpressApp to create express app
  const EXPRESS_APP = new EXPRESS_APP_BEAN();

  // Add variables to app epxress
  EXPRESS_APP.mapProperties = MAP_PROPERTIES_CREATE_EXPRESS;
  EXPRESS_APP.app = app;
  EXPRESS_APP.express = express;
  EXPRESS_APP.router = router;

  // create logger for app
  EXPRESS_APP.logger = LOGGER;

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
  create_express_app: create_express_app
};
