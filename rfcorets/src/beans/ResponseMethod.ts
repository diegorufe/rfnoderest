import { isNotNull } from "../utils/UtilsCommons";

/**
 * Class for responses call methods
 */
export class ReponseMethod {

    data?: any;
    error?: Error;
    errrorCode?: number;
    messageError?: string;
    stack?: string;
    errorName?: string;

    constructor(data?: any, error?: Error, errrorCode?: number, messageError?: string, stack?: string, errorName?: string) {
        this.data = data;
        this.error = error;
        this.errrorCode = errrorCode;
        this.messageError = messageError;
        this.stack = stack;
        this.errorName = errorName;
    }

    /**
     * Method to check has error
     * @returns true if has error
     */
    hasError(): boolean {
        return isNotNull(this.error) || (isNotNull(this.errrorCode) && this.errrorCode != undefined && this.errrorCode >= 0);
    }
}
