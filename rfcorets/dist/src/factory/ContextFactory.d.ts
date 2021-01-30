/**
 * Class for store data context
 */
declare class ContextFactory {
    /**
     * Map properties for store data in context
     */
    mapProperties: {
        [key: string]: any;
    };
    constructor();
}
export declare const CONTEXT: ContextFactory;
export {};
