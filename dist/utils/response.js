"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.success = success;
exports.created = created;
function ok(data, options) {
    const { message, meta } = options || {};
    const res = { success: true };
    if (message)
        res.message = message;
    if (typeof data !== 'undefined')
        res.data = data;
    if (typeof meta !== 'undefined')
        res.meta = meta;
    return res;
}
function success(message) {
    return { success: true, ...(message ? { message } : {}) };
}
function created(data, options) {
    return ok(data, options);
}
//# sourceMappingURL=response.js.map