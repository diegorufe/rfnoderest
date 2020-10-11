class Join {
  constructor(field, joinType, alias, customQueryJoin) {
    this.field = field;
    this.joinType = joinType;
    this.alias = alias;
    this.customQueryJoin = customQueryJoin;
    this.aliasJoinField = null;
  }
}

module.exports = Join;
