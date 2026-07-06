const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Living Room', 'Bedroom', 'Dining', 'Chairs', 'Storage', 'Office', 'Outdoor', 'Accessories']
  },
  color: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  specifications: {
    material: { type: String, trim: true },
    color: { type: String, trim: true },
    style: { type: String, trim: true },
    assembly: { type: String, trim: true },
    weightCapacity: { type: String, trim: true },
    warranty: { type: String, trim: true }
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Out of Stock', 'Discontinued'],
    default: 'Active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSpecial: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate SKU before saving
ProductSchema.pre('save', function(next) {
  if (!this.sku) {
    const prefix = this.category.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `VLR-${prefix}-${timestamp}`;
  }
  next();
});

// Calculate average rating
ProductSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.reviewCount = 0;
    return;
  }
  
  const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  this.averageRating = (total / this.ratings.length);
  this.reviewCount = this.ratings.length;
};

module.exports = mongoose.model('Product', ProductSchema);