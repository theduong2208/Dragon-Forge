import Dragon from '../models/Dragon.js';
import User from '../models/User.js';

// @desc    Tạo rồng mới
// @route   POST /api/dragons
// @access  Private
export const createDragon = async (req, res) => {
  try {
    const { name, type } = req.body;
    const owner = req.user._id;

    // Random rarity dựa trên tỷ lệ
    const rarityChance = Math.random() * 100;
    let rarity;
    if (rarityChance < 50) rarity = 'common';
    else if (rarityChance < 80) rarity = 'rare';
    else if (rarityChance < 95) rarity = 'epic';
    else rarity = 'legendary';

    const dragon = await Dragon.create({
      name,
      type,
      rarity,
      owner
    });

    // Cập nhật stats ban đầu
    dragon.updateStats();
    dragon.coinsPerMinute = dragon.calculateCoinsPerMinute();
    await dragon.save();

    res.status(201).json(dragon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Lấy danh sách rồng của user
// @route   GET /api/dragons
// @access  Private
export const getDragons = async (req, res) => {
  try {
    const dragons = await Dragon.find({ owner: req.user._id });
    res.json(dragons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cho rồng ăn để tăng exp
// @route   POST /api/dragons/:id/feed
// @access  Private
export const feedDragon = async (req, res) => {
  try {
    const dragon = await Dragon.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    });

    if (!dragon) {
      return res.status(404).json({ message: 'Dragon not found' });
    }

    // Tăng exp và kiểm tra level up
    dragon.experience += 10;
    dragon.happiness = Math.min(100, dragon.happiness + 10);
    dragon.lastFed = Date.now();

    const nextLevelExp = dragon.getNextLevelExp();
    if (dragon.experience >= nextLevelExp && dragon.level < 100) {
      dragon.level += 1;
      dragon.experience = 0;
      dragon.updateStats();
      dragon.coinsPerMinute = dragon.calculateCoinsPerMinute();
    }

    await dragon.save();
    res.json(dragon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thu thập xu từ rồng
// @route   POST /api/dragons/:id/collect
// @access  Private
export const collectCoins = async (req, res) => {
  try {
    const dragon = await Dragon.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!dragon) {
      return res.status(404).json({ message: 'Dragon not found' });
    }

    const user = await User.findById(req.user._id);
    const lastCollection = dragon.lastFed;
    const now = Date.now();
    const minutesPassed = Math.floor((now - lastCollection) / (1000 * 60));
    const coinsEarned = Math.floor(minutesPassed * dragon.coinsPerMinute);

    // Cập nhật số xu của user
    user.coins += coinsEarned;
    await user.save();

    // Cập nhật thời gian thu thập cuối
    dragon.lastFed = now;
    await dragon.save();

    res.json({
      coinsEarned,
      totalCoins: user.coins,
      nextCollectionTime: now
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đặt rồng làm active
// @route   PUT /api/dragons/:id/activate
// @access  Private
export const activateDragon = async (req, res) => {
  try {
    // Tắt tất cả rồng active
    await Dragon.updateMany(
      { owner: req.user._id, isActive: true },
      { isActive: false }
    );

    // Bật rồng được chọn
    const dragon = await Dragon.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { isActive: true },
      { new: true }
    );

    if (!dragon) {
      return res.status(404).json({ message: 'Dragon not found' });
    }

    res.json(dragon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

export const deleteDragon = async (req, res) => {
  try {
    const dragon = await Dragon.findByIdAndDelete(req.params.id);
    res.json(dragon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Thêm vào dragon controller
// @desc    Ghép 2 rồng thành 1 rồng level cao hơn
// @route   PUT /api/dragons/:id/merge
// @access  Private
export const mergeDragons = async (req, res) => {
  try {
    const { dragonId1, dragonId2 } = req.body;
    const userId = req.user._id;

    // Tìm 2 rồng cần ghép
    const [dragon1, dragon2] = await Promise.all([
      Dragon.findOne({ _id: dragonId1, owner: userId }),
      Dragon.findOne({ _id: dragonId2, owner: userId })
    ]);

    if (!dragon1 || !dragon2) {
      return res.status(404).json({ message: 'Dragons not found' });
    }

    // Kiểm tra điều kiện ghép
    if (dragon1.level !== dragon2.level) {
      return res.status(400).json({ message: 'Dragons must be same level to merge' });
    }

    if (dragon1.level >= 5) {
      return res.status(400).json({ message: 'Cannot merge max level dragons' });
    }

    // Xóa 2 rồng cũ
    await Promise.all([
      Dragon.findByIdAndDelete(dragonId1),
      Dragon.findByIdAndDelete(dragonId2)
    ]);

    // Tạo rồng mới với level cao hơn
    const newLevel = dragon1.level + 1;
    const newDragon = await Dragon.create({
      name: `${dragon1.name} Merged`,
      type: dragon1.type,
      level: newLevel,
      rarity: dragon1.rarity,
      owner: userId
    });

    // Cập nhật stats cho rồng mới
    newDragon.updateStats();
    newDragon.coinsPerMinute = newDragon.calculateCoinsPerMinute();
    await newDragon.save();

    res.json({
      message: 'Dragons merged successfully',
      newDragon,
      deletedDragons: [dragonId1, dragonId2]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật toàn bộ dữ liệu rồng của user
// @route   PUT /api/dragons/:id/sync
// @access  Private
export const syncDragons = async (req, res) => {
  try {
    const { dragons } = req.body; // Array of {level, count}
    const userId = req.user._id;

    // Xóa tất cả rồng hiện tại của user
    await Dragon.deleteMany({ owner: userId });

    // Tạo lại rồng theo dữ liệu mới
    const newDragons = [];
    for (const dragonData of dragons) {
      for (let i = 0; i < dragonData.count; i++) {
        const dragon = await Dragon.create({
          name: `Dragon Level ${dragonData.level}`,
          type: 'fire', // Có thể random hoặc để user chọn
          level: dragonData.level,
          rarity: 'common', // Có thể tính toán dựa trên level
          owner: userId
        });

        dragon.updateStats();
        dragon.coinsPerMinute = dragon.calculateCoinsPerMinute();
        await dragon.save();
        newDragons.push(dragon);
      }
    }

    res.json({
      message: 'Dragons synced successfully',
      dragons: newDragons
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};