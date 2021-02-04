import { RequestBrowser } from "rfdataaccessts";
import { ResponseBrowser } from "rfdataaccessts";
import { Limit } from "rfdataaccessts";
import { IBaseSearchDao } from "rfdataaccessts";
import { IBaseSearchService } from "rfdataaccessts";
import { RestRequestBody } from "../../beans/RestRequestBody";
import { RestRequestResponse } from "../../beans/RestRequestResponse";
import { IBaseSearchController } from "../IBAseSearchController";
import { BaseControllerImpl } from "./BaseControllerImpl";

/**
 * Base implementation search controller
 */
export abstract class BaseSearchControllerImpl<T, DAO extends IBaseSearchDao<T>, SERVICE extends IBaseSearchService<T, DAO>> extends BaseControllerImpl implements IBaseSearchController<T, DAO, SERVICE>{

    service: SERVICE;

    constructor(path: string, service: SERVICE) {
        super(path);
        this.service = service;
    }

    /**
     * @override
     */
    getService(): SERVICE {
        return this.service;
    }

    /**
     * @override
     */
    async count(mapParamsRequest: { [key: string]: any }, restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<number>> {
        const restRequestResponse: RestRequestResponse<number> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().count(restRequestBody.mapParams || {}, restRequestBody.filters || [], restRequestBody.joins || [], [])).data;
        return restRequestResponse;
    }

    /**
     * @override
     */
    async list(mapParamsRequest: { [key: string]: any }, restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T[]>> {
        const restRequestResponse: RestRequestResponse<T[]> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().list(restRequestBody.mapParams || {}, restRequestBody.fields || [], restRequestBody.filters || [], restRequestBody.joins || [], restRequestBody.orders || [], [], restRequestBody.limit || new Limit(0, 0))).data;
        return restRequestResponse;
    }

    /**
     * @override
     */
    async browser(mapParamsRequest: { [key: string]: any }, restRequestBody: RestRequestBody<RequestBrowser>): Promise<RestRequestResponse<ResponseBrowser<T>>> {
        const restRequestResponse: RestRequestResponse<ResponseBrowser<T>> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().browser(restRequestBody.mapParams || {}, restRequestBody.data || new RequestBrowser())).data;
        return restRequestResponse;
    }

}