import { ReponseMethod } from "../beans/ResponseMethod";
import { isNotNull, isNull } from "./UtilsCommons";
import { isNotEmpty } from "./UtilsString";


/**
 * Method for get response method form exception
 * @param {*} exception to set in response method
 * @param {*} messageError to set in response method
 * @param {*} errorCode to set in reponse method
 * @returns response method with exception
 */
export function getResponseMethodFromException(
  exception?: Error,
  messageError?: string,
  errorCode?: number
): ReponseMethod {
  const response = new ReponseMethod();
  response.error = exception;

  response.errrorCode = errorCode;

  if (isNotNull(exception) && exception != undefined) {
    response.errorName = exception.name;
    response.stack = exception.stack;
    response.messageError = exception.message;
  }

  if (messageError != undefined && isNotEmpty(messageError)) {
    response.messageError = messageError;
  }

  return response;
}

/**
 * Method to check response mehtod. If response method is null return response method with error
 * @param {*} responseMethod to check
 * @returns resposne method checked.
 */
export function checkResponseMethod(responseMethod?: ReponseMethod): ReponseMethod | undefined | null {
  let result = responseMethod;
  if (isNull(responseMethod)) {
    result = getResponseMethodFromException(new Error("Null response method"));
  }
  return result;
}

/**
 * Method for apply funcion for handler in view error
 * @param {*} fn for apply
 */
export async function applyFunctionWithHandlerError(fn: Function): Promise<ReponseMethod> {
  let response = new ReponseMethod();
  try {
    let result = fn.apply(fn, arguments);
    if (
      isNotNull(result) &&
      typeof result.then === "function" &&
      typeof result.catch === "function"
    ) {
      try {
        response.data = await result;
      } catch (exception) {
        response.error = exception;
      }
    }
  } catch (exception) {
    response = getResponseMethodFromException(exception);
  }
  return response;
}
