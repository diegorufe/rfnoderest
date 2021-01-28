/**
 * Method to check value is null
 * @param value to check
 * @returns true if value is null or undefined false if not
 */
export declare function isNull(value: any): boolean;
/**
 * Method to check value is not null
 * @param value to check
 * @returns false if value is null or undefined true if not
 */
export declare function isNotNull(value: any): boolean;
/**
 * Method to check array is empty. Is empty if is null or length == 0
 * @param {*} array to check
 * @returns true is array is null or undefiend or length == 0
 */
export declare function isArrayEmpty(array?: any[]): boolean;
/**
 * Method to check array is not empty. Is not empty is length > 0
 * @param {*} array to check
 * @returns false is array is null or undefiend or length == 0
 */
export declare function isArrayNotEmpty(array?: any[]): boolean;
/**
 * Method to know value ca be dictorionary
 * @param value to check
 * @returns true if value can be dictionary
 */
export declare function canBeDictionary(value: any): boolean;
