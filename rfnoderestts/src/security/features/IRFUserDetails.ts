/**
 * Interface user detailes security
 */
export interface IRFUserDetails {

    /**
     * Method for get user name
     */
    getUserName(): string;

    /**
     * Method for set unser name 
     * @param unserName to set
     */
    setUserName(unserName: string): void;

    /**
     * Method for get user id for session. This return object because in NOSQL
     * database id can be object
     * 
     * @return user id
     */
    getUserId(): any;

    /**
     * Method for set user id for session. This is object because in NOSQL database
     * id can be object
     * 
     * @param userId to set
     */
    setUserId(userId: any): void;

    /**
     * Method for get map claims for security context user
     * 
     * @return map claims
     */
    getMapClaims(): { [key: string]: any };

    /**
     * Method for set claims for security context user
     * 
     * @param mapClaims to set
     */
    setMapClaims(mapClaims: { [key: string]: any }): void;

    /**
     * Method for get collection permissions
     */
    getCollectionPermission(): string[];


    /**
     * Method for set collection permission
     * @param collectionPermission 
     */
    setCollectionPermission(collectionPermission: string[]): void;

    /**
    * Method for get collection authorities
    */
    getCollectionAuthorities(): string[];

    /**
    * Method for set collection authorities
    * @param collectionAuthorities 
    */
    setCollectionAuthorities(collectionAuthorities: string[]): void;

    /**
     * Method for get token for principal user
     * 
     * @return token for principal user in session
     */
    getToken(): string;

    /**
     * Method for get map params set to claims 
     * @return map params set to to claims
     */
    getMapParamsSetToClaims(): { [key: string]: any };

    /**
     * Method for set map params set to claims
     * @param mapParamsSetToClaims
     */
    setMapParamsSetToClaims(mapParamsSetToClaims: { [key: string]: any }): void;

}