/**
 * Filter types for query
 */
export enum EnumFilterTypes {

    EQUAL = "=",

    LITERAL_EQUAL = "EQUAL",

    GE = ">",

    GT = ">=",

    IN = "IN",

    NOT_EQUAL = "!=",

    NOT_IN = "NOT IN",

    LE = "<=",

    LIKE = "LIKE",

    LIKE_START = "LIKE_START",

    LIKE_END = "LIKE_END",

    LT = "<",

    IS_NULL = "IS NULL",

    IS_NOT_NULL = "IS NOT NULL",

    UNDEFINED = "",
}