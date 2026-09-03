export class appError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // to prevent including the constructor call in the stack trace
        Error.captureStackTrace(this, this.constructor);
    }

}