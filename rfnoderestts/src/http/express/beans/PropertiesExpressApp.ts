import crypto from "crypto";

/**
 * Properties express app
 */
export class PropertiesExpressApp {

    /**
     * Port express app
     */
    port: number = 3000;

    /**
     * Propertie for facility secure app
     *  https://github.com/helmetjs/helmet
     */
    useHelmet: boolean = true;

    /**
     * Disable powered trusted proxy
     */
    disablePoweredBy: boolean = true;

    /**
     * Turx proxy
     */
    truxProxy: boolean = true;

    /**
     *  Use csrf protection
     */
    userCrsf: boolean = false;

    /**
     *  Use router for manage request
     */
    useRouter: boolean = true;

    /**
     * Key jwt
     */
    keyJwtToken: string = "$2y$12$Z8XyhQRBD50hQ2fGcBn.GOLcE4ippoSNFXjjrBDWuvNLK0KaNIS.a";

    /**
     * Time expire jwt token
     */
    timeExpireJwtToken: number = 60 * 20;

    /**
     * Key cryto json data session
     */
    keyCrytoJsonDataSession: Buffer = Buffer.from("0100A000E00D00E00C00BAFE22A0E01A");

    /**
     * Buffer crypto json data session
     */
    iviCrytoJsonDataSession: Buffer = crypto.randomBytes(16);

    /**
     * Algorithm crytp
     */
    algorithmCryptoJsonDataSession: string = "aes-256-cbc"

    constructor() {

    }
}