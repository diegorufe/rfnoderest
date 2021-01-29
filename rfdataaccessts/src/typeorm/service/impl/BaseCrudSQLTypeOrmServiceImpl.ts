import { ResponseService } from "../../../beans/core/ResponseService";
import { Join } from "../../../beans/query/Join";
import { EnumTransactionsTypes } from "../../../constants/transactions/EnumTransactionsTypes";
import { IBaseCrudDao } from "../../../dao/IBaseCrudDao";
import { IBaseCrudService } from "../../../service/IBaseCrudService";
import { Transactional } from "../../decorators/TransactionalDecorator";
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
    async add(mapParams: {}, data: T): Promise<ResponseService<T>> {
        return new ResponseService(await this.getDao().add(mapParams, data));
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async edit(mapParams: {}, data: T): Promise<ResponseService<T>> {
        return new ResponseService(await this.getDao().edit(mapParams, data));
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async delete(mapParams: {}, data: T): Promise<ResponseService<boolean>> {
        return new ResponseService(await this.getDao().delete(mapParams, data));
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async read(mapParams: {}, pkValue: any): Promise<ResponseService<T | undefined>> {
        return new ResponseService(await this.getDao().read(mapParams, pkValue));
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async findByPk(mapParams: {}, pkValue: any, collectionJoins: Join[]): Promise<ResponseService<T | undefined>> {
        return new ResponseService(await this.getDao().findByPk(mapParams, pkValue, collectionJoins));
    }


    /**
     * @override
     */
    async loadNew(mapParams: {}): Promise<ResponseService<T>> {
        return new ResponseService(await this.getDao().newInstace(mapParams));
    }


}