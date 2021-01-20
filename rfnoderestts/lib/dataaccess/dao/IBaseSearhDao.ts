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
    applySelect(mapParams: {}): void;

    /**
     * Method for apply from
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                  constants ...
     */
    applyFrom(mapParams: {}): void;

    /**
     * Method for apply where
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                  constants ...
     */
    applyWhere(mapParams: {}): void;

    /**
     * Methods for apply filters query
     * @param collectionFilters to apply
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     */
    applyFilters(collectionFilters: Filter[] | undefined | null, mapParams: {}): void;

    /**
     * Methods for apply joins query
     * 
     * @param collectionJoins to apply
     * @param mapParams       is a map for params send to method, example builder,
     *                        constants ...
     */
    applyJoins(collectionJoins: Join[] | undefined | null, mapParams: {}): void;

    /**
     * Methods for apply orders query
     * 
     * @param collectionOrders to apply
     * @param mapParams
     */
    applyOrders(collectionOrders: Order[] | undefined | null, mapParams: {}): void;

    /**
     * Methods for apply groups query
     * 
     * @param collectionGroups to apply
     * @param mapParams        is a map for params send to method, example builder,
     *                         constants ...
     */
    applyGroups(collectionGroups: Group[] | undefined | null, mapParams: {}): void;

    /**
     * Methods for apply fields query
     * 
     * @param collectionFields to apply
     * @param mapParams        is a map for params send to method, example builder,
     *                         constants ...
     */
    applyFields(collectionFields: Field[] | undefined | null, mapParams: {}): void;

    /**
     * Method for list data dao
     * 
     * @param collectionFields  to set in DTO
     * @param collectionFilters apply for search DTO
     * @param collectionJoins   apply for search DTO
     * @param collectionOrders  apply for search DTO
     * @param collectionGroups  apply for search DTO
     * @param limit             to apply in query
     * @param mapParams         extra params apply for search dto
     * @return list data dao
     */
    list(collectionFields: Field[], collectionFilters: Filter[],
        collectionJoins: Join[], collectionOrders: Order[],
        collectionGroups: Group[], limit: Limit, mapParams: {}): T[]

    /**
     * Method for count
     * 
     * @param collectionFilters apply for search data
     * @param collectionJoins   apply for search data
     * @param collectionGroups  apply for search data
     * @param mapParams         extra params apply for count
     * @return count
     */
    count(collectionFilters: Filter[],
        collectionJoins: Join[],
        collectionGroups: Group[], limit: Limit, mapParams: {}): number

}