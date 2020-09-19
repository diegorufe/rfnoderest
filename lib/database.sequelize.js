const UtilsCommons = require("./utils/UtilsCommons");

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
   * @param {*} filters  to apply
   * @param {*} joins to apply
   * @param {*} orders to apply
   * @param {*} limit star, end for query
   * @param {*} transaction if pass use this transaction else create new
   * @returns array for register
   */
  async findAll(filters, joins, orders, limit, transaction) {
    return await this.model.findAll(
      this.__queryFind(null, filters, joins, orders, limit),
      { transaction: transaction }
    );
  }

  /**
   * Method for find registers only set field pass in parameters
   * @param {*} fields to get
   * @param {*} filters  to apply
   * @param {*} fetchs to apply
   * @param {*} joins to apply
   * @param {*} limit star, end for query
   * @param {*} transaction if pass use this transaction else create new
   * @returns array for register with fields
   */
  async findAllOnlyFields(fields, filters, joins, orders, limit, transaction) {
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
   * Method for save register
   * @param {*} element is a sequelize entity for save
   * @param {*} transaction if pass use this transaction else create new
   * @returns register saved
   */
  async save(element, transaction) {
    const commitTransaction = transaction == null || transaction == undefined;
    const transactionAction =
      transaction == null || transaction == undefined
        ? await this.mapPropertiesCreateDb.DB_MANAGER.transaction()
        : transaction;
    let data = null;
    try {
      data = await this.model.build(element);
      if (data.dataValues.id != null || data.dataValues.id != undefined) {
        data = element;
        try {
          if (data["cover"] != null && data["cover"] != undefined) {
            try {
              data["cover"].trim();
            } catch (ex) {
              data["cover"] = utf8ArrayToStr(
                new Uint8Array(data["cover"].data)
              );
            }
          }
        } catch {}
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
        data = await data.save({ transaction: transactionAction });
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
  async build() {
    try {
      return await this.model.loadNew();
    } catch (ex) {
      return await this.model.build();
    }
  }

  /**
   * Method to resolve property filter
   * @param {*} filter to resolve
   */
  __resolvePropertyFilter(filter) {
    let valueReturn = "";
    if (filter.alias != null && filter.alias != undefined) {
      valueReturn = filter.alias + ".";
    }
    valueReturn = valueReturn + filter.property;
    return valueReturn;
  }

  /**
   * Method to resolve operator filter
   * @param {*} filter to resolve
   */
  __resolveOperatorFilter(filter) {
    let operator = "$eq";
    if (UtilsCommons.isNotNull(filter) && UtilsCommons.isNotNull(filter.type)) {
      if (filter.type == "like_all" || filter.type == "LIKE") {
        operator = "$like";
      } else if (filter.type == "in") {
        operator = "$in";
      } else if (filter.type == "EQUAL") {
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
    let hashtagFilter = filter.hashtagFilter || false;

    if (
      UtilsCommons.isNotNull(filter) &&
      UtilsCommons.isNotNull(filter.propertyData)
    ) {
      value = filter.value[filter.propertyData];
    }
    if (
      UtilsCommons.isNotNull(filter) &&
      UtilsCommons.isNotNull(filter.type) &&
      UtilsCommons.isNotNull(value)
    ) {
      // If hashtag filter split by token
      if (hashtagFilter) {
        value = value.split(filter.splitToken);
      } else if (filter.type == "like_all" || filter.type == "LIKE") {
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
          (UtilsCommons.isNotNull(field.alias) ? field.alias + "." : "") +
            fieldValue[fieldValue.length - 1]
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
        let hashtagFilter = filter.hashtagFilter || false;

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
      for (let i = 0; i < joins.length; i++) {
        join = joins[i];
        joinQuery.push({
          association: join.alias,
          required: this.__isRequiredFetch(join.type),
          as: join.alias,
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
        if (UtilsCommons.isNotNull(order.type)) {
          key = order.property.split("_");
          if (key.length == 1) {
            orderQuery.push([key[0], order.type]);
          } else if (key.length == 2) {
            orderQuery.push([key[0], key[1], order.type]);
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
