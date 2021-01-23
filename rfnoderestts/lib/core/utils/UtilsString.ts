import { isNull } from "./UtilsCommons";

/**
 * Dot 
 */
export const DOT = ".";

/**
 * Space 
 */
export const SPACE = " ";

/**
 * Empty
 */
export const EMPTY = "";

/**
 * coma
 */
export const COMA = "";

/**
 * Thow points
 */
export const TWO_POINTS = ":";

/**
 * Method to check data is empty
 * @param {*} data to check
 * @returns true if data is null or undefined or trim() == "" 
 */
export function isEmpty(data: string): boolean {
    return isNull(data) || (data.trim() == "");
}

/**
 * Method to check data is not empty
 * @param {*} data to check
 * @returns true if data is not empty false if empty null or undefined
 */
export function isNotEmpty(data: string): boolean {
    return !isEmpty(data);
}

/**
 * Method for generate chr4 unique data
 * @returns unique chr4 data
 */
export function chr4(): string {
    return Math.random().toString(16).slice(-4);
}

/**
 * Method for generate unique id for components with chr4 concatenations
 * @returns unique id with chr4 concatenations
 */
export function uniqueIDChr4(): string {
    return chr4() + chr4() + chr4() + chr4();
}

/**
 * Method for generante unique id with chr4 and iso date
 * @returns unque id wiht chr4 concatenate with today iso date
 */
export function uniqueId(): string {
    return uniqueIDChr4();
}