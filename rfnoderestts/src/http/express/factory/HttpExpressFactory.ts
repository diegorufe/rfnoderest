import { PropertiesExpressApp } from "../beans/PropertiesExpressApp";
import crypto from "crypto";
import { EnumKeysEncryptJsonSession } from "../constants/EnumKeysEncryptJsonSession";
import expressAsyncHandler from "express-async-handler";
import { EMPTY, isNotEmpty, isNotNull, isNull } from "rfcorets";
import { EnumHttpStatus } from "../../core/constants/EnumHttpStatus";
import { decodeJwt, signJwt } from "../../core/utils/UtilsSecurity";
import { EnumKeysHttpHeader } from "../../core/constants/EnumKeysHttpHeader";

/**
 * Class for manage express app
 */
export class HttpExpressFactory {

    /**
     * Properties express app
     */
    propertiesExpressApp: PropertiesExpressApp = new PropertiesExpressApp();

    /**
     * Async handler object for catch async error 
     */
    asyncHandlerObject: any;

    /**
     * store app created by express
     */
    app: any;

    /**
     * store router object create by express if use router
     */
    router: any;

    

    constructor() {

    }

    /**
     * Method to encrypt json data session
     * @param jsonData is json data to store in session encrypted
     * @returns a map contains iv and ecrypted data for json store in data session
     */
    encryptJsonDataSession(jsonData: any): {} {
        let text = JSON.stringify(jsonData);
        let cipher = crypto.createCipheriv(
            this.propertiesExpressApp.algorithmCryptoJsonDataSession,
            this.propertiesExpressApp.keyCrytoJsonDataSession,
            this.propertiesExpressApp.iviCrytoJsonDataSession
        );

        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            [EnumKeysEncryptJsonSession.IV]: this.propertiesExpressApp.iviCrytoJsonDataSession.toString("hex"),
            [EnumKeysEncryptJsonSession.ENCRYPTED_DATA]: encrypted.toString("hex"),
        };
    }

    /**
     * Method to decript to json data session
     * @param jsonDataEcnrypted is a json to decrypt for obtain json data session
     * @returns a json data decryted
     */
    decryptToJsonDataSession(jsonDataEcnrypted: { [key: string]: any }): any {
        const iv = Buffer.from(jsonDataEcnrypted[EnumKeysEncryptJsonSession.IV], "hex");
        const encryptedText = Buffer.from(jsonDataEcnrypted[EnumKeysEncryptJsonSession.ENCRYPTED_DATA], "hex");
        const decipher = crypto.createDecipheriv(
            this.propertiesExpressApp.algorithmCryptoJsonDataSession,
            this.propertiesExpressApp.keyCrytoJsonDataSession,
            iv
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString());
    }

    /**
     * Method to know app is null
     */
    appIsNull(): boolean {
        return isNull(this.app);
    }

    /**
     * Method to know router is null
     */
    routerIsNull(): boolean {
        return isNull(this.router);
    }


    /**
     * Aync handler
     */
    asyncHandler() {
        if (
            this.asyncHandlerObject == null ||
            this.asyncHandlerObject == undefined
        ) {
            this.asyncHandlerObject = expressAsyncHandler;
        }
        return this.asyncHandlerObject;
    }

    /**
     * Method to configure error handler
     */
    configErrorHandler() {
        const method = "use";
        const routerHandler = this.routerIsNull() ? this.app : this.router;

        routerHandler[method]((error: any, req: any, res: any, next: any) => {
            if (isNotNull(error)) {
                // TODO LOgeer 
                if (
                    isNotEmpty(error.stack)
                ) {
                    //this.logger.error(error.stack);
                } else {
                    //this.logger.error(error);
                }

                res.status(EnumHttpStatus.BAD_REQUEST);
                res.send({ error: error.message });
                return;
            }
            next(error);
        });
    }

    /**
     * Method for sign jwt
     * @param tokenData to sign
     */
    signJwt(tokenData: {}): string {
        return signJwt(tokenData, this.propertiesExpressApp.timeExpireJwtToken, this.propertiesExpressApp.keyJwtToken);
    }

    /**
     * Method for decode jwt 
     * @param req request express
     */
    decodeJwt(req: any) {
        let token =
            req.headers[EnumKeysHttpHeader.AUTHORIZATION] ||
            req.headers[EnumKeysHttpHeader.AUTHORIZATION_UPPER_KEY_FIRST] ||
            req.headers[EnumKeysHttpHeader.X_ACCESS_TOKEN];
        let tokenReturn = null;
        if (isNotNull(token)) {
            token = token.replace(EnumKeysHttpHeader.BEARER, EMPTY);
            tokenReturn = decodeJwt(token, this.propertiesExpressApp.keyJwtToken);
        }
        return tokenReturn;
    }

    /**
     * Method for get data secure inside in token 
     * @param req  request express
     */
    getDataSecureToken(req: any) {
        let dataReturn = null;
        const token = this.decodeJwt(req);
        if (isNotNull(token)) {
            dataReturn = this.decryptToJsonDataSession(token!.data);
        }
        return dataReturn;
    }


}