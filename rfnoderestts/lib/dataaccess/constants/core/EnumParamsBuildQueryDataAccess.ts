
/**
 * Enum for define params pass map params build query data access
 */
export enum EnumParamsBuildQueryDataAccess {

    UNDEFINED = "",

    /**
     * Key for get transacction create when call service 
     */
    TRANSACTION = "TRANSACTION",

    /**
     * For get query builder. See TypeOrm QueryBuilder. In other type of orm queryBuilder are builder for store query. Example Select * from ....
     */
    QUERY_BUILDER = "QUERY_BUILDER",

}