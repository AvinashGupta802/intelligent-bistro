export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  userId: string;
  message: string;
}

export interface ChatResponse {
  response: string;
  items?: CartItem[];
  intent: string;
  total?: number;
  success: boolean;
}

export interface NLPResult {
  intent: 'add_to_cart' | 'remove_from_cart' | 'clear_cart' | 'view_cart' | 'unknown';
  items: Array<{
    name: string;
    quantity: number;
    menuItemId?: string;
  }>;
  confidence: number;
}
