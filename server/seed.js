const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./db/connect');
const productsData = require('./data/products');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Existing data cleared');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@velarehome.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'Velaré',
        phone: '+251 911 234 567',
        address: {
          street: 'Bole Road',
          city: 'Addis Ababa',
          country: 'Ethiopia'
        }
      }
    });
    console.log(`Admin created: ${admin.email}`);

    // Create sample customer
    const customer = await User.create({
      username: 'customer',
      email: 'customer@example.com',
      password: 'Customer@123',
      role: 'customer',
      profile: {
        firstName: 'Test',
        lastName: 'Customer',
        phone: '+251 922 345 678',
        address: {
          street: 'CMC Road',
          city: 'Addis Ababa',
          country: 'Ethiopia'
        }
      }
    });
    console.log(`Customer created: ${customer.email}`);

    // Seed products one by one to trigger pre-save hooks
    console.log('Seeding products...');
    let seededCount = 0;
    
    for (const productData of productsData) {
      try {
        // Check if product with same SKU exists
        const existingProduct = await Product.findOne({ sku: productData.sku });
        if (existingProduct) {
          console.log(`Product ${productData.name} already exists, skipping...`);
          continue;
        }
        
        const product = new Product(productData);
        await product.save();
        seededCount++;
        console.log(`  ${productData.name} (${product.sku})`);
      } catch (error) {
        console.error(`   Failed to seed ${productData.name}:`, error.message);
      }
    }
    
    console.log(` ${seededCount} products seeded successfully`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('Admin Credentials:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@velarehome.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log(' Customer Credentials:');
    console.log('   Email: customer@example.com');
    console.log('   Password: Customer@123');

    process.exit(0);
  } catch (error) {
    console.error(' Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();