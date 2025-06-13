import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/users';

export interface UserData {
  id: string;
  username: string;
  telegramId: string;
  registrationDate: string;
  level: number;
  dragonLevel: number;
  following: number;
  followers: number;
  friends: number;
  coins: number;
  diamonds: number;
}

export interface ProfileData {
  username: string;
  email: string;
  level: number;
  experience: number;
  playTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface BalanceData {
  coins: number;
  diamonds: number;
}

export interface StatsData {
  totalCoinsEarned: number;
  totalDiamondsEarned: number;
  dragonsCreated: number;
  missionsCompleted: number;
  loginDays: number;
  lastLogin: string;
}

class UserService {
  getProfile() {
    return axios.get<ProfileData>(API_URL + '/profile', { headers: authHeader() });
  }

  updateProfile(username: string, email: string) {
    return axios.put(API_URL + '/profile', {
      username,
      email,
    }, { headers: authHeader() });
  }

  updateUserLevel(level: number) {
    return axios.put(API_URL + '/profile', {
      level
    }, { headers: authHeader() });
  }

  getBalance() {
    return axios.get<BalanceData>(API_URL + '/balance', { headers: authHeader() });
  }

  updateBalance(coins: number, diamonds: number) {
    return axios.put(API_URL + '/balance', {
      coins,
      diamonds
    }, { headers: authHeader() });
  }

  getStats() {
    return axios.get<StatsData>(API_URL + '/stats', { headers: authHeader() });
  }

  updateUserStats(level: number) {
    return axios.put(API_URL + '/stats', {
      level
    }, { headers: authHeader() });
  }


  claimChestCoins(coins: number) {
    return axios.post<{ success: boolean; coins: number }>(API_URL + '/claim-chest', {
      coins
    }, { headers: authHeader() });
  }
}

export default new UserService(); 