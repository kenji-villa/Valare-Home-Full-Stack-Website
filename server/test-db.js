const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Force IPv4
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB Connection...');
console.log(`📡 URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')}`);

async function testConnection() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      tls: true,
      retryWrites: true,
    });
    
    console.log('✅ Connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.name || 'Not specified (will use default)'}`);
    console.log(`🖥️ Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port}`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your network connection');
    console.error('2. Verify IP is whitelisted in MongoDB Atlas');
    console.error('3. Check your password is correct');
    console.error('4. Try using a VPN or different network');
    process.exit(1);
  }
}

testConnection();