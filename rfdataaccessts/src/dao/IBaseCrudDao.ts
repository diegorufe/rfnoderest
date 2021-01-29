import { Join } from "../beans/query/Join";
import { IBaseSearchDao } from "./IBaseSearhDao";


/**
 * Base dao for crud
 */
export interface IBaseCrudDao<T> extends IBaseSearchDao<T> {

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
    * Method for get pk filed name
    * @returns field pk name
    */
    getPKFieldName(): string;
}