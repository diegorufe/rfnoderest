class Join {
  constructor(field, joinType, alias, customQueryJoin) {
    this.field = field;
    this.joinType = joinType;
    this.alias = alias;
    this.customQueryJoin = customQueryJoin;
    this.aliasJoinField = null;
    this.from = null;
    this.localField = null;
    this.foreignField = null;
    this.as = null;
  }
}

module.exports = Join;
