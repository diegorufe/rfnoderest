import { HttpExpressFactory } from "../factory/HttpExpressFactory";
import bodyParser from "body-parser";
import express from "express";
import { EMPTY, isArrayNotEmpty, isNotEmpty, isNotNull } from "rfcorets";
import { EnumKeysExpressApp } from "../constants/EnumKeysExpressApp";
import csurf from "csurf";
import { EnumKeysHttpHeader } from '../../core/constants/EnumKeysHttpHeader'
import { EnumHttpStatus } from "../../core/constants/EnumHttpStatus";
import jsonwebtoken from "jsonwebtoken";
import { RFSecurityException } from "../../core/beans/RFSecurityException";
import { findJWTTokenRequestHeaders } from "./UtilsHttpExpress";

/**
 * Method for create express app from express factory 
 * @param httpExpressFactory for create express app
 */
export function createExpressApp(httpExpressFactory: HttpExpressFactory) {
    // Create express 
    const app = express();

    // body parser 
    if (isNotEmpty(httpExpressFactory.propertiesExpressApp.bodyParserSizeLimit)) {
        // set limit bodyparser json
        app.use(
            bodyParser.json({
                limit: httpExpressFactory.propertiesExpressApp.bodyParserSizeLimit,
            })
        );

        // set limit bodyparser url
        app.use(
            bodyParser.urlencoded({
                limit: httpExpressFactory.propertiesExpressApp.bodyParserSizeLimit,
                extended: true,
            })
        );
    } else {
        app.use(bodyParser.urlencoded({ extended: true }));
    }

    app.use(bodyParser.json());

    // Use helmet 
    if (httpExpressFactory.propertiesExpressApp.useHelmet) {
        // TODO
        // app.use(helmet());
    }

    // Disable powered by
    if (httpExpressFactory.propertiesExpressApp.disablePoweredBy) {
        app.disable(EnumKeysExpressApp.X_POWERED_BY);
    }

    // Trust proxy
    if (httpExpressFactory.propertiesExpressApp.truxProxy) {
        app.set(EnumKeysExpressApp.TRUST_PROXY, 1);
    }

    // Use crsf protection
    if (httpExpressFactory.propertiesExpressApp.useCsurf) {
        app.use(csurf());
    }

    // Router and security interceptor
    if (httpExpressFactory.propertiesExpressApp.useRouter) {
        httpExpressFactory.router = express.Router();
        // Secure interceptor
        // add middelware for intercept all request include secure pattern
        httpExpressFactory.router.use(function (req: any, res: any, next: any) {
            const error = new RFSecurityException("ACCESS_DENIED", "Not allowed permission");
            error.stack = "";

            // Only intercept secure url when request mehtod distinct to options
            if (req.method != "OPTIONS") {
                let includeurlNotSecurePattern: boolean = false;

                // For map secure patterns
                if (isArrayNotEmpty(httpExpressFactory.propertiesExpressApp.mapNotSecurePatterns)) {
                    for (let pattern of httpExpressFactory.propertiesExpressApp.mapNotSecurePatterns) {
                        includeurlNotSecurePattern = req.originalUrl.includes(
                            pattern
                        )

                        if (includeurlNotSecurePattern) {
                            break;
                        }
                    }
                }

                // Check security if not url secure patten
                if (!includeurlNotSecurePattern) {

                    // Find jwt 
                    const token =
                        findJWTTokenRequestHeaders(req);

                    if (token == null || token == undefined || !token) {
                        res.status(EnumHttpStatus.UNAUTHORIZED);
                        next(error);
                    } else {


                        let permissionAllowed: boolean = true;

                        try {
                            const decodeToken = jsonwebtoken.verify(
                                token,
                                httpExpressFactory.propertiesExpressApp.keyJwtToken);
                            permissionAllowed = isNotNull(decodeToken);
                        } catch (exception) {
                            permissionAllowed = false;
                        }

                        if (permissionAllowed) {
                            next();
                        } else {
                            // Invalid access for resources
                            res.status(EnumHttpStatus.UNAUTHORIZED);
                            next(error);
                        }

                    }
                } else {
                    next();
                }
            } else {
                next();
            }
        });
    }



    // cors
    if (!httpExpressFactory.propertiesExpressApp.enableCors) {
        app.use(function (req, res, next) {

            // res.header("Access-Control-Allow-Origin", "*");
            // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header(EnumKeysHttpHeader.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
            res.header(
                EnumKeysHttpHeader.ACCESS_CONTROL_ALLOW_HEADERS,
                "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
            );
            res.header(
                EnumKeysHttpHeader.ACCESS_CONTROL_ALLOW_METHODS,
                "GET, POST, OPTIONS, PUT, DELETE"
            );
            res.header(EnumKeysHttpHeader.ALLOW, "GET, POST, OPTIONS, PUT, DELETE");

            next();
        });
    }

    // Set app to factory 
    httpExpressFactory.app = app;
}