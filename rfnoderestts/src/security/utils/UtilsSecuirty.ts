import { isNotEmpty, isNotNull } from "rfcorets";
import { EnumKeysJwtToken } from "../../http/core/constants/EnumKeysJwtToken";
import { PATTERN_ONLY_CHECK_AUTHENTICATE } from "../constants/IConstantsSecurity";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

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