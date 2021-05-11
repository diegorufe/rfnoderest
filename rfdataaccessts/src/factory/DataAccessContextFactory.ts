import { isNull } from "rfcorets";
import { getConnection } from "typeorm";

/**
 * Data acess context factory
 */
class DataAccessContextFactory {

    functionGetConnectionTypeORM: any = null;

    constructor() {

    }

    /**
     * Method for get connection type orm
     * @returns 
     */
    getConnectionTypeORM() {
        return isNull(this.functionGetConnectionTypeORM) ? getConnection() : this.functionGetConnectionTypeORM();
    }

    /**
     * Method for set function get connection type omr
     * @param fn 
     */
    setFunctionGetConnectionTypeORM(fn: any) {
        this.functionGetConnectionTypeORM = fn;
    }
}

export const DATA_ACESS_CONTEXT_FACTORY = new DataAccessContextFactory();