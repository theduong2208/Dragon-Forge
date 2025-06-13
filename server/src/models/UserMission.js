import mongoose from "mongoose";

const userMissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isRewarded: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
userMissionSchema.index({ user: 1, mission: 1 });

const UserMission = mongoose.model('UserMission', userMissionSchema);
export default UserMission; 