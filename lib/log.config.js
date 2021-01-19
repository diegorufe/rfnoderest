const winston = require("winston");
/**
 * Method for create logger
 * @param {*} nameLogger name for logger
 * @param {*} pathLogger save files for logger
 * @param {*} maxSize files logger
 * @param {*} maxFiles write logs
 */
function createLogger(nameLogger, pathLogger, maxSize, maxFiles) {
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

  const options = {
    file: {
      level: "info",
      filename: pathLogger,
      handleExceptions: true,
      maxsize: maxSize,
      maxFiles: maxFiles,
      colorize: true,
    },
    console: {
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };

  const logger = new winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      winston.format.printf(
        (info) =>
          `${info.timestamp} | ${info.level} | ${nameLogger} | ${info.message}`
      )
    ),
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
    ],
    exceptionHandlers: [new winston.transports.File(options.file)],
    exitOnError: false, // do not exit on handled exceptions
  });

  logger.stream = {
    write: function (message, encoding) {
      logger.info(message);
    },
  };

  let logger_info_old = logger.info;
  let logger_debug_old = logger.debug;
  let logger_error_old = logger.error;

  logger.info = function (msg) {
    var fileAndLine = traceCaller(1);
    return logger_info_old.call(this, fileAndLine + ") | " + msg);
  };

  logger.debug = function (msg) {
    var fileAndLine = traceCaller(1);
    return logger_debug_old.call(this, fileAndLine + ") | " + msg);
  };

  logger.error = function (msg) {
    var fileAndLine = traceCaller(1);
    return logger_error_old.call(this, fileAndLine + ") | " + msg);
  };

  return logger;
}

/**
 * examines the call stack and returns a string indicating
 * the file and line number of the n'th previous ancestor call.
 * this works in chrome, and should work in nodejs as well.
 *
 * @param n : int (default: n=1) - the number of calls to trace up the
 *   stack from the current call.  `n=0` gives you your current file/line.
 *  `n=1` gives the file/line that called you.
 */
function traceCaller(n) {
  if (isNaN(n) || n < 0) n = 1;
  n += 1;
  var s = new Error().stack,
    a = s.indexOf("\n", 5);
  while (n--) {
    a = s.indexOf("\n", a + 1);
    if (a < 0) {
      a = s.lastIndexOf("\n", s.length);
      break;
    }
  }
  b = s.indexOf("\n", a + 1);
  if (b < 0) b = s.length;
  a = Math.max(s.lastIndexOf(" ", b), s.lastIndexOf("/", b));
  b = s.lastIndexOf(":", b);
  s = s.substring(a + 1, b);
  return s;
}

module.exports = {
  log: {
    createLogger: createLogger,
  },
};
