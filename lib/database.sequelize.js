const UtilsCommons = require("./utils/UtilsCommons");
const Filter = require("./beans/query/Filter");
const Limit = require("./beans/query/Limit");

/**
 * Base class dao for sequelize get data
 */
class BaseDaoSequelize {
  /**
   * Constructor for BaseDaoSequelize
   * @param {*} mapPropertiesCreateDb map properties create db
   * @param {*} model defined for get data from database
   *
   */
  constructor(mapPropertiesCreateDb, model) {
    this.mapPropertiesCreateDb = mapPropertiesCreateDb;
    this.model = model;
    this.logger = null;
  }

  /**
   * Method for count registers
   * @param {*} filters to apply
   * @param {*} joins to apply
   * @param {*} transaction if pass use this transaction else create new
   * @returns number of records count
   */
  async count(filters, joins, transaction) {
    return await this.model.count(
      this.__queryFind(null, filters, joins, null, null),
      { transaction: transaction }
    );
  }

  /**
   * Method for find registers
   * @param {*} fields to get
   * @param {*} filters  to apply
   * @param {*} fetchs to apply
   * @param {*} joins to apply
   * @param {*} limit star, end for query
   * @param {*} transaction if pass use this transaction else create new
   * @returns array for register with fields
   */
  async list(fields, filters, joins, orders, limit, transaction) {
    return await this.model.findAll(
      this.__queryFind(fields, filters, joins, orders, limit),
      { transaction: transaction }
    );
  }

  /**
   * Method for find only one register
   * @param {*} filters to apply
   * @param {*} joins to apply
   * @param {*} orders to apply
   * @param {*} limit star, end for query
   * @param {*} transaction if pass use this transaction else create new
   * @returns a register find
   */
  async findOne(filters, joins, orders, limit, transaction) {
    const query = this.__queryFind(null, filters, joins, orders, limit);
    if (query != null && query != undefined && query != {}) {
      return await this.model.findOne(
        this.__queryFind(null, filters, joins, orders, limit),
        { transaction: transaction }
      );
    }
    return null;
  }

  /**
   * Method for read one element by pk
   * @param {*} element
   * @param {*} pkProperty
   * @param {*} joins
   * @param {*} transaction
   * @returns element read by pk
   */
  async read(element, pkProperty, joins, transaction) {
    const filters = [new Filter(pkProperty, "EQUAL", element[pkProperty])];
    return await this.findOne(
      filters,
      joins,
      null,
      new Limit(0, 1),
      transaction
    );
  }

  /**
   * Method for delete register
   * @param {*} element is a sequelize entity for delete
   * @param {*} transaction if pass use this transaction else create new
   */
  async delete(element, transaction) {
    const commitTransaction = transaction == null || transaction == undefined;
    const transactionAction =
      transaction == null || transaction == undefined
        ? await this.mapPropertiesCreateDb.DB_MANAGER.transaction()
        : transaction;
    let data = null;
    try {
      data = await this.model.build(element, {
        transaction: transactionAction,
      });
      if (data.dataValues.id != null || data.dataValues.id != undefined) {
        data._previousDataValues = data.dataValues;
      }
      await data.destroy({
        transaction: transactionAction,
      });
      // Commit if is necesary
      if (commitTransaction) {
        await transactionAction.commit();
      }
    } catch (ex) {
      // Rollback transaction
      await transactionAction.rollback();
      // Throw exception
      throw ex;
    }
    return data;
  }

  /**
   * Method for add register
   * @param {*} element is a sequelize entity for save
   * @param {*} transaction if pass use this transaction else create new
   * @returns register added
   */
  async add(element, transaction) {
    const commitTransaction = transaction == null || transaction == undefined;
    const transactionAction =
      transaction == null || transaction == undefined
        ? await this.mapPropertiesCreateDb.DB_MANAGER.transaction()
        : transaction;
    let data = null;
    try {
      data = await this.model.build(element);
      data = await data.save({ transaction: transactionAction });
      // Commit if is necesary
      if (commitTransaction) {
        await transactionAction.commit();
      }
    } catch (ex) {
      // Rollback transaction
      await transactionAction.rollback();
      // Throw exception
      throw ex;
    }
    return data;
  }

  /**
   * Method for edit register
   * @param {*} element is a sequelize entity for save
   * @param {*} transaction if pass use this transaction else create new
   * @returns register edit
   */
  async edit(element, transaction) {
    const commitTransaction = transaction == null || transaction == undefined;
    const transactionAction =
      transaction == null || transaction == undefined
        ? await this.mapPropertiesCreateDb.DB_MANAGER.transaction()
        : transaction;
    let data = null;
    try {
      data = await this.model.build(element);
      if (
        UtilsCommons.isNotNull(data.dataValues) &&
        UtilsCommons.isNotNull(data.dataValues)
      ) {
        data = element;
        this.__transFormCoverUint8Array(data);
        data = await this.model.update(
          data,
          { where: { id: element.id } },
          { transaction: transactionAction }
        );
        data = await this.model.findOne(
          { where: { id: element.id } },
          { transaction: transactionAction }
        );
      } else {
        throw new Error("$$Not found id in entity");
      }
      // Commit if is necesary
      if (commitTransaction) {
        await transactionAction.commit();
      }
    } catch (ex) {
      // Rollback transaction
      await transactionAction.rollback();
      // Throw exception
      throw ex;
    }
    return data;
  }

  /**
   * Method for build a new register
   * @returns register build
   */
  async loadNew() {
    try {
      try {
        return await this.model.loadNew();
      } catch (ex) {
        return await this.model.build();
      }
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * Method for transform cover uint array
   * @param data
   */
  __transFormCoverUint8Array(data) {
    if (UtilsCommons.isNotNull(data)) {
      if (data["cover"] != null && data["cover"] != undefined) {
        try {
          data["cover"].trim();
        } catch (ex) {
          data["cover"] = utf8ArrayToStr(new Uint8Array(data["cover"].data));
        }
      }
    }
  }

  /**
   * Method to resolve property filter
   * @param {*} filter to resolve
   */
  __resolvePropertyFilter(filter) {
    let valueReturn = "";
    if (UtilsCommons.isNotNull(filter.alias)) {
      valueReturn = filter.alias + ".";
    }
    valueReturn = valueReturn + filter.field;
    return valueReturn;
  }

  /**
   * Method to resolve operator filter
   * @param {*} filter to resolve
   */
  __resolveOperatorFilter(filter) {
    let operator = "$eq";
    if (
      UtilsCommons.isNotNull(filter) &&
      UtilsCommons.isNotNull(filter.filterType)
    ) {
      if (filter.filterType == "like_all" || filter.filterType == "LIKE") {
        operator = "$like";
      } else if (filter.filterType == "in") {
        operator = "$in";
      } else if (filter.filterType == "EQUAL") {
        operator = "$eq";
      }
    }
    return operator;
  }

  /**
   * Method to resolve value filter
   * @param {*} filter to resolve
   */
  __resolveValueFilter(filter) {
    let value = filter.value;
    const hashtagFilter = filter.hashtagFilter || false;

    if (
      UtilsCommons.isNotNull(filter) &&
      UtilsCommons.isNotNull(filter.propertyValue)
    ) {
      value = filter.value[filter.propertyValue];
    }
    if (
      UtilsCommons.isNotNull(filter) &&
      UtilsCommons.isNotNull(filter.filterType) &&
      UtilsCommons.isNotNull(value)
    ) {
      // If hashtag filter split by token
      if (hashtagFilter) {
        value = value.split(filter.splitTokenHastagFilter);
      } else if (
        filter.filterType == "like_all" ||
        filter.filterType == "LIKE"
      ) {
        value = "%" + value + "%";
      }
    }

    return value;
  }

  /**
   * Method for apply fields in query
   * @param {*} query
   * @param {*} fields
   * @param {*} fieldsQuery
   *
   */
  __applyFieldsQuery(query, fields, fieldsQuery) {
    if (UtilsCommons.isArrayNotEmpty(fields)) {
      let field = null;
      let fieldValue = null;

      for (let i = 0; i < fields.length; i++) {
        field = fields[i];
        fieldValue = field.property.split(field.fieldSeparator);
        fieldsQuery.push(
          (UtilsCommons.isNotNull(field.aliasTabla)
            ? field.aliasTabla + "."
            : "") + fieldValue[fieldValue.length - 1]
        );
      }
    }

    // Set attributes to find in query
    if (fieldsQuery.length > 0) {
      query["attributes"] = fieldsQuery;
    }
  }

  /**
   * MEthod for apply filters query
   * @param {*} query
   * @param {*} filters
   * @param {*} filterQuery
   */
  __applyFiltersQuery(query, filters, filterQuery) {
    if (UtilsCommons.isArrayNotEmpty(filters)) {
      let filter = null;

      for (let i = 0; i < filters.length; i++) {
        filter = filters[i];
        let propertyField = this.__resolvePropertyFilter(filter);
        let operator = this.__resolveOperatorFilter(filter);
        let value = this.__resolveValueFilter(filter);
        const hashtagFilter = filter.hashtagFilter || false;

        if (UtilsCommons.isNotNull(value)) {
          // Check hastag filter
          if (hashtagFilter) {
            // If have values
            if (value.length > 0) {
              let arrayHashtagValues = [];
              // Check elements
              value.forEach((element) => {
                // Only when not blank
                if (element.trim() != "") {
                  arrayHashtagValues.push(
                    this.mapPropertiesCreateDb.DB_MANAGER.fn(
                      "FIND_IN_SET",
                      element,
                      this.mapPropertiesCreateDb.DB_MANAGER.col(propertyField)
                    )
                  );
                }
              });
              // If have values append to query
              if (arrayHashtagValues.length > 0) {
                filterQuery.push({
                  ["$or"]: arrayHashtagValues,
                });
              }
            }
          } else {
            // Default filter propery , operator and value
            filterQuery.push({
              [propertyField]: {
                [operator]: value,
              },
            });
          }
        }
      }
    }

    // Set where
    if (filterQuery.length > 0) {
      query["where"] = filterQuery;
    }
  }

  /**
   * Method for apply joins query
   * @param {*} query
   * @param {*} joins
   * @param {*} joinQuery
   */
  __applyJoinsQuery(query, joins, joinQuery) {
    if (UtilsCommons.isArrayNotEmpty(joins)) {
      let join = null;
      let alias = null;
      for (let i = 0; i < joins.length; i++) {
        join = joins[i];
        alias = join.alias | join.field;
        joinQuery.push({
          association: join.field,
          required: this.__isRequiredFetch(join.joinType),
          as: alias,
        });
      }
    }

    // Incluse fetchs queries for get data for fetch entities
    if (joinQuery.length > 0) {
      query["include"] = joinQuery;
    }
  }

  /**
   * Method for apply orders query
   * @param {*} query
   * @param {*} orders
   * @param {*} orderQuery
   */
  __applyOrdersQuery(query, orders, orderQuery) {
    if (UtilsCommons.isArrayNotEmpty(orders)) {
      let order = null;
      let key = null;
      for (let i = 0; i < orders.length; i++) {
        order = orders[i];
        if (UtilsCommons.isNotNull(order.orderType)) {
          key = order.field.split(order.fieldSeparator);
          if (key.length == 1) {
            orderQuery.push([key[0], order.orderType]);
          } else if (key.length == 2) {
            orderQuery.push([key[0], key[1], order.orderType]);
          }
        }
      }
    }

    // Set order
    if (orderQuery.length > 0) {
      query["order"] = orderQuery;
    }
  }

  /**
   * Method for apply limits
   * @param {*} query
   * @param {*} limits
   */
  __applyLimits(query, limits) {
    if (
      UtilsCommons.isNotNull(limits) &&
      UtilsCommons.isNotNull(limits.start) &&
      UtilsCommons.isNotNull(limits.end)
    ) {
      query["offset"] = limits.start;
      query["limit"] = limits.end;
    }
  }

  /**
   * Method to generate query for find in model
   * @param {*} fields to get
   * @param {*} filters to apply
   * @param {*} joins to applyqueryFind
   * @param {*} orders  to apply
   * @param {*} limits start end to apply
   */
  __queryFind(fields, filters, joins, orders, limits) {
    let query = {};
    let fieldsQuery = [];
    let filterQuery = [];
    let joinQuery = [];
    let orderQuery = [];

    // set fields
    this.__applyFieldsQuery(query, fields, fieldsQuery);

    // Set filters
    this.__applyFiltersQuery(query, filters, filterQuery);

    // Set joins
    this.__applyJoinsQuery(query, joins, joinQuery);

    // Set oders
    this.__applyOrdersQuery(query, orders, orderQuery);

    // Set limits
    this.__applyLimits(query, limits);

    return query;
  }

  /**
   * Method to know is required fetch
   * @param {*} type
   */
  __isRequiredFetch(type) {
    let required = false;
    if (UtilsCommons.isNotNull(type)) {
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
    database: "",
    user: "",
    password: "",
    host: "localhost",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true, // true by default
      freezeTableName: true,
    },
    logging: false,
    storage: null, // use for sqlite
  };
}

/**
 * Method to init db
 * @param {*} params
 */
async function initDb(params, sequelizeModule) {
  const MAP_PROPERTIES_CREATE_DB = createDefaultParamsInitDb();

  // If the properties are not null, overwrite existing ones
  if (UtilsCommons.isNotNull(params)) {
    Object.entries(params).forEach(([key, value]) => {
      MAP_PROPERTIES_CREATE_DB[key] = value;
    });
  }
  try {
    const Sequelize = sequelizeModule;
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
      $col: Op.col,
    };
    const DB_MANAGER = new Sequelize(
      MAP_PROPERTIES_CREATE_DB.database,
      MAP_PROPERTIES_CREATE_DB.user,
      MAP_PROPERTIES_CREATE_DB.password,
      {
        host: MAP_PROPERTIES_CREATE_DB.host,
        dialect: MAP_PROPERTIES_CREATE_DB.dialect,
        operatorsAliases: operatorsAliases,
        pool: {
          max: MAP_PROPERTIES_CREATE_DB.pool.max,
          min: MAP_PROPERTIES_CREATE_DB.pool.min,
          acquire: MAP_PROPERTIES_CREATE_DB.pool.acquire,
          idle: MAP_PROPERTIES_CREATE_DB.pool.idle,
        },
        define: {
          timestamps: MAP_PROPERTIES_CREATE_DB.define.timestamps, // true by default
          freezeTableName: MAP_PROPERTIES_CREATE_DB.define.freezeTableName,
        },
        logging: MAP_PROPERTIES_CREATE_DB.logging,
        storage: MAP_PROPERTIES_CREATE_DB.storage, // SQLite only
      }
    );

    await DB_MANAGER.authenticate();

    console.log("Connection has been established successfully.");

    MAP_PROPERTIES_CREATE_DB.DB_MANAGER = DB_MANAGER;

    // OP Sequalize
    MAP_PROPERTIES_CREATE_DB.Op = Op;

    return MAP_PROPERTIES_CREATE_DB;
  } catch (ex) {
    console.error(ex);
  }
  return null;
}

module.exports = {
  BaseDaoSequelize: BaseDaoSequelize,
  initDb: initDb,
  createDefaultParamsInitDb: createDefaultParamsInitDb,
};
