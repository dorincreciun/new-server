"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = 'Success', status = 200, meta) => {
    return res.status(status).json({
        message,
        data,
        meta,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, code = 'INTERNAL_ERROR', status = 500, details) => {
    return res.status(status).json({
        message,
        code,
        details,
    });
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map