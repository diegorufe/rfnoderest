import { Field } from "../../../beans/query/Field";
import { Filter } from "../../../beans/query/Filter";
import { Group } from "../../../beans/query/Group";
import { Join } from "../../../beans/query/Join";
import { Limit } from "../../../beans/query/Limit";
import { Order } from "../../../beans/query/Order";
import { IBaseSearchDao } from "../../../dao/IBaseSearhDao";
import { IBaseSearchService } from "../../../service/IBaseSearchService";
import { Transactional } from "../../decorators/TransactionalDecorator";
import { EnumTransactionsTypes } from "../../../constants/transactions/EnumTransactionsTypes";

/**
 * Base class implementation for service serach sql type orm
 */
export abstract class BaseSearchSQLTypeOrmServiceImpl<T, DAO extends IBaseSearchDao<T>> implements IBaseSearchService<T, DAO>{

    dao: DAO;

    /**
     * Constructor BaseSearchSQLTypeOrmServiceImpl 
     * @param dao for dataaccess
     */
    constructor(dao: DAO) {
        this.dao = dao;
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async list(mapParams: {}, collectionFields: Field[], collectionFilters: Filter[], collectionJoins: Join[], collectionOrders: Order[], collectionGroups: Group[], limit: Limit): Promise<T[]> {
        return await this.getDao().list(mapParams, collectionFields, collectionFilters, collectionJoins, collectionOrders, collectionGroups, limit);
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async count(mapParams: {}, collectionFilters: Filter[], collectionJoins: Join[], collectionGroups: Group[]): Promise<number> {
        return await this.getDao().count(mapParams, collectionFilters, collectionJoins, collectionGroups);
    }

    /**
     * @override
     */
    getDao(): DAO {
        return this.dao;
    }

    /**
     * @override
     */
    setDao(dao: DAO): void {
        this.dao = dao;
    }
}