import express, { Router, Request, Response } from 'express';
import { CartItem } from '../types';

const router = Router();

// In-memory cart storage (in production, use database)
const carts: Map<string, CartItem[]> = new Map();

// Get cart for user
router.get('/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const cart = carts.get(userId) || [];

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.json({
    success: true,
    data: {
      userId,
      items: cart,
      itemCount: cart.length,
      total: parseFloat(total.toFixed(2)),
    },
  });
});

// Add item to cart
router.post('/:userId/add', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { menuItemId, name, price, quantity } = req.body;

    if (!menuItemId || !name || price === undefined || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: menuItemId, name, price, quantity',
      });
    }

    const cart = carts.get(userId) || [];
    const existingItem = cart.find((item) => item.menuItemId === menuItemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ menuItemId, name, price, quantity });
    }

    carts.set(userId, cart);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      success: true,
      data: {
        userId,
        items: cart,
        total: parseFloat(total.toFixed(2)),
        message: `Added ${quantity} ${name} to cart`,
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
    });
  }
});

// Remove item from cart
router.post('/:userId/remove', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { menuItemId } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        error: 'menuItemId is required',
      });
    }

    const cart = carts.get(userId) || [];
    const filteredCart = cart.filter((item) => item.menuItemId !== menuItemId);

    if (filteredCart.length === cart.length) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart',
      });
    }

    carts.set(userId, filteredCart);

    const total = filteredCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      success: true,
      data: {
        userId,
        items: filteredCart,
        total: parseFloat(total.toFixed(2)),
        message: 'Item removed from cart',
      },
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart',
    });
  }
});

// Update item quantity
router.post('/:userId/update', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'menuItemId and quantity are required',
      });
    }

    const cart = carts.get(userId) || [];
    const item = cart.find((item) => item.menuItemId === menuItemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart',
      });
    }

    if (quantity <= 0) {
      const filteredCart = cart.filter((item) => item.menuItemId !== menuItemId);
      carts.set(userId, filteredCart);

      const total = filteredCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return res.json({
        success: true,
        data: {
          userId,
          items: filteredCart,
          total: parseFloat(total.toFixed(2)),
          message: 'Item removed from cart',
        },
      });
    }

    item.quantity = quantity;
    carts.set(userId, cart);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      success: true,
      data: {
        userId,
        items: cart,
        total: parseFloat(total.toFixed(2)),
        message: `Updated quantity to ${quantity}`,
      },
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart',
    });
  }
});

// Clear cart
router.post('/:userId/clear', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    carts.delete(userId);

    res.json({
      success: true,
      data: {
        userId,
        items: [],
        total: 0,
        message: 'Cart cleared',
      },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
    });
  }
});

export default router;
