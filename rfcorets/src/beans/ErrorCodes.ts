import { IBaseExceptionErrorCodeDefinition } from "../features/IBaseExceptionErrorCodeDefinition";

/**
 * Error codes class
 */
export class ErrorCodes implements IBaseExceptionErrorCodeDefinition {

    code: number;

    constructor(code: number) {
        this.code = code;
    }

    /**
     * @override
     */
    getCode(): number {
        return this.code;
    }

    /**
     * @override
     */
    getType(): string {
        return "ErrorCodes";
    }

}