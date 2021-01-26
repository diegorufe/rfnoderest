import { IBaseService } from "../../../dataaccess/service/IBaseService";

/**
 * Base interface controller
 */
export interface IBaseController {

    /**
     * Method for find service by name
     * @param serviceName for find
     */
    getServiceByName(serviceName: string): IBaseService;
}