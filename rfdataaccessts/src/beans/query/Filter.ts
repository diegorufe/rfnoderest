import { isNull } from "rfcorets";
import { EnumFilterOperationType } from "../../constants/query/EnumFilterOperationType";
import { EnumFilterTypes } from "../../constants/query/EnumFilterTypes";


/**
 * Class for apply filters for query
 */
export class Filter {

   
    filterType?: EnumFilterTypes = EnumFilterTypes.EQUAL;
    filterOperationType?: EnumFilterOperationType = EnumFilterOperationType.AND;
    field: string;
    alias?: string;
    value?: any;
    collecionFilters?: Filter[] = [];
    openBrackets?: number = 1;
    closeBrackets?: number = 1;

    /**
     * Constructor with field and value 
     * @param field to apply filter 
     * @param value value compare filter
     */
    constructor(field: string, value?: any);

    /**
     * Construcor with all parameters
     * @param field to apply filter 
     * @param value value compare filter
     * @param alias get field 
     * @param filterType condition filter. EQUAL, LIKE ...
     * @param filterOperationType operation. AND, OR ...
     * @param openBrackets number of open brackets 
     * @param closeBrackets number of closes brackets
     */
    constructor(field: string, value?: any, alias?: string, filterType?: EnumFilterTypes, filterOperationType?: EnumFilterOperationType, openBrackets?: number, closeBrackets?: number) {
        this.field = field;
        this.value = value;
        this.alias = alias;
        this.filterType = isNull(filterType) ? EnumFilterTypes.EQUAL : filterType;
        this.filterOperationType = isNull(filterOperationType) ? EnumFilterOperationType.AND : filterOperationType;
        this.alias = alias;
        this.openBrackets = openBrackets;
        this.closeBrackets = closeBrackets;
    }
}