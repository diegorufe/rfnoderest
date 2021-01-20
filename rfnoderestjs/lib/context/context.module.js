/**
 * File for store context variables
 */
class Context {
  constructor() {
    this.logger = null;
  }

  /**
   * Method for get logger from context
   */
  getLogger() {
    return this.logger;
  }
}

module.exports = new Context();
