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
