import { Field } from "rfdataaccessts";
import { Filter } from "rfdataaccessts";
import { Join } from "rfdataaccessts";
import { Limit } from "rfdataaccessts";
import { Order } from "rfdataaccessts";

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