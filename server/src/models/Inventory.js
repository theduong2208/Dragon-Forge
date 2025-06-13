import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dragons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dragon'
  }],
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0
    }
  }],
  capacity: {
    type: Number,
    default: 50,
    min: 10
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware để kiểm tra số lượng item
inventorySchema.pre('save', function(next) {
  const totalItems = this.dragons.length + this.items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > this.capacity) {
    next(new Error('Inventory capacity exceeded'));
  }
  next();
});

// Phương thức để thêm dragon
inventorySchema.methods.addDragon = async function(dragonId) {
  if (this.dragons.length + this.items.length >= this.capacity) {
    throw new Error('Inventory is full');
  }
  this.dragons.push(dragonId);
  return this.save();
};

// Phương thức để thêm item
inventorySchema.methods.addItem = async function(itemId, quantity = 1) {
  const existingItem = this.items.find(item => item.itemId.equals(itemId));
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    if (this.dragons.length + this.items.length >= this.capacity) {
      throw new Error('Inventory is full');
    }
    this.items.push({ itemId, quantity });
  }
  
  return this.save();
};

// Phương thức để xóa item
inventorySchema.methods.removeItem = async function(itemId, quantity = 1) {
  const itemIndex = this.items.findIndex(item => item.itemId.equals(itemId));
  
  if (itemIndex === -1) {
    throw new Error('Item not found in inventory');
  }
  
  const item = this.items[itemIndex];
  if (item.quantity < quantity) {
    throw new Error('Not enough items');
  }
  
  item.quantity -= quantity;
  if (item.quantity === 0) {
    this.items.splice(itemIndex, 1);
  }
  
  return this.save();
};

// Phương thức để kiểm tra item
inventorySchema.methods.hasItem = function(itemId, quantity = 1) {
  const item = this.items.find(item => item.itemId.equals(itemId));
  return item && item.quantity >= quantity;
};

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory; 