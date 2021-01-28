/**
 * Class for responses call methods
 */
export declare class ReponseMethod {
    data?: any;
    error?: Error;
    errrorCode?: number;
    messageError?: string;
    stack?: string;
    errorName?: string;
    constructor(data?: any, error?: Error, errrorCode?: number, messageError?: string, stack?: string, errorName?: string);
    /**
     * Method to check has error
     * @returns true if has error
     */
    hasError(): boolean;
}
