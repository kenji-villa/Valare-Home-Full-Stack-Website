const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const authenticateUser = require('../middlewares/authenticateUser');


router.use(authenticateUser);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:productId', cartController.updateCartItem);
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;