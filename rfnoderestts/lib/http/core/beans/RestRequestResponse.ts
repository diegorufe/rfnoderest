
/**
 * Request response
 */
export class RestRequestResponse<T> {

    data?: T;
    messageResponse?: string;
    token?: string;
    mapParams?: {};

    constructor() { }
}