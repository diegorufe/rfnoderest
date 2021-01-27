import { Field } from "../../../beans/query/Field";
import { Filter } from "../../../beans/query/Filter";
import { Group } from "../../../beans/query/Group";
import { Join } from "../../../beans/query/Join";
import { Limit } from "../../../beans/query/Limit";
import { Order } from "../../../beans/query/Order";
import { IBaseSearchDao } from "../../../dao/IBaseSearhDao";
import { IBaseSearchService } from "../../../service/IBaseSearchService";
import { Transactional } from "../../decorators/TransactionalDecorator";
import { EnumTransactionsTypes } from "../../../constants/transactions/EnumTransactionsTypes";
import { RequestBrowser } from "../../../beans/core/RequestBrowser";
import { ResponseBrowser } from "../../../beans/core/ResponseBrowser";
import { ParamBuildQuery } from "../../../beans/core/ParamBuildQuery";

/**
 * Base class implementation for service serach sql type orm
 */
export abstract class BaseSearchSQLTypeOrmServiceImpl<T, DAO extends IBaseSearchDao<T>> implements IBaseSearchService<T, DAO>{

    dao: DAO;

    /**
     * Constructor BaseSearchSQLTypeOrmServiceImpl 
     * @param dao for dataaccess
     */
    constructor(dao: DAO) {
        this.dao = dao;
    }


    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async list(mapParams: {}, collectionFields: Field[], collectionFilters: Filter[], collectionJoins: Join[], collectionOrders: Order[], collectionGroups: Group[], limit: Limit): Promise<T[]> {
        return await this.getDao().list(mapParams, collectionFields, collectionFilters, collectionJoins, collectionOrders, collectionGroups, limit);
    }

    /**
     * @override
     */
    @Transactional(EnumTransactionsTypes.REQUIRED)
    async count(mapParams: {}, collectionFilters: Filter[], collectionJoins: Join[], collectionGroups: Group[]): Promise<number> {
        return await this.getDao().count(mapParams, collectionFilters, collectionJoins, collectionGroups);
    }

    /**
     * Method for build params query count and list browser
     * @param requestBrowser 
     */
    private buildParamsQueryCountListAndBrowser(requestBrowser: RequestBrowser): ParamBuildQuery {
        const paramBuildQuery = new ParamBuildQuery();
        return paramBuildQuery;
    }

    /**
     * Method for calculate page
     * 
     * @param first        for calculate page
     * @param recordsPage  record page show in page
     * @param totalRecords for calculate number of pages
     * @return limit for page. Cant be null
     */
    private calculateLimitPage(first: number, recordsPage: number, totalRecords: number): Limit {
        let page: number = 0;

        const numberOfPages: number = Math.ceil(parseFloat("" + totalRecords) / parseFloat("" + recordsPage));

        if (first >= 0) {
            page = parseInt((Math.ceil(first / recordsPage) + 1) + "");
        }

        if (page > numberOfPages) {
            page = 1;
        }

        if (page < 1) {
            page = 1;
        }

        return new Limit((page - 1) * recordsPage, recordsPage);
    }

    @Transactional(EnumTransactionsTypes.REQUIRED)
    async browser(mapParams: {}, requestBrowser: RequestBrowser): Promise<ResponseBrowser<T>> {
        const responseBrowser: ResponseBrowser<T> = new ResponseBrowser();

        // Build params build query
        const paramsBuildQuery: ParamBuildQuery = this.buildParamsQueryCountListAndBrowser(requestBrowser);

        // Count data 
        responseBrowser.count = await this.count(mapParams, paramsBuildQuery.collectionFilters || [], paramsBuildQuery.collectionJoins || [], paramsBuildQuery.collectioGroups || []);

        // Find data if have records
        if (responseBrowser.count > 0) {
            responseBrowser.data = await this.list(mapParams, requestBrowser.fields || [], paramsBuildQuery.collectionFilters || [],
                paramsBuildQuery.collectionJoins || [], paramsBuildQuery.collectionOrders || [], paramsBuildQuery.collectioGroups || [],
                this.calculateLimitPage(requestBrowser.first || 0, requestBrowser.recordsPage || 0, responseBrowser.count));
        }


        return responseBrowser;
    }

    /**
     * @override
     */
    getDao(): DAO {
        return this.dao;
    }

    /**
     * @override
     */
    setDao(dao: DAO): void {
        this.dao = dao;
    }
}