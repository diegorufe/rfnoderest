
/**
 * Enum for types transactions
 */
enum EnumTransactionTypes {

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