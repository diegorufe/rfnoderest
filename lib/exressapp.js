const SECURITY_MODULE = require("./security.config");
const ROUTES = require("./routes.config").routes;

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
   * @param {*} otherfnCreateService this function use for create other routes from service. This function must be input parameters expressApp(this), url, serviceName
   */
  createRouteService(url, serviceName, otherfnCreateService) {
    return ROUTES.create_route_service_db(
      this,
      url,
      serviceName,
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
    return SECURITY_MODULE.compareBcrypt(passwordBcrypt, password);
  }

  /**
   * Method for create routes login application
   * @param {*} functionLogin
   */
  createRoutesJwtSecurity(functionLogin) {
    EXPRESS_APP.addPostRoute(url + "/login", function(req, res) {
      (async () => {
        const loginResult = await functionLogin(EXPRESS_APP, user, password);
        if (loginResult != null && loginResult != undefined) {
          // Create token
          loginResult["token"] = EXPRESS_APP.signJwt(user);
          res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
          res.json({ data: loginResult, status: 200 });
        } else {
          res.status(EXPRESS_APP.mapStatusHttp.BAD_GATEWAY);
          res.json({ data: "", status: 400 });
        }
      })();
    });
    EXPRESS_APP.addPostRoute(url + "/refreshToken", function(req, res) {
      (async () => {
        EXPRESS_APP.refreshToken(req, res);
      })();
    });
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
                data: signJwtFn(user, mapPropertiesExp),
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
