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
   * @param {*} fetchs to apply
   * @param {*} transaction if pass use this transaction else create new
   * @returns number of records count
   */
  async count(filters, fetchs, transaction) {
    return await this.model.count(
      this.queryFind(null, filters, fetchs, null, null),
      { transaction: transaction }
    );
  }

  /**
   * Method for find registers
   * @param {*} filters  to apply
   * @param {*} fetchs to apply
   * @param {*} orders to apply
   * @param {*} limit star, end for query
   * @param {*} transaction if pass use this transaction else create new
   * @returns array for register
   */
  async findAll(filters, fetchs, orders, limit, transaction) {
    return await this.model.findAll(
      this.queryFind(null, filters, fetchs, orders, limit),
      { transaction: transaction }
    );
  }

  /**
   * Method for find registers only set field pass in parameters
   * @param {*} fields to get
   * @param {*} filters  to apply
   * @param {*} fetchs to apply
   * @param {*} orders to apply
   * @param {*} limit star, end for query
   * @param {*} transaction if pass use this transaction else create new
   * @returns array for register with fields
   */
  async findAllOnlyFields(fields, filters, fetchs, orders, limit, transaction) {
    return await this.model.findAll(
      this.queryFind(fields, filters, fetchs, orders, limit),
      { transaction: transaction }
    );
  }

  /**
   * Method for find only one register
   * @param {*} filters to apply
   * @param {*} fetchs to apply
   * @param {*} orders to apply
   * @param {*} limit star, end for query
   * @param {*} transaction if pass use this transaction else create new
   * @returns a register find
   */
  async findOne(filters, fetchs, orders, limit, transaction) {
    const query = this.queryFind(null, filters, fetchs, orders, limit);
    if (query != null && query != undefined && query != {}) {
      return await this.model.findOne(
        this.queryFind(null, filters, fetchs, orders, limit),
        { transaction: transaction }
      );
    }
    return null;
  }

  /**
   * Method for destroy register
   * @param {*} element is a sequelize entity for destroy
   * @param {*} transaction if pass use this transaction else create new
   */
  async destroy(element, transaction) {
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
   * @param {*} filter to resolve
   */
  resolveOperatorFilter(filter) {
    let operator = "$eq";
    if (filter.type != null && filter.type != undefined) {
      if (filter.type == "like_all") {
        operator = "$like";
      } else if (filter.type == "in") {
        operator = "$in";
      }
    }
    return operator;
  }

  /**
   * Method to resolve value filter
   * @param {*} filter to resolve
   */
  resolveValueFilter(filter) {
    let value = filter.value;
    let hashtagFilter = filter.hashtagFilter || false;

    if (filter.propertyData != null && filter.propertyData != undefined) {
      value = filter.value[filter.propertyData];
    }
    if (
      filter.type != null &&
      filter.type != undefined &&
      value != null &&
      value != undefined
    ) {
      // If hashtag filter split by token
      if (hashtagFilter) {
        value = value.split(filter.splitToken);
      } else if (filter.type == "like_all") {
        value = "%" + value + "%";
      }
    }

    return value;
  }

  /**
   * Method to generate query for find in model
   * @param {*} fields to get
   * @param {*} filters to apply
   * @param {*} fetchs to apply
   * @param {*} orders  to apply
   * @param {*} limits start end to apply
   */
  queryFind(fields, filters, fetchs, orders, limits) {
    let query = {};
    let fieldsQuery = [];
    let filterQuery = [];
    let fetchQuery = [];
    let orderQuery = [];

    // set fields
    if (fields != null && fields != undefined && fields.length > 0) {
      let field = null;
      let fieldValue = null;

      for (let i = 0; i < fields.length; i++) {
        field = fields[i];
        fieldValue = field.property.split("_");
        fieldsQuery.push(
          (field.alias != null && field.alias != undefined
            ? field.alias + "."
            : "") + fieldValue[fieldValue.length - 1]
        );
      }
    }

    // Set attributes to find in query
    if (fieldsQuery.length > 0) {
      query["attributes"] = fieldsQuery;
    }

    // Set filters
    if (filters != null && filters != undefined) {
      let filter = null;

      for (let i = 0; i < filters.length; i++) {
        filter = filters[i];
        let propertyField = this.resolvePropertyFilter(filter);
        let operator = this.resolveOperatorFilter(filter);
        let value = this.resolveValueFilter(filter);
        let hashtagFilter = filter.hashtagFilter || false;

        if (value != null && value != undefined) {
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

    // Set fetchs
    if (fetchs != null && fetchs != undefined) {
      let fetch = null;
      for (let i = 0; i < fetchs.length; i++) {
        fetch = fetchs[i];
        fetchQuery.push({
          association: fetch.alias,
          required: this.isRequiredFetch(fetch.type),
          as: fetch.alias,
        });
      }
    }

    // Incluse fetchs queries for get data for fetch entities
    if (fetchQuery.length > 0) {
      query["include"] = fetchQuery;
    }

    // Set oders
    if (orders != null && orders != undefined) {
      let order = null;
      let key = null;
      for (let i = 0; i < orders.length; i++) {
        order = orders[i];
        if (order.type != null && order.type != undefined) {
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

    // Set limits
    if (
      limits != null &&
      limits != undefined &&
      limits.start != null &&
      limits.end != undefined
    ) {
      query["offset"] = limits.start;
      query["limit"] = limits.end;
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
  if (params != null && params != undefined) {
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
