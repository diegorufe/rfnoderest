import crypto from "crypto";
import expressAsyncHandler from "express-async-handler";
import { CONTEXT, EMPTY, IErrorCodes, isNotEmpty, isNotNull, isNull, parseToJson, RFException } from "rfcorets";
import { IBaseCrudDao, IBaseCrudService } from "rfdataaccessts";
import { ResponseError } from "../../core/beans/ResponseError";
import { RFSecurityException } from "../../core/beans/RFSecurityException";
import { EnumHttpStatus } from "../../core/constants/EnumHttpStatus";
import { EnumKeysHttpHeader } from "../../core/constants/EnumKeysHttpHeader";
import { IBaseCrudController } from "../../core/controller/IBaseCrudController";
import { decodeJwt, signJwt } from "../../core/utils/UtilsSecurity";
import { PropertiesExpressApp } from "../beans/PropertiesExpressApp";
import { EnumKeysContextExpressApp } from "../constants/EnumKeysContextExpressApp";
import { EnumKeysEncryptJsonSession } from "../constants/EnumKeysEncryptJsonSession";
import { createExpressApp } from "../utils/UtilsCreateExpressApp";
import { handleCrudRoutes } from "../utils/UtilsCrudRoutes";
import { processRFException, processRFSecurityException } from "../utils/UtilsProcessExceptions";

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

    /**
     * Map services app
     */
    mapServicies: { [key: string]: any } = {};


    constructor() {
    }

    /**
     * Method to encrypt json data session
     * @param jsonData is json data to store in session encrypted
     * @returns a map contains iv and ecrypted data for json store in data session
     */
    encryptJsonDataSession(jsonData: any): {} {
        let text = parseToJson(jsonData);
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
    private configErrorHandler() {
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

                const responseError: ResponseError = new ResponseError();
                responseError.httpStatus = EnumHttpStatus.INTERNAL_SERVER_ERROR;
                responseError.code = IErrorCodes.GENERAL.code;
                responseError.stack = error.stack;
                responseError.message = error.message;
                responseError.name = error.name;

                // RFSecurity exception
                if (error instanceof RFSecurityException) {
                    processRFSecurityException(error, responseError);
                }
                // RFExpcetion
                else if (error instanceof RFException) {
                    processRFException(error, responseError);
                }

                res.status(responseError.httpStatus);
                res.send(parseToJson(responseError));
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

    /**
     * Method for add get route 
     * @param path for handle route 
     * @param functionRoute execute route 
     */
    addGetRoute(path: string, functionRoute: Function) {

        // if have router configuration add to router
        if (!this.routerIsNull()) {
            this.router.get(path, functionRoute);
            // if not have router add to app if exists
        } else if (!this.appIsNull()) {
            this.app.get(path, functionRoute);
        }

    }

    /**
     * Method for add post route 
     * @param path for handle route 
     * @param functionRoute execute route 
     */
    addPostRoute(path: string, functionRoute: Function) {

        // if have router configuration add to router
        if (!this.routerIsNull()) {
            this.router.post(path, functionRoute);
        } else if (!this.appIsNull()) {
            // if not have router add to app if exists
            this.app.post(path, functionRoute);
        }

    }

    /**
     * Method for add curd controller. Add, edit, delete, list, count, loadNew ...
     * @param baseController to add crud routes
     */
    addCrudRoutes<T, DAO extends IBaseCrudDao<T>, SERVICE extends IBaseCrudService<T, DAO>>(baseController: IBaseCrudController<T, DAO, SERVICE>) {
        handleCrudRoutes(this, baseController);
    }

    /**
     *  Method to add midleware to router. If not use route function dont add
     * @param functionMidleware to add
     */
    addMidlewareRouter(functionMidleware: Function) {

        if (!this.routerIsNull()) {
            this.router.use(functionMidleware);
        }

    }

    /**
     * Method for load app
     */
    loadAppConfig() {
        // Create express app
        createExpressApp(this);

        // Add this to context
        CONTEXT.mapProperties[EnumKeysContextExpressApp.HTTP_EXPRESS_FACTORY] = this;
    }

    /**
     * Method to start listen server. 
     * @param {*} port is the port of server
     * @param {*} hostname is th hostame of server
     */
    listen(hostname?: string, port?: number) {
        // check exists app
        if (!this.appIsNull()) {

            // Config error handler
            this.configErrorHandler();

            // If router is not null use by star api url
            if (!this.routerIsNull()) {
                this.app.use(this.propertiesExpressApp.apiUrl, this.router);
            }

            // If port is null get default port
            if (isNull(port)) {
                port = this.propertiesExpressApp.port;
            }

            const self = this;
            this.app.listen(port, hostname, function () {
                //self.logger.info("App on port " + port);
            });
        }
    }

    /**
     * Method for add service. Only add service if serviceName is not empty and service is not null 
     * @param serviceName for add service 
     * @param service to add 
     */
    addService(serviceName: string, service: any) {
        if (isNotEmpty(serviceName) && isNotNull(service)) {
            this.mapServicies[serviceName] = service;
        }
    }

    /**
     * Method to get service by name
     * @param {*} serviceName name for service
     */
    getService(serviceName: string) {
        return this.mapServicies[serviceName];
    }
}