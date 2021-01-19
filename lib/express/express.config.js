module.exports = {
  create_express_app: require("../createApp/createapp.config")
    .create_express_app,
  status_htpp: require("./properties.express").MAP_PROPERTIES_STATUS_HTTP,
  routes: require("../routes/routes.config").routes,
};
