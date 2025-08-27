// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// Get all orders for the logged-in farmer
router.get('/', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user.userId }).populate('products.product');
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});
const { protect } = require('../middleware/auth'); // JWT auth middleware

router.get('/orders', protect, async (req, res) => {
  try {
    const userId = req.user.id;  // set by verifyToken middleware from token
    const orders = await Order.find({ buyer: userId }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get specific order details
// Get a specific order by ID (for OrderDetails)
router.get('/:id', authenticateUser, async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('products.product');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch order details' });
    }
  });
  

// Mark an order as completed
router.put('/:id/complete', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.farmer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to update this order' });
    }

    order.status = 'Completed';
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status.' });
  }
});

module.exports = router;
