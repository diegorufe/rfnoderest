"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDictionaries = exports.canBeDictionary = exports.isArrayNotEmpty = exports.isArrayEmpty = exports.isNotNull = exports.isNull = void 0;
/**
 * Method to check value is null
 * @param value to check
 * @returns true if value is null or undefined false if not
 */
function isNull(value) {
    return value == null || value == undefined;
}
exports.isNull = isNull;
/**
 * Method to check value is not null
 * @param value to check
 * @returns false if value is null or undefined true if not
 */
function isNotNull(value) {
    return !isNull(value);
}
exports.isNotNull = isNotNull;
/**
 * Method to check array is empty. Is empty if is null or length == 0
 * @param {*} array to check
 * @returns true is array is null or undefiend or length == 0
 */
function isArrayEmpty(array) {
    return isNull(array) || (array != undefined && array.length == 0);
}
exports.isArrayEmpty = isArrayEmpty;
/**
 * Method to check array is not empty. Is not empty is length > 0
 * @param {*} array to check
 * @returns false is array is null or undefiend or length == 0
 */
function isArrayNotEmpty(array) {
    return !isArrayEmpty(array);
}
exports.isArrayNotEmpty = isArrayNotEmpty;
/**
 * Method to know value ca be dictorionary
 * @param value to check
 * @returns true if value can be dictionary
 */
function canBeDictionary(value) {
    return typeof value === "object";
}
exports.canBeDictionary = canBeDictionary;
/**
 * Method for merge dictionaries
 * @param target
 * @param source
 */
function mergeDictionaries(target, source) {
    for (let key in source) {
        target[key] = source[key];
    }
}
exports.mergeDictionaries = mergeDictionaries;
