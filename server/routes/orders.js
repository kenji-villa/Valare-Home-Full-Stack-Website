const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const authenticateUser = require('../middlewares/authenticateUser');
const authorizeAdmin = require('../middlewares/authorizeAdmin');

// All routes require authentication
router.use(authenticateUser);

// User routes
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/stats', authorizeAdmin, orderController.getOrderStats);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/', authorizeAdmin, orderController.getAllOrders);
router.put('/:id/status', authorizeAdmin, orderController.updateOrderStatus);
router.delete('/:id', authorizeAdmin, orderController.deleteOrder);

module.exports = router;