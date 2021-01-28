"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueId = exports.uniqueIDChr4 = exports.chr4 = exports.isNotEmpty = exports.isEmpty = exports.TWO_POINTS = exports.COMA = exports.EMPTY = exports.SPACE = exports.DOT = void 0;
const UtilsCommons_1 = require("./UtilsCommons");
/**
 * Dot
 */
exports.DOT = ".";
/**
 * Space
 */
exports.SPACE = " ";
/**
 * Empty
 */
exports.EMPTY = "";
/**
 * coma
 */
exports.COMA = ",";
/**
 * Thow points
 */
exports.TWO_POINTS = ":";
/**
 * Method to check data is empty
 * @param {*} data to check
 * @returns true if data is null or undefined or trim() == ""
 */
function isEmpty(data) {
    return UtilsCommons_1.isNull(data) || (data.trim() == "");
}
exports.isEmpty = isEmpty;
/**
 * Method to check data is not empty
 * @param {*} data to check
 * @returns true if data is not empty false if empty null or undefined
 */
function isNotEmpty(data) {
    return !isEmpty(data);
}
exports.isNotEmpty = isNotEmpty;
/**
 * Method for generate chr4 unique data
 * @returns unique chr4 data
 */
function chr4() {
    return Math.random().toString(16).slice(-4);
}
exports.chr4 = chr4;
/**
 * Method for generate unique id for components with chr4 concatenations
 * @returns unique id with chr4 concatenations
 */
function uniqueIDChr4() {
    return chr4() + chr4() + chr4() + chr4();
}
exports.uniqueIDChr4 = uniqueIDChr4;
/**
 * Method for generante unique id with chr4 and iso date
 * @returns unque id wiht chr4 concatenate with today iso date
 */
function uniqueId() {
    return uniqueIDChr4();
}
exports.uniqueId = uniqueId;
