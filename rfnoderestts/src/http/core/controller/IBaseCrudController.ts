import { IBaseCrudDao } from "../../../dataaccess/dao/IBaseCrudDao";
import { IBaseCrudService } from "../../../dataaccess/service/IBaseCrudService";
import { RestRequestBody } from "../beans/RestRequestBody";
import { RestRequestResponse } from "../beans/RestRequestResponse";
import { IBaseSearchController } from "./IBaseSearchController";

/**
 * Base interface for crud controllers
 */
export interface IBaseCrudController<T, DAO extends IBaseCrudDao<T>, SERVICE extends IBaseCrudService<T, DAO>> extends IBaseSearchController<T, DAO, SERVICE> {

    /**
     * Method for add data
     * @param restRequestBody 
     */
    add(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T>>;

    /**
     * Method for edit data
     * @param restRequestBody 
     */
    edit(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T>>;

    /**
    * Method for delete data
    * @param restRequestBody 
    */
    delete(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<boolean>>;

    /**
     * Method for create new instance
     * @param mapParams 
     */
    loadNew(mapParams: {}): Promise<RestRequestResponse<T>>;

    /**
     * Method for read data
     * @param restRequestBody 
     */
    read(restRequestBody: RestRequestBody<any>): Promise<RestRequestResponse<T>>;
}