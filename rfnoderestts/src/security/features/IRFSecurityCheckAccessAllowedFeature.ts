
/**
 * Interface for define access allowed in jwt authentication filter
 */
export interface IRFSecurityCheckAccessAllowedFeature {

    /**
     * Method for check access allowed
     * 
     * @param url                         for check access
     * @param mapParamsCheckAccessAllowed for pass extra data for this method.
     *                                    Always is not null
     */
    checkAccessAllowed(url: string, mapParamsCheckAccessAllowed: { [key: string]: any }): void;
    
}