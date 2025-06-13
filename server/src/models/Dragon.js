import mongoose from "mongoose";

const dragonSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    enum: ['fire', 'water', 'earth', 'air', 'light', 'dark']
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  level: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 100
  },
  experience: {
    type: Number,
    default: 0
  },
  stats: {
    health: { type: Number, default: 100 },
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 5 },
    speed: { type: Number, default: 5 }
  },
  skills: [{
    name: String,
    damage: Number,
    cooldown: Number,
    unlockLevel: Number
  }],
  coinsPerMinute: {
    type: Number,
    default: 1
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: false
  },
  lastFed: {
    type: Date,
    default: Date.now
  },
  happiness: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Tính toán coins per minute dựa trên level và rarity
dragonSchema.methods.calculateCoinsPerMinute = function() {
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  };
  
  return Math.floor(this.level * rarityMultiplier[this.rarity]);
};

// Tính exp cần thiết cho level tiếp theo
dragonSchema.methods.getNextLevelExp = function() {
  return Math.floor(100 * Math.pow(1.5, this.level - 1));
};

// Cập nhật stats khi lên level
dragonSchema.methods.updateStats = function() {
  const rarityMultiplier = {
    common: 1,
    rare: 1.2,
    epic: 1.5,
    legendary: 2
  };
  
  this.stats.health = Math.floor(100 * Math.pow(1.1, this.level - 1) * rarityMultiplier[this.rarity]);
  this.stats.attack = Math.floor(10 * Math.pow(1.1, this.level - 1) * rarityMultiplier[this.rarity]);
  this.stats.defense = Math.floor(5 * Math.pow(1.1, this.level - 1) * rarityMultiplier[this.rarity]);
  this.stats.speed = Math.floor(5 * Math.pow(1.05, this.level - 1) * rarityMultiplier[this.rarity]);
};

const Dragon = mongoose.model('Dragon', dragonSchema);
export default Dragon; 