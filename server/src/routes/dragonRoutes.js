import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createDragon,
  getDragons,
  feedDragon,
  collectCoins,
  activateDragon,
  mergeDragons,
  syncDragons,
  deleteDragon
} from '../controllers/dragonController.js';
import { validateDragonMerge, validateDragonSync, asyncHandler } from '../middleware/dragonValidation.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication
router.use(protect);

router.route('/')
  .get(asyncHandler(getDragons))
  .post(asyncHandler(createDragon));

router.post('/:id/feed', asyncHandler(feedDragon));
router.post('/:id/collect', asyncHandler(collectCoins));

router.put('/:id/activate', asyncHandler(activateDragon));
router.delete('/:id', asyncHandler(deleteDragon));
// Merge và sync routes
router.put('/:id/merge', validateDragonMerge, asyncHandler(mergeDragons));
router.put('/:id/sync', validateDragonSync, asyncHandler(syncDragons));


export default router; 