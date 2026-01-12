"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = exports.OrderController = void 0;
const service_1 = require("./service");
const response_1 = require("../../shared/http/response");
const errors_1 = require("../../shared/http/errors");
class OrderController {
    async checkout(req, res, next) {
        try {
            const userId = req.user.id;
            const { customer, address, paymentMethod } = req.body;
            const order = await service_1.orderService.createOrder(userId, customer, address, paymentMethod || 'CASH');
            return (0, response_1.sendSuccess)(res, order, 'Order created', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async getOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const { orders, total } = await service_1.orderService.getUserOrders(userId, page, limit);
            const meta = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };
            return (0, response_1.sendSuccess)(res, orders, 'Orders retrieved', 200, meta);
        }
        catch (error) {
            next(error);
        }
    }
    async getOrderDetails(req, res, next) {
        try {
            const userId = req.user.id;
            const orderId = Number(req.params.id);
            const order = await service_1.orderService.getOrderById(userId, orderId);
            if (!order) {
                throw new errors_1.NotFoundError('Order not found');
            }
            return (0, response_1.sendSuccess)(res, order, 'Order details');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
exports.orderController = new OrderController();
//# sourceMappingURL=controller.js.map