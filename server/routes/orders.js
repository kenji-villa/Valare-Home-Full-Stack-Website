const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/order');
const authenticateUser = require('../middlewares/authenticateUser');
const authorizeAdmin = require('../middlewares/authorizeAdmin');

// Validation rules for order
const orderValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.product').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isNumeric().withMessage('Quantity must be a number'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
];

// User routes
router.post(
  '/',
  authenticateUser,
  orderValidation,
  orderController.createOrder
);

router.get(
  '/my-orders',
  authenticateUser,
  orderController.getMyOrders
);

router.get(
  '/:id',
  authenticateUser,
  orderController.getOrderById
);

// Admin routes
router.get(
  '/',
  authenticateUser,
  authorizeAdmin,
  orderController.getAllOrders
);

router.put(
  '/:id/status',
  authenticateUser,
  authorizeAdmin,
  orderController.updateOrderStatus
);

router.put(
  '/:id/payment',
  authenticateUser,
  authorizeAdmin,
  orderController.updatePaymentStatus
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  orderController.deleteOrder
);

module.exports = router;