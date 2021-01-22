import { Field } from "../../../beans/query/Field";
import { Filter } from "../../../beans/query/Filter";
import { Group } from "../../../beans/query/Group";
import { Join } from "../../../beans/query/Join";
import { Limit } from "../../../beans/query/Limit";
import { Order } from "../../../beans/query/Order";
import { IBaseSearchDao } from "../../../dao/IBaseSearhDao";

/**
 * Base search dao implementantion for type orm
 */
export abstract class BaseSearchTypeOrmDaoImpl<T> implements IBaseSearchDao<T>{
    applySelect(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    applyFrom(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    applyWhere(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    applyFilters(mapParams: {}, collectionFilters: Filter[] | null | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    applyJoins(mapParams: {}, collectionJoins: Join[] | null | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    applyOrders(mapParams: {}, collectionOrders: Order[] | null | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    applyGroups(mapParams: {}, collectionGroups: Group[] | null | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    applyFields(mapParams: {}, collectionFields: Field[] | null | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    list(mapParams: {}, collectionFields: Field[], collectionFilters: Filter[], collectionJoins: Join[], collectionOrders: Order[], collectionGroups: Group[], limit: Limit): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    count(mapParams: {}, collectionFilters: Filter[], collectionJoins: Join[], collectionGroups: Group[], limit: Limit): Promise<number> {
        throw new Error("Method not implemented.");
    }
   

}