const User = require('../models/User');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    res.json({
      success: true,
      cart: user.cart
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

// @desc    Add a product to the cart 
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    // If the product is already in the cart, increment its quantity atomically
    let user = await User.findOneAndUpdate(
      { _id: req.user._id, 'cart.product': productId },
      { $inc: { 'cart.$.quantity': qtyToAdd } },
      { new: true }
    ).populate('cart.product');

    // Otherwise, add it as a new cart entry
    if (!user) {
      user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { cart: { product: productId, quantity: qtyToAdd } } },
        { new: true }
      ).populate('cart.product');
    }

    res.json({
      success: true,
      message: 'Added to cart',
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

// @desc    Set the exact quantity for a product already in the cart
//          (quantity <= 0 removes the item)
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    if (quantity <= 0) {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { cart: { product: productId } } },
        { new: true }
      ).populate('cart.product');

      return res.json({
        success: true,
        message: 'Item removed from cart',
        cart: user.cart
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, 'cart.product': productId },
      { $set: { 'cart.$.quantity': quantity } },
      { new: true }
    ).populate('cart.product');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    res.json({
      success: true,
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

// @desc    Remove a single product from the cart
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

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { cart: { product: productId } } },
      { new: true }
    ).populate('cart.product');

    res.json({
      success: true,
      message: 'Removed from cart',
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

// @desc    Clear the entire cart in a single atomic operation
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { cart: [] } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart: user.cart
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