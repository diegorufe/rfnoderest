import { IBaseService } from "../../../../dataaccess/service/IBaseService";
import { IBaseController } from "../IBaseController";

/**
 * Base implementation for controllers
 */
export abstract class BaseControllerImpl implements IBaseController {


    getServiceByName(serviceName: string): IBaseService {
        throw new Error("Method not implemented.");
    }

}