"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'Success', status = 200, meta) {
    const response = {
        message,
        data,
    };
    if (meta !== undefined) {
        response.meta = meta;
    }
    return res.status(status).json(response);
}
function sendError(res, message, code = 'INTERNAL_ERROR', status = 500, details) {
    return res.status(status).json({
        message,
        code,
        ...(details ? { details } : {}),
    });
}
//# sourceMappingURL=response.js.map