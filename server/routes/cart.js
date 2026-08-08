const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const authenticateUser = require('../middlewares/authenticateUser');

router.get('/', authenticateUser, cartController.getCart);
router.post('/add', authenticateUser, cartController.addToCart);
router.put('/update', authenticateUser, cartController.updateCartItem);
router.delete('/remove', authenticateUser, cartController.removeFromCart);
router.delete('/clear', authenticateUser, cartController.clearCart);

module.exports = router;