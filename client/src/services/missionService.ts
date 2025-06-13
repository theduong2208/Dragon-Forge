import type { Mission } from '../types/mission';
import config from '../config';

// Lấy danh sách nhiệm vụ
export const getMissions = async (): Promise<{ dailyMissions: Mission[], specialMissions: Mission[] }> => {
  const response = await fetch(`${config.API_URL}/missions`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch missions');
  }

  return response.json();
};

// Cập nhật tiến độ nhiệm vụ
export const updateMissionProgress = async (missionId: string, progress: number): Promise<Mission> => {
  const response = await fetch(`${config.API_URL}/missions/${missionId}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ progress })
  });

  if (!response.ok) {
    throw new Error('Failed to update mission progress');
  }

  return response.json();
};

// Nhận thưởng nhiệm vụ
export const claimMissionReward = async (missionId: string): Promise<{ 
  mission: Mission, 
  userStats: { coins: number, diamonds: number } 
}> => {
  const response = await fetch(`${config.API_URL}/missions/${missionId}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to claim mission reward');
  }

  return response.json();
};

// Reset nhiệm vụ hàng ngày
export const resetDailyMissions = async () => {
  const response = await fetch(
    `${config.API_URL}/missions/reset`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to reset daily missions');
  }

  return response.json();
}; 