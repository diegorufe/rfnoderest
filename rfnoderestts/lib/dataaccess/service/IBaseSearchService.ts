import { RequestBrowser } from "../beans/core/RequestBrowser";
import { ResponseBrowser } from "../beans/core/ResponseBrowser";
import { Field } from "../beans/query/Field";
import { Filter } from "../beans/query/Filter";
import { Group } from "../beans/query/Group";
import { Join } from "../beans/query/Join";
import { Limit } from "../beans/query/Limit";
import { Order } from "../beans/query/Order";
import { IBaseSearchDao } from "../dao/IBaseSearhDao";
import { IBaseService } from "./IBaseService";


/**
 * Base service for search
 */
export interface IBaseSearchService<T, DAO extends IBaseSearchDao<T>> extends IBaseService {

    /**
    * Method for list data 
    * 
    * @param mapParams         extra params apply for search dto
    * @param collectionFields  to set in DTO
    * @param collectionFilters apply for search DTO
    * @param collectionJoins   apply for search DTO
    * @param collectionOrders  apply for search DTO
    * @param collectionGroups  apply for search DTO
    * @param limit             to apply in query

    * @return list data 
    */
    list(mapParams: {}, collectionFields: Field[], collectionFilters: Filter[],
        collectionJoins: Join[], collectionOrders: Order[],
        collectionGroups: Group[], limit: Limit): Promise<T[]>

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
        collectionGroups: Group[]): Promise<number>

    /**
     * Method for browser operation
     * @param mapParams  extra params apply for count
     * @param requestBrowser data request browser
     * @param mapParamsRequest extra params request
     */
    browser(mapParams: {}, requestBrowser: RequestBrowser, mapParamsRequest: {}): Promise<ResponseBrowser<T>>;

    /**
     * Method for get dao
     * @returns dao
     */
    getDao(): DAO;

    /**
     * Method for set dao 
     * @param dao to set
     */
    setDao(dao: DAO): void;


}