export interface MissionRewards {
  coins?: number;
  diamonds?: number;
  experience?: number;
}

export interface MissionRequirement {
  type: 'feed_dragon' | 'collect_coins' | 'level_up_dragon' | 'create_dragon' | 'spend_coins';
  target: number;
}

export interface Mission {
  _id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  requirements: MissionRequirement;
  rewards: MissionRewards;
  isActive: boolean;
  resetTime: string;
  progress: number;
  isCompleted: boolean;
  isRewarded: boolean;
  progressText: string;
}

export interface MissionResponse {
  dailyMissions: Mission[];
  specialMissions: Mission[];
} 