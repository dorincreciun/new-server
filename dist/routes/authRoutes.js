"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
exports.authRoutes = router;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operațiuni de autentificare și gestionare utilizatori cu cookie-uri HTTP-Only
 */
// Folosește rutele de autentificare cu cookie-uri
router.use('/', auth_1.default);
//# sourceMappingURL=authRoutes.js.map