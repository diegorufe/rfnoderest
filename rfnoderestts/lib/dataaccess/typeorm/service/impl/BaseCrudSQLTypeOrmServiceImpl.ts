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
import { IBaseCrudDao } from "../../../dao/IBaseCrudDao";
import { IBaseCrudService } from "../../../service/IBaseCrudService";
import { BaseSearchSQLTypeOrmServiceImpl } from "./BaseSearchSQLTypeOrmServiceImpl";

/**
 * Base class implementation for service serach sql type orm
 */
export abstract class BaseCrudSQLTypeOrmServiceImpl<T, DAO extends IBaseCrudDao<T>> extends BaseSearchSQLTypeOrmServiceImpl<T, DAO> implements IBaseCrudService<T, DAO>{


    /**
     * Constructor BaseCrudSQLTypeOrmServiceImpl 
     * @param dao for dataaccess
     */
    constructor(dao: DAO) {
        super(dao);
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async add(mapParams: {}, data: T): Promise<T> {
        return await this.getDao().add(mapParams, data);
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async edit(mapParams: {}, data: T): Promise<T> {
        return await this.getDao().edit(mapParams, data);
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async delete(mapParams: {}, data: T): Promise<boolean> {
        return await this.getDao().delete(mapParams, data);
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async read(mapParams: {}, pkValue: any): Promise<T | undefined> {
        return await this.getDao().read(mapParams, pkValue);
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async findByPk(mapParams: {}, pkValue: any, collectionJoins: Join[]): Promise<T | undefined> {
        return await this.getDao().findByPk(mapParams, pkValue, collectionJoins);
    }


    /**
     * @override
     */
    async newInstace(mapParams: {}): Promise<T> {
        return await this.getDao().newInstace(mapParams);
    }


}