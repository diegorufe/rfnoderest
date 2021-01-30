import { isNotNull } from "rfcorets";
import { ResponseError } from "../../core/beans/ResponseError";
import { EnumHttpStatus } from "../../core/constants/EnumHttpStatus";


/**
 * Method for process rf exception
 * @param error to proccess
 * @param responseError for set properties exception
 */
export function processRFException(error: any, responseError: ResponseError) {
    responseError.httpStatus = EnumHttpStatus.BAD_REQUEST;

    if (isNotNull(error.baseExceptionErrorCodeDefinition)) {
        responseError.code = error.baseExceptionErrorCodeDefinition.getCode();
    } else if (isNotNull(error.code)) {
        responseError.code = error.code;
    }
}

/**
* Method for process rf security exception
* @param error to proccess
* @param responseError for set properties exception
*/
export function processRFSecurityException(error: any, responseError: ResponseError) {
    responseError.httpStatus = EnumHttpStatus.UNAUTHORIZED;

    if (isNotNull(error.baseExceptionErrorCodeDefinition)) {
        responseError.code = error.baseExceptionErrorCodeDefinition.getCode();
    } else if (isNotNull(error.code)) {
        responseError.code = error.code;
    }
}