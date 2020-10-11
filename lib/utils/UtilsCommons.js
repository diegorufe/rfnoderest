/**
 * Utilitie class for commons
 */
class UtilsCommons {
  /**
   * Method to check data is null
   * @param {*} data to check
   * @returns true if data is null or undefined
   */
  static isNull(data) {
    return data == null || data == undefined;
  }

  /**
   * Method to check data is not null
   * @param {*} data to check
   * @returns true if data is not null and not undefined
   */
  static isNotNull(data) {
    return !UtilsCommons.isNull(data);
  }

  /**
   * Method to check data is type of
   * @param {*} data to check
   * @param {*} type to check is type
   * @returns true if data and type isNotNull and type is typeof == "string" and typeof data equals type
   */
  static isTypeOf(data, type) {
    return (
      UtilsCommons.isNotNull(data) &&
      UtilsCommons.isNotNull(type) &&
      typeof type == "string" &&
      typeof data == type
    );
  }

  /**
   * Method to check array is not empty
   * @param {*} array to check
   * @returns true if array is not null and length > 0
   */
  static isArrayNotEmpty(array) {
    return UtilsCommons.isNotNull(array) && array.length > 0;
  }

  /**
   * Method to check array is empty
   * @param {*} array to check
   * @returns true if array is null or empty
   */
  static isArrayEmpty(array) {
    return !UtilsCommons.isArrayNotEmpty(array);
  }

  /**
   * Method to check values is equal other
   * @param {*} value to check is equal
   * @param {*} valueCompare to other if equal
   */
  static isEqual(value, valueCompare) {
    return value == valueCompare;
  }
}

module.exports = UtilsCommons;
