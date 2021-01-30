import { IBaseCrudDao } from "rfdataaccessts";
import { IBaseCrudService } from "rfdataaccessts";
import { RestRequestBody } from "../../beans/RestRequestBody";
import { RestRequestResponse } from "../../beans/RestRequestResponse";
import { EnumHttpStatus } from "../../constants/EnumHttpStatus";
import { IBaseCrudController } from "../IBaseCrudController";
import { BaseSearchControllerImpl } from "./BaseSearchControllerImpl";

/**
 * Base class implementation base crud controller
 */
export abstract class BaseCrudControllerImpl<T, DAO extends IBaseCrudDao<T>, SERVICE extends IBaseCrudService<T, DAO>> extends BaseSearchControllerImpl<T, DAO, SERVICE> implements IBaseCrudController<T, DAO, SERVICE> {

    constructor(path: string, service: SERVICE) {
        super(path, service);
    }

    /**
     * @override
     */
    async add(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T>> {
        const restRequestResponse: RestRequestResponse<T> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().add(restRequestBody.mapParams || {}, restRequestBody.data!)).data;
        restRequestResponse.httpStaus = EnumHttpStatus.CREATED;
        return restRequestResponse;
    }

    /**
     * @override
     */
    async edit(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T>> {
        const restRequestResponse: RestRequestResponse<T> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().edit(restRequestBody.mapParams || {}, restRequestBody.data!)).data;
        return restRequestResponse;
    }

    /**
     * @override
     */
    async delete(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<boolean>> {
        const restRequestResponse: RestRequestResponse<boolean> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().delete(restRequestBody.mapParams || {}, restRequestBody.data!)).data;
        return restRequestResponse;
    }


    /**
     * @override
     */
    async loadNew(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T>> {
        const restRequestResponse: RestRequestResponse<T> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().loadNew(restRequestBody.mapParams || {})).data;
        return restRequestResponse;
    }

    /**
     * @override
     */
    async read(restRequestBody: RestRequestBody<any>): Promise<RestRequestResponse<T>> {
        const restRequestResponse: RestRequestResponse<T> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().read(restRequestBody.mapParams || {}, restRequestBody.data!)).data;
        return restRequestResponse;
    }

}