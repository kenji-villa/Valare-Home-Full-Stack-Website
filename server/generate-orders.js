// server/generate-orders.js (Run this to create sample orders)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./db/connect');

dotenv.config();

const generateOrders = async () => {
  try {
    await connectDB();
    
    // Get a user to associate orders with
    const user = await User.findOne({ role: 'customer' });
    if (!user) {
      console.log('No customer user found. Please create a customer first.');
      process.exit(1);
    }
    
    // Get products
    const products = await Product.find({ status: 'Active' });
    if (products.length === 0) {
      console.log('No products found. Please seed products first.');
      process.exit(1);
    }
    
    // Delete existing orders (optional)
    await Order.deleteMany({});
    console.log('🗑️ Existing orders cleared');
    
    // Generate sample orders
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Delivered', 'Delivered'];
    const customers = [
      { name: 'Helen M.', email: 'helen@example.com' },
      { name: 'David K.', email: 'david@example.com' },
      { name: 'Sarah T.', email: 'sarah@example.com' },
      { name: 'Michael R.', email: 'michael@example.com' },
      { name: 'Grace L.', email: 'grace@example.com' },
      { name: 'John D.', email: 'john@example.com' },
      { name: 'Emily W.', email: 'emily@example.com' },
      { name: 'Robert C.', email: 'robert@example.com' },
    ];
    
    const orders = [];
    const now = new Date();
    
    // Generate orders with different dates (last 6 months)
    for (let i = 0; i < 30; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const numItems = Math.floor(Math.random() * 4) + 1;
      const selectedProducts = [];
      const usedProducts = new Set();
      
      for (let j = 0; j < numItems; j++) {
        let product;
        let attempts = 0;
        do {
          product = products[Math.floor(Math.random() * products.length)];
          attempts++;
        } while (usedProducts.has(product._id.toString()) && attempts < 20);
        
        if (!usedProducts.has(product._id.toString())) {
          usedProducts.add(product._id.toString());
          selectedProducts.push({
            product: product._id,
            name: product.name,
            price: product.price || (Math.random() * 500 + 100),
            quantity: Math.floor(Math.random() * 3) + 1,
            image: product.coverImage || product.images?.[0] || '/assets/images/placeholder.jpg'
          });
        }
      }
      
      if (selectedProducts.length === 0) continue;
      
      const subtotal = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = Math.random() > 0.6 ? 0 : 5.00;
      const total = subtotal + shippingCost;
      
      // Random date within last 6 months
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 180));
      
      orders.push({
        user: user._id,
        orderNumber: `ORD-2025-${String(i + 1).padStart(3, '0')}`,
        customer: customer.name,
        email: customer.email,
        items: selectedProducts,
        subtotal,
        shippingCost,
        discount: 0,
        total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
        deliveryMethod: Math.random() > 0.3 ? 'delivery' : 'pickup',
        paymentMethod: ['Credit Card', 'Bank Transfer', 'Cash on Delivery'][Math.floor(Math.random() * 3)],
        paymentStatus: Math.random() > 0.2 ? 'Paid' : 'Pending',
        shippingAddress: {
          fullName: customer.name,
          email: customer.email,
          phone: '+251 911 234 567',
          country: 'Ethiopia',
          city: ['Addis Ababa', 'Bole', 'CMC', 'Piassa', 'Summit'][Math.floor(Math.random() * 5)],
          state: 'Addis Ababa',
          zipCode: '1000',
          address: `${Math.floor(Math.random() * 1000)} ${['Bole Road', 'CMC Road', 'Piassa Street', 'Africa Avenue'][Math.floor(Math.random() * 4)]}`
        },
        createdAt: date,
        updatedAt: date
      });
    }
    
    // Insert orders
    const result = await Order.insertMany(orders);
    console.log(`✅ ${result.length} orders created successfully!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating orders:', error);
    process.exit(1);
  }
};

generateOrders();