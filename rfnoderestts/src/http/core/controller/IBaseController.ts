import { IBaseService } from "../../../dataaccess/service/IBaseService";

/**
 * Base interface controller
 */
export interface IBaseController {

    /**
     * Method for get path controller
     */
    getPath(): string;
}