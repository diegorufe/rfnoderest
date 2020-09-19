const UtilsCommons = require("../../utils/UtilsCommons");

/**
 * Class for responses call methods
 */
class ReponseMethod {
  constructor() {
    this.data = null;
    this.error = null;
    this.errrorCode = -1;
    this.messageError = null;
    this.stack = null;
    this.errorName = null;
  }

  /**
   * Method to check has error
   * @returns true if has error
   */
  hasError() {
    return UtilsCommons.isNotNull(this.error) || this.errrorCode >= 0;
  }
}

module.exports = ReponseMethod;
