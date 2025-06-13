import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'special'],
    required: true
  },
  requirements: {
    type: {
      type: String,
      enum: [
        'create_dragon',
        'feed_dragon',
        'collect_coins',
        'spend_coins',
        'level_up_dragon',
        'win_battles',
        'complete_training',
        'add_to_homescreen',
        'subscribe_channels',
        'sign_in',
        'claim_diamonds',
        'claim_coins',
        'share_game'
      ],
      required: true
    },
    target: {
      type: Number,
      required: true
    }
  },
  rewards: {
    coins: Number,
    diamonds: Number,
    experience: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetTime: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'never'],
    required: true,
    default: 'never'
  }
}, {
  timestamps: true
});

// Phương thức để lấy text hiển thị tiến độ
missionSchema.methods.getProgressText = function(currentProgress) {
  return `${currentProgress}/${this.requirements.target}`;
};

// Phương thức để kiểm tra hoàn thành
missionSchema.methods.isCompleted = function(progress) {
  return progress >= this.requirements.target;
};

const Mission = mongoose.model('Mission', missionSchema);
export default Mission; 