import { ReponseMethod } from "../beans/ResponseMethod";
/**
 * Method for get response method form exception
 * @param {*} exception to set in response method
 * @param {*} messageError to set in response method
 * @param {*} errorCode to set in reponse method
 * @returns response method with exception
 */
export declare function getResponseMethodFromException(exception?: Error, messageError?: string, errorCode?: number): ReponseMethod;
/**
 * Method to check response mehtod. If response method is null return response method with error
 * @param {*} responseMethod to check
 * @returns resposne method checked.
 */
export declare function checkResponseMethod(responseMethod?: ReponseMethod): ReponseMethod | undefined | null;
/**
 * Method for apply funcion for handler in view error
 * @param {*} fn for apply
 */
export declare function applyFunctionWithHandlerError(fn: Function): Promise<ReponseMethod>;
