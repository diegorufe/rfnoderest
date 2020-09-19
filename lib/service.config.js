/**
 * Class limit queries
 */
class Limit {
  /**
   * Constructor for limit
   * @param {*} start query
   * @param {*} end query
   * @param {*} other other data if required
   */
  constructor(start, end, other) {
    this.start = start;
    this.end = end;
    this.other = other;
  }
}

/**
 * Class to get only fields in query
 */
class Field {
  /**
   * Constructor for field
   * @param {*} alias for fetch table
   * @param {*} property property for table
   */
  constructor(alias, property) {
    this.alias = alias;
    this.property = property;
  }
}

/**
 * Class fetch data in queries
 */
class Join {
  /**
   * Constructor for fetch
   * @param {*} alias for fetch table
   * @param {*} type for join
   * @param {*} other other data if required
   */
  constructor(alias, type, other) {
    this.alias = alias;
    this.type = type;
    this.other = other;
  }
}

/**
 * Class filter in queries
 */
class Filter {
  /**
   *
   * @param {*} property
   * @param {*} type
   * @param {*} value
   * @param {*} andOr
   * @param {*} alias
   * @param {*} propertyData
   * @param {*} other other data if required
   */
  constructor(property, type, value, andOr, alias, propertyData, other) {
    this.property = property;
    this.type = type;
    this.value = value;
    this.andOr = andOr;
    this.alias = alias;
    this.idData = null;
    this.propertyData = propertyData;
    this.other = other;
    this.splitToken = ",";
    this.hashtagFilter = false;
  }
}

/**
 * Class order by in queries
 */
class Order {
  /**
   * Constructor for order
   * @param {*} property to order data
   * @param {*} type "ASC", "DESC" ...
   * @param {*} other other data if required
   */
  constructor(property, type, other) {
    this.property = property;
    this.type = type;
    this.other = other;
  }
}

/**
 * Base class from all service for application.
 * Extend this for add more funcionality
 */
class BaseService {
  constructor() {}
}

/**
 * Base class from service crud operations
 * Extend this for add more funcionality
 */
class BaseCrudService extends BaseService {
  /**
   * Constructor for base service
   * @param {*} dao is the ORM, OGM, class ... for manage queries and send to database
   */
  constructor(dao) {
    super();
    this.dao = dao;
    this.logger = null;
  }

  /**
   * Count
   * @param {*} filters
   * @param {*} joins
   * @param {*} transaction
   */
  async count(filters, joins, transaction) {
    return await this.dao.count(filters, joins, transaction);
  }

  /**
   * Find all
   * @param {*} filters
   * @param {*} joins
   * @param {*} orders
   * @param {*} limit
   * @param {*} transaction
   */
  async findAll(filters, joins, orders, limit, transaction) {
    return await this.dao.findAll(filters, joins, orders, limit, transaction);
  }

  /**
   * Find all, return only fields in data
   * @param {*} fields
   * @param {*} filters
   * @param {*} joins
   * @param {*} orders
   * @param {*} limit
   * @param {*} transaction
   */
  async findAllOnlyFields(fields, filters, joins, orders, limit, transaction) {
    return await this.dao.findAllOnlyFields(
      fields,
      filters,
      fetchs,
      orders,
      limit,
      transaction
    );
  }

  /**
   * Find one
   * @param {*} filters
   * @param {*} joins
   * @param {*} orders
   * @param {*} limit
   * @param {*} transaction
   */
  async findOne(filters, joins, orders, limit, transaction) {
    return await this.dao.findOne(filters, joins, orders, limit, transaction);
  }

  /**
   * Destroy
   * @param {*} element
   * @param {*} transaction
   */
  async destroy(element, transaction) {
    return await this.dao.destroy(element, transaction);
  }

  /**
   * Save
   * @param {*} element
   * @param {*} transaction
   */
  async save(element, transaction) {
    return await this.dao.save(element, transaction);
  }

  /**
   * Build
   */
  async build() {
    return await this.dao.build();
  }
}

module.exports = {
  Field: Field,
  Limit: Limit,
  Join: Join,
  Filter: Filter,
  Order: Order,
  BaseService: BaseService,
  BaseCrudService: BaseCrudService,
};
