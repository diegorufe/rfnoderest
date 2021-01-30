import { IErrorCodes } from "rfcorets";
import { EnumHttpStatus } from "../constants/EnumHttpStatus";

/**
 * Response error exception
 */
export class ResponseError {
    code: number = IErrorCodes.GENERAL.getCode();
    name: string = "";
    message: string = "";
    httpStatus: EnumHttpStatus = EnumHttpStatus.INTERNAL_SERVER_ERROR;
    stack: string = "";
}