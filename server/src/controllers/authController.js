import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Inventory from '../models/Inventory.js';
import { generateToken } from '../utils/generateToken.js';
import { generateTelegramId } from '../utils/generateTelegramId.js';

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Kiểm tra email đã tồn tại
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }

    // Kiểm tra username đã tồn tại
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'Username already exists' 
      });
    }

    // Tạo telegramId ngẫu nhiên và kiểm tra trùng lặp
    let telegramId;
    let isUniqueTelegramId = false;
    while (!isUniqueTelegramId) {
      telegramId = generateTelegramId();
      const existingUser = await User.findOne({ telegramId });
      if (!existingUser) {
        isUniqueTelegramId = true;
      }
    }

    // Tạo user mới với số dư ban đầu và telegramId
    user = new User({
      username,
      email,
      password,
      telegramId,
      registrationDate: new Date(),
      coins: 0,     // Bắt đầu với 0 coins
      diamonds: 0,  // Bắt đầu với 0 diamonds
      stats: {
        lastLogin: Date.now(),
        loginDays: 1,
        totalCoinsEarned: 0,  // Bắt đầu với 0 coins đã nhận
        totalDiamondsEarned: 0, // Bắt đầu với 0 diamonds đã nhận
        dragonsCreated: 0,
        missionsCompleted: 0
      }
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Lưu user
    await user.save();

    // Tạo inventory cho user
    const inventory = new Inventory({
      userId: user._id,
      capacity: 50 // Đặt capacity mặc định
    });
    await inventory.save();

    // Tạo token
    const token = generateToken(user._id);

    // Trả về response với đầy đủ thông tin
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        telegramId: user.telegramId,
        registrationDate: user.registrationDate,
        coins: user.coins,
        diamonds: user.diamonds,
        level: user.level,
        experience: user.experience,
        stats: user.stats
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Tìm user và lấy cả trường password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Kiểm tra password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Khởi tạo stats nếu chưa có
    if (!user.stats) {
      user.stats = {
        lastLogin: Date.now(),
        loginDays: 1,
        totalCoinsEarned: 0,
        totalDiamondsEarned: 0,
        dragonsCreated: 0,
        missionsCompleted: 0
      };
    } else {
      // Cập nhật thời gian đăng nhập
      user.stats.lastLogin = Date.now();
      user.stats.loginDays += 1;
    }

    // Reset thời gian chơi khi đăng nhập
    user.playTime.lastUpdate = new Date();
    await user.save();

    // Tạo token
    const token = generateToken(user._id);

    // Chuẩn bị response
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      telegramId: user.telegramId,
      playTime: user.getPlayTimeString(),
      coins: user.coins,
      diamonds: user.diamonds,
      level: user.level,
      experience: user.experience,
      stats: user.stats
    };

    // Gửi response
    res.json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// @desc    Lấy thông tin profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cập nhật thời gian chơi
    await user.updatePlayTime();

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        telegramId: user.telegramId,
        playTime: user.getPlayTimeString(),
        coins: user.coins,
        diamonds: user.diamonds,
        level: user.level,
        experience: user.experience,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra password hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash password mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in change password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Quên mật khẩu
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TODO: Gửi email reset password
    res.json({ message: 'Password reset instructions sent to email' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    // TODO: Verify reset token
    // TODO: Update password

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 