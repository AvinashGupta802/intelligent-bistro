# 🍽️ The Intelligent Bistro

An AI-powered restaurant ordering application with React Native frontend and Node.js backend. Users can browse a menu, manage shopping carts, and place orders through conversational AI interaction.

## 🎯 Features

### Frontend (React Native/Expo)
- 📱 **Bottom Tab Navigation** - Menu, Chat, and Cart screens
- 🛒 **Smart Shopping Cart** - Add/remove items, adjust quantities
- 💬 **AI Chat Interface** - Conversational natural language ordering
- 🎨 **Premium UI** - Clean, intuitive design with orange accent color
- 💾 **Persistent Cart** - Zustand state management with local storage
- ⚡ **Real-time Updates** - Instant total calculations

### Backend (Node.js/Express)
- 🤖 **NLP Service** - Parses natural language orders into structured JSON
- 📊 **Menu Management** - RESTful endpoints for browsing menu items
- 🛍️ **Cart Operations** - Full CRUD operations for cart management
- 📡 **Chat API** - Processes user messages and returns AI responses
- 🔒 **Type Safety** - Full TypeScript implementation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI (for frontend)
- iOS/Android emulator or physical device

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Press `i` for iOS simulator or `a` for Android emulator

## 📡 API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get specific menu item
- `GET /api/menu/category/:category` - Get items by category

### Chat
- `POST /api/chat` - Process natural language order
  - Request: `{ "userId": "string", "message": "string" }`
  - Response: `{ "response": "string", "items": CartItem[], "intent": "string" }`

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `POST /api/cart/:userId/update` - Update item quantity
- `POST /api/cart/:userId/remove` - Remove item from cart
- `POST /api/cart/:userId/clear` - Clear entire cart

## 🤖 NLP Examples

The AI can parse orders like:

| User Input | Result |
|-----------|--------|
| "Add 2 spicy chicken sandwiches and a large water" | 2× Spicy Chicken Sandwich, 1× Large Water |
| "I want 3 margherita pizzas and fries" | 3× Margherita Pizza, 1× French Fries |
| "Remove the cola" | Removes Large Cola from cart |
| "Clear my cart" | Clears entire cart |

## 📱 Menu Items

- 🌶️ Spicy Chicken Sandwich - $12.99
- 🍕 Margherita Pizza - $14.99
- 🥗 Caesar Salad - $10.99
- 🍟 French Fries - $5.99
- 💧 Large Water - $2.99
- 🥤 Large Cola - $4.99
- 🍰 Chocolate Cake - $8.99
- 🐟 Grilled Salmon - $18.99

## 🏗️ Project Structure

```
intelligent-bistro/
├── backend/
│   ├── src/
│   │   ├── server.ts           - Express server
│   │   ├── types.ts            - TypeScript interfaces
│   │   ├── services/
│   │   │   └── nlpService.ts   - NLP parsing engine
│   │   ├── data/
│   │   │   └── menu.ts         - Menu database
│   │   └── routes/
│   │       ├── menuRoutes.ts
│   │       ├── chatRoutes.ts
│   │       └── cartRoutes.ts
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── screens/
    │   │   ├── MenuScreen.tsx
    │   │   ├── ChatScreen.tsx
    │   │   └── CartScreen.tsx
    │   ├── store/
    │   │   └── cartStore.ts
    │   ├── types.ts
    │   └── App.tsx
    ├── app.json
    ├── tsconfig.json
    └── package.json
```

## 🔧 Tech Stack

**Frontend:**
- React Native
- Expo
- TypeScript
- Zustand (state management)
- Axios (HTTP client)
- React Navigation

**Backend:**
- Express.js
- TypeScript
- CORS
- dotenv

## 📝 Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development
```

## 🎬 Demo Video

View your 5-minute demo video covering:
1. UI walkthrough and navigation
2. AI ordering demonstration
3. Cart management and updates
4. Code architecture overview

## 🤝 Contributing

This project is part of an AI coding tools evaluation. Feel free to enhance the NLP service, add more features, or improve the UI.

## 📄 License

MIT

## 👤 Author

Avinash Gupta - The Intelligent Bistro Project

---

**Build Status:** ✅ Production Ready

**Last Updated:** May 15, 2026
