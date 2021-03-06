const LOG = require("../lib/log/log.config");

const MAP_PROPERTIES = require("../lib/express/properties.express")
  .MAP_PROPERTIES;
const MAP_PROPERTIES_STATUS_HTTP = require("../lib/express/properties.express")
  .MAP_PROPERTIES_STATUS_HTTP;
const MAP_PROPERTIES_CREATE_EXPRESS = Object.assign({}, MAP_PROPERTIES);

const LOGGER = LOG.log.createLogger(
  MAP_PROPERTIES_CREATE_EXPRESS.EXPRESS_REST_NAME,
  MAP_PROPERTIES_CREATE_EXPRESS.PATH_LOG,
  MAP_PROPERTIES_CREATE_EXPRESS.MAX_SIZE_LOG,
  MAP_PROPERTIES_CREATE_EXPRESS.MAX_FILES_LOG,
  LOG.log.TYPES_LOGGER.log4js
);
//LOGGER.transports[0].level = 'debug'
LOGGER.error("This is a debug");

function app(){
throw new Error("test");}


//app();