const UtilsCommons = require("./utils/UtilsCommons");
const UtilsDbMongo = require("./utils/UtilsDbMongo");

/**
 * Base class dao for mongodb get data
 */
class BaseDaoMongoDb {
  /**
   * Constructor for BaseDaoSequelize
   * @param {*} mapPropertiesCreateDb map properties create db
   * @param {*} collection name for collection
   *
   */
  constructor(mapPropertiesCreateDb, collection) {
    this.mapPropertiesCreateDb = mapPropertiesCreateDb;
    this.collection = collection;
    this.logger = null;
    this.isMasterCollection =
      UtilsCommons.isNotNull(collection) && collection.includes("_master");
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
    const query = this.__queryFind(null, filters, joins, null, null);
    query.push({ $count: "count" });

    const collectionDb = await this.__getCollection(mapParams);

    const result = await collectionDb.aggregate(query);

    let resultCount = 0;

    if (UtilsCommons.isNotNull(result)) {
      resultCount = await result.toArray();
      if (
        UtilsCommons.isArrayNotEmpty(resultCount) &&
        resultCount.length == 1
      ) {
        resultCount = resultCount[0].count;
      } else {
        resultCount = 0;
      }
    }

    return UtilsCommons.isNull(resultCount) ? 0 : resultCount;
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
    const query = this.__queryFind(null, filters, joins, orders, limit);

    const collectionDb = await this.__getCollection(mapParams);

    const result = await collectionDb.aggregate(query);

    var resultData = [];

    if (UtilsCommons.isNotNull(result)) {
      resultData = await result.toArray();
      if (UtilsCommons.isArrayEmpty(resultData)) {
        resultData = [];
      }
    }

    return UtilsCommons.isNull(resultData) ? [] : resultData;
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
    let query = [];
    
    // Set fields
    UtilsDbMongo.applyFieldsQuery(query, fields);
    // Set joins
    UtilsDbMongo.applyJoinsQuery(query, joins);
    // Set fitlers
    UtilsDbMongo.applyFiltersQuery(query, filters);
    // Set orders
    UtilsDbMongo.applyOrdersQuery(query, orders);
    // Set limits
    UtilsDbMongo.applyLimits(query, limits);

    return query;
  }

  async __getCollection(mapParams) {
    return await this.mapPropertiesCreateDb.DB_MANAGER.collection(
      this.collection
    );
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
    port: 27017,
  };
}

/**
 * Method to init db
 * @param {*} params
 * @param {*} mongoModule
 */
async function initDb(params, mongoModule) {
  const MAP_PROPERTIES_CREATE_DB = createDefaultParamsInitDb();

  // If the properties are not null, overwrite existing ones
  if (UtilsCommons.isNotNull(params)) {
    Object.entries(params).forEach(([key, value]) => {
      MAP_PROPERTIES_CREATE_DB[key] = value;
    });
  }
  try {
    const MongoClient = mongoModule.MongoClient;
    const uri =
      "mongodb://" +
      MAP_PROPERTIES_CREATE_DB.host +
      ":" +
      MAP_PROPERTIES_CREATE_DB.port +
      "/";

    const client = new MongoClient(uri);

    // Connect the client to the server
    await client.connect();

    const db = client.db(MAP_PROPERTIES_CREATE_DB.database);

    MAP_PROPERTIES_CREATE_DB.DB_MANAGER = db;

    return MAP_PROPERTIES_CREATE_DB;
  } catch (ex) {
    console.error(ex);
  }
  return null;
}

module.exports = {
  BaseDaoMongoDb: BaseDaoMongoDb,
  initDb: initDb,
  createDefaultParamsInitDb: createDefaultParamsInitDb,
};
