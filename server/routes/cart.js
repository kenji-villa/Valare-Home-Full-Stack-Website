const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const authenticateUser = require('../middlewares/authenticateUser');

// All cart routes require authentication
router.use(authenticateUser);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;