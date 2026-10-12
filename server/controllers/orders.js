const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      subtotal,
      shippingCost,
      discount,
      total
    } = req.body;

    console.log('📦 Creating order for user:', req.user._id);
    console.log('📦 Items:', items?.length);

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is incomplete'
      });
    }

    // Validate and prepare items
    const validatedItems = [];
    for (const item of items) {
      // Check if product exists (optional - won't fail if not found)
      let productImage = item.image || '/assets/images/placeholder.jpg';
      let productName = item.name || 'Product';
      
      if (item.product) {
        try {
          const product = await Product.findById(item.product);
          if (product) {
            productName = product.name;
            productImage = product.coverImage || product.images?.[0] || productImage;
          }
        } catch (err) {
          console.log('Product lookup failed for:', item.product);
        }
      }

      validatedItems.push({
        product: item.product || undefined,
        name: productName,
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: productImage
      });
    }

    // Generate order number manually (backup for the pre-validate hook)
    const date = new Date();
    const year = date.getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${year}-${timestamp}${random}`;

    // Calculate subtotal from validated items
    const calculatedSubtotal = validatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const finalShippingCost = shippingCost || 0;
    const finalDiscount = discount || 0;
    const calculatedTotal = subtotal || calculatedSubtotal + finalShippingCost - finalDiscount;

    // Create order with explicit orderNumber
    const order = new Order({
      orderNumber,  // ← Explicitly set orderNumber
      user: req.user._id,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shippingCost: finalShippingCost,
      discount: finalDiscount,
      total: calculatedTotal,
      shippingAddress,
      deliveryMethod: deliveryMethod || 'delivery',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      status: 'Pending',
      statusHistory: [{
        status: 'Pending',
        changedBy: req.user._id,
        changedAt: new Date(),
        note: 'Order created'
      }]
    });

    await order.save();

    // ✅ Emit new order event to admins
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('new-order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        customer: req.user.username,
      });
    }

  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permission (user can only see their own orders)
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};



// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;

    if (!order.statusHistory) {
      order.statusHistory = [];
    }

    order.statusHistory.push({
      status: status,
      changedBy: req.user._id,
      changedAt: new Date(),
      note: note || `Status updated to ${status}`
    });

    if (status === 'Delivered' && order.paymentMethod === 'Cash on Delivery') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('user', 'username email');

    // ✅ Emit real-time event to specific user
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${order.user._id}`).emit('order-status-updated', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: status,
        updatedAt: order.updatedAt,
        message: `Your order ${order.orderNumber} is now ${status}`,
      });

      // Also notify admins
      io.to('admin-room').emit('admin-order-updated', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: status,
      });

      console.log(`🔔 Emitted status update for order ${order.orderNumber}`);
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// @desc    Delete order (admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await Order.findByIdAndDelete(orderId);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

// @desc    Cancel order (user)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership - allow admin too
    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel if not shipped or delivered
    if (['Shipped', 'Delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has been shipped or delivered'
      });
    }

    // Can't cancel already-cancelled order
    if (order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    order.status = 'Cancelled';

    if (!order.statusHistory) {
      order.statusHistory = [];
    }

    order.statusHistory.push({
      status: 'Cancelled',
      changedBy: req.user._id,
      changedAt: new Date(),
      note: 'Cancelled by customer'
    });

    await order.save();

    // Restore stock safely (don't fail whole operation if stock update fails)
    for (const item of order.items) {
      if (item.product) {
        try {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
          });
        } catch (err) {
          console.log('Stock restore failed for:', item.product);
        }
      }
    }

    // Emit socket event (optional, don't crash if not set up)
    try {
      const io = req.app.get('io');
      if (io) {
        io.to('admin-room').emit('order-cancelled', {
          orderId: order._id,
          orderNumber: order.orderNumber,
        });
        io.to(`user-${order.user._id}`).emit('order-cancelled', {
          orderId: order._id,
          orderNumber: order.orderNumber,
        });
      }
    } catch (socketErr) {
      console.log('Socket emit failed:', socketErr.message);
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// @desc    Get order statistics (admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'Pending' });
    const processing = await Order.countDocuments({ status: 'Processing' });
    const shipped = await Order.countDocuments({ status: 'Shipped' });
    const delivered = await Order.countDocuments({ status: 'Delivered' });
    const cancelled = await Order.countDocuments({ status: 'Cancelled' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats
};