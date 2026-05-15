import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useCartStore } from '../store/cartStore';

const CartScreen = () => {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleRemove = (menuItemId: string, itemName: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${itemName}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removeItem(menuItemId),
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: clearCart,
          style: 'destructive',
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Start adding items from the menu or chat with AI!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <View key={item.menuItemId} style={styles.cartItem}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  updateQuantity(item.menuItemId, item.quantity - 1)
                }
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  updateQuantity(item.menuItemId, item.quantity + 1)
                }
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.itemTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>

            <TouchableOpacity
              onPress={() => handleRemove(item.menuItemId, item.name)}
            >
              <Text style={styles.removeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (8%):</Text>
          <Text style={styles.summaryValue}>
            ${(total * 0.08).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            ${(total * 1.08).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCart}
        >
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  itemsContainer: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 8,
    minWidth: 50,
    textAlign: 'right',
  },
  removeButton: {
    fontSize: 20,
    color: '#999',
    marginLeft: 8,
  },
  summaryContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTopF: 12,
    marginTop: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  clearButtonText: {
    color: '#999',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CartScreen;
