const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config({ path: './config.env' });

const categories = [
  {
    name: 'Rings',
    description: 'Elegant rings for every occasion',
    icon: '💍',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop',
    color: 'gold',
    gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    sortOrder: 1,
    isActive: true
  },
  {
    name: 'Necklaces',
    description: 'Stunning necklaces to complement your style',
    icon: '📿',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop',
    color: 'ruby',
    gradient: 'bg-gradient-to-br from-red-400 to-red-600',
    sortOrder: 2,
    isActive: true
  },
  {
    name: 'Bracelets',
    description: 'Beautiful bracelets for wrist elegance',
    icon: '💫',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop',
    color: 'emerald',
    gradient: 'bg-gradient-to-br from-green-400 to-green-600',
    sortOrder: 3,
    isActive: true
  },
  {
    name: 'Earrings',
    description: 'Dazzling earrings to frame your face',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop',
    color: 'sapphire',
    gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
    sortOrder: 4,
    isActive: true
  },
  {
    name: 'Pendants',
    description: 'Exquisite pendants for neck adornment',
    icon: '💎',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=300&fit=crop',
    color: 'purple',
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
    sortOrder: 5,
    isActive: true
  },
  {
    name: 'Chains',
    description: 'Premium chains for versatile styling',
    icon: '🔗',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop',
    color: 'silver',
    gradient: 'bg-gradient-to-br from-gray-300 to-gray-500',
    sortOrder: 6,
    isActive: true
  },
  {
    name: 'Gold Bars',
    description: 'Investment grade gold bars',
    icon: '🥇',
    image: 'https://images.unsplash.com/photo-1610375461369-d613b5633e0b?w=400&h=300&fit=crop',
    color: 'gold',
    gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    sortOrder: 7,
    isActive: true
  },
  {
    name: 'Silver Bars',
    description: 'Pure silver investment bars',
    icon: '🥈',
    image: 'https://images.unsplash.com/photo-1610375461369-d613b5633e0b?w=400&h=300&fit=crop',
    color: 'silver',
    gradient: 'bg-gradient-to-br from-gray-300 to-gray-500',
    sortOrder: 8,
    isActive: true
  }
];

const createCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/subha-laxmi-jewellery', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Create new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories:`);

    createdCategories.forEach(category => {
      console.log(`- ${category.name} (${category.icon})`);
    });

    console.log('\nCategories created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating categories:', error);
    process.exit(1);
  }
};

createCategories(); 