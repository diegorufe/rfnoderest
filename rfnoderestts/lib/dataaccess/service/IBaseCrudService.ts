import { Field } from "../beans/query/Field";
import { Filter } from "../beans/query/Filter";
import { Group } from "../beans/query/Group";
import { Join } from "../beans/query/Join";
import { Limit } from "../beans/query/Limit";
import { Order } from "../beans/query/Order";
import { IBaseCrudDao } from "../dao/IBaseCrudDao";
import { IBaseSearchDao } from "../dao/IBaseSearhDao";
import { IBaseSearchService } from "./IBaseSearchService";


/**
 * Base service for crud
 */
export interface IBaseCrudService<T, DAO extends IBaseCrudDao<T>> extends IBaseSearchService<T, DAO> {

    /**
    * Method for add data
    * 
    * @param mapParams is a map for params send to method, example builder,
    *                          constants ...
    * @param data to add
    * @return data added
    */
    add(mapParams: {}, data: T): Promise<T>;

    /**
     * Method for edit data
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @param data to edit
     * @return data edited
     */
    edit(mapParams: {}, data: T): Promise<T>;

    /**
     * Remove data
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @param data to remove
     */
    delete(mapParams: {}, data: T): Promise<boolean>;

    /**
     * Method for read value with pk
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @param pkValue for read
     * @return data
     */
    read(mapParams: {}, pkValue: any): Promise<T | undefined>;

    /**
    * Method by find by pk
    * 
    * @param mapParams is a map for params send to method, example builder,
    *                          constants ...
    * @param pkValue         to find entity
    * @param collectionJoins for entity
    * @return data find by pk
    */
    findByPk(mapParams: {}, pkValue: any, collectionJoins: Join[]): Promise<T | undefined>;

    /**
     * Method for generate new instace data
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @return instace data
     */
    loadNew(mapParams: {}): Promise<T>;
}