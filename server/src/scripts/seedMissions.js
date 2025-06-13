import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mission from '../models/Mission.js';

dotenv.config();

const dailyMissions = [
  {
    title: "Add",
    description: "Add dragon forge to your home screen.",
    type: "daily",
    requirements: {
      type: "add_to_homescreen",
      target: 1
    },
    rewards: {
      coins: 100
    },
    isActive: true,
    resetTime: "never"
  },
  {
    title: "Training",
    description: "Upgrade your dragon to Level 10.",
    type: "daily",
    requirements: {
      type: "level_up_dragon",
      target: 10
    },
    rewards: {
      coins: 100
    },
    isActive: true,
    resetTime: "never"
  },
  {
    title: "Subscribe",
    description: "Subscribe our channel on Youtube, X and Fb",
    type: "daily",
    requirements: {
      type: "subscribe_channels",
      target: 3
    },
    rewards: {
      coins: 100
    },
    isActive: true,
    resetTime: "never"
  },
  {
    title: "Coin harvest",
    description: "DragonCoin reach 1000",
    type: "daily",
    requirements: {
      type: "collect_coins",
      target: 1000
    },
    rewards: {
      coins: 200
    },
    isActive: true,
    resetTime: "daily"
  }
];

const specialMissions = [
  {
    title: "Upgrade",
    description: "Upgrade your dragon",
    type: "special",
    requirements: {
      type: "level_up_dragon",
      target: 1
    },
    rewards: {
      diamonds: 10
    },
    isActive: true,
    resetTime: "never"
  },
  {
    title: "Sign in",
    description: "Sign in",
    type: "special",
    requirements: {
      type: "sign_in",
      target: 1
    },
    rewards: {
      diamonds: 10
    },
    isActive: true,
    resetTime: "daily"
  },
  {
    title: "Receive dragon diamond",
    description: "Click to receive your dragon diamond",
    type: "special",
    requirements: {
      type: "claim_diamonds",
      target: 1
    },
    rewards: {
      diamonds: 10
    },
    isActive: true,
    resetTime: "daily"
  },
  {
    title: "Receive DragonCoin",
    description: "Click to receive your DragonCoin in home page",
    type: "special",
    requirements: {
      type: "claim_coins",
      target: 1
    },
    rewards: {
      diamonds: 10
    },
    isActive: true,
    resetTime: "daily"
  },
  {
    title: "Share",
    description: "Share dragon forge 0/1",
    type: "special",
    requirements: {
      type: "share_game",
      target: 1
    },
    rewards: {
      diamonds: 10
    },
    isActive: true,
    resetTime: "never"
  }
];

const seedMissions = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Xóa tất cả missions cũ
    await Mission.deleteMany({});
    console.log('Cleared existing missions');

    // Thêm missions mới
    await Mission.insertMany([...dailyMissions, ...specialMissions]);
    console.log('Added new missions');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding missions:', error);
    process.exit(1);
  }
};

seedMissions(); 