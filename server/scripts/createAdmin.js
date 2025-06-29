const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');
require('dotenv').config({ path: '../config.env' });

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/subha-laxmi-jewellery');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('Email: admin@subhalaxmi.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create default admin user
    const adminUser = new AdminUser({
      username: 'admin',
      email: 'admin@subhalaxmi.com',
      password: 'admin123',
      role: 'super-admin',
      isActive: true
    });

    await adminUser.save();
    
    console.log('✅ Default admin user created successfully!');
    console.log('==========================================');
    console.log('🔐 Admin Login Credentials:');
    console.log('Username: admin');
    console.log('Email: admin@subhalaxmi.com');
    console.log('Password: admin123');
    console.log('==========================================');
    console.log('⚠️  IMPORTANT: Change these credentials after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createDefaultAdmin(); 