import express from 'express';
import * as missionController from '../controllers/missionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều yêu cầu xác thực
router.use(authenticateToken);

// Lấy danh sách nhiệm vụ
router.get('/', missionController.getMissions);

// Cập nhật tiến độ nhiệm vụ
router.put('/:missionId/progress', missionController.updateProgress);

// Nhận thưởng nhiệm vụ
router.post('/:missionId/claim', missionController.claimReward);

// Reset nhiệm vụ hàng ngày
router.post('/reset', missionController.resetDailyMissions);

export default router; 