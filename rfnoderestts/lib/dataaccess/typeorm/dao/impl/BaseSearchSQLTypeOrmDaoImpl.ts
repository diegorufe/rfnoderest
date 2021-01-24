import { isArrayEmpty, isArrayNotEmpty, isNull } from "../../../../core/utils/UtilsCommons";
import { DOT, isNotEmpty, SPACE, COMA, uniqueId, TWO_POINTS, EMPTY } from "../../../../core/utils/UtilsString";
import { Field } from "../../../beans/query/Field";
import { Filter } from "../../../beans/query/Filter";
import { Group } from "../../../beans/query/Group";
import { Join } from "../../../beans/query/Join";
import { Limit } from "../../../beans/query/Limit";
import { Order } from "../../../beans/query/Order";
import { DEFAULT_ALIAS_TABLE_QUERY, OPEN_BRACKET, CLOSE_BRACKET } from "../../../constants/core/ConstantsDataAccess";
import { IBaseSearchDao } from "../../../dao/IBaseSearhDao";
import { createQueryBuilderFromTransaction, findTransactionMapParams, findQueryBuilderMapParams, putQueryBuilderMapParams } from "../../../utils/UtilsTransactions";
import { EnumFilterOperationType } from '../../../constants/query/EnumFilterOperationType';
import { EnumFilterTypes } from '../../../constants/query/EnumFilterTypes';
import { EnumJoinTypes } from '../../../constants/query/EnumJoinTypes';
import { EnumParamsBuildQueryDataAccess } from "../../../constants/core/EnumParamsBuildQueryDataAccess";

/**
 * Base search SQL dao implementantion for type orm
 */
export abstract class BaseSearchSQLTypeOrmDaoImpl<T> implements IBaseSearchDao<T>{

    /**
     * Method for create query builder and put in map params 
     * @param transaction for create query builder
     * @param mapParams for put query builder
     */
    createQueryBuilderAndPutInMapParams(mapParams: { [key: string]: any }) {
        // Create query build and put in map params
        mapParams[EnumParamsBuildQueryDataAccess.QUERY_BUILDER] = createQueryBuilderFromTransaction(findTransactionMapParams(mapParams));
    }

    /**
     * Method for remove query builder map params 
     * @param mapParams for remove query builder
     */
    removeQueryBuilderMapParams(mapParams: { [key: string]: any }) {
        // Create query build and put in map params
        mapParams[EnumParamsBuildQueryDataAccess.QUERY_BUILDER] = undefined;
    }

    /**
     * @override
     */
    async applySelect(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async applyFields(mapParams: {}, collectionFields: Field[]): Promise<void> {
        const arrayFieldsSelect: string[] = [];

        // Fields pass to method 
        if (isArrayNotEmpty(collectionFields)) {
            let first: boolean = true;

            for (let field of collectionFields) {
                let builder = SPACE;

                // Add coma separatr
                if (!first) {
                    builder = builder + COMA;
                }

                // Set first to false
                first = false;

                // Custom field 
                if (field.customField != undefined && isNotEmpty(field.customField)) {

                    builder = builder + field.customField;

                    // Normal case
                } else {

                    // Check field has alias table
                    if (field.aliasTable != undefined && isNotEmpty(field.aliasTable)) {
                        builder = builder + field.aliasTable;
                    } else {
                        builder = builder + DEFAULT_ALIAS_TABLE_QUERY;
                    }

                    // Add name field
                    builder = builder + DOT + field.name + SPACE;

                    // Check alias field
                    if (field.aliasField != undefined && isNotEmpty(field.aliasField)) {
                        builder = builder + SPACE + field.aliasField;
                    } else {
                        builder = builder + SPACE + field.name;
                    }

                }

                builder = builder + SPACE;

                arrayFieldsSelect.push(builder);

            }
        } else {
            // All fiedls 
            arrayFieldsSelect.push(DEFAULT_ALIAS_TABLE_QUERY);
        }

        // Select fields and put in map params 
        putQueryBuilderMapParams(mapParams, findQueryBuilderMapParams(mapParams).select(arrayFieldsSelect));
    }

    /**
     * @override
     */
    async applyFrom(mapParams: {}): Promise<void> {
        putQueryBuilderMapParams(mapParams, findQueryBuilderMapParams(mapParams).from(this.getTableNameBuildORM(), DEFAULT_ALIAS_TABLE_QUERY));
    }

    /**
     * @override
     */
    async applyWhere(mapParams: {}): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * @override
     */
    async applyFilters(mapParams: {}, collectionFilters: Filter[], firstLevel: boolean): Promise<{}> {
        const mapParamsApplyFilters: { [key: string]: any } = {};
        if (isArrayNotEmpty(collectionFilters)) {

            // Map params apply filters
            const starIdParam = uniqueId();
            let counterParam = 0;
            let first: boolean = true;
            let builder = SPACE;

            for (let filter of collectionFilters) {

                // Dont have value or collection filters
                if ((filter.value == undefined || isNull(filter.value)) && isArrayEmpty(filter.collecionFilters)) {
                    continue;
                }

                const filterOperationType = filter.filterOperationType == undefined ? EnumFilterOperationType.AND : filter.filterOperationType;
                const filterType = filter.filterType == undefined ? EnumFilterTypes.EQUAL : filter.filterType;

                // Add ilter operation type and/or
                if (!first) {
                    builder = SPACE;

                    switch (filterOperationType) {
                        case EnumFilterOperationType.AND:
                            builder = builder + EnumFilterOperationType.AND;
                            break;

                        case EnumFilterOperationType.OR:
                            builder = builder + EnumFilterOperationType.OR;
                            break;

                    }
                }

                // Set first to false
                first = false;


                // Normal case dont have collection filters
                if (isArrayEmpty(filter.collecionFilters)) {

                    // open brackets 
                    const openBrackets = filter.openBrackets == undefined || filter.openBrackets < 0 ? 1 : filter.openBrackets;

                    for (let i = 0; i < openBrackets; i++) {
                        builder = builder + SPACE + OPEN_BRACKET;
                    }

                    // Alias for filter
                    if (filter.alias != undefined && isNotEmpty(filter.alias)) {
                        builder = builder + SPACE + filter.alias + DOT + filter.field;
                    } else {
                        builder = builder + SPACE + DEFAULT_ALIAS_TABLE_QUERY + DOT + filter.field;
                    }

                    builder = builder + SPACE;

                    // Filter type
                    switch (filterType) {
                        case EnumFilterTypes.EQUAL:
                            builder = builder + SPACE + EnumFilterTypes.EQUAL;
                            break;

                        case EnumFilterTypes.LIKE:
                            builder = builder + SPACE + EnumFilterTypes.LIKE;
                            break;

                        // TODO all types
                    }

                    // Value
                    counterParam = counterParam + 1;
                    const keyParam = starIdParam + counterParam;

                    // Add value 
                    mapParamsApplyFilters[keyParam] = filter.value;

                    builder = builder + SPACE + TWO_POINTS + keyParam;

                    // close brackets 
                    const closeBrackets = filter.closeBrackets == undefined || filter.closeBrackets < 0 ? 1 : filter.closeBrackets;

                    for (let i = 0; i < closeBrackets; i++) {
                        builder = builder + SPACE + CLOSE_BRACKET;
                    }
                } else {

                    // TODO apply collection filters
                }

            }

            // If fist level apply query and params. Else if call this method from this
            if (firstLevel) {
                let queryBuiler = findQueryBuilderMapParams(mapParams);
                queryBuiler = queryBuiler.where(builder, { name: mapParamsApplyFilters })
                putQueryBuilderMapParams(mapParams, queryBuiler);
            }

        }

        return mapParamsApplyFilters;
    }

    /**
     * @override
     */
    async applyJoins(mapParams: {}, collectionJoins: Join[]): Promise<void> {
        if (isArrayNotEmpty(collectionJoins)) {
            let queryBuiler = findQueryBuilderMapParams(mapParams);

            // For each join
            for (let join of collectionJoins) {
                let builderJoin = SPACE;
                let builderAlias = SPACE;
                // Custom join query  // TODO
                if (join.customQueryJoin != undefined && isNotEmpty(join.customQueryJoin)) {


                    // Normal case
                } else {
                    // Alias join
                    if (join.alias != undefined && isNotEmpty(join.alias)) {
                        builderJoin = builderJoin + join.alias + DOT + join.field;
                    } else {
                        builderJoin = builderJoin + DEFAULT_ALIAS_TABLE_QUERY + DOT + join.field;
                    }

                    // Alias join
                    if (join.aliasJoinField != undefined && isNotEmpty(join.aliasJoinField)) {
                        builderAlias = join.aliasJoinField;
                    } else {
                        builderAlias = join.field;
                    }

                    // Types joins
                    switch (join.joinType) {
                        case EnumJoinTypes.NNER_JOIN:
                            queryBuiler = queryBuiler.innerJoin(builderJoin, builderAlias);
                            break;

                        case EnumJoinTypes.INNER_JOIN_FETCH:
                            queryBuiler = queryBuiler.innerJoinAndSelect(builderJoin, builderAlias);
                            break;

                        case EnumJoinTypes.LEFT_JOIN:
                            queryBuiler = queryBuiler.leftJoin(builderJoin, builderAlias);
                            break;

                        case EnumJoinTypes.LEFT_JOIN_FETCH:
                            queryBuiler = queryBuiler.leftJoinAndSelect(builderJoin, builderAlias);
                            break;

                        case EnumJoinTypes.RIGTH_JOIN:
                            queryBuiler = queryBuiler.rigthJoin(builderJoin, builderAlias);
                            break;

                        case EnumJoinTypes.RIGTH_JOIN_FETCH:
                            queryBuiler = queryBuiler.rigthJoinAndSelect(builderJoin, builderAlias);
                            break;
                    }
                }
            }

            putQueryBuilderMapParams(mapParams, queryBuiler);
        }
    }

    /**
     * @override
     */
    async applyGroups(mapParams: {}, collectionGroups: Group[]): Promise<void> {
        // TODO
    }

    /**
     * @override
     */
    async applyOrders(mapParams: {}, collectionOrders: Order[]): Promise<void> {
        if (isArrayNotEmpty(collectionOrders)) {

            const mapOrders: { [key: string]: string } = {};

            for (let order of collectionOrders) {
                let builder = EMPTY;

                // Alias for order 
                if (order.alias != undefined && isNotEmpty(order.alias)) {
                    builder = builder + order.alias + DOT + order.field;
                    // Default alias
                } else {
                    builder = builder + DEFAULT_ALIAS_TABLE_QUERY + DOT + order.field;
                }

                mapOrders[builder] = order.orderType;
            }

            // add orders
            putQueryBuilderMapParams(mapParams, findQueryBuilderMapParams(mapParams).orderBy(mapOrders));
        }
    }

    /**
     * @override
     */
    async applyLimit(mapParams: {}, limit: Limit): Promise<void> {
        let queryBuilder = findQueryBuilderMapParams(mapParams);

        queryBuilder = queryBuilder.offset(limit.start);
        queryBuilder = queryBuilder.limit(limit.end);

        putQueryBuilderMapParams(mapParams, queryBuilder);
    }

    /**
     * @override
     */
    async list(mapParams: {}, collectionFields: Field[], collectionFilters: Filter[], collectionJoins: Join[], collectionOrders: Order[], collectionGroups: Group[], limit: Limit): Promise<T[]> {
        // create query builder and punt in map params
        this.createQueryBuilderAndPutInMapParams(mapParams);

        // Apply fields
        await this.applyFields(mapParams, collectionFields);

        // Apply from
        await this.applyFrom(mapParams);

        // Apply joins
        await this.applyJoins(mapParams, collectionJoins);

        // Apply filters
        await this.applyFilters(mapParams, collectionFilters, true);

        // Apply groups 
        await this.applyGroups(mapParams, collectionGroups);

        // Apply limit
        await this.applyLimit(mapParams, limit);

        // List data
        const data: T[] = await findQueryBuilderMapParams(mapParams).getMany();

        // Remove query builder map params
        this.removeQueryBuilderMapParams(mapParams);

        return data;
    }

    /**
    * @override
    */
    async count(mapParams: {}, collectionFilters: Filter[], collectionJoins: Join[], collectionGroups: Group[]): Promise<number> {

        // create query builder and punt in map params
        this.createQueryBuilderAndPutInMapParams(mapParams);

        const collectionFields: Field[] = [];

        const countField: Field = new Field("");

        countField.customField = " count(1) ";

        collectionFields.push(countField)

        // Apply fields
        await this.applyFields(mapParams, collectionFields);

        // Apply from
        await this.applyFrom(mapParams);

        // Apply joins
        await this.applyJoins(mapParams, collectionJoins);

        // Apply filters
        await this.applyFilters(mapParams, collectionFilters, true);

        // Apply groups 
        await this.applyGroups(mapParams, collectionGroups);

        // Count data
        const countMap: { [key: string]: number } = await findQueryBuilderMapParams(mapParams).getRawOne();

        let count: number = 0;

        if (countMap != undefined) {
            for (let key in countMap) {
                count = countMap[key];
                break;
            }
        }

        return count;
    }


    /**
    * @override
    */
    getTableNameBuildORM(): string {
        throw new Error("Method not implemented.");
    }

}