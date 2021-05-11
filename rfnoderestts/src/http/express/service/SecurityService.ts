import { isNotNull } from "rfcorets";
import { LoginUser } from "../../../security/beans/LoginUser";
import { RFUserDetails } from "../../../security/beans/RFUserDetails";
import { EnumBasicParamClaims } from "../../../security/constants/EnumBasicParamClaims";
import { JWT_CRYPTO_CLAIMS, JWT_SUB } from "../../../security/constants/IConstantsSecurity";
import { IRFSecurityCheckAccessAllowedFeature } from "../../../security/features/IRFSecurityCheckAccessAllowedFeature";
import { IRFUserDetails } from "../../../security/features/IRFUserDetails";
import { decodeJwt, decryptToJsonDataSession, generateTokenForUserDetails, isUrlOnlyCkeckAuthenticate, signJwt } from "../../../security/utils/UtilsSecuirty";
import { RestRequestResponse } from "../../core/beans/RestRequestResponse";
import { RFSecurityException } from "../../core/beans/RFSecurityException";
import { EnumKeysJwtToken } from "../../core/constants/EnumKeysJwtToken";
import { HttpExpressFactory } from "../factory/HttpExpressFactory";
import { findJWTTokenRequestHeaders } from "../utils/UtilsHttpExpress";


/**
 * Default security service 
 */
export class SecurityService implements IRFSecurityCheckAccessAllowedFeature {

    expressFactory: HttpExpressFactory;

    constructor(expressFactory: HttpExpressFactory) {
        this.expressFactory = expressFactory;
    }


    /**
     * Method for use logín
     * @param loginUser for login
     */
    login(loginUser: LoginUser): Promise<IRFUserDetails | undefined> {
        return new Promise<IRFUserDetails | undefined>((resolver: Function, reject) => {
            return undefined;
        })
    }

    /**
     * Method for refresh jwt token if needed
     * @param req request http
     * @param restRequestResponse for set token if refresh token is needed
     */
    refreshJWTTokenIfNeeded(req: any, restRequestResponse: RestRequestResponse<any>): void {
        if (!this.expressFactory.propertiesExpressApp.disableSecurity) {
            const token = isNotNull(restRequestResponse.token) ? restRequestResponse.token : findJWTTokenRequestHeaders(req);

            if (isNotNull(token)) {
                const jwtDecode: any = decodeJwt(token, this.expressFactory.propertiesExpressApp.keyJwtToken);

                if (isNotNull(jwtDecode)) {
                    const timeExpire = jwtDecode[EnumKeysJwtToken.EXP];

                    // Refhesh token
                    if ((new Date().getTime() -
                        timeExpire.getTime()) >= (this.expressFactory.propertiesExpressApp.timeExpireJwtToken - 1000)) {

                        restRequestResponse.token = generateTokenForUserDetails(this.getIRFUserDetailsFromRequest(req), this.expressFactory.propertiesExpressApp.timeExpireJwtToken, this.expressFactory.propertiesExpressApp.keyJwtToken, this.expressFactory.propertiesExpressApp.algorithmCryptoJsonDataSession, this.expressFactory.propertiesExpressApp.keyCrytoJsonDataSession, this.expressFactory.propertiesExpressApp.iviCrytoJsonDataSession)
                    }
                }
            }
        }
    }

    /**
     * Method for get user detauls from request 
     * @param req for get user details
     */
    getIRFUserDetailsFromRequest(req: any): IRFUserDetails {
        const userDetails: IRFUserDetails = new RFUserDetails();

        const token = findJWTTokenRequestHeaders(req);

        if (isNotNull(token)) {
            const jwtDecode: any = decodeJwt(token, this.expressFactory.propertiesExpressApp.keyJwtToken);
            if (isNotNull(jwtDecode)) {

                // Username
                userDetails.setUserName(jwtDecode[JWT_SUB]);

                // Claims
                const mapClaims = decryptToJsonDataSession(jwtDecode[JWT_CRYPTO_CLAIMS], this.expressFactory.propertiesExpressApp.algorithmCryptoJsonDataSession, this.expressFactory.propertiesExpressApp.keyCrytoJsonDataSession)

                // Get data for RFUserDetails
                if (isNotNull(mapClaims)) {
                    // USER_ID
                    if (isNotNull(mapClaims[EnumBasicParamClaims.USER_ID])) {
                        userDetails.setUserId(mapClaims[EnumBasicParamClaims.USER_ID]);
                    }
                    // AUTHORITIES
                    if (isNotNull(mapClaims[EnumBasicParamClaims.AUTHORITIES])) {
                        userDetails.setCollectionAuthorities(mapClaims[EnumBasicParamClaims.AUTHORITIES]);
                    }
                    // PERMISSIONS
                    if (isNotNull(mapClaims[EnumBasicParamClaims.PERMISSIONS])) {
                        userDetails.setCollectionPermission(mapClaims[EnumBasicParamClaims.PERMISSIONS]);
                    }
                    // Other properties
                    userDetails.setMapParamsSetToClaims(mapClaims);
                }
            }
        }

        return userDetails;
    }


    /**
     * @override
     */
    checkAccessAllowed(url: string, userDetails: IRFUserDetails): void {
        // Check url only check authenticate
        if (!isUrlOnlyCkeckAuthenticate(url)) {
            const collectionPermissions = userDetails.getCollectionPermission();
            let accessGranted: boolean = false;

            // Check access granted
            for (let permission of collectionPermissions) {
                accessGranted = url.includes(permission);
                if (accessGranted) {
                    break;
                }
            }

            if (!accessGranted) {
                throw new RFSecurityException("ACCESS_DENIED", "Not allowed permission");
            }
        }
    }

}