import { isArrayNotEmpty } from "../../../../core/utils/UtilsCommons";
import { Field } from "../../../beans/query/Field";
import { Filter } from "../../../beans/query/Filter";
import { Join } from "../../../beans/query/Join";
import { Limit } from "../../../beans/query/Limit";
import { IBaseCrudDao } from "../../../dao/IBaseCrudDao";
import { BaseSearchSQLTypeOrmDaoImpl } from "./BaseSearchSQLTypeOrmDaoImpl";

/**
 * Base crud sql tryp orm implementation
 */
export abstract class BaseCrudSQLTypeOrmDaoImpl<T> extends BaseSearchSQLTypeOrmDaoImpl<T> implements IBaseCrudDao<T>{

    /**
     * @override
     */
    async add(mapParams: {}, data: T): Promise<T> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async edit(mapParams: {}, data: T): Promise<T> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async delete(mapParams: {}, data: T): Promise<T> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async read(mapParams: {}, pkValue: any): Promise<T> {
        throw new Error("Method not implemented.");
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