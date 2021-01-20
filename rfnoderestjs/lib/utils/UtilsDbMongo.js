const UtilsCommons = require("./UtilsCommons");

/**
 * Utils database mongo
 */
class UtilsDbMongo {
  /**
   * Indicates transaction is enable, by default is false because transactions only work in replica sets for mongobd
   */
  static ENABLE_FEATURE_TRANSACTION = false;

  /**
   * Method to know collection is master
   * @param {*} collection to check is master
   */
  static isMasterCollection(collection) {
    return UtilsCommons.isNotNull(collection) && collection.includes("_master");
  }

  /**
   * Method for get name collection
   * @param {*} collection
   * @param {*} mapParams
   */
  static getNameCollection(collection, mapParams) {
    let name = collection;
    if (
      !UtilsDbMongo.isMasterCollection(name) &&
      UtilsCommons.isNotNull(mapParams) &&
      "rfclient" in mapParams
    ) {
      name = name + mapParams["rfclient"].code;
    }
    return name;
  }

  /**
   * Method for transform cover uint array
   * @param data
   */
  static transFormCoverUint8Array(data) {
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
   * Method to resolve operator filter
   * @param {*} filter to resolve
   */
  static resolveOperatorFilter(filter) {
    let operator = "$eq";
    if (
      UtilsCommons.isNotNull(filter) &&
      UtilsCommons.isNotNull(filter.filterType)
    ) {
      if (
        filter.filterType == "like_all" ||
        filter.filterType.toUpperCase() == "LIKE"
      ) {
        operator = "$like";
      } else if (filter.filterType.toUpperCase() == "IN") {
        operator = "$in";
      } else if (filter.filterType == "EQUAL") {
        operator = "$eq";
      }
    }
    return operator;
  }

  /**
   * Method to resolve property filter
   * @param {*} filter to resolve
   */
  static resolvePropertyFilter(filter) {
    let valueReturn = "";
    if (UtilsCommons.isNotNull(filter.alias)) {
      valueReturn = filter.alias + ".";
    }
    valueReturn = valueReturn + filter.field;
    return valueReturn;
  }

  /**
   * Method to resolve value filter
   * @param {*} filter to resolve
   */
  static resolveValueFilter(filter) {
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
      UtilsCommons.isNotNull(value) &&
      hashtagFilter
    ) {
      // If hashtag filter split by token
      value = value.split(filter.splitTokenHastagFilter);
    }

    return value;
  }

  /**
   * Method for apply fields query
   * @param {*} query
   * @param {*} fields
   * @param {*} filters
   * @param {*} joins
   * @param {*} mapPropertiesCreateDb
   */
  static applyFieldsQuery(
    query,
    fields,
    filters,
    joins,
    mapPropertiesCreateDb
  ) {
    if (UtilsCommons.isArrayNotEmpty(fields)) {
      const fieldsApply = fields;

      if (UtilsCommons.isArrayNotEmpty(filters)) {
        filters.forEach((filter) => {
          let joinSplit = filter.field.split(".");
          if (joinSplit.length == 1) {
            fieldsApply.push({ name: filter.field });
          }
        });
      }

      if (UtilsCommons.isArrayNotEmpty(joins)) {
        joins.forEach((join) => {
          fieldsApply.push({ name: join.localField });
          fieldsApply.push({ name: join.as });
        });
      }

      let field = null;
      const fieldsQuery = {};
      for (let i = 0; i < fieldsApply.length; i++) {
        field = fieldsApply[i];
        fieldsQuery[field.name] = 1;
      }
      query.push({ $project: fieldsQuery });
    }
  }

  /**
   * Method for apply filters query
   * @param {*} query
   * @param {*} filters
   * @param {*} mapPropertiesCreateDb
   */
  static applyFiltersQuery(query, filters, mapPropertiesCreateDb) {
    // TODO apply or condition
    let mapApplyFilters = { $and: [] };
    let isApplyFilters = false;
    if (UtilsCommons.isArrayNotEmpty(filters)) {
      let filter = null;

      for (let i = 0; i < filters.length; i++) {
        isApplyFilters = true;
        filter = filters[i];

        let propertyField = UtilsDbMongo.resolvePropertyFilter(filter);
        let operator = UtilsDbMongo.resolveOperatorFilter(filter);
        let value = UtilsDbMongo.resolveValueFilter(filter);
        let mapData = {};
        mapData[propertyField] = null;

        switch (operator) {
          case "$eq":
            mapData[propertyField] = value;
            break;

          case "$like":
            mapData[propertyField] = eval(`/${value}/`);
            break;

          case "$in":
            mapData[propertyField] = { $in: value };
            break;
        }
        mapApplyFilters["$and"].push(mapData);
      }
    }
    if (isApplyFilters) {
      query.push({ $match: mapApplyFilters });
    }
  }

  /**
   * Method for apply joins query
   * @param {*} query
   * @param {*} joins
   * @param {*} mapParams
   */
  static applyJoinsQuery(query, joins, mapParams) {
    if (UtilsCommons.isArrayNotEmpty(joins)) {
      let join = null;
      for (let i = 0; i < joins.length; i++) {
        join = joins[i];
        query.push({
          $lookup: {
            from: UtilsDbMongo.getNameCollection(join.from, mapParams),
            localField: join.localField,
            foreignField: join.foreignField,
            as: join.as,
          },
        });
      }
    }
  }

  /**
   * Method for apply orders query
   * @param {*} query
   * @param {*} orders
   */
  static applyOrdersQuery(query, orders) {
    let mapApplyOrders = {};
    let isApplyOrders = false;
    if (UtilsCommons.isArrayNotEmpty(orders)) {
      let order = null;
      let key = null;
      for (let i = 0; i < orders.length; i++) {
        order = orders[i];
        if (UtilsCommons.isNotNull(order.orderType)) {
          isApplyOrders = true;
          mapApplyOrders[order.field] = order.orderType == "ASC" ? 1 : -1;
        }
      }
      if (isApplyOrders) {
        query.push({ $sort: mapApplyOrders });
      }
    }
  }

  /**
   * Method for apply limits
   * @param {*} query
   * @param {*} limits
   */
  static applyLimits(query, limits) {
    if (
      UtilsCommons.isNotNull(limits) &&
      UtilsCommons.isNotNull(limits.start) &&
      UtilsCommons.isNotNull(limits.end)
    ) {
      query.push({ $skip: limits.start });
      query.push({ $limit: limits.end });
    }
  }

  /**
   * Load defaults fields necesary for elements
   * @param {*} element
   */
  static loadDefaultDataElement(element) {
    if (UtilsCommons.isNull(element)) {
      element = {};
    }

    if (!("_id" in element)) {
      element["_id"] = null;
    }

    if (!("erasable" in element)) {
      element["erasable"] = true;
    }

    if (!("editable" in element)) {
      element["editable"] = true;
    }

    if (!("createdAt" in element)) {
      element["createdAt"] = null;
    }
    if (!("userCreatedAtId" in element)) {
      element["userCreatedAtId"] = null;
    }
    if (!("updatedAt" in element)) {
      element["updatedAt"] = null;
    }
    if (!("userupdatedAtId" in element)) {
      element["userUpdatedAtId"] = null;
    }

    if (!("dischargeDate" in element)) {
      element["dischargeDate"] = null;
    }

    if (!("dbVersion" in element)) {
      element["dbVersion"] = 0;
    }

    return element;
  }

  /**
   * Method for get client manager inside map params
   * @param {*} mapParams
   */
  static getClientManager(mapParams) {
    let clientManager = null;
    if (UtilsCommons.isNotNull(mapParams) && "CLIENT_MANAGER" in mapParams) {
      clientManager = mapParams["CLIENT_MANAGER"];
    }
    return clientManager;
  }

  /**
   * Method for create transaction
   * @param {*} transaction
   * @param {*} mapParams
   */
  static createTransaction(mapParams) {
    let transaction = null;
    if (UtilsCommons.isNotNull(mapParams)) {
      const clientManager = UtilsDbMongo.getClientManager(mapParams);
      transaction = {
        session: clientManager.startSession(),
      };
    }
    return transaction;
  }

  /**
   * Method for end transaction
   * @param {*} transaction
   */
  static startTransaction(transaction) {
    if (
      UtilsDbMongo.ENABLE_FEATURE_TRANSACTION &&
      UtilsCommons.isNotNull(transaction)
    ) {
      transaction.session.startTransaction();
    }
  }

  /**
   * Method for commit transaction
   * @param {*} transaction
   */
  static async commitTransaction(transaction) {
    if (
      UtilsDbMongo.ENABLE_FEATURE_TRANSACTION &&
      UtilsCommons.isNotNull(transaction)
    ) {
      await transaction.session.commitTransaction();
      transaction.session.endSession();
    }
  }

  /**
   * Method for abort transaction
   * @param {*} transaction
   */
  static async abortTransaction(transaction) {
    if (
      UtilsDbMongo.ENABLE_FEATURE_TRANSACTION &&
      UtilsCommons.isNotNull(transaction)
    ) {
      await transaction.session.abortTransaction();
      transaction.session.endSession();
    }
  }

  /**
   * Method for apply transaction if transaction if enabled. See UtilsDbMongo.ENABLE_FEATURE_TRANSACTION &&
   * @param {*} transaction
   * @param {*} fn for apply
   */
  static async applyFunctionWithTransaction(
    transaction,
    mapPropertiesCreateDb,
    fn
  ) {
    const commitTransaction = UtilsCommons.isNull(transaction);
    const transactionAction = UtilsCommons.isNull(transaction)
      ? UtilsDbMongo.createTransaction(mapPropertiesCreateDb)
      : transaction;

    if (commitTransaction) {
      UtilsDbMongo.startTransaction(transactionAction);
    }

    let result = null;

    try {
      result = fn.apply(this, arguments);
      if (
        UtilsCommons.isNotNull(result) &&
        typeof result.then === "function" &&
        typeof result.catch === "function"
      ) {
        try {
          result = await result;
        } catch (exception) {
          // Throw exception
          throw exception;
        }
      }
    } catch (exception) {
      console.log(exception);
      if (commitTransaction) {
        await UtilsDbMongo.abortTransaction(transactionAction);
      }
      // Throw exception
      throw exception;
    }
    return result;
  }

  /**
   * Method for get options transaction. See UtilsDbMongo.ENABLE_FEATURE_TRANSACTION
   * @param {*} transaction
   */
  static getOptionsTransaction(transaction) {
    let options = null;
    if (UtilsDbMongo.ENABLE_FEATURE_TRANSACTION) {
      const session = transaction.session;
      options = { session, returnOriginal: false };
    }
    return options;
  }
}

module.exports = UtilsDbMongo;
