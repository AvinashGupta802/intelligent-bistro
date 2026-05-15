import { menuItems } from '../data/menu';
import { NLPResult, CartItem } from '../types';

class NLPService {
  private menuItems = menuItems;

  parseOrder(message: string): NLPResult {
    const lowerMessage = message.toLowerCase().trim();

    // Determine intent
    let intent: 'add_to_cart' | 'remove_from_cart' | 'clear_cart' | 'view_cart' | 'unknown' = 'unknown';

    if (lowerMessage.includes('remove') || lowerMessage.includes('delete') || lowerMessage.includes('don\'t want')) {
      intent = 'remove_from_cart';
    } else if (lowerMessage.includes('clear') || lowerMessage.includes('empty')) {
      intent = 'clear_cart';
    } else if (lowerMessage.includes('show') || lowerMessage.includes('view') || lowerMessage.includes('my cart') || lowerMessage.includes('what\'s')) {
      intent = 'view_cart';
    } else if (lowerMessage.includes('add') || lowerMessage.includes('want') || lowerMessage.includes('get') || lowerMessage.includes('i\'ll take')) {
      intent = 'add_to_cart';
    }

    // Extract items
    const items = this.extractItems(message, intent);

    return {
      intent,
      items,
      confidence: items.length > 0 ? 0.95 : 0.5
    };
  }

  private extractItems(message: string, intent: string): Array<{ name: string; quantity: number; menuItemId?: string }> {
    const items: Array<{ name: string; quantity: number; menuItemId?: string }> = [];
    const lowerMessage = message.toLowerCase();

    // Extract quantities (e.g., "2", "two", "a", "one")
    const quantityMap: { [key: string]: number } = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'a': 1, 'an': 1
    };

    // Split message into potential item mentions
    const parts = message.split(/[,;and]/i);

    for (const part of parts) {
      const trimmedPart = part.trim().toLowerCase();

      // Skip empty parts
      if (!trimmedPart) continue;

      let quantity = 1;
      let itemName = trimmedPart;

      // Check for quantity prefix (e.g., "2 sandwiches", "three pizzas")
      const quantityMatch = trimmedPart.match(/(\d+|\w+)\s+/);
      if (quantityMatch) {
        const quantityStr = quantityMatch[1].toLowerCase();
        if (quantityMap[quantityStr] !== undefined) {
          quantity = quantityMap[quantityStr];
          itemName = trimmedPart.replace(quantityMatch[0], '').trim();
        } else if (!isNaN(parseInt(quantityStr))) {
          quantity = parseInt(quantityStr);
          itemName = trimmedPart.replace(quantityMatch[0], '').trim();
        }
      }

      // Find matching menu item
      const matchedItem = this.menuItems.find(item =>
        this.fuzzyMatch(itemName, item.name.toLowerCase()) ||
        this.fuzzyMatch(itemName, item.category.toLowerCase()) ||
        itemName.includes('large') && item.name.includes('Water'),
      );

      if (matchedItem) {
        items.push({
          name: matchedItem.name,
          quantity: Math.max(1, quantity),
          menuItemId: matchedItem.id
        });
      }
    }

    return items;
  }

  private fuzzyMatch(input: string, target: string): boolean {
    // Check if target contains significant parts of input
    const inputWords = input.split(/\s+/);
    return inputWords.some(word => 
      word.length > 2 && target.includes(word)
    );
  }

  generateResponse(items: CartItem[], intent: string): string {
    if (intent === 'add_to_cart' && items.length > 0) {
      const itemNames = items.map(item => `${item.quantity}× ${item.name}`).join(', ');
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
      return `Great! I've added ${itemNames} to your cart! 🛒 Your total is now $${total}.`;
    } else if (intent === 'remove_from_cart') {
      return `Removed items from your cart. Is there anything else I can help you with?`;
    } else if (intent === 'clear_cart') {
      return `Your cart has been cleared! Ready to start fresh? 🧹`;
    } else if (intent === 'view_cart') {
      return `Your cart is ready! You can view it in the Cart tab.`;
    } else {
      return `I'm not sure I understood that. You can say things like "Add 2 spicy sandwiches and a large water" or "Remove the cola".`;
    }
  }
}

export default new NLPService();
