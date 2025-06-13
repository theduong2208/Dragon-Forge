import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Inventory from '../models/Inventory.js';

dotenv.config();

const seedUsers = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Inventory.deleteMany({});
    console.log('Cleaned old data');

    // Tạo user mẫu
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      coins: 1000,
      diamonds: 10,
      stats: {
        totalCoinsEarned: 0,
        totalDiamondsEarned: 0,
        dragonsCreated: 0,
        missionsCompleted: 0,
        loginDays: 0,
        lastLogin: new Date()
      }
    });

    // Lưu user
    await user.save();

    // Tạo inventory cho user
    const inventory = new Inventory({
      userId: user._id,
      capacity: 50
    });
    await inventory.save();

    console.log('Created test user:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers(); 