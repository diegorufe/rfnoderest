/**
 * Function to create routes for crud operations for service db for default object BaseService
 * All request have in body param "data". Example: {data: filters: [] .... }
 * @param {*} EXPRESS_APP is the express object aplication
 * @param {*} url is the path for catch request
 * @param {*} serviceName is the name for service
 * @param {*} otherfnCreateService this function use for create other routes from service. This service recive EXPRESS_APP, url and serviceName
 */
function create_route_service_db(
  EXPRESS_APP,
  url,
  serviceName,
  otherfnCreateService
) {
  // Count
  EXPRESS_APP.addPostRoute(url + "/count", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].count(
        req.body.data.filters,
        req.body.data.fetchs
      );

      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // FindAll
  EXPRESS_APP.addPostRoute(url + "/findAll", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findAll(
        req.body.data.filters,
        req.body.data.fetchs,
        req.body.data.orders,
        req.body.data.limits
      );
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // findAllOnlyFields
  EXPRESS_APP.addPostRoute(url + "/findAllOnlyFields", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findAllOnlyFields(
        req.body.data.fields,
        req.body.data.filters,
        req.body.data.fetchs,
        req.body.data.orders,
        req.body.data.limits
      );
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // FindOne
  EXPRESS_APP.addPostRoute(url + "/findOne", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].findOne(
        req.body.data.filters,
        req.body.data.fetchs,
        req.body.data.orders,
        req.body.data.limits
      );
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // Destroy
  EXPRESS_APP.addPostRoute(url + "/destroy", function(req, res) {
    (async () => {
      const data = await EXPRESS_APP.mapProperties.SERVICES[
        serviceName
      ].destroy(req.body.data.element);
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: true, status: 200 });
    })();
  });

  // Save
  EXPRESS_APP.addPostRoute(url + "/save", function(req, res) {
    (async () => {
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].save(
        req.body.data.element
      );
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // Build
  EXPRESS_APP.addPostRoute(url + "/build", function(req, res) {
    (async () => {
      let data = await EXPRESS_APP.mapProperties.SERVICES[serviceName].build();
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: data, status: 200 });
    })();
  });

  // Test
  EXPRESS_APP.addGetRoute(url + "/test", function(req, res) {
    (async () => {
      res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
      res.json({ data: "test", status: 200 });
    })();
  });

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
