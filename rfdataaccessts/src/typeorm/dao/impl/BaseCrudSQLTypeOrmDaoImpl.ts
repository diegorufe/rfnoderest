import { isArrayNotEmpty, isNotNull } from "rfcorets";
import { Filter } from "../../../beans/query/Filter";
import { Join } from "../../../beans/query/Join";
import { Limit } from "../../../beans/query/Limit";
import { IBaseCrudDao } from "../../../dao/IBaseCrudDao";
import { findEntityManagerMapParams } from "../../../utils/UtilsTransactions";
import { BaseAuditTypeOrmEntity } from "../../entities/BaseAuditTypeOrmEntity";
import { BaseSearchSQLTypeOrmDaoImpl } from "./BaseSearchSQLTypeOrmDaoImpl";

/**
 * Base crud sql tryp orm implementation
 */
export abstract class BaseCrudSQLTypeOrmDaoImpl<T> extends BaseSearchSQLTypeOrmDaoImpl<T> implements IBaseCrudDao<T>{

    /**
     * @override
     */
    async add(mapParams: {}, data: T): Promise<T> {

        // Prevent unable to find entity annotation
        const dataEntity = Object.assign(await this.newInstace(mapParams), data);

        // Add createdAt updatedAt
        this.addCreatedAt(dataEntity);
        this.addUpdatedAt(dataEntity);

        // create query builder and punt in map params
        this.createEntityManagerAndPutInMapParams(mapParams);
        const dataReturn = await findEntityManagerMapParams(mapParams).save(dataEntity);
        return dataReturn;
    }

    /**
     * @override
     */
    async edit(mapParams: {}, data: T): Promise<T> {

        // Prevent unable to find entity annotation
        const dataEntity = Object.assign(await this.newInstace(mapParams), data);

        // Add updatedAt
        this.addUpdatedAt(dataEntity);

        // create query builder and punt in map params
        this.createEntityManagerAndPutInMapParams(mapParams);
        const dataReturn = await findEntityManagerMapParams(mapParams).save(dataEntity);
        return dataReturn;
    }

    /**
     * @override
     */
    async delete(mapParams: {}, data: T): Promise<boolean> {
        // Prevent unable to find entity annotation
        const dataEntity = Object.assign(await this.newInstace(mapParams), data);
        // create query builder and punt in map params
        this.createEntityManagerAndPutInMapParams(mapParams);
        await findEntityManagerMapParams(mapParams).remove(dataEntity);
        return true;
    }

    /**
     * @override
     */
    async read(mapParams: {}, pkValue: any): Promise<T | undefined> {
        return await this.findByPk(mapParams, pkValue, []);
    }

    /**
     * @override
     */
    async findByPk(mapParams: {}, pkValue: any, collectionJoins: Join[]): Promise<T | undefined> {
        const collectionFilters: Filter[] = [];
        collectionFilters.push(new Filter(this.getPKFieldName(), pkValue));

        const data: T[] = await this.list(mapParams, [], collectionFilters, collectionJoins, [], [], new Limit(0, 1));

        return data != undefined && isArrayNotEmpty(data) ? data[0] : undefined;
    }

    /**
     * @override
     */
    getPKFieldName(): string {
        return "id";
    }

    /**
     * Method for add createdAt in data
     * @param data to add createdAt
     */
    private addCreatedAt(data: T): void {
        if (isNotNull(data) && data instanceof BaseAuditTypeOrmEntity) {
            data.createdAt = new Date();
        }
    }

    /**
     * Method for add updatedAt in data
     * @param data to add updatedAt
     */
    private addUpdatedAt(data: T): void {
        if (isNotNull(data) && data instanceof BaseAuditTypeOrmEntity) {
            data.updatedAt = new Date();
        }
    }
}