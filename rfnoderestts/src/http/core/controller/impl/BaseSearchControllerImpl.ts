import { RequestBrowser } from "../../../../dataaccess/beans/core/RequestBrowser";
import { ResponseBrowser } from "../../../../dataaccess/beans/core/ResponseBrowser";
import { Limit } from "../../../../dataaccess/beans/query/Limit";
import { IBaseSearchDao } from "../../../../dataaccess/dao/IBaseSearhDao";
import { IBaseSearchService } from "../../../../dataaccess/service/IBaseSearchService";
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
    async count(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<number>> {
        const restRequestResponse: RestRequestResponse<number> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().count(restRequestBody.mapParams || {}, restRequestBody.filters || [], restRequestBody.joins || [], [])).data;
        return restRequestResponse;
    }

    /**
     * @override
     */
    async list(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T[]>> {
        const restRequestResponse: RestRequestResponse<T[]> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().list(restRequestBody.mapParams || {}, restRequestBody.fields || [], restRequestBody.filters || [], restRequestBody.joins || [], restRequestBody.orders || [], [], restRequestBody.limit || new Limit(0, 0))).data;
        return restRequestResponse;
    }

    /**
     * @override
     */
    async browser(restRequestBody: RestRequestBody<RequestBrowser>): Promise<RestRequestResponse<ResponseBrowser<T>>> {
        const restRequestResponse: RestRequestResponse<ResponseBrowser<T>> = new RestRequestResponse();
        restRequestResponse.data = (await this.getService().browser(restRequestBody.mapParams || {}, restRequestBody.data || new RequestBrowser())).data;
        return restRequestResponse;
    }

}