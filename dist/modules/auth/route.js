"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const validate_1 = require("../../shared/middleware/validate");
const dto_1 = require("./dto");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)({ body: dto_1.registerSchema }), controller_1.authController.register);
router.post('/login', (0, validate_1.validate)({ body: dto_1.loginSchema }), controller_1.authController.login);
router.post('/refresh', controller_1.authController.refresh);
router.get('/me', auth_1.authMiddleware, controller_1.authController.me);
router.post('/logout', auth_1.authMiddleware, controller_1.authController.logout);
exports.default = router;
//# sourceMappingURL=route.js.map