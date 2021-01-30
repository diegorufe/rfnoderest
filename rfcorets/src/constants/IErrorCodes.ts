import { ErrorCodes } from "../beans/ErrorCodes";
/**
 * Interface error codes
 */
export class IErrorCodes {

    /**
     * General code error
     */
    static GENERAL = new ErrorCodes(0xE0000001);

    /**
     * Code for null values
     */
    static NULL_VALUES = new ErrorCodes(0xE0000002);

    /**
     * Code for division by zero
     */
    static NULL_ARITEMICAL_EXCEPTION_DIVISION_BY_ZEROVALUES = new ErrorCodes(0xE0000003);
}