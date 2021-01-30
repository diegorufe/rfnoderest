import { parseToJson } from "rfcorets";
import { RestRequestResponse } from "../beans/RestRequestResponse";

/**
 * Method for finish response request if not throw exception 
 * @param res to set http status and reponse data 
 * @param restRequestResponse response to set 
 */
export function finishResponseRequest(res: any, restRequestResponse: RestRequestResponse<any>) {
    res.status(restRequestResponse.httpStaus);
    res.json(parseToJson(restRequestResponse));
}