const Limit = require("./beans/query/Limit");
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
    this.isMasterCollection = UtilsDbMongo.isMasterCollection(this.collection);
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
    const query = this.__queryFind(null, filters, joins, null, null, mapParams);
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
    const query = this.__queryFind(
      fields,
      filters,
      joins,
      orders,
      limit,
      mapParams
    );

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
    const data = this.list(
      null,
      filters,
      joins,
      null,
      new Limit(0, 1),
      transaction,
      mapParams
    );
    return UtilsCommons.isArrayNotEmpty(data) ? data[0] : null;
  }

  /**
   * Method for add register
   * @param {*} element is a entity for save
   * @param {*} transaction if pass use this transaction else create new
   * @param {*} mapParams for pass extra data
   * @returns register added
   */
  async add(element, transaction, mapParams) {
    element["createdAt"] = new Date();
    element["updatedAt"] = new Date();
    const dbCollection = await this.__getCollection(mapParams);
    const result = await dbCollection.insertOne(element);
    element._id = result.insertedId;
    return element;
  }

  /**
   * Method for edit register
   * @param {*} element is a  entity for save
   * @param {*} transaction if pass use this transaction else create new
   * @param {*} mapParams for pass extra data
   * @returns register added
   */
  async edit(element, transaction, mapParams) {
    element["updatedAt"] = new Date();
    const dbCollection = await this.__getCollection(mapParams);
    const result = await dbCollection.updateOne(element);
    return element;
  }

  /**
   * Method for delete register
   * @param {*} element is a sequelize entity for delete
   * @param {*} transaction if pass use this transaction else create new
   * @param {*} mapParams for pass extra data
   */
  async delete(element, transaction, mapParams) {
    const dbCollection = await this.__getCollection(mapParams);
    const result = await dbCollection.deleteOne(element);
    return true;
  }

  /**
   * Method to generate query for find in model
   * @param {*} fields to get
   * @param {*} filters to apply
   * @param {*} joins to applyqueryFind
   * @param {*} orders  to apply
   * @param {*} limits start end to apply
   * @param {*} mapParams
   */
  __queryFind(fields, filters, joins, orders, limits, mapParams) {
    let query = [];

    // Set fields
    UtilsDbMongo.applyFieldsQuery(query, fields, filters, joins);
    // Set joins
    UtilsDbMongo.applyJoinsQuery(query, joins, mapParams);
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
      this.__getNameCollection(mapParams)
    );
  }

  /**
   * Method for get name collection
   * @param {*} mapParams for get rfclient for get name real collection dao
   */
  __getNameCollection(mapParams) {
    return UtilsDbMongo.getNameCollection(this.collection, mapParams);
  }

  /**
   * Method for create collection if not exists
   * @param {*} mapParams for create collection
   * @returns true if collection if created false if not
   */
  async createCollectionIfNotExists(mapParams) {
    let created = false;
    let collectionDb = await this.__getCollection(mapParams);
    // If collection dont exists create
    if (UtilsCommons.isNull(collectionDb)) {
      collectionDb = await this.mapPropertiesCreateDb.DB_MANAGER.createCollection(
        this.__getNameCollection(mapParams)
      );
      created = UtilsCommons.isNotNull(collectionDb);
      // Create indexes for collection
      this.createIndexes(mapParams);
    }
    return created;
  }

  /**
   * Method for create index  for collection
   * @param {*} mapParams
   * @param {*} name
   * @param {*} keyPath
   * @param {*} options
   */
  async createIndex(mapParams, name, keyPath, options) {
    const collectionDb = await this.__getCollection(mapParams);
    if (UtilsCommons.isNotNull(collectionDb)) {
      await collectionDb.createIndex(name, keyPath, options);
    }
  }

  /**
   * Method for create indexes collection
   * @param {*} mapParams
   */
  async createIndexes(mapParams) {}

  /**
   * Method for drop collection 
   * @param {*} mapParams 
   * @returns true if drop
   */
  async dropCollection(mapParams){
    let drop = false;

    const collectionDb = await this.__getCollection(mapParams);
    if (UtilsCommons.isNotNull(collectionDb)) {
      let resultDrop = await collectionDb.drop();
      drop = UtilsCommons.isNotNull(resultDrop) && resultDrop;
    }

    return drop;
  }

  /**
   * Method for create start data for example when create collection 
   * @param {*} mapParams 
   */
  async startData(mapParams);

  /**
   * Method for check bd collection create collections, insert data ...
   * @param {*} mapParams 
   */
  async checkBd(mapParams){
  }

  /**
   * Method for drop collection, drop data ....
   * @param {*} mapParams 
   */
  async dropBd(mapParams){

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
