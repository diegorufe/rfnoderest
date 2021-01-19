/**
 * Method for create logger
 * @param {*} nameLogger name for logger
 * @param {*} pathLogger save files for logger
 * @param {*} maxSize files logger
 * @param {*} maxFiles write logs
 */
function createLoggerLog4js(nameLogger, pathLogger, maxSize, maxFiles) {
  if (maxSize == null || maxSize == undefined) {
    maxSize = 262144000; // 250MB
  }

  if (maxFiles == null || maxFiles == undefined) {
    maxFiles = 5;
  }

  if (pathLogger == null || pathLogger == undefined) {
    pathLogger = "./log/log.log";
  }

  if (nameLogger == null || nameLogger == undefined) {
    nameLogger = "EXPRESS_APP";
  }

  const normalLayout = {
    type: "pattern",
    pattern: "%d | %p | %c | %f{1} | %l | %o | %m ",
  };

  const options = {
    appenders: {
      everything: {
        type: "file",
        filename: pathLogger,
        maxLogSize: maxSize,
        backups: maxFiles,
        compress: true,
        layout: normalLayout,
      },
      out: { type: "stdout", layout: normalLayout },
      error: { type: "stderr", layout: normalLayout },
    },
    categories: {
      default: {
        appenders: ["everything", "out"],
        level: "info",
        enableCallStack: true,
      },
    },
  };

  const log4js = require("log4js");

  log4js.configure(options);

  return log4js.getLogger();
}

module.exports = createLoggerLog4js;
