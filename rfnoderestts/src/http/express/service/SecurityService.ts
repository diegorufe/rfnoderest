import { EMPTY, isNotNull, parseToJson } from "rfcorets";
import { HttpExpressFactory } from "../factory/HttpExpressFactory";
import crypto from "crypto";
import { EnumKeysEncryptJsonSession } from "../constants/EnumKeysEncryptJsonSession";
import { decodeJwt, signJwt } from "../../../security/utils/UtilsSecuirty";
import { EnumKeysHttpHeader } from "../../core/constants/EnumKeysHttpHeader";
import { JWT_CRYPTO_CLAIMS } from "../../../security/constants/IConstantsSecurity";


/**
 * Default security service 
 */
export class SecurityService {

    expressFactory: HttpExpressFactory;

    constructor(expressFactory: HttpExpressFactory) {
        this.expressFactory = expressFactory;
    }

    /**
     * Method to encrypt json data session
     * @param jsonData is json data to store in session encrypted
     * @returns a map contains iv and ecrypted data for json store in data session
     */
    encryptJsonDataSession(jsonData: any): {} {
        let text = parseToJson(jsonData);
        let cipher = crypto.createCipheriv(
            this.expressFactory.propertiesExpressApp.algorithmCryptoJsonDataSession,
            this.expressFactory.propertiesExpressApp.keyCrytoJsonDataSession,
            this.expressFactory.propertiesExpressApp.iviCrytoJsonDataSession
        );

        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            [EnumKeysEncryptJsonSession.IV]: this.expressFactory.propertiesExpressApp.iviCrytoJsonDataSession.toString("hex"),
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
            this.expressFactory.propertiesExpressApp.algorithmCryptoJsonDataSession,
            this.expressFactory.propertiesExpressApp.keyCrytoJsonDataSession,
            iv
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString());
    }

    /**
     * Method for sign jwt
     * @param tokenData to sign
     */
    signJwt(tokenData: {}): string {
        return signJwt(tokenData, this.expressFactory.propertiesExpressApp.timeExpireJwtToken, this.expressFactory.propertiesExpressApp.keyJwtToken);
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
            tokenReturn = decodeJwt(token, this.expressFactory.propertiesExpressApp.keyJwtToken);
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
            dataReturn = this.decryptToJsonDataSession(token![JWT_CRYPTO_CLAIMS]);
        }
        return dataReturn;
    }
}