
/**
 * Class for apply order in queries
 */
export class Order {

    orderType: EnumOrderTypes = EnumOrderTypes.ASC;
    field: string;
    alias?: string;

    /**
     * Constructor class Order 
     * @param field for order in query 
     * @param orderType tipe order. ASC, DESC ...
     */
    constructor(field: string, orderType: EnumOrderTypes);

    /**
     *  Constructor class Order 
     * @param field  for order in query 
     * @param orderType tipe order. ASC, DESC ...
     * @param alias for add to field. Can be null or undefined
     */
    constructor(field: string, orderType: EnumOrderTypes, alias?: string) {
        this.field = field;
        this.orderType = orderType;
        this.alias = alias;
    }
}