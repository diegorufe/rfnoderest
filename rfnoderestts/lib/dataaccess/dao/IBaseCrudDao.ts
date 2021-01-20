import { Join } from "../beans/query/Join";
import { IBaseSearchDao } from "./IBaseSearhDao";


/**
 * Base dao for crud
 */
export interface IBaseCrudDao<T> {

    /**
     * Method for add data
     * 
     * @param data to add
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @return data added
     */
    add(data: T, mapParams: {}): T;

    /**
     * Method for edit data
     * 
     * @param data to edit
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @return data edited
     */
    edit(data: T, mapParams: {}): T;

    /**
     * Remove data
     * 
     * @param data to remove
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     */
    delete(data: T, mapParams: {}): T;

    /**
     * Method for read value with pk
     * 
     * @param pkValue for read
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @return data
     */
    read(pkValue: any, mapParams: {}): T;

    /**
     * Method by find by pk
     * 
     * @param pkValue         to find entity
     * @param collectionJoins for entity
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @return data find by pk
     */
    findByPk(pkValue: any, collectionJoins: Join[] | undefined | null, mapParams: {}): T;

    /**
     * Method for generate new instace data
     * 
     * @param mapParams is a map for params send to method, example builder,
     *                          constants ...
     * @return instace data
     */
    newInstace(mapParams: {}): T;
}