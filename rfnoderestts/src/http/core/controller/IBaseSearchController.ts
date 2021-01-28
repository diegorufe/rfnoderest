import { RequestBrowser } from "../../../dataaccess/beans/core/RequestBrowser";
import { ResponseBrowser } from "../../../dataaccess/beans/core/ResponseBrowser";
import { IBaseSearchDao } from "../../../dataaccess/dao/IBaseSearhDao";
import { IBaseSearchService } from "../../../dataaccess/service/IBaseSearchService";
import { RestRequestBody } from "../beans/RestRequestBody";
import { RestRequestResponse } from "../beans/RestRequestResponse";
import { IBaseController } from "./IBaseController";

/**
 * Interface base search controller
 */
export interface IBaseSearchController<T, DAO extends IBaseSearchDao<T>, SERVICE extends IBaseSearchService<T, DAO>> extends IBaseController {


    /**
     * Method for get service 
     */
    getService(): SERVICE;

    /**
     * Method for count data 
     * @param restRequestBody 
     */
    count(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<number>>;

    /**
     * Method for list data 
     * @param restRequestBody 
     */
    list(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T[]>>;

    /**
     * Method for browser request. Count and data
     * @param restRequestBody 
     */
    browser(restRequestBody: RestRequestBody<RequestBrowser>): Promise<RestRequestResponse<ResponseBrowser<T>>>;

}