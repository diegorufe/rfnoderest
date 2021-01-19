const UtilsCommons = require("./utils/UtilsCommons");
const Filter = require("./beans/query/Filter");
const Limit = require("./beans/query/Limit");
const UtilsDbSequelize = require("./utils/UtilsDbSequelize");

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
   * @param {*} mapParams for pass extra data
   * @returns number of records count
   */
  async count(filters, joins, transaction, mapParams) {
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
   * @param {*} mapParams for pass extra data
   * @returns array for register with fields
   */
  async list(fields, filters, joins, orders, limit, transaction, mapParams) {
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
   * @param {*} mapParams for pass extra data
   * @returns a register find
   */
  async findOne(filters, joins, orders, limit, transaction, mapParams) {
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
   * @param {*} mapParams for pass extra data
   * @returns element read by pk
   */
  async read(element, pkProperty, joins, transaction, mapParams) {
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
   * @param {*} mapParams for pass extra data
   */
  async delete(element, transaction, mapParams) {
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
   * @param {*} mapParams for pass extra data
   * @returns register added
   */
  async add(element, transaction, mapParams) {
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
   * @param {*} mapParams for pass extra data
   * @returns register edit
   */
  async edit(element, transaction, mapParams) {
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
        UtilsDbSequelize.transFormCoverUint8Array(data);
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
   * @param {*} transaction
   * @param {*} mapParams for pass extra data
   * @returns register build
   */
  async loadNew(transaction, mapParams) {
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
    UtilsDbSequelize.applyFieldsQuery(query, fields, fieldsQuery);

    // Set filters
    UtilsDbSequelize.applyFiltersQuery(
      query,
      filters,
      filterQuery,
      this.mapPropertiesCreateDb
    );

    // Set joins
    UtilsDbSequelize.applyJoinsQuery(query, joins, joinQuery);

    // Set oders
    UtilsDbSequelize.applyOrdersQuery(query, orders, orderQuery);

    // Set limits
    UtilsDbSequelize.applyLimits(query, limits);

    return query;
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

    console.log("Connection database has been established successfully.");

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
