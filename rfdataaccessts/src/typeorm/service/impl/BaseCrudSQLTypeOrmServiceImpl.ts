import { isNotNull } from "rfcorets";
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

        this.defaulCheckBeforeAdd(mapParams, data);

        return new ResponseService(await this.getDao().add(mapParams, data));
    }

    /**
     * @override
     */
    defaulCheckBeforeAdd(mapParams: {}, data: T): void {

    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async edit(mapParams: {}, data: T): Promise<ResponseService<T>> {

        this.defaulCheckBeforeEdit(mapParams, data);

        return new ResponseService(await this.getDao().edit(mapParams, data));
    }

    /**
     * @override
     */
    defaulCheckBeforeEdit(mapParams: {}, data: T): void {

    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async delete(mapParams: {}, data: T): Promise<ResponseService<boolean>> {

        this.defaulCheckBeforeDelete(mapParams, data);

        return new ResponseService(await this.getDao().delete(mapParams, data));
    }

    /**
     * @override
     */
    defaulCheckBeforeDelete(mapParams: {}, data: T): void {

    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async read(mapParams: {}, pkValue: any): Promise<ResponseService<T | undefined>> {
        const dataReturn = await this.getDao().read(mapParams, pkValue);

        if (isNotNull(dataReturn)) {
            this.defaulCheckAfterRead(mapParams, dataReturn!);
        }

        return new ResponseService(dataReturn);
    }

    /**
     * @override
     */
    defaulCheckAfterRead(mapParams: {}, data: T): void {

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
        const dataReturn = await this.getDao().newInstace(mapParams);

        if (isNotNull(dataReturn)) {
            this.defaulCheckAfterLoadNew(mapParams, dataReturn!);
        }

        return new ResponseService(dataReturn);
    }

    /**
     * @override
     */
    defaulCheckAfterLoadNew(mapParams: {}, data: T): void {

    }

}