import { Request, Response, NextFunction } from 'express';
import { orderService } from './service';
import { sendSuccess } from '../../shared/http/response';
import { NotFoundError } from '../../shared/http/errors';
import { components } from '../../docs/schema';

type OrderResponse = components['schemas']['OrderDTO'];
type OrderListResponse = components['schemas']['OrderDTO'][];
type PaginationMeta = components['schemas']['PaginationMeta'];

export class OrderController {
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { customer, address, paymentMethod } = req.body;
      
      const order = await orderService.createOrder(
        userId,
        customer,
        address,
        paymentMethod || 'CASH'
      );
      
      return sendSuccess<OrderResponse>(res, order, 'Order created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const { orders, total } = await orderService.getUserOrders(userId, page, limit);
      
      const meta: PaginationMeta = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
      
      return sendSuccess<OrderListResponse, PaginationMeta>(
        res,
        orders,
        'Orders retrieved',
        200,
        meta
      );
    } catch (error) {
      next(error);
    }
  }

  async getOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const orderId = Number(req.params.id);
      
      const order = await orderService.getOrderById(userId, orderId);
      if (!order) {
        throw new NotFoundError('Order not found');
      }
      
      return sendSuccess<OrderResponse>(res, order, 'Order details');
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
