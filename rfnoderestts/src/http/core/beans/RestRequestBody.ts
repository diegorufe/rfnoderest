import { Field } from "../../../dataaccess/beans/query/Field";
import { Filter } from "../../../dataaccess/beans/query/Filter";
import { Join } from "../../../dataaccess/beans/query/Join";
import { Limit } from "../../../dataaccess/beans/query/Limit";
import { Order } from "../../../dataaccess/beans/query/Order";

/**
 * Request body
 */
export class RestRequestBody<T>{

    data?: T;
    limit?: Limit;
    fields?: Field[];
    joins?: Join[];
    orders?: Order[];
    filters?: Filter[];
    mapParams?: {};

    constructor() { }
}