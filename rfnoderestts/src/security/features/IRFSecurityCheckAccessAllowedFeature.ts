import { IRFUserDetails } from "./IRFUserDetails";

/**
 * Interface for define access allowed in jwt authentication filter
 */
export interface IRFSecurityCheckAccessAllowedFeature {

    /**
     * Method for check access allowed
     * 
     * @param url                         for check access
     * @param userDetails for check data
     */
    checkAccessAllowed(url: string, userDetails: IRFUserDetails): void;

}