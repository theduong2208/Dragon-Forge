import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['food', 'potion', 'equipment', 'decoration']
  },
  effects: {
    health: Number,
    attack: Number,
    defense: Number,
    speed: Number,
    luck: Number,
    coins: Number,
    experience: Number
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'rare', 'epic', 'legendary', 'mythical'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Phương thức để lấy giá trị hiệu ứng của item
itemSchema.methods.getEffectValue = function(effectType) {
  return this.effects?.[effectType] || 0;
};

// Phương thức để kiểm tra xem item có hiệu ứng không
itemSchema.methods.hasEffect = function(effectType) {
  return !!this.effects?.[effectType];
};

// Phương thức để áp dụng hiệu ứng lên dragon
itemSchema.methods.applyEffects = function(dragon) {
  if (!this.effects) return dragon;

  const stats = { ...dragon.stats };
  
  for (const [effect, value] of Object.entries(this.effects)) {
    if (stats[effect] !== undefined) {
      stats[effect] += value;
    }
  }

  return { ...dragon, stats };
};

const Item = mongoose.model('Item', itemSchema);

export default Item; 