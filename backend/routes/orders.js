const express = require('express');
const router = express.Router();

const {placeOrder,getOrder,getAllOrders,updateOrderStatus} = require('../services/order')

const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/orders/place
// Called when user clicks "Place Order" on checkout page
router.post('/place', placeOrder);

// GET /api/orders/:userId
// Fetch all orders for a user with their items
router.get('/user/:userId', getOrder);

// Admin Routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;