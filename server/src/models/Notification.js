import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['info', 'success', 'warning', 'error', 'achievement']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Index để tự động xóa thông báo hết hạn
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index để tìm kiếm nhanh theo userId và isRead
notificationSchema.index({ userId: 1, isRead: 1 });

// Phương thức để đánh dấu đã đọc
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Phương thức để cập nhật thời gian hết hạn
notificationSchema.methods.updateExpiration = function(days) {
  this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return this.save();
};

// Static method để tạo thông báo mới
notificationSchema.statics.createNotification = async function(
  userId,
  title,
  message,
  type = 'info',
  data = null,
  expirationDays = 7
) {
  return this.create({
    userId,
    title,
    message,
    type,
    data,
    expiresAt: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000)
  });
};

// Static method để lấy thông báo chưa đọc
notificationSchema.statics.getUnreadNotifications = function(userId) {
  return this.find({
    userId,
    isRead: false
  }).sort({ createdAt: -1 });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 