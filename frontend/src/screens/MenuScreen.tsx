import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { MenuItem, CartItem } from '../types';
import { useCartStore } from '../store/cartStore';

const API_URL = 'http://localhost:3000/api';

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/menu`);
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      Alert.alert('Error', 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (item: MenuItem) => {
    const cartItem: CartItem = {
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    };
    addItem(cartItem);
    Alert.alert('Added', `${item.name} added to cart!`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddItem(item)}
            >
              <Text style={styles.addButtonText}>+ Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 15,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MenuScreen;
