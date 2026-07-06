const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4
dns.setDefaultResultOrder('ipv4first');

// Your connection string (copy exactly from Compass)
const MONGODB_URI = 'mongodb+srv://velare_admin:YourPassword@cluster0.l0mrbnk.mongodb.net/velare_db?retryWrites=true&w=majority';

console.log('🔍 Testing MongoDB Connection...');

async function test() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    console.log('✅ Connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  } catch (error) {
    console.error('❌ Failed:', error.message);
    console.log('\n📝 Try using this format instead:');
    console.log('MONGODB_URI=mongodb://velare_admin:YourPassword@cluster0.l0mrbnk.mongodb.net:27017/velare_db?retryWrites=true&w=majority');
  }
}

test();