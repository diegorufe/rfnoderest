const log4js = require("log4js");
const UtilsCommons = require("../utils/UtilsCommons");

const TYPES_LOGGER = {
  winston: "winston",
  log4js: "log4js",
};

/**
 * Method for create logger
 * @param {*} nameLogger name for logger
 * @param {*} pathLogger save files for logger
 * @param {*} maxSize files logger
 * @param {*} maxFiles write logs
 * @param {*} typeLogger if is null default log4js. Types winston, log4js
 */
function createLogger(nameLogger, pathLogger, maxSize, maxFiles, typeLogger) {
  let logger = null;

  if (UtilsCommons.isNull(typeLogger)) {
    typeLogger = TYPES_LOGGER.log4js;
  }

  // Check types logger
  if (typeLogger in TYPES_LOGGER) {
    let fnCreateLogger = null;

    switch (typeLogger) {

      // Logger winston
      case TYPES_LOGGER.winston:
        fnCreateLogger = require("./loggerwinston/logwinston");
        break;

      // Logger log4js
      case TYPES_LOGGER.log4js:
        fnCreateLogger = require("./loggerlog4js/loggerlog4js");
        break;

    }

    // If have function for create logger create this
    if (UtilsCommons.isNotNull(fnCreateLogger)) {
      logger = fnCreateLogger(nameLogger, pathLogger, maxSize, maxFiles);
    }
  }

  return logger;
}

module.exports = {
  log: {
    createLogger: createLogger,
    TYPES_LOGGER: TYPES_LOGGER,
  },
};
