
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
    return !isNull(value);
}

/**
 * Method to check array is empty. Is empty if is null or length == 0
 * @param {*} array to check
 * @returns true is array is null or undefiend or length == 0
 */
export function isArrayEmpty(array?: any[]) {
    return isNull(array) || (array != undefined && array.length == 0);
}

/**
 * Method to check array is not empty. Is not empty is length > 0
 * @param {*} array to check
 * @returns false is array is null or undefiend or length == 0
 */
export function isArrayNotEmpty(array?: any[]) {
    return !isArrayEmpty(array);
}

/**
 * Method to know value ca be dictorionary
 * @param value to check
 * @returns true if value can be dictionary
 */
export function canBeDictionary(value: any) {
    return typeof value === "object";
}
/**
 * Method for merge dictionaries 
 * @param target 
 * @param source 
 */
export function mergeDictionaries(target: { [key: string]: any }, source: { [key: string]: any }): void {
    for (let key in source) {
        target[key] = source[key];
    }
}