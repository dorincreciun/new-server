"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../http/errors");
const response_1 = require("../http/response");
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`, err);
    if (err instanceof errors_1.AppError) {
        return (0, response_1.sendError)(res, err.message, err.code, err.status, err.details);
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Map Prisma errors to AppErrors
        if (err.code === 'P2002') {
            return (0, response_1.sendError)(res, 'A record with these details already exists.', 'CONFLICT', 409);
        }
        if (err.code === 'P2025') {
            return (0, response_1.sendError)(res, 'Record not found.', 'NOT_FOUND', 404);
        }
    }
    // Fallback to internal server error
    const isProd = process.env.NODE_ENV === 'production';
    return (0, response_1.sendError)(res, isProd ? 'An internal server error occurred.' : err.message, 'INTERNAL_ERROR', 500);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map