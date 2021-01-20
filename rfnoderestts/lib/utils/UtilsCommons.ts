
/**
 * Method to check value is null 
 * @param value to check 
 * @returns true if value is null or undefined false if not
 */
export function isNull(value: any): boolean {
    return value == null || value == undefined;
}


/**
 * Method to check value is not null 
 * @param value to check 
 * @returns false if value is null or undefined true if not
 */
export function isNotNull(value: any): boolean {
    return isNull(value);
}
