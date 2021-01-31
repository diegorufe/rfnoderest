import { IRFUserDetails } from "../features/IRFUserDetails";
/**
 * Default implementantion user details
 */
export class RFUserDetils implements IRFUserDetails {


    userName!: string;
    userId: any;
    mapClaims!: { [key: string]: any; };
    collectionPermission!: string[];
    token!: string;
    mapClaimsSetToClaims!: { [key: string]: any; };

    /**
     * @override
     */
    getUserName(): string {
        return this.userName;
    }

    /**
     * @override
     */
    setUserName(unserName: string): void {
        this.userName = unserName;
    }

    /**
     * @override
     */
    getUserId() {
        return this.userId;
    }

    /**
     * @override
     */
    setUserId(userId: any): void {
        this.userId = userId;
    }

    /**
     * @override
     */
    getMapClaims(): { [key: string]: any; } {
        return this.mapClaims;
    }

    /**
     * @override
     */
    setMapClaims(mapClaims: { [key: string]: any; }): void {
        this.mapClaims = mapClaims;
    }

    /**
     * @override
     */
    getCollectionPermission(): string[] {
        return this.collectionPermission;
    }

    /**
     * @override
     */
    setCollectionPermission(collectionPermission: string[]): void {
        this.collectionPermission = collectionPermission;
    }

    /**
     * @override
     */
    getToken(): string {
        return this.token;
    }

    /**
     * @override
     */
    getMapParamsSetToClaims(): { [key: string]: any; } {
        return this.mapClaimsSetToClaims;
    }

    /**
     * @override
     */
    setMapParamsSetToClaims(mapParamsSetToClaims: { [key: string]: any; }): void {
        this.mapClaimsSetToClaims = mapParamsSetToClaims;
    }

}