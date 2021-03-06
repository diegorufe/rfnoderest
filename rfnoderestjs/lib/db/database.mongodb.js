const Limit = require("../beans/query/Limit");
const Filter = require("../beans/query/Filter");
const UtilsCommons = require("../utils/UtilsCommons");
const UtilsDbMongo = require("../utils/UtilsDbMongo");

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
    const self = this;

    element = await UtilsDbMongo.applyFunctionWithTransaction(
      transaction,
      self.mapPropertiesCreateDb,
      async () => {
        element["createdAt"] = new Date();
        element["updatedAt"] = new Date();
        const dbCollection = await self.__getCollection(mapParams);
        const result = await dbCollection.insertOne(
          element,
          UtilsDbMongo.getOptionsTransaction(transaction)
        );
        element._id = result.insertedId;

        return element;
      }
    );

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
    const self = this;

    element = await UtilsDbMongo.applyFunctionWithTransaction(
      transaction,
      self.mapPropertiesCreateDb,
      async () => {
        element["updatedAt"] = new Date();
        const dbCollection = await self.__getCollection(mapParams);
        const result = await dbCollection.updateOne(
          element,
          UtilsDbMongo.getOptionsTransaction(transaction)
        );

        return element;
      }
    );

    return element;
  }

  /**
   * Method for delete register
   * @param {*} element is a sequelize entity for delete
   * @param {*} transaction if pass use this transaction else create new
   * @param {*} mapParams for pass extra data
   */
  async delete(element, transaction, mapParams) {
    const self = this;

    return await UtilsDbMongo.applyFunctionWithTransaction(
      transaction,
      self.mapPropertiesCreateDb,
      async () => {
        const dbCollection = await self.__getCollection(mapParams);
        if (
          UtilsCommons.isNotNull(element) &&
          UtilsCommons.isNotNull(element.erasable) &&
          element.erasable == false
        ) {
          throw new Error("$$Not erasable element");
        }
        const result = await dbCollection.deleteOne(
          element,
          UtilsDbMongo.getOptionsTransaction(transaction)
        );

        return true;
      }
    );
  }

  /**
   * Method for build a new register
   * @param transaction
   * @param {*} mapParams for pass extra data
   * @returns register build
   */
  async loadNew(transaction, mapParams) {
    return {};
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
    const collections = await this.mapPropertiesCreateDb.DB_MANAGER.collections();
    let collection = null;
    const nameCollection = this.__getNameCollection(mapParams);
    if (
      collections.map((c) => c.s.namespace.collection).includes(nameCollection)
    )
      collection = await this.mapPropertiesCreateDb.DB_MANAGER.collection(
        nameCollection
      );
    return collection;
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
   * @param transaction
   * @param {*} mapParams for create collection
   * @returns true if collection if created false if not
   */
  async createCollectionIfNotExists(transaction, mapParams) {
    const self = this;

    return await UtilsDbMongo.applyFunctionWithTransaction(
      transaction,
      self.mapPropertiesCreateDb,
      async () => {
        let created = false;
        let collectionDb = await self.__getCollection(mapParams);
        if (UtilsCommons.isNull(collectionDb)) {
          const collectionDb = await self.mapPropertiesCreateDb.DB_MANAGER.createCollection(
            self.__getNameCollection(mapParams),
            UtilsDbMongo.getOptionsTransaction(transaction)
          );
          created = UtilsCommons.isNotNull(collectionDb);
          // Create indexes for collection
          await self.createIndexes(transaction, mapParams);
        }
        return created;
      }
    );
  }

  /**
   * Method for create index  for collection
   * @param {*} transaction
   * @param {*} mapParams
   * @param {*} name
   * @param {*} keyPath
   * @param {*} options
   */
  async createIndex(transaction, mapParams, name, keyPath, options) {
    const self = this;

    return await UtilsDbMongo.applyFunctionWithTransaction(
      transaction,
      self.mapPropertiesCreateDb,
      async () => {
        const collectionDb = await self.__getCollection(mapParams);
        if (UtilsCommons.isNotNull(collectionDb)) {
          await collectionDb.createIndex(
            name,
            keyPath,
            UtilsDbMongo.getOptionsTransaction(transaction)
          );
        }
      }
    );
  }

  /**
   * Method for create indexes collection
   * @param {*} transaction
   * @param {*} mapParams
   */
  async createIndexes(transaction, mapParams) {}

  /**
   * Method for drop collection
   * @param {*} transaction
   * @param {*} mapParams
   * @returns true if drop
   */
  async dropCollection(transaction, mapParams) {
    const self = this;

    return await UtilsDbMongo.applyFunctionWithTransaction(
      transaction,
      self.mapPropertiesCreateDb,
      async () => {
        let drop = false;

        const collectionDb = await self.__getCollection(mapParams);
        if (UtilsCommons.isNotNull(collectionDb)) {
          let resultDrop = await collectionDb.drop(
            UtilsDbMongo.getOptionsTransaction(transaction)
          );
          drop = UtilsCommons.isNotNull(resultDrop) && resultDrop;
        }
        return drop;
      }
    );
  }

  /**
   * Method for check bd collection create collections, insert data ...
   * @param {*} transaction
   * @param {*} mapParams
   */
  async checkBd(transaction, mapParams) {}

  /**
   * Method for drop collection, drop data ....
   * @param {*} transaction
   * @param {*} mapParams
   */
  async dropBd(transaction, mapParams) {}
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
    dbVersion: 0,
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

    // Necesary for create transactions
    MAP_PROPERTIES_CREATE_DB.CLIENT_MANAGER = client;

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
