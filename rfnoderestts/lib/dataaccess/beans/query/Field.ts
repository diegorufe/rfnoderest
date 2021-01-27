
/**
 * Class for get fields for query
 */
export class Field {


    name: string;
    aliasTable?: string;
    aliasField?: string;
    customField?: string;

    /**
     * Constructor class field only with name propertie
     * @param name for field
     */
    constructor(name: string);

    /**
     * Constructor field with all params 
     * @param name for field 
     * @param aliasTable  build query 
     */
    constructor(name: string, aliasTable?: string);

    /**
     * Constructor field with all params 
     * @param name for field 
     * @param aliasTable build query 
     * @param aliasField for get query 
     * @param customField indicates custom field for get query
     */
    constructor(name: string, aliasTable?: string, aliasField?: string, customField?: string) {
        this.name = name;
        this.aliasTable = aliasTable;
        this.aliasField = aliasField;
        this.customField = customField;
    }

}