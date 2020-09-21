class Filter {
  constructor(
    field,
    filterType,
    value,
    alias,
    filterOperationType,
    openBrackets,
    closeBrackets
  ) {
    this.field = field;
    this.filterType = filterType || "EQUAL";
    this.value = value;
    this.alias = alias;
    this.filterOperationType = filterOperationType;
    this.openBrackets = openBrackets;
    this.closeBrackets = closeBrackets;
    this.propertyValue = null;
    this.hashtagFilter = false;
    this.splitTokenHastagFilter = ",";
  }

  /**
   * Method for resolve value
   */
  resolveFilterValue() {
    let result = Object.assign(new Filter(), this);
    if (
      this.value != null &&
      this.value != undefined &&
      this.propertyValue != null &&
      this.propertyValue != undefined
    ) {
      result.value = this.value[this.propertyValue];
    }
    return result;
  }
}

module.exports = Filter;
