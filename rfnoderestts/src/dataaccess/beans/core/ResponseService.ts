
/**
 * Class for response services methods
 */
export class ResponseService<T>{

    data?: T;

    constructor(data?: T) {
        this.data = data;
    }
}