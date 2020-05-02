/**
 * Next function for electron
 * @param {*} error if not null throw these
 */
async function nextElectron(error) {
  if (error != null && error != undefined) {
    throw error;
  }
}

/**
 * Class for response electron
 */
class ResponseElectron {
  constructor() {
    this.status = 400;
    this.json = { data: "", status: 400 };
  }

  status(status) {
    this.status = status;
  }

  async json(json) {
    if (json != null && json != undefined) {
      this.json = json;
    }
    return this.json;
  }
}

/**
 * Class for manage data for electron
 */
class ElectronModule {
  constructor() {
    this.electron = require("electron");
    // Error handler for this
    this.errorHandler = null;
    // Map get routes
    this.mapGetRoutes = {};
    // Map post routes
    this.mapPostRoutes = {};
    // TODO pending for use
    // Midlewares
    this.midlewares = [];
    // Added express app
    this.epxressApp = null;
  }

  /**
   * Method for execute post request
   * @param {*} request is the reques http for execute. Use this bean for compatibility with express
   */
  async executeAction(request) {
    const response = new ResponseElectron();
    try {
      if (
        request != null &&
        request != undefined &&
        request.url != null &&
        request.url != undefined &&
        request.url != ""
      ) {
        let actionExecute = null;
        if (request.type.toUpperCase() == "GET") {
          actionExecute = this.mapGetRoutes[request.url];
        } else {
          actionExecute = this.mapPostRoutes[request.url];
        }
        // Execute middlewares 
        this.midlewares.forEach(midleware => {
          await midleware(request, response, nextElectron);
          // Unautorized
          if(response.status == 401){
            break;
          }
        });
        // Execute action from route
        if (response.status != 401 && actionExecute != null && actionExecute != undefined) {
          await actionExecute(request, response, nextElectron);
        }
      }
    } catch (error) {
      if (
        error.stack != null &&
        error.stack != undefined &&
        error.stack != ""
      ) {
        this.epxressApp.logger.error(error.stack);
      } else {
        this.epxressApp.logger.error(error);
      }

      response.status(this.epxressApp.MAP_PROPERTIES_STATUS_HTTP.BAD_GATEWAY);
      response.send({ error: error.message });
    }
    return response;
  }

  /**
   * Method for add get route
   * @param {*} route is route for get
   * @param {*} functionGet to execute
   */
  addGet(route, functionGet) {
    if (
      route != null &&
      route != undefined &&
      route.trim() != "" &&
      functionGet != null &&
      functionGet != undefined
    ) {
      this.mapGetRoutes[route] = functionGet;
    }
  }

  /**
   * Method for add post route
   * @param {*} route is route for pot
   * @param {*} functionPost to execute
   */
  addPost(route, functionPost) {
    if (
      route != null &&
      route != undefined &&
      route.trim() != "" &&
      functionPost != null &&
      functionPost != undefined
    ) {
      this.mapPostRoutes[route] = functionPost;
    }
  }

  /**
   * Method for use midleware
   * @param {*} functionMidleware is the midleware to add
   */
  use(functionMidleware) {
    if (functionMidleware != null && functionMidleware != undefined) {
      this.midlewares.push(functionMidleware);
    }
  }

  /**
   * Method for config error hadler
   * @param {*} errorHandler is function launch or error. This function should have 4 arguments. This arguments are error, req, res, next
   */
  configErrorHandler(errorHandler) {
    this.errorHandler = errorHandler;
  }

  /**
   * Function for create router express for electron
   * @return a router for electron. Router at the moment is this
   */
  createRouter() {
    return this;
  }
}

module.exports = ElectronModule;
