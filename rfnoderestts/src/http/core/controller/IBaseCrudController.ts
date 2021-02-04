import { IBaseCrudDao } from "rfdataaccessts";
import { IBaseCrudService } from "rfdataaccessts";
import { RestRequestBody } from "../beans/RestRequestBody";
import { RestRequestResponse } from "../beans/RestRequestResponse";
import { IBaseSearchController } from "./IBaseSearchController";

/**
 * Base interface for crud controllers
 */
export interface IBaseCrudController<T, DAO extends IBaseCrudDao<T>, SERVICE extends IBaseCrudService<T, DAO>> extends IBaseSearchController<T, DAO, SERVICE> {

    /**
     * Method for add data
     * @param mapParamsRequest
     * @param restRequestBody 
     */
    add(mapParamsRequest: { [key: string]: any }, restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T>>;

    /**
     * Method for edit data
     * @param mapParamsRequest
     * @param restRequestBody 
     */
    edit(mapParamsRequest: { [key: string]: any }, restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T>>;

    /**
    * Method for delete data
    * @param mapParamsRequest
    * @param restRequestBody 
    */
    delete(mapParamsRequest: { [key: string]: any }, restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<boolean>>;

    /**
     * Method for create new instance
     * @param mapParamsRequest
     * @param mapParams 
     */
    loadNew(mapParamsRequest: { [key: string]: any }, mapParams: {}): Promise<RestRequestResponse<T>>;

    /**
     * Method for read data
     * @param mapParamsRequest
     * @param restRequestBody 
     */
    read(mapParamsRequest: { [key: string]: any }, restRequestBody: RestRequestBody<any>): Promise<RestRequestResponse<T>>;
}