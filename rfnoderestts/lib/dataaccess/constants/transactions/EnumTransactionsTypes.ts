
/**
 * Enum for types transactions
 */
export enum EnumTransactionsTypes {

    /**
     * If transaction dont exists create it 
     */
    REQUIRED,

    /**
     * Always create new transaction
     */
    REQUIRED_NEW,

    /**
     * Dont use and dont create transaction
     */
    NO_TRANSACTION
}