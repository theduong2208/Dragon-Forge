import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều yêu cầu xác thực
router.use(authenticateToken);

// Lấy thông tin user
router.get('/profile', userController.getProfile);

// Cập nhật thông tin user
router.put('/profile', userController.updateProfile);

// Lấy số dư tài khoản
router.get('/balance', userController.getBalance);

// Cập nhật số dư
router.put('/balance', userController.updateBalance);

// Lấy thống kê
router.get('/stats', userController.getStats);

// Cập nhật thống kê user
router.put('/stats', userController.updateUserStats);

// Nhận coin từ chest
router.post('/claim-chest', userController.claimChestCoins);

export default router; 