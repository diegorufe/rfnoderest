import { RequestBrowser } from "../../../../dataaccess/beans/core/RequestBrowser";
import { ResponseBrowser } from "../../../../dataaccess/beans/core/ResponseBrowser";
import { Limit } from "../../../../dataaccess/beans/query/Limit";
import { IBaseSearchDao } from "../../../../dataaccess/dao/IBaseSearhDao";
import { IBaseSearchService } from "../../../../dataaccess/service/IBaseSearchService";
import { RestRequestBody } from "../../../core/beans/RestRequestBody";
import { RestRequestResponse } from "../../../core/beans/RestRequestResponse";
import { IBaseSearchController } from "../IBAseSearchController";
import { BaseControllerImpl } from "./BaseControllerImpl";

/**
 * Base implementation search controller
 */
export abstract class BaseSearchControllerImpl<T, DAO extends IBaseSearchDao<T>, SERVICE extends IBaseSearchService<T, DAO>> extends BaseControllerImpl implements IBaseSearchController<T, DAO, SERVICE>{

    service?: SERVICE;

    /**
     * @override
     */
    getService(): SERVICE {
        // Add service if is undefined
        if (this.service == undefined) {
            this.getServiceByName(this.getKeyService());
        }
        return this.service!;
    }

    /**
     * @override
     */
    getKeyService(): string {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async count(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<number>> {
        const restRequestResponse: RestRequestResponse<number> = new RestRequestResponse();
        restRequestResponse.data = await this.getService().count({}, restRequestBody.filters || [], restRequestBody.joins || [], []);
        return restRequestResponse;
    }

    /**
     * @override
     */
    async list(restRequestBody: RestRequestBody<T>): Promise<RestRequestResponse<T[]>> {
        const restRequestResponse: RestRequestResponse<T[]> = new RestRequestResponse();
        restRequestResponse.data = await this.getService().list({}, restRequestBody.fields || [], restRequestBody.filters || [], restRequestBody.joins || [], restRequestBody.orders || [], [], restRequestBody.limit || new Limit(0, 0));
        return restRequestResponse;
    }

    /**
     * @override
     */
    async browser(restRequestBody: RestRequestBody<RequestBrowser>): Promise<RestRequestResponse<ResponseBrowser<T>>> {
        const restRequestResponse: RestRequestResponse<ResponseBrowser<T>> = new RestRequestResponse();
        restRequestResponse.data = await this.getService().browser({}, restRequestBody.data || new RequestBrowser(), restRequestBody.mapParams || {});
        return restRequestResponse;
    }

}