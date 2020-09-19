const UtilsCommons = require("../utils/UtilsCommons");
const ReponseMethod = require("../beans/commons/ResponseMethod");

/**
 * Utilies class for error
 */
class UtilsError {
  /**
   * Method for apply funcion for handler in view error
   * @param {*} fn for apply
   */
  static async applyFunctionWithHandlerError(fn) {
    let response = new ReponseMethod();
    try {
      let self = this;
      let result = fn.apply(this, arguments);
      if (
        UtilsCommons.isNotNull(result) &&
        typeof result.then === "function" &&
        typeof result.catch === "function"
      ) {
        try {
          response.data = await result;
        } catch (exception) {
          response.error = exception;
        }
      }
      // if (UtilsLog.isDebugConsoleEnabled()) {
      //   UtilsLog.debug(
      //     "Response applyAsyncFunctionWithHandlerError: " +
      //       JSON.stringify(response)
      //   );
      // }
    } catch (exception) {
      response = UtilsError.getResponseMethodFromException(exception);
    }
    return response;
  }

  /**
   * Method for get response method form exception
   * @param {*} exception to set in response method
   * @param {*} messageError to set in response method
   * @param {*} errorCode to set in reponse method
   * @returns response method with exception
   */
  static getResponseMethodFromException(exception, messageError, errorCode) {
    const response = new ReponseMethod();
    response.error = exception;

    response.errrorCode = errorCode;

    if (UtilsCommons.isNotNull(exception)) {
      response.errorName = exception.name;
      response.stack = exception.stack;
      response.messageError = exception.message;
    }

    if (UtilsString.isNotEmpty(messageError)) {
      response.messageError = messageError;
    }

    return response;
  }

  /**
   * Method to check response mehtod. If response method is null return response method with error
   * @param {*} responseMethod to check
   * @returns resposne method checked.
   */
  static checkResponseMethod(responseMethod) {
    let result = responseMethod;
    if (UtilsCommons.isNull(responseMethod)) {
      result = UtilsError.getResponseMethodFromException(
        new Error("Null response method")
      );
    }
    return result;
  }
}

module.exports = UtilsError;
