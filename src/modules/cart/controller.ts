import { Request, Response, NextFunction } from 'express';
import { cartService } from './service';
import { sendSuccess } from '../../shared/api/http/response';
import { paths } from '../../docs/schema';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const cart = await cartService.getCart(userId);
      return sendSuccess(res, cart, 'Current cart');
    } catch (error) {
      next(error);
    }
  }

  async addItem(
    req: Request<any, any, paths['/cart/items']['post']['requestBody']['content']['application/json']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req as any).user.id;
      const { productVariantId, quantity } = req.body;
      const cart = await cartService.addItem(userId, productVariantId, quantity);
      return sendSuccess(res, cart, 'Product added to cart');
    } catch (error) {
      next(error);
    }
  }

  async updateItem(
    req: Request<any, any, paths['/cart/items/{itemId}']['patch']['requestBody']['content']['application/json']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req as any).user.id;
      const itemId = Number(req.params.itemId);
      const { quantity } = req.body;
      const cart = await cartService.updateItemQuantity(userId, itemId, quantity);
      return sendSuccess(res, cart, 'Quantity updated');
    } catch (error) {
      next(error);
    }
  }

  async removeItem(
    req: Request<any>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req as any).user.id;
      const itemId = Number(req.params.itemId);
      const cart = await cartService.removeItem(userId, itemId);
      return sendSuccess(res, cart, 'Product removed from cart');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await cartService.clearCart(userId);
      return sendSuccess(res, null, 'Cart cleared');
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
