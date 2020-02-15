/**
 * Base class dato for sequelize
 */
class BaseDaoSequelize {
  constructor(model) {
    this.model = model;
  }

  /**
   * Count
   * @param {*} filters
   * @param {*} fetchs
   */
  async count(filters, fetchs) {
    return await this.model.count(
      this.queryFind(null, filters, fetchs, null, null)
    );
  }

  /**
   * Find all
   * @param {*} filters
   * @param {*} fetchs
   * @param {*} orders
   * @param {*} limit
   */
  async findAll(filters, fetchs, orders, limit) {
    return await this.model.findAll(
      this.queryFind(null, filters, fetchs, orders, limit)
    );
  }

  /**
   * Find all, return only fields in data
   * @param {*} fields
   * @param {*} filters
   * @param {*} fetchs
   * @param {*} orders
   * @param {*} limit
   */
  async findAllOnlyFields(fields, filters, fetchs, orders, limit) {
    return await this.model.findAll(
      this.queryFind(fields, filters, fetchs, orders, limit)
    );
  }

  /**
   * Find one
   * @param {*} filters
   * @param {*} fetchs
   * @param {*} orders
   * @param {*} limit
   */
  async findOne(filters, fetchs, orders, limit) {
    return await this.model.findOne(
      this.queryFind(null, filters, fetchs, orders, limit)
    );
  }

  /**
   * Destroy
   * @param {*} element
   */
  async destroy(element) {
    let data = await this.model.build(element);
    if (data.dataValues.id != null || data.dataValues.id != undefined) {
      data._previousDataValues = data.dataValues;
    }
    data.destroy();
    return data;
  }

  /**
   * Save
   * @param {*} element
   */
  async save(element) {
    let data = await this.model.build(element);
    if (data.dataValues.id != null || data.dataValues.id != undefined) {
      data = element;
      try {
        if (data["cover"] != null && data["cover"] != undefined) {
          try {
            data["cover"].trim();
          } catch (ex) {
            data["cover"] = utf8ArrayToStr(new Uint8Array(data["cover"].data));
          }
        }
      } catch {}
      data = await this.model.update(data, { where: { id: element.id } });
      data = await this.model.findOne({ where: { id: element.id } });
    } else {
      data = await data.save();
    }
    return data;
  }

  /**
   * Build
   */
  async build() {
    return await this.model.build();
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
   * @param {*} fields
   * @param {*} filters
   * @param {*} fetchs
   * @param {*} orders
   * @param {*} limits
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
          required: isRequiredFetch(fetch.type)
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
      for (let i = 0; i < orders.length; i++) {
        order = orders[i];
        if (order.type != null && order.type != undefined) {
          orderQuery.push([order.property, order.type]);
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
      $col: Op.col
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
          idle: MAP_PROPERTIES_CREATE_DB.pool.idle
        },
        define: {
          timestamps: MAP_PROPERTIES_CREATE_DB.define.timestamps, // true by default
          freezeTableName: MAP_PROPERTIES_CREATE_DB.define.freezeTableName
        },
        logging: MAP_PROPERTIES_CREATE_DB.logging,
        storage: MAP_PROPERTIES_CREATE_DB.storage // SQLite only
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
  createDefaultParamsInitDb: createDefaultParamsInitDb
};
