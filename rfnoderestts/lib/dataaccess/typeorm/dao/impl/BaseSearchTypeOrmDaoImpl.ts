import { isArrayNotEmpty } from "../../../../core/utils/UtilsCommons";
import { isNotEmpty } from "../../../../core/utils/UtilsString";
import { Field } from "../../../beans/query/Field";
import { Filter } from "../../../beans/query/Filter";
import { Group } from "../../../beans/query/Group";
import { Join } from "../../../beans/query/Join";
import { Limit } from "../../../beans/query/Limit";
import { Order } from "../../../beans/query/Order";
import { Transaction } from "../../../beans/transactions/Transaction";
import { IBaseSearchDao } from "../../../dao/IBaseSearhDao";
import { createQueryBuilderFromTransaction, findTransactionMapParams, findQueryBuilderMapParams, putQueryBuilderMapParams } from "../../../utils/UtilsTransactions";

/**
 * Base search dao implementantion for type orm
 */
export abstract class BaseSearchTypeOrmDaoImpl<T> implements IBaseSearchDao<T>{

    /**
     * Method for create query builder and put in map params 
     * @param transaction for create query builder
     * @param mapParams for put query builder
     */
    createQueryBuilderAndPutInMapParams(mapParams: { [key: string]: any }) {
        // Create query build and put in map params
        mapParams[EnumParamsBuildQueryDataAccess.QUERY_BUILDER] = createQueryBuilderFromTransaction(findTransactionMapParams(mapParams));
    }

    /**
     * @override
     */
    async applySelect(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async applyFields(mapParams: {}, collectionFields: Field[]): Promise<void> {
        const arrayFieldsSelect: string[] = [];

        // Fields pass to method 
        if (isArrayNotEmpty(collectionFields)) {
            collectionFields.forEach(field => {
                let builder = "";

            });
        } else {
            // All fiedls 
            // TODO
        }

        // Select fields adn put in map params 
        putQueryBuilderMapParams(mapParams, findQueryBuilderMapParams(mapParams).select(arrayFieldsSelect));
    }

    /**
     * @override
     */
    async applyFrom(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async applyWhere(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async applyFilters(mapParams: {}, collectionFilters: Filter[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async applyJoins(mapParams: {}, collectionJoins: Join[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async applyGroups(mapParams: {}, collectionGroups: Group[]): Promise<void> {

    }

    /**
     * @override
     */
    async applyOrders(mapParams: {}, collectionOrders: Order[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async applyLimit(mapParams: {}, limit: Limit): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async list(mapParams: {}, collectionFields: Field[], collectionFilters: Filter[], collectionJoins: Join[], collectionOrders: Order[], collectionGroups: Group[], limit: Limit): Promise<T[]> {
        // create query builder and punt in map params
        this.createQueryBuilderAndPutInMapParams(mapParams);
        // Apply fields
        await this.applyFields(mapParams, collectionFields);
        // Apply from
        await this.applyFrom(mapParams);
        // Apply joins
        await this.applyJoins(mapParams, collectionJoins);
        // Apply filters
        await this.applyFilters(mapParams, collectionFilters);
        // Apply groups 
        await this.applyGroups(mapParams, collectionGroups);
        // Apply limit
        await this.applyLimit(mapParams, limit);

        // List data
        const data: T[] = findQueryBuilderMapParams(mapParams).getMany();

        return data;
    }

    async count(mapParams: {}, collectionFilters: Filter[], collectionJoins: Join[], collectionGroups: Group[], limit: Limit): Promise<number> {
        throw new Error("Method not implemented.");
    }


    getTableNameBuildORM(): string {
        throw new Error("Method not implemented.");
    }

}