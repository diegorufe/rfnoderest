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
  otherfnCreateService
) {
  // Count
  EXPRESS_APP.addPostRoute(
    url + "/count",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = functionBeforeAction("/count", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].count(
        bodydRequest.data.filters,
        bodydRequest.data.fetchs
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = functionAfterAction("/count", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // FindAll
  EXPRESS_APP.addPostRoute(
    url + "/findAll",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = functionBeforeAction("/findAll", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findAll(
        bodydRequest.data.filters,
        bodydRequest.data.fetchs,
        bodydRequest.data.orders,
        bodydRequest.data.limits
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = functionAfterAction("/findAll", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // findAllOnlyFields
  EXPRESS_APP.addPostRoute(
    url + "/findAllOnlyFields",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = functionBeforeAction("/findAllOnlyFields", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findAllOnlyFields(
        bodydRequest.data.fields,
        bodydRequest.data.filters,
        bodydRequest.data.fetchs,
        bodydRequest.data.orders,
        bodydRequest.data.limits
      );
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = functionAfterAction(
          "/findAllOnlyFields",
          req,
          responseData
        );
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // FindOne
  EXPRESS_APP.addPostRoute(
    url + "/findOne",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = functionBeforeAction("/findOne", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findOne(
        bodydRequest.data.filters,
        bodydRequest.data.fetchs,
        bodydRequest.data.orders,
        bodydRequest.data.limits
      );
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = functionAfterAction("/findOne", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Destroy
  EXPRESS_APP.addPostRoute(
    url + "/destroy",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = functionBeforeAction("/destroy", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].destroy(bodydRequest.data.element);

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = functionAfterAction("/destroy", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Save
  EXPRESS_APP.addPostRoute(
    url + "/save",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = functionBeforeAction("/save", req);
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].save(
        bodydRequest.data.element
      );
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = functionAfterAction("/save", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Build
  EXPRESS_APP.addPostRoute(
    url + "/build",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = functionBeforeAction("/build", req);
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].build();

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = functionAfterAction("/build", req, responseData);
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
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = functionBeforeAction("/test", req);
      }
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = functionAfterAction("/test", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // Create rest routes from url
  if (otherfnCreateService != null) {
    otherfnCreateService(EXPRESS_APP, url, serviceName);
  }
}

module.exports = {
  routes: {
    create_route_service_db: create_route_service_db
  }
};
