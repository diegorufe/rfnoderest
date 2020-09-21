class Order {
  constructor(field, orderType, alias) {
    this.field = field;
    this.alias = alias;
    this.orderType = orderType;
    this.fieldSeparator = "_FIELD_SEPARATOR_";
  }
}

module.exports = Order;
