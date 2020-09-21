const UtilsCommons = require("./utils/UtilsCommons");
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
  const UtilsCommons = require("./utils/UtilsCommons");

  // Count
  EXPRESS_APP.addPostRoute(
    url + "/count",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction("/count", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].count(
        bodydRequest.filters,
        bodydRequest.joins
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction("/count", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // list
  EXPRESS_APP.addPostRoute(
    url + "/list",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction("/list", req);
      }

      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].list(
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
        responseData = await functionAfterAction("/list", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // read
  EXPRESS_APP.addPostRoute(
    url + "/read",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction("/read", req);
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
        data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].read(data);
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
        responseData = await functionAfterAction("/read", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Delete
  EXPRESS_APP.addPostRoute(
    url + "/delete",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;

      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction("/delete", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].delete(
        bodydRequest.data
      );

      let responseData = {
        data: "Ok",
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction("/delete", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Edit
  EXPRESS_APP.addPostRoute(
    url + "/edit",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;

      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction("/edit", req);
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].edit(
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
          data,
          joins
        );
      }

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction("/edit", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // add
  EXPRESS_APP.addPostRoute(
    url + "/add",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction("/add", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].add(
        bodydRequest.data
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction("/add", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // loadNew
  EXPRESS_APP.addPostRoute(
    url + "/loadNew",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (UtilsCommons.isNotNull(functionBeforeAction)) {
        bodydRequest = await functionBeforeAction("/loadNew", req);
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].loadNew();

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction("/loadNew", req, responseData);
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
        bodydRequest = await functionBeforeAction("/test", req);
      }
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES,
      };

      if (UtilsCommons.isNotNull(functionAfterAction)) {
        responseData = await functionAfterAction("/test", req, responseData);
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
