import { HttpExpressFactory } from "../factory/HttpExpressFactory";


/**
 * Default security service 
 */
export class SecurityService {

    expressFactory: HttpExpressFactory;

    constructor(expressFactory: HttpExpressFactory) {
        this.expressFactory = expressFactory;
    }

}