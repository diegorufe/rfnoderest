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
    async applySelect(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async applyFrom(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async applyWhere(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async applyFilters(collectionFilters: Filter[] | null | undefined, mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async applyJoins(collectionJoins: Join[] | null | undefined, mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async applyOrders(collectionOrders: Order[] | null | undefined, mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async applyGroups(collectionGroups: Group[] | null | undefined, mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async applyFields(collectionFields: Field[] | null | undefined, mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async list(collectionFields: Field[], collectionFilters: Filter[], collectionJoins: Join[], collectionOrders: Order[], collectionGroups: Group[], limit: Limit, mapParams: {}): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    async count(collectionFilters: Filter[], collectionJoins: Join[], collectionGroups: Group[], limit: Limit, mapParams: {}): Promise<number> {
        throw new Error("Method not implemented.");
    }

}