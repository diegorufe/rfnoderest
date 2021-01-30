
/**
 * Base interface for create enums for exceptions codes definitions
 * @author diego
 *
 */
export interface IBaseExceptionErrorCodeDefinition {

    /**
     * Method for get code for exception 
     * @return code for exceptión
     */
    getCode(): number;

    /**
     * Method for get type code error exception 
     * @return type for code error exception
     */
    getType(): string;
}