import { HttpExpressFactory } from "../factory/HttpExpressFactory";
import bodyParser from "body-parser";
import express from "express";
import { isNotEmpty } from "rfcorets";
import { EnumKeysExpressApp } from "../constants/EnumKeysExpressApp";
import csurf from "csurf";
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

}