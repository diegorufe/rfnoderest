const SECURITY_MODULE = require("./security.config");
const ROUTES = require("./routes.config").routes;
const MAP_PROPERTIES_STATUS_HTTP = require("./properties.express")
  .MAP_PROPERTIES_STATUS_HTTP;
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

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

    // Crypto json data session in header
    this.algorithmCrypto = "aes-256-cbc";
  }

  /**
   * Method to encrypt json data session
   * @param {*} jsonData is json data to store in session encrypted
   * @returns a map contains iv and ecrypted data for json store in data session
   */
  encryptJsonSession(jsonData) {
    let text = JSON.stringify(jsonData);
    let cipher = crypto.createCipheriv(
      this.algorithmCrypto,
      Buffer.from(this.mapProperties.KEY_CRYPTO_JSON_SESSION),
      this.mapProperties.IVI_CRYPTO_JSON_SESSION
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this.mapProperties.IVI_CRYPTO_JSON_SESSION.toString("hex"),
      encryptedData: encrypted.toString("hex")
    };
  }

  /**
   * Method to decript to json data session
   * @param {*} jsonDataEcnrypted is a json to decrypt for obtain json data session
   * @returns a json data decryted
   */
  decryptToJsonSession(jsonDataEcnrypted) {
    let iv = Buffer.from(jsonDataEcnrypted.iv, "hex");
    let encryptedText = Buffer.from(jsonDataEcnrypted.encryptedData, "hex");
    let decipher = crypto.createDecipheriv(
      this.algorithmCrypto,
      Buffer.from(this.mapProperties.KEY_CRYPTO_JSON_SESSION),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  }

  /**
   * Aync handler
   */
  asyncHandler() {
    return asyncHandler;
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
      this.configErrorHandler();
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
   * Method to configure error handler
   */
  configErrorHandler() {
    const routerHandler = this.routerIsNull() ? this.app : this.router;
    routerHandler.use((error, req, res, next) => {
      if (error != null && error != undefined) {
        if (
          error.stack != null &&
          error.stack != undefined &&
          error.stack != ""
        ) {
          this.logger.error(error.stack);
        } else {
          this.logger.error(error);
        }

        res.status(MAP_PROPERTIES_STATUS_HTTP.BAD_GATEWAY);
        res.send({ error: error.message });
        return;
      }
      next(error);
    });
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
   * Method to get service by name
   * @param {*} serviceName
   */
  getService(serviceName) {
    return this.mapProperties.SERVICES[serviceName];
  }

  /**
   * Function to create routes for crud operations for service db for default object BaseService
   * @param {*} url  is the path for catch request
   * @param {*} serviceName is the name for service
   * @param {*} functionBeforeAction is a funcion execute before execute action post route. Pass argument action example /count and request. Must be return body for request
   * @param {*} functionAfterAction is a funcion execute after execute action post route. Pass argument action example /count, request and data result and status in map example: {data:any, status: number}. Must be return a map {data:any, status: number}
   * @param {*} otherfnCreateService this function use for create other routes from service. This function must be input parameters expressApp(this), url, serviceName
   */
  createRouteService(
    url,
    serviceName,
    functionBeforeAction,
    functionAfterAction,
    otherfnCreateService
  ) {
    return ROUTES.create_route_service_db(
      this,
      url,
      serviceName,
      functionBeforeAction,
      functionAfterAction,
      otherfnCreateService
    );
  }

  /**
   * Method to encrypt bcrypt password
   * @param {*} password
   */
  bcryptPassword(password) {
    return SECURITY_MODULE.security.bcryptPassword(
      this.mapProperties,
      password
    );
  }

  /**
   * Method to compare bcrypt
   * @param {*} passwordBcrypt
   * @param {*} password
   */
  compareBcrypt(passwordBcrypt, password) {
    return SECURITY_MODULE.security.compareBcrypt(passwordBcrypt, password);
  }

  /**
   * Method for create routes login application
   * @param {*} functionLogin
   */
  createRoutesJwtSecurity(functionLogin) {
    const EXPRESS_APP = this;
    // Route login
    EXPRESS_APP.addPostRoute(
      "/login",
      this.asyncHandler()(async (req, res, next) => {
        const loginResult = await functionLogin(
          EXPRESS_APP,
          req.body["user"],
          req.body["password"]
        );
        if (loginResult != null && loginResult != undefined) {
          // Create token
          loginResult["token"] = EXPRESS_APP.signJwt({
            user: req.body["user"],
            data: EXPRESS_APP.encryptJsonSession(loginResult)
          });
          res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
          res.json({ data: loginResult, status: 200 });
        } else {
          EXPRESS_APP.logger.error("Bad request loging");
          res.status(EXPRESS_APP.mapStatusHttp.BAD_GATEWAY);
          res.json({ data: "", status: 400 });
        }
      })
    );
    // Route refresh token
    EXPRESS_APP.addPostRoute(
      "/refreshToken",
      this.asyncHandler()(async (req, res, next) => {
        EXPRESS_APP.refreshToken(req, res);
      })
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
      const EXPRESS_APP = this;
      await SECURITY_MODULE.security.jsonwebtoken.verify(
        token,
        this.mapProperties.SECRET_PASSWORD_JSON_WEB_TOKEN,
        function(err, user) {
          if (err) {
            res.status(mapPropertiesSta.ACCESS_DENIED);
            res.json({ data: "", status: 400 });
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
              res.status(EXPRESS_APP.mapStatusHttp.BAD_GATEWAY);
              res.json({
                data: EXPRESS_APP.signJwt(user, mapPropertiesExp),
                status: 200
              });
            } else {
              res.status(mapPropertiesSta.ACCESS_DENIED);
              res.json({ data: "", status: 400 });
            }
          }
        }
      );
    }
  }
}

module.exports = {
  ExpressApp: ExpressApp
};
