import { applyFunctionWithHandlerError, canBeDictionary, isArrayNotEmpty, isNotNull, ReponseMethod } from "rfcorets";
import { Transaction } from "../../beans/transactions/Transaction";
import { EnumParamsBuildQueryDataAccess } from "../../constants/core/EnumParamsBuildQueryDataAccess";
import { EnumTransactionsTypes } from "../../constants/transactions/EnumTransactionsTypes";
import { createTransaction } from "../../utils/UtilsTransactions";

/**
 * Decorator for indicante service have a transaction 
 * @param enumTransactionType indicates transaction type for service method
 */
export function Transactional(enumTransactionType: EnumTransactionsTypes) {
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

            if (isArrayNotEmpty(args)) {
                // Map params always first arg
                let mapParams = args[0];

                // Only check when lasta param is map 
                if (isNotNull(mapParams) && canBeDictionary(mapParams)) {

                    // Check type transaction
                    switch (enumTransactionType) {

                        // No transaction 
                        case EnumTransactionsTypes.NO_TRANSACTION:
                            mapParams[EnumParamsBuildQueryDataAccess.TRANSACTION] = null;
                            break;

                        // Required. Find if not exists create
                        case EnumTransactionsTypes.REQUIRED:
                            haveCreateTransaction = !(EnumParamsBuildQueryDataAccess.TRANSACTION in mapParams);
                            transactional = true;
                            if (haveCreateTransaction) {
                                transaction = createTransaction();
                                mapParams[EnumParamsBuildQueryDataAccess.TRANSACTION] = transaction;
                            } else {
                                transaction = mapParams[EnumParamsBuildQueryDataAccess.TRANSACTION];
                            }
                            break;

                        // Required new always create transaction
                        case EnumTransactionsTypes.REQUIRED_NEW:
                            haveCreateTransaction = true;
                            transactional = true;
                            transaction = createTransaction();
                            mapParams[EnumParamsBuildQueryDataAccess.TRANSACTION] = transaction;
                            break;
                    }
                }

            }

            let result = null;
            let haveError = false;

            try {

                // Start transaction
                if (haveCreateTransaction) {
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
                haveError = true;
                console.log(exception);
                throw exception;
            } finally {
                if (transactional && haveCreateTransaction) {

                    // If has error rollback
                    if (haveError) {
                        await transaction.rollbackTransaction();
                    } else {
                        // Commit transaction
                        await transaction.commitTransaction();
                    }

                    // Relesae transaction
                    await transaction.release();
                }
            }

            return result;
        }
    };
}