import { IBaseExceptionErrorCodeDefinition } from "../features/IBaseExceptionErrorCodeDefinition";

/**
 * Base exception
 */
export class RFException extends Error {

    name: string;
    message: string;
    stack?: string;
    errorCode?: number;
    baseExceptionErrorCodeDefinition?: IBaseExceptionErrorCodeDefinition;
    

    constructor(name: string, message: string, stack?: string, errorCode?: number, baseExceptionErrorCodeDefinition?: IBaseExceptionErrorCodeDefinition) {
        super();
        this.name = name;
        this.message = message;
        this.stack = stack;
        this.errorCode = errorCode;
        this.baseExceptionErrorCodeDefinition = baseExceptionErrorCodeDefinition;
    }

}