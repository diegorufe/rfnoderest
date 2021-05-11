import { RestRequestResponse } from "../beans/RestRequestResponse";

/**
 * Method for finish response request if not throw exception 
 * @param res to set http status and reponse data 
 * @param restRequestResponse response to set 
 */
export function finishResponseRequest(res: any, restRequestResponse: RestRequestResponse<any>) {
    res.status(restRequestResponse.httpStaus);

    // This is for normal response json
    res.json(restRequestResponse);

    // chunked
    // res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    // res.setHeader('Transfer-Encoding', 'chunked');

    // res.write(JSON.stringify(restRequestResponse));
    // res.end();
}