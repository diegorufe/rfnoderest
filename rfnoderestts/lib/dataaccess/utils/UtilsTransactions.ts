import { getConnection } from "typeorm";
import { Transaction } from "../beans/transactions/Transaction";

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