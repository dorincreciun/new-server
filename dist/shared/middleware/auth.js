"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../../config");
const errors_1 = require("../http/errors");
const cookieUtils_1 = require("../../utils/cookieUtils");
const authMiddleware = (req, res, next) => {
    const token = (0, cookieUtils_1.readAccessToken)(req);
    if (!token) {
        return next(new errors_1.UnauthorizedError('Access token lipsă'));
    }
    try {
        const decoded = jwt.verify(token, config_1.config.jwtAccessSecret);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
        };
        next();
    }
    catch (error) {
        return next(new errors_1.UnauthorizedError('Access token invalid sau expirat'));
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map