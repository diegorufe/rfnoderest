import { getConnection } from "typeorm";
import { Transaction } from "../beans/transactions/Transaction";
import { EnumParamsBuildQueryDataAccess } from "../constants/core/EnumParamsBuildQueryDataAccess";

/**
 * Method for create transaction. By the moment only works with typeOrm
 */
export function createTransaction(): Transaction {
    const trasanction: Transaction = new Transaction();

    // Type orm 
    // https://typeorm.io/#/transactions
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    trasanction.connection = connection;
    trasanction.queryRunner = queryRunner;

    return trasanction;
}

/**
 * Function for create query builder from transaction
 * @param transaction 
 */
export function createQueryBuilderFromTransaction(transaction: Transaction) {
    return transaction.queryRunner.manager.createQueryBuilder();
}

/**
 * Function for create enity manager from transaction
 * @param transaction 
 */
export function createEntityManagerrFromTransaction(transaction: Transaction) {
    return transaction.queryRunner.manager;
}

/**
 * Method for find transaction in map params
 * @param mapParams for find transaction
 */
export function findTransactionMapParams(mapParams: { [key: string]: any }): Transaction {
    return <Transaction>mapParams[EnumParamsBuildQueryDataAccess.TRANSACTION];
}

/**
 * Method for find query builder map params 
 * @param mapParams for find query builder
 */
export function findQueryBuilderMapParams(mapParams: { [key: string]: any }) {
    return mapParams[EnumParamsBuildQueryDataAccess.QUERY_BUILDER];
}

/**
 * Method for put query builder in mapParams
 * @param mapParams for find query builder
 * @param queryBuilder query buidler to set
 */
export function putQueryBuilderMapParams(mapParams: { [key: string]: any }, queryBuilder: any) {
    mapParams[EnumParamsBuildQueryDataAccess.QUERY_BUILDER] = queryBuilder;
}

/**
 * Method for find entity manager map params 
 * @param mapParams for find entity manager
 */
export function findEntityManagerMapParams(mapParams: { [key: string]: any }) {
    return mapParams[EnumParamsBuildQueryDataAccess.ENTITY_MANAGER];
}