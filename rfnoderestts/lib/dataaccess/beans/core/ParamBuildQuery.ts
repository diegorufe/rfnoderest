import { Filter } from "../query/Filter";
import { Group } from "../query/Group";
import { Join } from "../query/Join";
import { Order } from "../query/Order";

/**
 * Class for set beans to build query
 */
export class ParamBuildQuery {

    collectionFilters?: Filter[];
    collectionJoins?: Join[];
    collectionOrders?: Order[];
    collectioGroups?: Group[];

    constructor() {

    }
}