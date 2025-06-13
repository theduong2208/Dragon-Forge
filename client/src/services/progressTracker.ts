import type { Mission } from '../types/mission';
import * as missionService from './missionService';

class ProgressTracker {
  private static instance: ProgressTracker;
  private missions: Mission[] = [];

  private constructor() {}

  public static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker();
    }
    return ProgressTracker.instance;
  }

  // Khởi tạo missions
  public setMissions(missions: Mission[]) {
    this.missions = missions;
  }

  // Theo dõi khi cho rồng ăn
  public async trackFeedDragon() {
    const feedMissions = this.missions.filter(
      m => m.requirements.type === 'feed_dragon' && !m.isCompleted
    );

    for (const mission of feedMissions) {
      const newProgress = mission.progress + 1;
      await missionService.updateMissionProgress(mission._id, newProgress);
    }
  }

  // Theo dõi khi thu thập xu
  public async trackCollectCoins(amount: number) {
    const coinMissions = this.missions.filter(
      m => m.requirements.type === 'collect_coins' && !m.isCompleted
    );

    for (const mission of coinMissions) {
      const newProgress = mission.progress + amount;
      await missionService.updateMissionProgress(mission._id, newProgress);
    }
  }

  // Theo dõi khi rồng lên cấp
  public async trackDragonLevelUp(newLevel: number) {
    const levelMissions = this.missions.filter(
      m => m.requirements.type === 'level_up_dragon' && !m.isCompleted
    );

    for (const mission of levelMissions) {
      const newProgress = Math.max(mission.progress, newLevel);
      await missionService.updateMissionProgress(mission._id, newProgress);
    }
  }

  // Theo dõi khi tạo rồng mới
  public async trackCreateDragon() {
    const createMissions = this.missions.filter(
      m => m.requirements.type === 'create_dragon' && !m.isCompleted
    );

    for (const mission of createMissions) {
      const newProgress = mission.progress + 1;
      await missionService.updateMissionProgress(mission._id, newProgress);
    }
  }

  // Theo dõi khi tiêu xu
  public async trackSpendCoins(amount: number) {
    const spendMissions = this.missions.filter(
      m => m.requirements.type === 'spend_coins' && !m.isCompleted
    );

    for (const mission of spendMissions) {
      const newProgress = mission.progress + amount;
      await missionService.updateMissionProgress(mission._id, newProgress);
    }
  }
}

export default ProgressTracker.getInstance(); 