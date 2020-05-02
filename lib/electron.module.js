/**
 * Class for manage data for electron
 */
class ElectronModule {
  constructor() {
    this.electron = require("electron");
  }

  /**
   * Function for create router express for electron
   * @return a router for electron
   */
  createRouter() {}
}

module.exports = ElectronModule;
