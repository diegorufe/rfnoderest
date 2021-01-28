/**
 * Dot
 */
export declare const DOT = ".";
/**
 * Space
 */
export declare const SPACE = " ";
/**
 * Empty
 */
export declare const EMPTY = "";
/**
 * coma
 */
export declare const COMA = ",";
/**
 * Thow points
 */
export declare const TWO_POINTS = ":";
/**
 * Method to check data is empty
 * @param {*} data to check
 * @returns true if data is null or undefined or trim() == ""
 */
export declare function isEmpty(data: string): boolean;
/**
 * Method to check data is not empty
 * @param {*} data to check
 * @returns true if data is not empty false if empty null or undefined
 */
export declare function isNotEmpty(data: string): boolean;
/**
 * Method for generate chr4 unique data
 * @returns unique chr4 data
 */
export declare function chr4(): string;
/**
 * Method for generate unique id for components with chr4 concatenations
 * @returns unique id with chr4 concatenations
 */
export declare function uniqueIDChr4(): string;
/**
 * Method for generante unique id with chr4 and iso date
 * @returns unque id wiht chr4 concatenate with today iso date
 */
export declare function uniqueId(): string;
