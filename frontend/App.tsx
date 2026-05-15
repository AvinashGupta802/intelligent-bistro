import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import MenuScreen from './src/screens/MenuScreen';
import ChatScreen from './src/screens/ChatScreen';
import CartScreen from './src/screens/CartScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#999',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🍽️</Text>,
          headerTitle: 'The Intelligent Bistro',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text>,
          headerTitle: 'AI Ordering',
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🛒</Text>,
          headerTitle: 'Your Cart',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
