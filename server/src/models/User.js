import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Không lấy password khi query
  },
  telegramId: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastChestClaim: {
    type: Date,
    default: Date.now
  },
  playTime: {
    hours: {
      type: Number,
      default: 0,
      min: 0
    },
    minutes: {
      type: Number,
      default: 0,
      min: 0,
      max: 59
    },
    seconds: {
      type: Number,
      default: 0,
      min: 0,
      max: 59
    },
    lastUpdate: {
      type: Date,
      default: Date.now
    }
  },
  coins: {
    type: Number,
    default: 0, // Bắt đầu với 0 coins
    min: 0
  },
  diamonds: {
    type: Number,
    default: 0, // Bắt đầu với 0 diamonds
    min: 0
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  stats: {
    totalCoinsEarned: {
      type: Number,
      default: 0
    },
    totalDiamondsEarned: {
      type: Number,
      default: 0
    },
    dragonsCreated: {
      type: Number,
      default: 0
    },
    missionsCompleted: {
      type: Number,
      default: 0
    },
    loginDays: {
      type: Number,
      default: 0
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Middleware để kiểm tra và cập nhật level
userSchema.pre('save', function(next) {
  if (this.isModified('experience')) {
    const expForNextLevel = this.level * 100;
    if (this.experience >= expForNextLevel) {
      this.level += 1;
      this.experience -= expForNextLevel;
    }
  }
  next();
});

// Hash mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
  try {
    // Chỉ hash password khi nó được thay đổi
    if (!this.isModified('password')) {
      console.log('Password not modified, skipping hash');
      return next();
    }

    console.log('Hashing password:', {
      passwordLength: this.password?.length,
      isAlreadyHashed: this.password?.startsWith('$2')
    });
    
    // Kiểm tra xem password đã được hash chưa
    if (this.password.startsWith('$2')) {
      console.log('Password already hashed, skipping');
      return next();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Phương thức để kiểm tra password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('comparePassword called with:', {
      hasStoredPassword: !!this.password,
      storedPasswordLength: this.password?.length,
      candidatePasswordLength: candidatePassword?.length
    });

    if (!this.password) {
      console.error('No stored password found for user');
      throw new Error('Password not found in user document');
    }

    if (!candidatePassword) {
      console.error('No candidate password provided');
      throw new Error('No password provided for comparison');
    }

    // Kiểm tra xem password đã được hash chưa
    if (!this.password.startsWith('$2')) {
      console.error('Stored password is not properly hashed');
      throw new Error('Invalid password format in database');
    }

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error in comparePassword:', error);
    throw error;
  }
};

// Phương thức để cập nhật số dư
userSchema.methods.updateBalance = async function(coins = 0, diamonds = 0) {
  this.coins = Math.max(0, this.coins + coins);
  this.diamonds = Math.max(0, this.diamonds + diamonds);

  if (coins > 0) {
    this.stats.totalCoinsEarned += coins;
  }
  if (diamonds > 0) {
    this.stats.totalDiamondsEarned += diamonds;
  }

  return this.save();
};

// Phương thức để cập nhật thống kê
userSchema.methods.updateStats = async function(stats) {
  Object.assign(this.stats, stats);
  return this.save();
};

// Phương thức để cập nhật thời gian chơi
userSchema.methods.updatePlayTime = async function() {
  const now = new Date();
  const lastUpdate = this.playTime.lastUpdate;
  const timeDiff = Math.floor((now - lastUpdate) / 1000); // Chuyển đổi thành giây

  if (timeDiff <= 0) return;

  let totalSeconds = timeDiff;
  totalSeconds += this.playTime.seconds;
  totalSeconds += this.playTime.minutes * 60;
  totalSeconds += this.playTime.hours * 3600;

  // Chuyển đổi tổng số giây thành giờ:phút:giây
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Cập nhật thời gian chơi
  this.playTime.hours = hours;
  this.playTime.minutes = minutes;
  this.playTime.seconds = seconds;
  this.playTime.lastUpdate = now;

  await this.save();
  return this.playTime;
};

// Phương thức để lấy thời gian chơi dưới dạng chuỗi
userSchema.methods.getPlayTimeString = function() {
  const { hours, minutes, seconds } = this.playTime;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const User = mongoose.model('User', userSchema);
export default User; 