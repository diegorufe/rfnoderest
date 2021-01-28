import { Field } from "../query/Field";
import { Filter } from "../query/Filter";
import { Group } from "../query/Group";
import { Join } from "../query/Join";
import { Order } from "../query/Order";

/**
 * Bean for get request browser operations
 */
export class RequestBrowser {

    fields?: Field[];
    joins?: Join[];
    orders?: Order[];
    filters?: Filter[];
    groups?: Group[];
    first?: number;
    recordsPage?: number;
    mapParams?: {};

    constructor() {

    }
}