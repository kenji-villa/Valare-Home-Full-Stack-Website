const mongoose = require('mongoose');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Build filter object
    const filter = { status: 'Active' };
    
    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Color filter
    if (req.query.color) {
      filter.color = req.query.color;
    }
    
    // Material filter
    if (req.query.material) {
      filter.material = req.query.material;
    }
    
    // Rating filter
    if (req.query.minRating) {
      filter.averageRating = { $gte: parseFloat(req.query.minRating) };
    }
    
    // Search filter
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    let sortObj = {};
    switch(sort) {
      case 'price_low':
        sortObj = { price: 1 };
        break;
      case 'price_high':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { averageRating: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }
    
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(filter);
    
    res.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('Getting product with ID:', productId);
    
    let product;
    
    // Check if ID is valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    } else {
      // If not a valid ObjectId, try to find by sku or other field
      product = await Product.findOne({ sku: productId });
      
      // If still not found, try to find by name (case insensitive)
      if (!product) {
        product = await Product.findOne({ 
          name: { $regex: new RegExp(productId, 'i') } 
        });
      }
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log('Product found:', product.name);
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const productData = req.body;
    console.log('Creating product with data:', productData);
    
    // Validate images array
    if (!productData.images || productData.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }
    
    // Ensure images is an array of strings
    if (typeof productData.images === 'string') {
      productData.images = [productData.images];
    }
    
    // Set cover image as first image if not provided
    if (!productData.coverImage && productData.images && productData.images.length > 0) {
      productData.coverImage = productData.images[0];
    }
    
    // Calculate discount if originalPrice is provided
    if (productData.originalPrice && productData.originalPrice > productData.price) {
      productData.discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
    } else {
      productData.discount = 0;
    }
    
    // Set status based on stock
    if (productData.stock === 0 || productData.stock === '0') {
      productData.status = 'Out of Stock';
    } else {
      productData.status = 'Active';
    }
    
    // Generate SKU if not provided
    if (!productData.sku) {
      const prefix = productData.category.substring(0, 2).toUpperCase();
      const timestamp = Date.now().toString().slice(-6);
      productData.sku = `VLR-${prefix}-${timestamp}`;
    }
    
    const product = await Product.create(productData);
    console.log('Product created successfully:', product._id);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists. Please try again.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const updateData = req.body;
    
    // Recalculate discount if price or originalPrice changed
    if (updateData.price || updateData.originalPrice) {
      const newPrice = updateData.price || product.price;
      const newOriginalPrice = updateData.originalPrice || product.originalPrice;
      
      if (newOriginalPrice && newOriginalPrice > newPrice) {
        updateData.discount = Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100);
      } else {
        updateData.discount = 0;
      }
    }
    
    // Update status based on stock
    if (updateData.stock !== undefined) {
      updateData.status = updateData.stock === 0 ? 'Out of Stock' : 'Active';
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists'
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(`Attempting to delete product with ID: ${productId}`);
    
    // Check if ID is provided
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    // Find and delete the product
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log(`Product deleted successfully: ${product.name} (${product._id})`);
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      product: {
        id: product._id,
        name: product.name
      }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};



// @desc    Add product rating
// @route   POST /api/products/:id/rate
// @access  Private
const addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user already rated this product
    const existingRating = product.ratings.find(r => r.user.toString() === userId.toString());
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      if (review) existingRating.review = review;
      existingRating.date = new Date();
    } else {
      // Add new rating
      product.ratings.push({
        user: userId,
        rating,
        review: review || ''
      });
    }
    
    // Recalculate average rating
    product.calculateAverageRating();
    await product.save();
    
    res.json({
      success: true,
      message: 'Rating added successfully',
      averageRating: product.averageRating,
      reviewCount: product.reviewCount
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add rating',
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, status: 'Active' })
      .limit(6)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
};

// @desc    Get special products (display only)
// @route   GET /api/products/special
// @access  Public
const getSpecialProducts = async (req, res) => {
  try {
    const products = await Product.find({ isSpecial: true, status: 'Active' })
      .limit(6)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get special products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch special products',
      error: error.message
    });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      status: 'Active'
    })
      .limit(4)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      products: relatedProducts
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related products',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addRating,
  getFeaturedProducts,
  getSpecialProducts,
  getRelatedProducts
};