// Lấy giá trị từ environment variables của Vite
const API_URL = 'http://localhost:3000/api';

export const config = {
  API_URL,
  DRAGON_CONFIG: {
    MAX_LEVEL: 100,
    BASE_COINS_PER_HOUR: 10,
    LEVEL_MULTIPLIER: 1.1,
    RARITY_MULTIPLIERS: {
      common: 1,
      rare: 1.5,
      epic: 2,
      legendary: 3,
      mythical: 5
    }
  }
} as const;

export default config; 