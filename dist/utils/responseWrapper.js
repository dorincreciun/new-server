"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.error = error;
function success(data, message, meta) {
    return {
        success: true,
        ...(message !== undefined ? { message } : {}),
        ...(data !== undefined ? { data } : {}),
        ...(meta !== undefined ? { meta } : {}),
    };
}
function error(message, status = 400, details) {
    return {
        success: false,
        message,
        data: null,
        status,
        ...(details ? { details } : {}),
    };
}
//# sourceMappingURL=responseWrapper.js.map