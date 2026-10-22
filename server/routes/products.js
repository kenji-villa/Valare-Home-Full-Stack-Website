const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/products');
const authenticateUser = require('../middlewares/authenticateUser');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const { uploadProductImages } = require('../middlewares/upload');

// Validation rules for product creation/update
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  // Price OR (originalPrice + discount) is required - enforced in the controller
  body('price').optional({ checkFalsy: true }).isNumeric().withMessage('Price must be a number'),
  body('originalPrice').optional({ checkFalsy: true }).isNumeric().withMessage('Original price must be a number'),
  body('discount').optional({ checkFalsy: true }).isFloat({ min: 0, max: 99 }).withMessage('Discount must be between 0 and 99'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').optional().isNumeric().withMessage('Stock must be a number'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*').optional().isString().withMessage('Each image must be a string'),
  body('coverImage').optional().isString().withMessage('Cover image must be a string')
];

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/special', productController.getSpecialProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);

// Image upload route (Admin only)
router.post('/upload', authenticateUser, authorizeAdmin, uploadProductImages, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }
    
    const uploadedImages = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/products/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// Private routes (require authentication)
router.post('/:id/rate', authenticateUser, productController.addRating);

// Admin only routes
router.post('/', authenticateUser, authorizeAdmin, productValidation, productController.createProduct);
router.put('/:id', authenticateUser, authorizeAdmin, productValidation, productController.updateProduct);
router.delete('/:id', authenticateUser, authorizeAdmin, productController.deleteProduct);

module.exports = router;