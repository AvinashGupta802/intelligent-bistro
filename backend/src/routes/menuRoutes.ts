import express from 'express';
import { menuItems } from '../data/menu';

const router = express.Router();

// Get all menu items
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu'
    });
  }
});

// Get menu item by ID
router.get('/:id', (req, res) => {
  try {
    const item = menuItems.find(item => item.id === req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu item'
    });
  }
});

// Get menu items by category
router.get('/category/:category', (req, res) => {
  try {
    const items = menuItems.filter(item => 
      item.category.toLowerCase() === req.params.category.toLowerCase()
    );
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items'
    });
  }
});

export default router;
