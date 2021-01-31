import { isNotEmpty, isNotNull, mergeDictionaries, parseToJson } from "rfcorets";
import { EnumKeysJwtToken } from "../../http/core/constants/EnumKeysJwtToken";
import { JWT_CRYPTO_CLAIMS, JWT_SUB, PATTERN_ONLY_CHECK_AUTHENTICATE } from "../constants/IConstantsSecurity";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { IRFUserDetails } from "../features/IRFUserDetails";
import { EnumBasicParamClaims } from "../constants/EnumBasicParamClaims";
import crypto from "crypto";
import { EnumKeysEncryptJsonSession } from "../../http/express/constants/EnumKeysEncryptJsonSession";

/**
 * Method for know only check authenticate url if contains patter onlye check
 * authenticate
 * 
 * @param url to check
 * @return true if only check authenticate
 */
export function isUrlOnlyCkeckAuthenticate(url: string): boolean {
    return isNotEmpty(url) && url.includes(PATTERN_ONLY_CHECK_AUTHENTICATE);
}

/**
 * Method to sign jwt
 * @param tokenData to sign
 * @param timeExpireJsonWebToken time expire json webtoken
 * @param keyJwt to sign
 */
export function signJwt(tokenData: { [key: string]: any }, timeExpireJsonWebToken: number | undefined, keyJwt: string) {
    // Remo exp and iat for token
    if (
        isNotNull(tokenData) &&
        isNotNull(tokenData[EnumKeysJwtToken.EXP])
    ) {
        delete tokenData[EnumKeysJwtToken.EXP];
        delete tokenData[EnumKeysJwtToken.IAT];
    }

    // sign jwt 
    if (
        isNotNull(timeExpireJsonWebToken)
    ) {
        return jsonwebtoken.sign(
            tokenData,
            keyJwt,
            {
                expiresIn: timeExpireJsonWebToken,
            }
        );
    } else {
        return jsonwebtoken.sign(
            tokenData,
            keyJwt
        );
    }
}

/**
 * Method for bcrypt password 
 * @param saltRounds to bcrypt 
 * @param password to bcrypt
 */
export function bcryptPassword(saltRounds: number, password: string): string {
    return bcrypt.hashSync(password, saltRounds);
}

/**
 * Method to compare bcrypt password
 * @param passwordBcrypt passsword encripted to compare 
 * @param passwordCompare passsword not encrypted to compare
 */
export function compareBcrypt(passwordBcrypt: string, passwordCompare: string): boolean {
    return bcrypt.compareSync(passwordCompare, passwordBcrypt.trim());
}

/**
 * Method for decode jwt 
 * @param token to decode 
 * @param jwtKey key jwt
 */
export function decodeJwt(token: any, jwtKey: any) {
    return jsonwebtoken.decode(
        token,
        jwtKey
    );
}

/**
 * Method encrytp json data session
 * @param jsonData 
 * @param algorithmCryptoJsonDataSession 
 * @param keyCrytoJsonDataSession 
 * @param iviCrytoJsonDataSession 
 */
export function encryptJsonDataSession(jsonData: any, algorithmCryptoJsonDataSession: string, keyCrytoJsonDataSession: Buffer, iviCrytoJsonDataSession: Buffer): {} {
    let text = parseToJson(jsonData);
    let cipher = crypto.createCipheriv(
        algorithmCryptoJsonDataSession,
        keyCrytoJsonDataSession,
        iviCrytoJsonDataSession
    );

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
        [EnumKeysEncryptJsonSession.IV]: iviCrytoJsonDataSession.toString("hex"),
        [EnumKeysEncryptJsonSession.ENCRYPTED_DATA]: encrypted.toString("hex"),
    };
}

/**
 * Method to decript to json data session
 * @param jsonDataEcnrypted is a json to decrypt for obtain json data session
 * @param algorithmCryptoJsonDataSession 
 * @param keyCrytoJsonDataSession 
 * @returns a json data decryted
 */
export function decryptToJsonDataSession(jsonDataEcnrypted: { [key: string]: any }, algorithmCryptoJsonDataSession: string, keyCrytoJsonDataSession: Buffer): any {
    const iv = Buffer.from(jsonDataEcnrypted[EnumKeysEncryptJsonSession.IV], "hex");
    const encryptedText = Buffer.from(jsonDataEcnrypted[EnumKeysEncryptJsonSession.ENCRYPTED_DATA], "hex");
    const decipher = crypto.createDecipheriv(
        algorithmCryptoJsonDataSession,
        keyCrytoJsonDataSession,
        iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
}


/**
 * Method for generate token for user details
 * @param userDetails for user detais
 * @param timeExpireJsonWebToken time expire json webtoken
 * @param keyJwt to sign
 * @param algorithmCryptoJsonDataSession 
 * @param keyCrytoJsonDataSession 
 * @param iviCrytoJsonDataSession 
 */
export function generateTokenForUserDetails(userDetails: IRFUserDetails, timeExpireJsonWebToken: number | undefined, keyJwt: string, algorithmCryptoJsonDataSession: string, keyCrytoJsonDataSession: Buffer, iviCrytoJsonDataSession: Buffer): string {
    const mapParamsJwt: { [key: string]: any } = {};
    // Set user
    mapParamsJwt[JWT_SUB] = userDetails.getUserName();

    // Set crypto claims 
    const mapClaims: { [key: string]: any } = {};
    mapClaims[EnumBasicParamClaims.USER_ID] = userDetails.getUserId();
    mapClaims[EnumBasicParamClaims.AUTHORITIES] = userDetails.getCollectionAuthorities();
    mapClaims[EnumBasicParamClaims.PERMISSIONS] = userDetails.getCollectionPermission();

    // Merge aditional data
    if (isNotNull(userDetails.getMapParamsSetToClaims())) {
        mergeDictionaries(mapClaims, userDetails.getMapParamsSetToClaims());
    }

    // Encrypt claims
    mapParamsJwt[JWT_CRYPTO_CLAIMS] = encryptJsonDataSession(mapClaims, algorithmCryptoJsonDataSession, keyCrytoJsonDataSession, iviCrytoJsonDataSession);

    // signJwt
    return signJwt(mapParamsJwt, timeExpireJsonWebToken, keyJwt);
}