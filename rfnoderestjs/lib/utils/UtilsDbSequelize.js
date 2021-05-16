const UtilsCommons = require("./UtilsCommons");
const Filter = require("../beans/query/Filter");
const Limit = require("../beans/query/Limit");

/**
 * Utils database sequelize
 */
class UtilsDbSequelize {
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
        filter.filterType.toUpperCase() == "LIKE_ALL" ||
        filter.filterType == "LIKE"
      ) {
        operator = "$like";
      } else if (filter.filterType.toUpperCase() == "IN") {
        operator = "$in";
      } else if (filter.filterType == "EQUAL" || filter.filterType == "=") {
        operator = "$eq";
      }
    }
    return operator;
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
      UtilsCommons.isNotNull(value)
    ) {
      // If hashtag filter split by token
      if (hashtagFilter) {
        value = value.split(filter.splitTokenHastagFilter);
      } else if (
        filter.filterType.toUpperCase() == "LIKE_ALL" ||
        filter.filterType == "LIKE"
      ) {
        value = "%" + value + "%";
      }
    }

    return value;
  }

  /**
   * Method for apply joins query
   * @param {*} query
   * @param {*} joins
   * @param {*} joinQuery
   */
  static applyJoinsQuery(query, joins, joinQuery) {
    if (UtilsCommons.isArrayNotEmpty(joins)) {
      let join = null;
      let alias = null;
      for (let i = 0; i < joins.length; i++) {
        join = joins[i];
        alias = join.alias | join.field;
        joinQuery.push({
          association: join.field,
          required: UtilsDbSequelize.isRequiredFetch(join.joinType),
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
   * Method to know is required fetch
   * @param {*} type
   */
  static isRequiredFetch(type) {
    let required = false;
    if (UtilsCommons.isNotNull(type) && type.toUpperCase().includes("INNER")) {
      required = true;
    }
    return required;
  }

  /**
   * Method for apply fields in query
   * @param {*} query
   * @param {*} fields
   * @param {*} fieldsQuery
   *
   */
  static applyFieldsQuery(query, fields, fieldsQuery) {
    if (UtilsCommons.isArrayNotEmpty(fields)) {
      let field = null;
      let fieldValue = null;

      for (let i = 0; i < fields.length; i++) {
        field = fields[i];
        fieldValue = field.name.split(field.fieldSeparator);
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
   * @param {*} mapPropertiesCreateDb
   */
  static applyFiltersQuery(query, filters, filterQuery, mapPropertiesCreateDb) {
    if (UtilsCommons.isArrayNotEmpty(filters)) {
      let filter = null;

      for (let i = 0; i < filters.length; i++) {
        filter = filters[i];
        let propertyField = UtilsDbSequelize.resolvePropertyFilter(filter);
        let operator = UtilsDbSequelize.resolveOperatorFilter(filter);
        let value = UtilsDbSequelize.resolveValueFilter(filter);
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
                    mapPropertiesCreateDb.DB_MANAGER.fn(
                      "FIND_IN_SET",
                      element,
                      mapPropertiesCreateDb.DB_MANAGER.col(propertyField)
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
   * Method for apply orders query
   * @param {*} query
   * @param {*} orders
   * @param {*} orderQuery
   */
  static applyOrdersQuery(query, orders, orderQuery) {
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
  static applyLimits(query, limits) {
    if (
      UtilsCommons.isNotNull(limits) &&
      UtilsCommons.isNotNull(limits.start) &&
      UtilsCommons.isNotNull(limits.end)
    ) {
      query["offset"] = limits.start;
      query["limit"] = limits.end;
    }
  }
}

module.exports = UtilsDbSequelize;
