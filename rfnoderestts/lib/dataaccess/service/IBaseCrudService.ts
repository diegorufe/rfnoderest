import { ResponseService } from "../beans/core/ResponseService";
import { Join } from "../beans/query/Join";
import { IBaseCrudDao } from "../dao/IBaseCrudDao";
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
    add(mapParams: {}, data: T): Promise<ResponseService<T>>;

    /**
     * Method for edit data
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @param data to edit
     * @return data edited
     */
    edit(mapParams: {}, data: T): Promise<ResponseService<T>>;

    /**
     * Remove data
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @param data to remove
     */
    delete(mapParams: {}, data: T): Promise<ResponseService<boolean>>;

    /**
     * Method for read value with pk
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @param pkValue for read
     * @return data
     */
    read(mapParams: {}, pkValue: any): Promise<ResponseService<T | undefined>>;

    /**
    * Method by find by pk
    * 
    * @param mapParams is a map for params send to method, example builder,
    *                          constants ...
    * @param pkValue         to find entity
    * @param collectionJoins for entity
    * @return data find by pk
    */
    findByPk(mapParams: {}, pkValue: any, collectionJoins: Join[]): Promise<ResponseService<T | undefined>>;

    /**
     * Method for generate new instace data
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @return instace data
     */
    loadNew(mapParams: {}): Promise<ResponseService<T>>;
}