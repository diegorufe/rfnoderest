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
    this.pkProperty = "id";
  }

  /**
   * Method for check bd collection create collections, insert data ...
   * @param {*} expressApp
   * @param {*} transaction
   * @param {*} mapParams
   */
  async checkBd(expressApp, transaction, mapParams) {
    return await this.dao.checkBd(transaction, mapParams);
  }

  /**
   * Method for drop collection, drop data ....
   * @param {*} expressApp
   * @param {*} transaction
   * @param {*} mapParams
   */
  async dropBd(expressApp, transaction, mapParams) {
    return await this.dao.dropBd(transaction, mapParams);
  }

  /**
   * Count
   * @param {*} expressApp
   * @param {*} filters
   * @param {*} joins
   * @param {*} transaction
   * @param {*} mapParams
   */
  async count(expressApp, filters, joins, transaction, mapParams) {
    return await this.dao.count(filters, joins, transaction, mapParams);
  }

  /**
   *  Method for find registers
   * @param {*} expressApp
   * @param {*} fields
   * @param {*} filters
   * @param {*} joins
   * @param {*} orders
   * @param {*} limit
   * @param {*} transaction
   * @param {*} mapParams
   */
  async list(
    expressApp,
    fields,
    filters,
    joins,
    orders,
    limit,
    transaction,
    mapParams
  ) {
    return await this.dao.list(
      fields,
      filters,
      joins,
      orders,
      limit,
      transaction,
      mapParams
    );
  }

  /**
   * Method for count and find data
   * @param {*}  expressApp
   * @param {*} fields to get
   * @param {*} filters  to apply
   * @param {*} joins to apply
   * @param {*} orders to apply
   * @param {*} first to start find
   * @param {*} recordsPage end to limit
   * @param {*} transaction  if pass use this transaction else create new
   * @param {*} mapParams for pass extra data
   */
  async browser(
    expressApp,
    fields,
    filters,
    joins,
    orders,
    first,
    recordsPage,
    transaction,
    mapParams
  ) {
    return await this.dao.browser(
      fields,
      filters,
      joins,
      orders,
      first,
      recordsPage,
      transaction,
      mapParams
    );
  }

  /**
   * Method for read one element by pk
   * @param {*} expressApp
   * @param {*} element
   * @param {*} transaction
   * @param {*} mapParams
   *
   * @returns element read by pk
   */
  async readWithElement(expressApp, elemen, transaction, mapParams) {
    return await this.dao.read(
      elemen,
      this.pkProperty,
      null,
      transaction,
      mapParams
    );
  }

  /**
   * Method for read one element by pk
   * @param {*} expressApp
   * @param {*} pkValue
   * @param {*} transaction
   * @param {*} mapParams
   *
   * @returns element read by pk
   */
  async read(expressApp, pkValue, transaction, mapParams) {
    return await this.dao.read(pkValue, null, transaction, mapParams);
  }

  /**
   * Find one
   * @param {*} expressApp
   * @param {*} filters
   * @param {*} joins
   * @param {*} orders
   * @param {*} limit
   * @param {*} transaction
   * @param {*} mapParams
   *
   */
  async findOne(
    expressApp,
    filters,
    joins,
    orders,
    limit,
    transaction,
    mapParams
  ) {
    return await this.dao.findOne(
      filters,
      joins,
      orders,
      limit,
      transaction,
      mapParams
    );
  }

  /**
   * Destroy
   * @param {*} expressApp
   * @param {*} element
   * @param {*} transaction
   *  @param {*} mapParams
   */
  async delete(expressApp, element, transaction, mapParams) {
    return await this.dao.delete(element, transaction, mapParams);
  }

  /**
   * Edit
   * @param {*} expressApp
   * @param {*} element
   * @param {*} transaction
   * @param {*} mapParams
   */
  async edit(expressApp, element, transaction, mapParams) {
    element = await this.beforeAddEdit(
      expressApp,
      element,
      transaction,
      mapParams
    );
    return await this.dao.edit(element, transaction, mapParams);
  }

  /**
   * Add
   * @param {*} expressApp
   * @param {*} element
   * @param {*} transaction
   * @param {*} mapParams
   */
  async add(expressApp, element, transaction, mapParams) {
    element = await this.beforeAddEdit(
      expressApp,
      element,
      transaction,
      mapParams
    );
    return await this.dao.add(element, transaction, mapParams);
  }

  /**
   * Method execute before add/edit
   * @param {*} expressApp
   * @param {*} element
   * @param {*} transaction
   * @param {*} mapParams
   * @returns element
   */
  async beforeAddEdit(expressApp, element, transaction, mapParams) {
    return element;
  }

  /**
   * loadNew
   * @param {*} expressApp
   * @param {*} transaction
   * @param {*} mapParams
   */
  async loadNew(expressApp, transaction, mapParams) {
    return await this.dao.loadNew(transaction, mapParams);
  }

  /**
   * Method for get pk property
   * @returns
   */
  getPkProperty() {
    return this.dao.getPkProperty();
  }
}

module.exports = {
  BaseService: BaseService,
  BaseCrudService: BaseCrudService,
};
