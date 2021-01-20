import { isNull } from "./UtilsCommons";

/**
 * Method to check data is empty
 * @param {*} data to check
 * @returns true if data is null or undefined or trim() == "" 
 */
export function isEmpty(data: string) {
    return isNull(data) || (data.trim() == "");
}

/**
 * Method to check data is not empty
 * @param {*} data to check
 * @returns true if data is not empty false if empty null or undefined
 */
export function isNotEmpty(data: string) {
    return !isEmpty(data);
}