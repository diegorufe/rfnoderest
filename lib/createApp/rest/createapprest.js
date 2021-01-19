/**
 * Function for create express app rest
 * @param {*} express is the express module
 * @param {*} app is app for express module
 * @param {*} MAP_PROPERTIES_CREATE_EXPRESS
 * @param {*} MAP_PROPERTIES_STATUS_HTTP
 * @returns router for the app
 */
function create_express_app_rest(
  express,
  app,
  MAP_PROPERTIES_CREATE_EXPRESS,
  MAP_PROPERTIES_STATUS_HTTP
) {
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
          extended: true,
        })
      );

      // set limit bodyparser url
      app.use(
        bodyParser.urlencoded({
          limit: MAP_PROPERTIES_CREATE_EXPRESS.BODY_PARSER_SIZE_LIMIT,
          extended: true,
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

  // Use router handler request. Default is true
  let router = null;
  if (MAP_PROPERTIES_CREATE_EXPRESS.USE_ROUTER) {
    router = express.Router();
  }

  // If secure, and url contains secure pattern, check user principal credentials
  if (MAP_PROPERTIES_CREATE_EXPRESS.SECURE) {
    // add middelware for intercept all request include secure pattern
    router.use(function (req, res, next) {
      const error = new Error("Not allowed permission");
      error.stack = "";
      error.name = "ACCESS_DENIED";

      // Only intercept secure url when request mehtod distinct to options
      if (req.method != "OPTIONS") {
        // when include secure pattern check security
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
                // jwt token replace bearer for empty
                token = token.replace("Bearer ", "");
                // Verify jwt token
                jsonwebtoken.verify(
                  token,
                  MAP_PROPERTIES_CREATE_EXPRESS.SECRET_PASSWORD_JSON_WEB_TOKEN,
                  /**
                   * Function response verify token
                   * @param {*} err produce if token is not valid
                   * @param {*} user payload verify token is valid
                   */
                  function (err, user) {
                    if (err) {
                      // Set status denied
                      res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
                      // check if jwt expired
                      if (
                        err != null &&
                        err != undefined &&
                        err.message.includes("jwt expired")
                      ) {
                        res.json({
                          data: "EXPIRED",
                          status: MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED,
                        });
                      } else {
                        res.json({
                          data: "Not allowed permission",
                          status: MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED,
                        });
                      }
                    } else {
                      let permissionAllowed = true;
                      // Extra function to knwo user has security permisions override per inmplentation
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
                      // if security ok, send next to next request
                      if (permissionAllowed) {
                        // TODO if jwt refrehs always in header
                        // token = signJwtFn(user, MAP_PROPERTIES_CREATE_EXPRESS);
                        // res.setHeader("Authorization", token);
                        next();
                      } else {
                        // Invalid access for resources
                        res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
                        res.json({
                          data: "Not allowed permission",
                          status: MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED,
                        });
                      }
                    }
                  }
                );

                break;

              default:
                // Invalid access for resources
                res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
                res.json({
                  data: "Not allowed permission",
                  status: MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED,
                });
                break;
            }
          } else {
            // for default if include secure patther throw error permision
            res.status(MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED);
            res.json({
              data: "Not allowed permission",
              status: MAP_PROPERTIES_STATUS_HTTP.ACCESS_DENIED,
            });
          }
        } else {
          next();
        }
      } else {
        next();
      }
    });
  }

  // if disable cors protection. For default is disabled
  if (!MAP_PROPERTIES_CREATE_EXPRESS.ENABLE_CORS) {
    app.use(function (req, res, next) {
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

  return router;
}

module.exports = {
  create_express_app_rest: create_express_app_rest,
};
