/**
 * Base class dato for sequelize
 */
class BaseDaoSequelize {
  constructor(model) {
    this.model = model;
  }

  /**
   * Method to resolve property filter
   * @param {*} filter
   */
  resolvePropertyFilter(filter) {
    let valueReturn = "";
    if (filter.alias != null && filter.alias != undefined) {
      valueReturn = filter.alias + ".";
    }
    valueReturn = valueReturn + filter.property;
    return valueReturn;
  }

  /**
   * Method to resolve operator filter
   * @param {*} filter
   */
  resolveOperatorFilter(filter) {
    let operator = "$eq";
    if (filter.type != null && filter.type != undefined) {
      if (filter.type == "like_all") {
        operator = "$like";
      }
    }
    return operator;
  }

  /**
   * Method to resolve value filter
   * @param {*} filter
   */
  resolveValueFilter(filter) {
    let value = filter.value;

    if (
      filter.propertyData != null &&
      filter.propertyData != undefined &&
      filter.data != null &&
      filter.data != undefined
    ) {
      value = filter.data[filter.propertyData];
    }
    if (
      filter.type != null &&
      filter.type != undefined &&
      value != null &&
      value != undefined
    ) {
      if (this.type == "like_all") {
        value = "%" + value + "%";
      }
    }
    return value;
  }

  /**
   * Method to generate query for find in model
   * @param {*} filters
   * @param {*} fetchs
   * @param {*} orders
   * @param {*} limits
   */
  queryFind(filters, fetchs, orders, limits) {
    let query = {};
    let fetchQuery = [];
    let orderQuery = [];
    let filterQuery = [];

    if (filters != null && filters != undefined) {
      let filter = null;
      for (let i = 0; i < filters.length; i++) {
        filter = filters[i];
        let valueField = filter.resolveProperty();
        let operator = filter.resolveOperator();
        let value = filter.resolveValue();
        if (value != null && value != undefined) {
          filterQuery.push({
            [valueField]: {
              [operator]: filter.resolveValue()
            }
          });
        }
      }
    }

    if (fetchs != null && fetchs != undefined) {
      let fetch = null;
      for (let i = 0; i < fetchs.length; i++) {
        fetch = fetchs[i];
        fetchQuery.push({
          association: fetch.alias,
          required: isRequiredFetch(fetch.type)
        });
      }
    }

    if (
      limits != null &&
      limits != undefined &&
      limits.start != null &&
      limits.end != undefined
    ) {
      query["offset"] = limits.start;
      query["limit"] = limits.end;
    }

    if (fetchQuery.length > 0) {
      query["include"] = fetchQuery;
    }

    if (orders != null && orders != undefined) {
      let order = null;
      for (let i = 0; i < orders.length; i++) {
        order = orders[i];
        if (order.type != null && order.type != undefined) {
          orderQuery.push([order.property, order.type]);
        }
      }
    }

    if (orderQuery.length > 0) {
      query["order"] = orderQuery;
    }

    if (filterQuery.length > 0) {
      query["where"] = filterQuery;
    }

    return query;
  }

  /**
   * Method to know is required fetch
   * @param {*} type
   */
  isRequiredFetch(type) {
    let required = false;
    if (type != null && type != undefined) {
      if (type.toUpperCase().includes("INNER")) {
        required = true;
      }
    }
    return required;
  }
}

/**
 * Method to create default params for init db
 */
function createDefaultParamsInitDb() {
  return {
    host: "localhost",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true, // true by default
      freezeTableName: true
    },
    logging: false,
    storage: null // use for sqlite
  };
}

/**
 * Method to init db
 * @param {*} params
 */
async function initDb(params) {
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
  };
  const DB_MANAGER = new Sequelize("rfnotes", "root", "root", {
    host: params.host,
    dialect: params.dialect,
    operatorsAliases: operatorsAliases,
    pool: {
      max: params.pool.max,
      min: params.pool.min,
      acquire: params.pool.acquire,
      idle: params.pool.idle
    },
    define: {
      timestamps: params.define.timestamps, // true by default
      freezeTableName: params.define.freezeTableName
    },
    logging: params.logging,
    storage: params.storage // SQLite only
  });

  DB_MANAGER.authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err);
    });

  params.DB_MANAGER = DB_MANAGER;
  
  // OP Sequalize
  params.Op = Op;
}

module.exports = {
  BaseDaoSequelize: BaseDaoSequelize,
  initDb: initDb
};
