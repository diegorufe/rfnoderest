/**
 * Base class from all service for application.
 * Extend this for add more funcionality
 */
class BaseService {
  constructor() {}

  /**
   * Method for check bd collection create collections, insert data ...
   * @param {*} mapParams
   */
  async checkBd(mapParams) {}

  /**
   * Method for drop collection, drop data ....
   * @param {*} mapParams
   */
  async dropBd(mapParams) {}
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
    this.pkProperty = "id";
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
   *  Method for find registers
   * @param {*} fields
   * @param {*} filters
   * @param {*} joins
   * @param {*} orders
   * @param {*} limit
   * @param {*} transaction
   */
  async list(fields, filters, joins, orders, limit, transaction) {
    return await this.dao.list(
      fields,
      filters,
      joins,
      orders,
      limit,
      transaction
    );
  }

  /**
   * Method for read one element by pk
   * @param {*} element
   * @param {*} transaction
   * @returns element read by pk
   */
  async read(elemen, transaction) {
    return await this.dao.read(elemen, this.pkProperty, null, transaction);
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
  async delete(element, transaction) {
    return await this.dao.delete(element, transaction);
  }

  /**
   * Edit
   * @param {*} element
   * @param {*} transaction
   */
  async edit(element, transaction) {
    return await this.dao.edit(element, transaction);
  }

  /**
   * Add
   * @param {*} element
   * @param {*} transaction
   */
  async add(element, transaction) {
    return await this.dao.add(element, transaction);
  }

  /**
   * loadNew
   */
  async loadNew() {
    return await this.dao.loadNew();
  }
}

module.exports = {
  BaseService: BaseService,
  BaseCrudService: BaseCrudService,
};
