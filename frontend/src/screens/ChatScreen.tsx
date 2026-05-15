import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../types';

const API_URL = 'http://localhost:3000/api';
const USER_ID = 'user-1';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m your AI ordering assistant. You can tell me things like "Add 2 spicy chicken sandwiches and a large water" or "Remove the cola". What would you like to order?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const setCart = useCartStore((state) => state.setCart);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        userId: USER_ID,
        message: input,
      });

      const { response: botResponse, items } = response.data;

      // Update cart if items were added
      if (items && items.length > 0) {
        setCart(items);
      }

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'user'
                ? styles.userBubble
                : styles.botBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.sender === 'user'
                  ? styles.userText
                  : styles.botText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FF6B35" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tell me what you'd like to order..."
          placeholderTextColor="#ccc"
          value={input}
          onChangeText={setInput}
          editable={!loading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            loading && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    marginVertical: 8,
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B35',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  loadingContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ChatScreen;
