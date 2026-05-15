import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Cart, CartItem } from '../types';
import { menuItems } from '../data/menu';

const router = express.Router();

// Store carts in memory (in production, use database)
const carts = new Map<string, Cart>();

router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const cart = carts.get(userId);

    if (!cart) {
      return res.json({
        success: true,
        data: {
          userId,
          items: [],
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
});

router.post('/:userId/add', (req, res) => {
  try {
    const { userId } = req.params;
    const { menuItemId, quantity = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        error: 'Menu item ID is required'
      });
    }

    // Find menu item
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    // Get or create cart
    let cart = carts.get(userId);
    if (!cart) {
      cart = {
        userId,
        items: [],
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.menuItemId === menuItemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity
      });
    }

    // Update total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    carts.set(userId, cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart'
    });
  }
});

router.post('/:userId/update', (req, res) => {
  try {
    const { userId } = req.params;
    const { menuItemId, quantity } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        error: 'Menu item ID is required'
      });
    }

    const cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const item = cart.items.find(item => item.menuItemId === menuItemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    item.quantity = Math.max(0, quantity);
    if (item.quantity === 0) {
      cart.items = cart.items.filter(i => i.menuItemId !== menuItemId);
    }

    // Update total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    carts.set(userId, cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item'
    });
  }
});

router.post('/:userId/remove', (req, res) => {
  try {
    const { userId } = req.params;
    const { menuItemId } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        error: 'Menu item ID is required'
      });
    }

    const cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item.menuItemId !== menuItemId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    carts.set(userId, cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
});

router.post('/:userId/clear', (req, res) => {
  try {
    const { userId } = req.params;
    const cart: Cart = {
      userId,
      items: [],
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    carts.set(userId, cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart'
    });
  }
});

export default router;
