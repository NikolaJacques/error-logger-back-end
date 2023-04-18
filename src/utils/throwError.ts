import { ErrorResponseType } from "delivery-backend";

export const throwError = (messageString: string, statusCode: number) => {
    const err = new Error() as ErrorResponseType;
    err.message = messageString; 
    err.statusCode = statusCode;
    throw err;
}