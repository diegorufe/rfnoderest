const { MAP_ROUTES_CRUD } = require("../constants/routes.constants");

/**
 * Function to create routes for crud operations for service db for default object BaseService
 * All request have in body param "data". Example: {data: filters: [] .... }
 * @param {*} EXPRESS_APP is the express object aplication
 * @param {*} url is the path for catch request
 * @param {*} serviceName is the name for service
 * @param {*} functionBeforeAction is a funcion execute before execute action post route. Pass argument action example /count and request. Must be return body for request
 * @param {*} functionAfterAction is a funcion execute after execute action post route. Pass argument action example /count, request and data result and status in map example: {data:any, status: number}. Must be return a map {data:any, status: number}
 * @param {*} otherfnCreateService this function use for create other routes from service. This service recive EXPRESS_APP, url and serviceName
 */
function create_route_service_db(
  EXPRESS_APP,
  url,
  serviceName,
  functionBeforeAction,
  functionAfterAction,
  otherfnCreateService
) {
  const UtilsCommons = require("../utils/UtilsCommons");

  // Count
  EXPRESS_APP.addPostRoute(
    url + MAP_ROUTES_CRUD.COUNT,
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction(
          MAP_ROUTES_CRUD.COUNT,
          EXPRESS_APP,
          req
        );
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].count(
        EXPRESS_APP,
        bodydRequest.filters,
        bodydRequest.joins
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          MAP_ROUTES_CRUD.COUNT,
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // list
  EXPRESS_APP.addPostRoute(
    url + MAP_ROUTES_CRUD.LIST,
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction(
          MAP_ROUTES_CRUD.LIST,
          EXPRESS_APP,
          req
        );
      }

      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].list(
        EXPRESS_APP,
        bodydRequest.fields,
        bodydRequest.filters,
        bodydRequest.joins,
        bodydRequest.orders,
        bodydRequest.limits
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          MAP_ROUTES_CRUD.LIST,
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // browser
  EXPRESS_APP.addPostRoute(
    url + MAP_ROUTES_CRUD.BROWSER,
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction(
          MAP_ROUTES_CRUD.BROWSER,
          EXPRESS_APP,
          req
        );
      }

      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].browser(
        EXPRESS_APP,
        bodydRequest.data.fields,
        bodydRequest.data.filters,
        bodydRequest.data.joins,
        bodydRequest.data.orders,
        bodydRequest.data.first,
        bodydRequest.data.recordsPage
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          MAP_ROUTES_CRUD.BROWSER,
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // read
  EXPRESS_APP.addPostRoute(
    url + MAP_ROUTES_CRUD.READ,
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction(
          MAP_ROUTES_CRUD.READ,
          EXPRESS_APP,
          req
        );
      }

      let joins = null;

      if (
        UtilsCommons.isNotNull(bodydRequest) &&
        UtilsCommons.isNotNull(bodydRequest.joins)
      ) {
        joins = bodydRequest.joins;
      }
      let data = null;
      if (
        UtilsCommons.isNotNull(bodydRequest) &&
        UtilsCommons.isNotNull(bodydRequest.data) &&
        UtilsCommons.isNotNull(bodydRequest.data.id)
      ) {
        data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].read(
          EXPRESS_APP,
          data
        );
      } else if (UtilsCommons.isNotNull(bodydRequest) && bodydRequest.data) {
        data = bodydRequest.data;
      }

      let responseData = null;

      if (UtilsCommons.isNotNull(data)) {
        responseData = {
          data: data,
          status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
        };
      } else {
        responseData = {
          data: null,
          status: EXPRESS_APP.mapStatusHttp.BAD_GATEWAY,
        };
      }

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          MAP_ROUTES_CRUD.READ,
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Delete
  EXPRESS_APP.addPostRoute(
    url + MAP_ROUTES_CRUD.DELETE,
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;

      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction(
          MAP_ROUTES_CRUD.DELETE,
          EXPRESS_APP,
          req
        );
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].delete(
        EXPRESS_APP,
        bodydRequest.data
      );

      let responseData = {
        data: "Ok",
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          MAP_ROUTES_CRUD.DELETE,
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Edit
  EXPRESS_APP.addPostRoute(
    url + MAP_ROUTES_CRUD.EDIT,
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;

      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction(
          MAP_ROUTES_CRUD.EDIT,
          EXPRESS_APP,
          req
        );
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].edit(
        EXPRESS_APP,
        bodydRequest.data
      );

      let joins = null;

      if (
        UtilsCommons.isNotNull(bodydRequest) &&
        UtilsCommons.isNotNull(bodydRequest.joins)
      ) {
        joins = bodydRequest.joins;
      }

      if (UtilsCommons.isNotNull(data)) {
        data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].read(
          EXPRESS_APP,
          data,
          joins
        );
      }

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          MAP_ROUTES_CRUD.EDIT,
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // add
  EXPRESS_APP.addPostRoute(
    url + MAP_ROUTES_CRUD.ADD,
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction(
          MAP_ROUTES_CRUD.ADD,
          EXPRESS_APP,
          req
        );
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].add(
        EXPRESS_APP,
        bodydRequest.data
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          MAP_ROUTES_CRUD.ADD,
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // loadNew
  EXPRESS_APP.addPostRoute(
    url + MAP_ROUTES_CRUD.LOAD_NEW,
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction(
          MAP_ROUTES_CRUD.LOAD_NEW,
          EXPRESS_APP,
          req
        );
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].loadNew(
        EXPRESS_APP
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          MAP_ROUTES_CRUD.LOAD_NEW,
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Test
  EXPRESS_APP.addGetRoute(
    url + "/test",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction("/test", EXPRESS_APP, req);
      }
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction(
          "/test",
          EXPRESS_APP,
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Create rest routes from url
  if (UtilsCommons.isNotNull(otherfnCreateService)) {
    otherfnCreateService(EXPRESS_APP, url, serviceName);
  }
}

module.exports = {
  routes: {
    create_route_service_db: create_route_service_db,
  },
};
