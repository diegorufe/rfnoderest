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
  // Count
  EXPRESS_APP.addPostRoute(
    url + "/count",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/count", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].count(
        bodydRequest.filters,
        bodydRequest.fetchs
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
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
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/list", req);
      }

      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findAll(
        bodydRequest.filters,
        bodydRequest.fetchs,
        bodydRequest.orders,
        bodydRequest.limits
      );

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = await functionAfterAction("/list", req, responseData);
      }

      res.status(responseData.status);
      res.json(responseData);
    })
  );

  // listOnlyFields
  EXPRESS_APP.addPostRoute(
    url + "/listOnlyFields",
    EXPRESS_APP.asyncHandler()(async (req, res, next) => {
      let bodydRequest = req.body;
      // If not not nul pre handle action
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/listOnlyFields", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findAllOnlyFields(
        bodydRequest.fields,
        bodydRequest.filters,
        bodydRequest.fetchs,
        bodydRequest.orders,
        bodydRequest.limits
      );
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = await functionAfterAction(
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
        bodydRequest = await functionBeforeAction("/findOne", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findOne(
        bodydRequest.filters,
        bodydRequest.fetchs,
        bodydRequest.orders,
        bodydRequest.limits
      );
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = await functionAfterAction("/findOne", req, responseData);
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
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/read", req);
      }

      let fetchs = null;

      if (
        bodydRequest.data.fetchs != null &&
        bodydRequest.data.fetchs != undefined
      ) {
        fetchs = bodydRequest.data.fetchs;
      }
      let data = null;
      if (bodydRequest.data.id != null && bodydRequest.data.id != undefined) {
        data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].findOne(
          [
            {
              property: "id",
              type: "=",
              value: bodydRequest.data.id,
              andOr: "and",
              alias: null,
              propertyData: null,
              other: null
            }
          ],
          fetchs,
          null
        );
      } else {
        data = bodydRequest.data;
      }

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
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
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/delete", req);
      }
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].destroy(bodydRequest.data);

      let responseData = {
        data: "Ok",
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
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
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/edit", req);
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].save(
        bodydRequest.data
      );

      let fetchs = null;

      if (
        bodydRequest.data.fetchs != null &&
        bodydRequest.data.fetchs != undefined
      ) {
        fetchs = bodydRequest.data.fetchs;
      }

      if (data != null && data != undefined) {
        data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].findOne(
          [
            {
              property: "id",
              type: "=",
              value: data.id,
              andOr: "and",
              alias: null,
              propertyData: null,
              other: null
            }
          ],
          fetchs,
          null
        );
      }

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
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
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/add", req);
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].save(
        bodydRequest.data
      );

      let fetchs = null;

      if (
        bodydRequest.data.fetchs != null &&
        bodydRequest.data.fetchs != undefined
      ) {
        fetchs = bodydRequest.data.fetchs;
      }

      if (data != null && data != undefined) {
        data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].findOne(
          [
            {
              property: "id",
              type: "=",
              value: data.id,
              andOr: "and",
              alias: null,
              propertyData: null,
              other: null
            }
          ],
          fetchs,
          null
        );
      }

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
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
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/loadNew", req);
      }
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].build();

      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
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
      if (functionBeforeAction != null && functionBeforeAction != undefined) {
        bodydRequest = await functionBeforeAction("/test", req);
      }
      let responseData = {
        data: data,
        status: EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES
      };

      if (functionAfterAction != null && functionAfterAction != undefined) {
        responseData = await functionAfterAction("/test", req, responseData);
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
