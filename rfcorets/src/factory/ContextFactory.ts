/**
 * Class for store data context
 */
class ContextFactory {
    
    /**
     * Map properties for store data in context
     */
    mapProperties: { [key: string]: any }

    constructor() {
        this.mapProperties = {};
    }
}

export const CONTEXT = new ContextFactory();