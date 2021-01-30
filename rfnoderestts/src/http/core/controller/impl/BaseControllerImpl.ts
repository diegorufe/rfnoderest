import { IBaseController } from "../IBaseController";

/**
 * Base implementation for controllers
 */
export abstract class BaseControllerImpl implements IBaseController {

    path: string;

    constructor(path: string) {
        this.path = path;
    }

    /**
     * @override
     */
    getPath(): string {
        return this.path;
    }


}