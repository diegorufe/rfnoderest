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
class Fetch {
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
    this.data = null;
    this.idData = null;
    this.propertyData = propertyData;
    this.other = other;
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
  }

  /**
   * Count
   * @param {*} filters
   * @param {*} fetchs
   */
  async count(filters, fetchs) {
    return await this.dao.count(filters, fetchs);
  }

  /**
   * Find all
   * @param {*} filters
   * @param {*} fetchs
   * @param {*} orders
   * @param {*} limit
   */
  async findAll(filters, fetchs, orders, limit) {
    return await this.dao.findAll(filters, fetchs, orders, limit);
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
    return await this.dao.findAllOnlyFields(
      fields,
      filters,
      fetchs,
      orders,
      limit
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
    return await this.dao.findOne(filters, fetchs, orders, limit);
  }

  /**
   * Destroy
   * @param {*} element
   */
  async destroy(element) {
    return await this.dao.destroy(element);
  }

  /**
   * Save
   * @param {*} element
   */
  async save(element) {
    return await this.dao.save(element);
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
  Fetch: Fetch,
  Filter: Filter,
  Order: Order,
  BaseService: BaseService,
  BaseCrudService: BaseCrudService
};
