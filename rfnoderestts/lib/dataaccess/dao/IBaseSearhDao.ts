import { Field } from "../beans/query/Field";
import { Filter } from "../beans/query/Filter";
import { Group } from "../beans/query/Group";
import { Join } from "../beans/query/Join";
import { Limit } from "../beans/query/Limit";
import { Order } from "../beans/query/Order";

/**
 * Base dao for search
 */
export interface IBaseSearchDao<T> {

    /**
     * Method for apply select
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                  constants ...
     */
    applySelect(mapParams: {}): Promise<void>;

    /**
     * Method for apply from
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                  constants ...
     */
    applyFrom(mapParams: {}): Promise<void>;

    /**
     * Method for apply where
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                  constants ...
     */
    applyWhere(mapParams: {}): Promise<void>;

    /**
     * Methods for apply filters query
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @param collectionFilters to apply
     */
    applyFilters(mapParams: {}, collectionFilters: Filter[]): Promise<void>;

    /**
     * Methods for apply joins query
     * 
     * @param mapParams       is a map for params send to method, example builder,
     *                        constants ...
     * @param collectionJoins to apply
     */
    applyJoins(mapParams: {}, collectionJoins: Join[]): Promise<void>;

    /**
     * Methods for apply orders query
     * 
     * @param mapParams
     * @param collectionOrders to apply
     * 
     */
    applyOrders(mapParams: {}, collectionOrders: Order[]): Promise<void>;

    /**
     * Methods for apply groups query
     * 
     * @param mapParams        is a map for params send to method, example builder,
     *                         constants ...
     * @param collectionGroups to apply
     */
    applyGroups(mapParams: {}, collectionGroups: Group[]): Promise<void>;

    /**
     * Methods for apply fields query
     * 
     * @param mapParams        is a map for params send to method, example builder,
     *                         constants ...
     * @param collectionFields to apply
     * 
     */
    applyFields(mapParams: {}, collectionFields: Field[]): Promise<void>;

    /**
     * Method for apply limit
     * @param mapParams        is a map for params send to method, example builder,
     *                         constants ...
     * @param limit to apply
     */
    applyLimit(mapParams: {}, limit: Limit): Promise<void>;

    /**
     * Method for list data dao
     * 
     * @param mapParams         extra params apply for search dto
     * @param collectionFields  to set in DTO
     * @param collectionFilters apply for search DTO
     * @param collectionJoins   apply for search DTO
     * @param collectionOrders  apply for search DTO
     * @param collectionGroups  apply for search DTO
     * @param limit             to apply in query

     * @return list data dao
     */
    list(mapParams: {}, collectionFields: Field[], collectionFilters: Filter[],
        collectionJoins: Join[], collectionOrders: Order[],
        collectionGroups: Group[], limit: Limit,): Promise<T[]>

    /**
     * Method for count
     * 
     * @param mapParams         extra params apply for count
     * @param collectionFilters apply for search data
     * @param collectionJoins   apply for search data
     * @param collectionGroups  apply for search data
     * @return count
     */
    count(mapParams: {}, collectionFilters: Filter[],
        collectionJoins: Join[],
        collectionGroups: Group[], limit: Limit): Promise<number>


    /**
     * Method for get table name for buld queries orm
     * @returns table name build orms
     */
    getTableNameBuildORM(): string;

}