import { EnumJoinTypes } from "../../constants/query/EnumJoinTypes";

/**
 * Class for joinin queries
 */
export class Join {

    field: string;
    alias?: string;
    joinType: EnumJoinTypes = EnumJoinTypes.NNER_JOIN;
    customQueryJoin?: string;
    aliasJoinField?: string;

    /**
     * Constructor for join 
     * @param field for joining 
     * @param joinType inner, left ...
     */
    constructor(field: string, joinType: EnumJoinTypes);

    /**
     * Constructor for join 
     * @param field for joining 
     * @param joinType inner, left ...
     * @param alias for table join
     * @param customQueryJoin custom query join 
     * @param aliasJoinField alias join field
     */
    constructor(field: string, joinType: EnumJoinTypes, alias?: string, customQueryJoin?: string, aliasJoinField?: string) {
        this.field = field;
        this.joinType = joinType;
        this.alias = alias;
        this.customQueryJoin = customQueryJoin;
        this.aliasJoinField = aliasJoinField;
    }
}