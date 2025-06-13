import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Đăng ký user mới
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra user đã tồn tại
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Tạo user mới
    user = new User({
      username,
      email,
      password
    });

    // Mã hóa password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Tạo JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Đăng nhập user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Tạo JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/users/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cập nhật thông tin user
// @route   PUT /api/users/update
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;


    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cập nhật thống kê user
// @route   PUT /api/users/stats
// @access  Private
export const updateUserStats = async (req, res) => {
  try {
    const { coins, diamonds, level } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (coins !== undefined) user.coins = coins;
    if (diamonds !== undefined) user.diamonds = diamonds;
    if (level !== undefined) user.level = level;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error in updateUserStats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy thông tin profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật thông tin profile
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy số dư tài khoản
export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('coins diamonds');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      coins: user.coins,
      diamonds: user.diamonds
    });
  } catch (error) {
    console.error('Error in getBalance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật số dư
export const updateBalance = async (req, res) => {
  try {
    const { coins, diamonds } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (coins !== undefined) user.coins = coins;
    if (diamonds !== undefined) user.diamonds = diamonds;

    await user.save();
    res.json({
      coins: user.coins,
      diamonds: user.diamonds
    });
  } catch (error) {
    console.error('Error in updateBalance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy thống kê
export const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('stats level experience playTime');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      stats: user.stats,
      level: user.level,
      experience: user.experience,
      playTime: user.playTime
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Nhận coin từ chest
export const claimChestCoins = async (req, res) => {
  try {
    const { coins } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.coins += coins;
    user.lastChestClaim = Date.now();
    user.stats.totalCoinsEarned += coins;
    
    await user.save();

    res.json({
      success: true,
      coins: user.coins,
      totalCoinsEarned: user.stats.totalCoinsEarned
    });
  } catch (error) {
    console.error('Error in claimChestCoins:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Lấy thông tin stats của user
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cập nhật thời gian chơi trước khi trả về
    await user.updatePlayTime();

    res.json({
      coins: user.coins,
      diamonds: user.diamonds,
      lastChestClaim: user.lastChestClaim,
      playTime: {
        hours: user.playTime.hours,
        minutes: user.playTime.minutes,
        seconds: user.playTime.seconds
      }
    });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 