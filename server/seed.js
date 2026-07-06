const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./db/connect');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin already exists');
      return;
    }

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

    console.log('Admin created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log('Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
seedAdmin();