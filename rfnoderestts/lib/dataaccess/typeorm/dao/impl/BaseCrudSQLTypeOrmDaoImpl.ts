import { isArrayNotEmpty } from "../../../../core/utils/UtilsCommons";
import { Field } from "../../../beans/query/Field";
import { Filter } from "../../../beans/query/Filter";
import { Join } from "../../../beans/query/Join";
import { Limit } from "../../../beans/query/Limit";
import { IBaseCrudDao } from "../../../dao/IBaseCrudDao";
import { findEntityManagerMapParams, findQueryBuilderMapParams } from "../../../utils/UtilsTransactions";
import { BaseSearchSQLTypeOrmDaoImpl } from "./BaseSearchSQLTypeOrmDaoImpl";

/**
 * Base crud sql tryp orm implementation
 */
export abstract class BaseCrudSQLTypeOrmDaoImpl<T> extends BaseSearchSQLTypeOrmDaoImpl<T> implements IBaseCrudDao<T>{

    /**
     * @override
     */
    async add(mapParams: {}, data: T): Promise<T> {
        // create query builder and punt in map params
        this.createEntityManagerAndPutInMapParams(mapParams);
        const dataReturn = await findEntityManagerMapParams(mapParams).save(data);
        return dataReturn;
    }

    /**
     * @override
     */
    async edit(mapParams: {}, data: T): Promise<T> {
        // create query builder and punt in map params
        this.createEntityManagerAndPutInMapParams(mapParams);
        const dataReturn = await findEntityManagerMapParams(mapParams).save(data);
        return dataReturn;
    }

    /**
     * @override
     */
    async delete(mapParams: {}, data: T): Promise<boolean> {
        // create query builder and punt in map params
        this.createEntityManagerAndPutInMapParams(mapParams);
        await findEntityManagerMapParams(mapParams).remove(data);
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
    async newInstace(mapParams: {}): Promise<T> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    getPKFieldName(): string {
        return "id";
    }
}