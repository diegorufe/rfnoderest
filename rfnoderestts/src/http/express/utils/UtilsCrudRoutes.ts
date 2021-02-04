import { IBaseCrudDao, IBaseCrudService } from "rfdataaccessts";
import { IBaseCrudController } from "../../core/controller/IBaseCrudController";
import { EnumPathRoutesCurd } from "../constants/EnumPathRoutesCurd";
import { HttpExpressFactory } from "../factory/HttpExpressFactory";
import { finishResponseRequestExpress } from "./UtilsHttpExpress";
import { EnumParamsRequest } from "../constants/EnumParamsRequest";

/**
 * Create params send method request 
 * @param req start request
 */
export function createParamsSendMethodRequest(req: any) {
    const mapParamsRequest: { [key: string]: any } = {}
    mapParamsRequest[EnumParamsRequest.REQUEST] = req;
    return mapParamsRequest;
}

/**
 * Function for handle crud routes
 * @param httpExpressFactory to handle routes
 * @param baseController for realize crud operations
 */
export function handleCrudRoutes<T, DAO extends IBaseCrudDao<T>, SERVICE extends IBaseCrudService<T, DAO>>(httpExpressFactory: HttpExpressFactory, baseController: IBaseCrudController<T, DAO, SERVICE>) {

    const path = baseController.getPath();

    // count
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.COUNT,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.count(createParamsSendMethodRequest(req), bodydRequest);

            // Finish response request
            finishResponseRequestExpress(httpExpressFactory, res, res, responseRequest);

        })
    );

    // list
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.LIST,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.list(createParamsSendMethodRequest(req), bodydRequest);

            // Finish response request
            finishResponseRequestExpress(httpExpressFactory, res, res, responseRequest);

        })
    );

    // browser
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.BROWSER,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.browser(createParamsSendMethodRequest(req), bodydRequest);

            // Finish response request
            finishResponseRequestExpress(httpExpressFactory, res, res, responseRequest);

        })
    );

    // add
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.add(createParamsSendMethodRequest(req), bodydRequest);

            // Finish response request
            finishResponseRequestExpress(httpExpressFactory, res, res, responseRequest);

        })
    );

    // edit
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.edit(createParamsSendMethodRequest(req), bodydRequest);

            // Finish response request
            finishResponseRequestExpress(httpExpressFactory, res, res, responseRequest);

        })
    );

    // delete
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.delete(createParamsSendMethodRequest(req), bodydRequest);

            // Finish response request
            finishResponseRequestExpress(httpExpressFactory, res, res, responseRequest);

        })
    );

    // loadNew
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.loadNew(createParamsSendMethodRequest(req), bodydRequest);

            // Finish response request
            finishResponseRequestExpress(httpExpressFactory, res, res, responseRequest);

        })
    );

    // read
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.read(createParamsSendMethodRequest(req), bodydRequest);

            // Finish response request
            finishResponseRequestExpress(httpExpressFactory, res, res, responseRequest);

        })
    );
}