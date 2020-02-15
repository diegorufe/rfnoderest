const MAP_PROPERTIES_EXPRESS = {};

const EXPRESS_APP = require("./lib/express.config").create_express_app(
  MAP_PROPERTIES_EXPRESS
);

EXPRESS_APP.addGetRoute("/", function(req, res) {
  EXPRESS_APP.logger.info('Test');
  res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
  res.json({ key: "Hello world!" });
});

EXPRESS_APP.addGetRoute("/secure/test", function(req, res) {
  res.status(EXPRESS_APP.mapStatusHttp.ACCESS_SUCCES);
  res.json({ key: "Hello world!" });
});

// Listen server
EXPRESS_APP.listen();
