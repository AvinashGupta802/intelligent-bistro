import express from 'express';
import { ChatRequest, ChatResponse, CartItem } from '../types';
import nlpService from '../services/nlpService';
import { menuItems } from '../data/menu';

const router = express.Router();

// Store user carts in memory (in production, use database)
const userCarts = new Map<string, { items: CartItem[]; total: number }>();

router.post('/', (req, res) => {
  try {
    const { userId, message } = req.body as ChatRequest;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        response: 'User ID and message are required'
      });
    }

    // Parse the order
    const parsed = nlpService.parseOrder(message);

    // Get or create user cart
    let cart = userCarts.get(userId) || { items: [], total: 0 };

    // Process intent
    if (parsed.intent === 'add_to_cart') {
      for (const item of parsed.items) {
        const menuItem = menuItems.find(m => m.id === item.menuItemId);
        if (menuItem && item.menuItemId) {
          const existingItem = cart.items.find((ci: CartItem) => ci.menuItemId === item.menuItemId);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            cart.items.push({
              menuItemId: item.menuItemId,
              name: menuItem.name,
              price: menuItem.price,
              quantity: item.quantity
            });
          }
        }
      }
    } else if (parsed.intent === 'remove_from_cart') {
      // Remove specific items
      cart.items = cart.items.filter((item: CartItem) => 
        !parsed.items.some(p => p.name.toLowerCase().includes(item.name.toLowerCase()))
      );
    } else if (parsed.intent === 'clear_cart') {
      cart.items = [];
    }

    // Calculate total
    cart.total = cart.items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

    // Save cart
    userCarts.set(userId, cart);

    // Generate response
    const response = nlpService.generateResponse(cart.items, parsed.intent);

    const chatResponse: ChatResponse = {
      success: true,
      response,
      items: cart.items,
      intent: parsed.intent,
      total: parseFloat(cart.total.toFixed(2))
    };

    res.json(chatResponse);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      response: 'An error occurred processing your request'
    });
  }
});

export default router;
