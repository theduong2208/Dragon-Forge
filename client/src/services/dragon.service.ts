import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/dragons';

export interface Dragon {
  id: string;
  name: string;
  type: string;
  level: number;
  experience: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

class DragonService {
  getAllDragons() {
    return axios.get<Dragon[]>(API_URL, { headers: authHeader() });
  }

  getDragonById(id: string) {
    return axios.get<Dragon>(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createDragon(dragonData: Partial<Dragon>) {
    return axios.post<Dragon>(API_URL, dragonData, { headers: authHeader() });
  }

  updateDragon(id: string, dragonData: Partial<Dragon>) {
    return axios.put<Dragon>(`${API_URL}/${id}`, dragonData, { headers: authHeader() });
  }

  deleteDragon(id: string) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }

  levelUpDragon(id: string) {
    return axios.post<Dragon>(`${API_URL}/${id}/level-up`, {}, { headers: authHeader() });
  }

  // Lấy thông tin rồng đang active
  async getActiveDragon(): Promise<Dragon | null> {
    try {
      const response = await axios.get<Dragon>(`${API_URL}/active`, { headers: authHeader() });
      return response.data;
    } catch (error) {
      console.error('Error getting active dragon:', error);
      return null;
    }
  }

  // Lấy đường dẫn hình ảnh rồng dựa trên level
  getDragonImage(level: number): string {
    // Level nào thì trả đúng ảnh level đó, tối đa 5
    const dragonLevel = Math.min(level, 5);
    return `/src/assets/dragon - level ${dragonLevel}.png`;
  }

  // Tính toán coins mỗi phút dựa trên level rồng
  calculateCoinsPerMinute(level: number): number {
    return level; // Mỗi level tăng 1 coin/phút
  }
  
  mergeDragons(dragonId1: string, dragonId2: string) {
    return axios.post(`${API_URL}/merge`, {
      dragonId1,
      dragonId2
    }, { headers: authHeader() });
  }

  // Đồng bộ toàn bộ dữ liệu rồng
  syncDragons(dragons: Array<{level: number, count: number}>) {
    return axios.put(`${API_URL}/sync`, {
      dragons
    }, { headers: authHeader() });
  }

  // Lấy dữ liệu rồng dạng grid để hiển thị
  getDragonsGrid() {
    return axios.get(`${API_URL}/grid`, { headers: authHeader() });
  }

  // Cập nhật dữ liệu rồng trong storage
  updateDragonStorage(dragons: Array<{level: number, count: number}>) {
    return axios.put(`${API_URL}/storage`, {
      dragons
    }, { headers: authHeader() });
  }

  // Tính toán diamonds per second từ danh sách rồng
  calculateTotalDiamondPerSecond(dragons: Array<{level: number, count: number}>): number {
    const dragonConfigs = [
      { level: 1, diamondPerSecond: 0.2 },
      { level: 2, diamondPerSecond: 0.3 },
      { level: 3, diamondPerSecond: 0.4 },
      { level: 4, diamondPerSecond: 0.5 },
      { level: 5, diamondPerSecond: 0.6 },
    ];

    return dragons.reduce((total, dragon) => {
      const config = dragonConfigs.find(c => c.level === dragon.level);
      return total + (config ? config.diamondPerSecond * dragon.count : 0);
    }, 0);
  }

  // Chuyển đổi từ dạng grid sang dạng dragons array
  convertGridToDragons(gridDragons: (number | undefined)[]): Array<{level: number, count: number}> {
    const dragonsMap = new Map<number, number>();
    
    gridDragons.forEach(level => {
      if (level !== undefined) {
        dragonsMap.set(level, (dragonsMap.get(level) || 0) + 1);
      }
    });

    return Array.from(dragonsMap.entries())
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => a.level - b.level);
  }

  // Chuyển đổi từ dạng dragons array sang dạng grid
  convertDragonsToGrid(dragons: Array<{level: number, count: number}>, maxSlots: number = 12): (number | undefined)[] {
    const grid: (number | undefined)[] = [];
    
    dragons.forEach(dragon => {
      for (let i = 0; i < dragon.count; i++) {
        grid.push(dragon.level);
      }
    });

    // Thêm các slot trống
    while (grid.length < maxSlots) {
      grid.push(undefined);
    }

    return grid;
  }

}

export default new DragonService(); 