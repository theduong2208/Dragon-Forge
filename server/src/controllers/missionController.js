import Mission from '../models/Mission.js';
import UserMission from '../models/UserMission.js';
import User from '../models/User.js';

// @desc    Lấy danh sách nhiệm vụ của user
// @route   GET /api/missions
// @access  Private
export const getMissions = async (req, res) => {
  try {
    // Lấy user ID từ token
    const userId = req.user.id;

    // Lấy tất cả nhiệm vụ và trạng thái của user
    const [missions, userMissions] = await Promise.all([
      Mission.find({ isActive: true }),
      UserMission.find({ userId })
    ]);

    // Tách thành nhiệm vụ hàng ngày và đặc biệt
    const dailyMissions = [];
    const specialMissions = [];

    missions.forEach(mission => {
      // Tìm trạng thái của user cho nhiệm vụ này
      const userMission = userMissions.find(um => 
        um.missionId.toString() === mission._id.toString()
      );

      // Tạo object nhiệm vụ với thông tin trạng thái
      const missionWithStatus = {
        _id: mission._id,
        title: mission.title,
        description: mission.description,
        type: mission.type,
        requirements: mission.requirements,
        rewards: mission.rewards,
        progress: userMission?.progress || 0,
        isCompleted: userMission?.isCompleted || false,
        isRewarded: userMission?.isRewarded || false,
        progressText: mission.getProgressText(userMission?.progress || 0)
      };

      // Phân loại nhiệm vụ
      if (mission.type === 'daily') {
        dailyMissions.push(missionWithStatus);
      } else {
        specialMissions.push(missionWithStatus);
      }
    });

    res.json({ dailyMissions, specialMissions });
  } catch (error) {
    console.error('Lỗi khi lấy nhiệm vụ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Cập nhật tiến độ nhiệm vụ
// @route   POST /api/missions/:id/progress
// @access  Private
export const updateProgress = async (req, res) => {
  try {
    const { missionId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id;

    // Tìm nhiệm vụ
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Tìm hoặc tạo UserMission
    let userMission = await UserMission.findOne({ userId, missionId });
    if (!userMission) {
      userMission = new UserMission({ userId, missionId, progress: 0 });
    }

    // Cập nhật tiến độ
    userMission.progress = progress;
    
    // Kiểm tra hoàn thành
    if (progress >= mission.requirements.target && !userMission.isCompleted) {
      userMission.isCompleted = true;
    }

    await userMission.save();

    res.json({
      ...userMission.toObject(),
      progressText: mission.getProgressText(progress)
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật tiến độ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Nhận phần thưởng nhiệm vụ
// @route   POST /api/missions/:id/claim
// @access  Private
export const claimReward = async (req, res) => {
  try {
    const { missionId } = req.params;
    const userId = req.user.id;

    // Tìm nhiệm vụ và trạng thái
    const [mission, userMission] = await Promise.all([
      Mission.findById(missionId),
      UserMission.findOne({ userId, missionId })
    ]);

    if (!mission || !userMission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Kiểm tra điều kiện nhận thưởng
    if (!userMission.isCompleted) {
      return res.status(400).json({ message: 'Mission not completed' });
    }

    if (userMission.isRewarded) {
      return res.status(400).json({ message: 'Reward already claimed' });
    }

    // Cập nhật tài khoản người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cộng phần thưởng
    if (mission.rewards.coins) {
      user.coins += mission.rewards.coins;
    }
    if (mission.rewards.diamonds) {
      user.diamonds += mission.rewards.diamonds;
    }
    if (mission.rewards.experience) {
      user.experience += mission.rewards.experience;
      // TODO: Kiểm tra và xử lý level up
    }

    // Đánh dấu đã nhận thưởng
    userMission.isRewarded = true;

    // Lưu các thay đổi
    await Promise.all([
      user.save(),
      userMission.save()
    ]);

    res.json({
      mission: {
        ...userMission.toObject(),
        progressText: mission.getProgressText(userMission.progress)
      },
      userStats: {
        coins: user.coins,
        diamonds: user.diamonds,
        experience: user.experience,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Lỗi khi nhận thưởng:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Reset nhiệm vụ hàng ngày
// @route   POST /api/missions/reset
// @access  Private
export const resetDailyMissions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy danh sách nhiệm vụ hàng ngày
    const dailyMissions = await Mission.find({ type: 'daily' });
    const missionIds = dailyMissions.map(m => m._id);

    // Reset trạng thái của user
    await UserMission.updateMany(
      { 
        userId, 
        missionId: { $in: missionIds } 
      },
      {
        progress: 0,
        isCompleted: false,
        isRewarded: false
      }
    );

    res.json({ message: 'Daily missions reset successfully' });
  } catch (error) {
    console.error('Lỗi khi reset nhiệm vụ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 