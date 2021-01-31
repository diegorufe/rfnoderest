import { EMPTY, isNotNull } from "rfcorets";
import { RestRequestResponse } from "../../core/beans/RestRequestResponse";
import { EnumKeysHttpHeader } from "../../core/constants/EnumKeysHttpHeader";
import { finishResponseRequest } from "../../core/utils/UtilsHttp";
import { HttpExpressFactory } from "../factory/HttpExpressFactory";

/**
 * method for find token request headers
 * @param req express find jwt token in headers
 */
export function findJWTTokenRequestHeaders(req: any): string | undefined {
    let token = undefined;

    if (isNotNull(req)) {
        token = req.headers[EnumKeysHttpHeader.AUTHORIZATION] ||
            req.headers[EnumKeysHttpHeader.AUTHORIZATION_UPPER_KEY_FIRST] ||
            req.headers[EnumKeysHttpHeader.X_ACCESS_TOKEN];

        // jwt token replace bearer for empty
        token = token.replace(EnumKeysHttpHeader.BEARER, EMPTY);
    }

    return token;
}

/**
 * Method for finish response request if not throw exception 
 * @param httpExpressFactory
 * @param req request http
 * @param res to set http status and reponse data 
 * @param restRequestResponse response to set 
 */
export function finishResponseRequestExpress(httpExpressFactory: HttpExpressFactory, req: any, res: any, restRequestResponse: RestRequestResponse<any>) {
    // Refresh jwt token if is needed
    httpExpressFactory.securityService.refreshJWTTokenIfNeeded(req, restRequestResponse);
    // Finis response request
    finishResponseRequest(res, restRequestResponse);
}