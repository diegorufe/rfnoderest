"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReponseMethod = void 0;
const UtilsCommons_1 = require("../utils/UtilsCommons");
/**
 * Class for responses call methods
 */
class ReponseMethod {
    constructor(data, error, errrorCode, messageError, stack, errorName) {
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
    hasError() {
        return UtilsCommons_1.isNotNull(this.error) || (UtilsCommons_1.isNotNull(this.errrorCode) && this.errrorCode != undefined && this.errrorCode >= 0);
    }
}
exports.ReponseMethod = ReponseMethod;
