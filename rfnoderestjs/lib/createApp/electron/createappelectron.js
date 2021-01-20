/**
 * Method for create secure router for electron
 * @param {*} router
 * @param {*} MAP_PROPERTIES_CREATE_EXPRESS
 * @param {*} MAP_PROPERTIES_STATUS_HTTP
 */
function createSecureRouterElectron(
  router,
  MAP_PROPERTIES_CREATE_EXPRESS,
  MAP_PROPERTIES_STATUS_HTTP
) {
  // If secure, and url contains secure pattern, check user principal credentials
  if (MAP_PROPERTIES_CREATE_EXPRESS.SECURE) {
    // add middelware for intercept all request include secure pattern
    router.use(
      router.epxressApp.asyncHandler()(async function (req, res, next) {
        const error = new Error("Not allowed permission");
        error.stack = "";
        error.name = "ACCESS_DENIED";

        let originalUrl = req.originalUrl;

        if (originalUrl == null || originalUrl == undefined) {
          originalUrl = req.url;
        }

        // Only intercept secure url when request mehtod distinct to options
        if (req.method != "OPTIONS") {
          // when include secure pattern check security
          if (
            originalUrl.includes(
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
      })
    );
  }
}

/**
 * Function for create express app electron
 * @param {*} express is the express electron module
 * @param {*} app is app for express electron module
 * @param {*} MAP_PROPERTIES_CREATE_EXPRESS
 * @param {*} MAP_PROPERTIES_STATUS_HTTP
 * @returns router for the app
 */
function create_express_app_electron(
  express,
  app,
  MAP_PROPERTIES_CREATE_EXPRESS,
  MAP_PROPERTIES_STATUS_HTTP
) {
  return app.createRouter();
}

module.exports = {
  create_express_app_electron: create_express_app_electron,
  createSecureRouterElectron: createSecureRouterElectron,
};
