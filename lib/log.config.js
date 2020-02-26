const winston = require("winston");

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
      json: true,
      maxsize: maxSize,
      maxFiles: maxFiles,
      colorize: false
    },
    console: {
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true
    }
  };

  const logger = new winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      winston.format.printf(
        info =>
          `${info.timestamp} | ${info.level} | ${nameLogger} | ${info.message}`
      )
    ),
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    exceptionHandlers: [new winston.transports.File(options.file)],
    exitOnError: false // do not exit on handled exceptions
  });

  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    }
  };

  return logger;
}

module.exports = {
  log: {
    createLogger: createLogger
  }
};
