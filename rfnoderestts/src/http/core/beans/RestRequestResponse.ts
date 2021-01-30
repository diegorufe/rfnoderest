import { EnumHttpStatus } from "../constants/EnumHttpStatus";

/**
 * Request response
 */
export class RestRequestResponse<T> {

    data?: T;
    messageResponse?: string;
    token?: string;
    mapParams?: {};
    httpStaus: EnumHttpStatus = EnumHttpStatus.OK;

    constructor() { }
}