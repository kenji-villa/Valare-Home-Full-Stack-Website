const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out cart items whose product was deleted
    const validCart = user.cart.filter(item => item.product != null);

    res.json({
      success: true,
      cart: validCart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);

    const existingIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      user.cart = user.cart.filter(
        i => i.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from cart',
      error: error.message
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};