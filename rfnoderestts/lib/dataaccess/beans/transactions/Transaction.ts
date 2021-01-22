
/**
 * Class for store information and utilties for transaction
 * By the moment only works for typeorm
 */
export class Transaction {

    connection?: any;

    /**
     * For type orm 
     * https://typeorm.io/#/transactions
     */
    queryRunner?: any;

    /**
     * Method for start transaction 
     */
    async stratTransaction(): Promise<void> {
        // establish real database connection using our new query runner
        await this.queryRunner.connect();

        // lets now open a new transaction:
        await this.queryRunner.startTransaction();
    }

    /**
     * Method for commit transaction. Mysql, oracle ....
     */
    async commitTransaction(): Promise<void> {
        // commit transaction now:
        await this.queryRunner.commitTransaction();
    }

    /**
    * Method for roolback transaction. Mysql, oracle ....
    */
    async rollbackTransaction(): Promise<void> {

        // since we have errors let's rollback changes we made
        await this.queryRunner.rollbackTransaction();
    }

    /**
     * Method for relase create transaction
     */
    async release(): Promise<void> {

        // you need to release query runner which is manually created:
        await this.queryRunner.release();
    }
}