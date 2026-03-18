export class AppError extends Error {
    statusCode;
    isOperational;
    errors;
    constructor(message, statusCode, errors) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
