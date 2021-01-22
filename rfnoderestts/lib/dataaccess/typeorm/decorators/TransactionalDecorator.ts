import { ReponseMethod } from "../../../core/beans/ResponseMethod";
import { canBeDictionary, isArrayNotEmpty, isNotNull, isNull } from "../../../core/utils/UtilsCommons";
import { Transaction } from "../../beans/transactions/Transaction";
import { createTransaction } from "../../utils/UtilsTransactions";
import { applyFunctionWithHandlerError } from "../../../core/utils/UtilsError";

/**
 * Decorator for indicante service have a transaction 
 * @param enumTransactionType indicates transaction type for service method
 */
export function Transactional(enumTransactionType: EnumTransactionTypes) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Indicate if create transaction
        let haveCreateTransaction: boolean = false;

        // Indicate is transaction
        let transactional: boolean = false;

        // Bean for store information and methods for transactions
        let transaction: Transaction = new Transaction();

        // Original method transaction
        let originalMethod = descriptor.value;

        // wrapping the original method
        descriptor.value = async function (...args: any[]) {
            //console.log("wrapped function: before invoking " + propertyKey);
            //console.log(args);
            if (isArrayNotEmpty(args)) {
                // Map params always last arg
                let mapParams = args[args.length - 1];

                // Only check when lasta param is map 
                if (isNotNull(mapParams) && canBeDictionary(mapParams)) {

                    // Check type transaction
                    switch (enumTransactionType) {

                        // No transaction 
                        case EnumTransactionTypes.NO_TRANSACTION:
                            mapParams[EnumParamsBuildQueryDataAccess.TRANSACTION] = null;
                            break;

                        // Required. Find if not exists create
                        case EnumTransactionTypes.REQUIRED:
                            haveCreateTransaction = !(EnumParamsBuildQueryDataAccess.TRANSACTION in mapParams);
                            transactional = true;
                            if (!haveCreateTransaction) {
                                transaction = mapParams[EnumParamsBuildQueryDataAccess.TRANSACTION];
                            }
                            break;

                        // Required new always create transaction
                        case EnumTransactionTypes.REQUIRED_NEW:
                            haveCreateTransaction = true;
                            transactional = true;
                            break;
                    }
                }

            }

            // If create transaction
            if (transactional && haveCreateTransaction) {
                transaction = createTransaction();
            }

            let result = null;
            let hasError = false;

            try {

                // Start transaction
                if (transactional) {
                    await transaction.stratTransaction();
                }

                const self = this;

                const responseMethod: ReponseMethod = await applyFunctionWithHandlerError(() => {
                    return originalMethod.apply(self, args);
                })

                result = responseMethod.data;

                // IF has error throw this
                if (responseMethod.hasError()) {
                    throw responseMethod.error;
                }
            } catch (exception) {
                hasError = true;
            } finally {
                if (transactional) {

                    // If has error rollback
                    if (hasError && transaction != null) {
                        await transaction.rollbackTransaction();
                    } else {
                        // Commit transaction
                        await transaction.commitTransaction();
                    }

                    // Relesae transaction
                    await transaction.release();
                }
            }

            //console.log("wrapped function: after invoking " + propertyKey);

            return result;
        }
    };
}