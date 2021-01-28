"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFunctionWithHandlerError = exports.checkResponseMethod = exports.getResponseMethodFromException = void 0;
const ResponseMethod_1 = require("../beans/ResponseMethod");
const UtilsCommons_1 = require("./UtilsCommons");
const UtilsString_1 = require("./UtilsString");
/**
 * Method for get response method form exception
 * @param {*} exception to set in response method
 * @param {*} messageError to set in response method
 * @param {*} errorCode to set in reponse method
 * @returns response method with exception
 */
function getResponseMethodFromException(exception, messageError, errorCode) {
    const response = new ResponseMethod_1.ReponseMethod();
    response.error = exception;
    response.errrorCode = errorCode;
    if (UtilsCommons_1.isNotNull(exception) && exception != undefined) {
        response.errorName = exception.name;
        response.stack = exception.stack;
        response.messageError = exception.message;
    }
    if (messageError != undefined && UtilsString_1.isNotEmpty(messageError)) {
        response.messageError = messageError;
    }
    return response;
}
exports.getResponseMethodFromException = getResponseMethodFromException;
/**
 * Method to check response mehtod. If response method is null return response method with error
 * @param {*} responseMethod to check
 * @returns resposne method checked.
 */
function checkResponseMethod(responseMethod) {
    let result = responseMethod;
    if (UtilsCommons_1.isNull(responseMethod)) {
        result = getResponseMethodFromException(new Error("Null response method"));
    }
    return result;
}
exports.checkResponseMethod = checkResponseMethod;
/**
 * Method for apply funcion for handler in view error
 * @param {*} fn for apply
 */
function applyFunctionWithHandlerError(fn) {
    return __awaiter(this, arguments, void 0, function* () {
        let response = new ResponseMethod_1.ReponseMethod();
        try {
            let result = fn.apply(fn, arguments);
            if (UtilsCommons_1.isNotNull(result) &&
                typeof result.then === "function" &&
                typeof result.catch === "function") {
                try {
                    response.data = yield result;
                }
                catch (exception) {
                    response.error = exception;
                }
            }
        }
        catch (exception) {
            response = getResponseMethodFromException(exception);
        }
        return response;
    });
}
exports.applyFunctionWithHandlerError = applyFunctionWithHandlerError;
