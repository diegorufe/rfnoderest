import { IBaseCrudDao, IBaseCrudService } from "rfdataaccessts";
import { IBaseCrudController } from "../../core/controller/IBaseCrudController";
import { finishResponseRequest } from "../../core/utils/UtilsHttp";
import { EnumPathRoutesCurd } from "../constants/EnumPathRoutesCurd";
import { HttpExpressFactory } from "../factory/HttpExpressFactory";

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
            const responseRequest = await baseController.count(bodydRequest);

            // Finis response request
            finishResponseRequest(res, responseRequest);

        })
    );

    // list
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.LIST,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.list(bodydRequest);

            // Finis response request
            finishResponseRequest(res, responseRequest);

        })
    );

    // browser
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.BROWSER,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.browser(bodydRequest);

            // Finis response request
            finishResponseRequest(res, responseRequest);

        })
    );

    // add
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.add(bodydRequest);

            // Finis response request
            finishResponseRequest(res, responseRequest);

        })
    );

    // edit
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.edit(bodydRequest);

            // Finis response request
            finishResponseRequest(res, responseRequest);

        })
    );

    // delete
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.delete(bodydRequest);

            // Finis response request
            finishResponseRequest(res, responseRequest);

        })
    );

    // loadNew
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.loadNew(bodydRequest);

            // Finis response request
            finishResponseRequest(res, responseRequest);

        })
    );

    // read
    httpExpressFactory.addPostRoute(
        path + EnumPathRoutesCurd.ADD,
        httpExpressFactory.asyncHandler()(async (req: any, res: any, next: any) => {

            // Body request
            const bodydRequest = req.body;

            // Response request
            const responseRequest = await baseController.read(bodydRequest);

            // Finis response request
            finishResponseRequest(res, responseRequest);

        })
    );
}