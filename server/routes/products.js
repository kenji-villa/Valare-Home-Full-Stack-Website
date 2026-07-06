const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/products');
const authenticateUser = require('../middlewares/authenticateUser');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const { uploadProductImages } = require('../middlewares/upload');

// Validation rules for product
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isNumeric().withMessage('Stock must be a number')
];

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/special', productController.getSpecialProducts);
router.get('/:id', productController.getProductById);

// Admin only routes
router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  uploadProductImages,
  productValidation,
  productController.createProduct
);

router.put(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  uploadProductImages,
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  productController.deleteProduct
);

router.put(
  '/:id/status',
  authenticateUser,
  authorizeAdmin,
  productController.updateProductStatus
);

module.exports = router;