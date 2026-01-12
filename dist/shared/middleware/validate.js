"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("../http/errors");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                const parsed = await schema.query.parseAsync(req.query);
                Object.defineProperty(req, 'query', {
                    value: parsed,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            }
            if (schema.params) {
                const parsed = await schema.params.parseAsync(req.params);
                Object.defineProperty(req, 'params', {
                    value: parsed,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return next(new errors_1.ValidationError('Validation Error', details));
            }
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map