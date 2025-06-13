import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import progressTracker from '../services/progressTracker';
import dragonService from '../services/dragon.service';
import authService from "../services/auth.service";
import userService from "../services/user.service";
import type { Dragon } from "../services/dragon.service";

const dragonImages = [
  "/src/assets/dragon - level 1.png",
  "/src/assets/dragon - level 2.png",
  "/src/assets/dragon - level 3.png",
  "/src/assets/dragon - level 4.png",
  "/src/assets/dragon - level 5.png",
];
const bgImg = "/src/assets/background.png";
const coinIcon = "/src/assets/Coin button.png";
const diamondIcon = "/src/assets/dragon coin.png";
const shopIcon = "/src/assets/shopping button.png";
const rankIcon = "/src/assets/ranking.png";
const closeIcon = "/src/assets/back button.png";

const dragonConfigs = [
  { level: 1, diamondPerSecond: 0.2, name: "Rồng Con" },
  { level: 2, diamondPerSecond: 0.3, name: "Rồng Bé" },
  { level: 3, diamondPerSecond: 0.4, name: "Rồng Lửa" },
  { level: 4, diamondPerSecond: 0.5, name: "Rồng Sấm" },
  { level: 5, diamondPerSecond: 0.6, name: "Rồng Vua" },
];

const MAX_PETS = 12;

const DragonStorage: React.FC = () => {
  // State
  const [dragons, setDragons] = useState<{ level: number; count: number }[]>(() => {
    const savedDragons = localStorage.getItem('dragonStorage');
    return savedDragons ? JSON.parse(savedDragons) : [{ level: 1, count: 1 }];
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDragon, setActiveDragon] = useState<Dragon | null>(null);
  const [dragonImage, setDragonImage] = useState<string>("");
  const [diamond, setDiamond] = useState(0); 
  const [coins, setCoins] = useState(0);
  const [lastClaimTime, setLastClaimTime] = useState<number>(Date.now());
  const [accumulatedDiamonds, setAccumulatedDiamonds] = useState(0);
  const [rewardNotification, setRewardNotification] = useState<{
    show: boolean;
    amount: number;
    type: 'diamond' | 'coin';
  }>({ show: false, amount: 0, type: 'diamond' });
  const [userLevel, setUserLevel] = useState<number>(1);
  const [highestDragonLevel, setHighestDragonLevel] = useState<number>(1);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  // Calculate total diamond per second
  const totalDiamondPerSec = dragons.reduce(
    (sum, d) => sum + dragonConfigs[d.level - 1].diamondPerSecond * d.count,
    0
  );

  // Update diamonds in real-time
  useEffect(() => {
    if (totalDiamondPerSec <= 0) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeDiff = (currentTime - lastClaimTime) / 1000;
      const newAccumulatedDiamonds = timeDiff * totalDiamondPerSec;
      setAccumulatedDiamonds(newAccumulatedDiamonds);
    }, 100);

    return () => clearInterval(interval);
  }, [totalDiamondPerSec, lastClaimTime]);

  // 🐉 NEW: Sync dragon level to user stats
  const syncDragonLevelToStats = async (dragonLevel: number) => {
    if (!isAuthenticated || isSyncing) return;
    
    try {
      setIsSyncing(true);
      console.log(`🐉 Syncing dragon level ${dragonLevel} to user stats...`);
      
      // Cập nhật dragon level trong user stats
      await userService.updateUserStats(dragonLevel);
      
      console.log(`✅ Dragon level ${dragonLevel} synced to user stats successfully`);
    } catch (error) {
      console.error('❌ Error syncing dragon level to stats:', error);
      // Không hiển thị error cho user vì đây là background sync
    } finally {
      setIsSyncing(false);
    }
  };

  // Updated: Update user level và highest dragon level với stats sync
  const updateUserLevel = async (dragonsData: { level: number; count: number }[]) => {
    const maxDragonLevel = dragonsData.reduce((max, dragon) => 
      dragon.level > max ? dragon.level : max, 1
    );
    
    // Chỉ update nếu level thực sự thay đổi
    if (maxDragonLevel !== highestDragonLevel) {
      setHighestDragonLevel(maxDragonLevel);
      localStorage.setItem('highestDragonLevel', maxDragonLevel.toString());
      
      console.log(`🐉 Highest dragon level updated from ${highestDragonLevel} to ${maxDragonLevel}`);
      
      // 🐉 NEW: Sync dragon level to stats
      if (isAuthenticated) {
        await syncDragonLevelToStats(maxDragonLevel);
      }
    }
    
    if (maxDragonLevel > userLevel) {
      setUserLevel(maxDragonLevel);
      localStorage.setItem('userLevel', maxDragonLevel.toString());
      
      console.log(`👤 User level updated from ${userLevel} to ${maxDragonLevel}`);
      
      // Sync với server nếu user đã đăng nhập
      if (isAuthenticated && !isSyncing) {
        syncUserLevelToServer(maxDragonLevel);
      }
    }
  };

  // Sync user level lên server
  const syncUserLevelToServer = async (level: number) => {
    try {
      setIsSyncing(true);
      await userService.updateUserLevel(level);
      console.log(`✅ User level ${level} synced to server successfully`);
    } catch (error) {
      console.error('❌ Error syncing user level to server:', error);
      setError('Không thể đồng bộ level người dùng lên server');
    } finally {
      setIsSyncing(false);
    }
  };

  // Save dragons to local storage
  const saveDragonsToLocal = async (dragonsData: { level: number; count: number }[]) => {
    localStorage.setItem('dragonStorage', JSON.stringify(dragonsData));
    await updateUserLevel(dragonsData);
  };

  // Updated: Save highest dragon to server với stats sync
  const saveHighestDragonToServer = async (newHighestLevel?: number, retryCount = 0) => {
    if (!isAuthenticated || isSyncing) return;
    
    const levelToSave = newHighestLevel || highestDragonLevel;
    const maxRetries = 3;
    
    try {
      setIsSyncing(true);
      console.log(`🐉 Saving highest dragon level to server: ${levelToSave} (attempt ${retryCount + 1})`);
      
      // Create or update the single dragon record with highest level
      await dragonService.createDragon({ 
        name: dragonConfigs[levelToSave - 1].name,
        type: 'fire',
        level: levelToSave
      });
      
      // 🐉 NEW: Also sync to user stats
      await syncDragonLevelToStats(levelToSave);
      
      console.log('✅ Highest dragon saved to server and stats successfully');
      
      // Update local state to reflect successful sync
      if (newHighestLevel && newHighestLevel > highestDragonLevel) {
        setHighestDragonLevel(newHighestLevel);
        localStorage.setItem('highestDragonLevel', newHighestLevel.toString());
      }
      
    } catch (error) {
      console.error(`❌ Error saving highest dragon to server (attempt ${retryCount + 1}):`, error);
      
      // Retry mechanism
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying in ${(retryCount + 1) * 2} seconds...`);
        setTimeout(() => {
          saveHighestDragonToServer(levelToSave, retryCount + 1);
        }, (retryCount + 1) * 2000);
      } else {
        setError('Không thể lưu rồng cao nhất lên server sau nhiều lần thử');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Save to local storage when dragons change
  useEffect(() => {
    saveDragonsToLocal(dragons);
  }, [dragons]);

  // Fetch balance from server
  const fetchBalance = async () => {
    if (!isAuthenticated) return;
    
    try {
      const balanceData = await userService.getBalance();
      setDiamond(balanceData.data.diamonds || 0);
      setCoins(balanceData.data.coins || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to load balance data');
    }
  };

  // Fetch và sync highest dragon from server
  const fetchAndSyncHighestDragon = async () => {
    if (!isAuthenticated) return;
    
    try {
      console.log('🔄 Fetching highest dragon from server...');
      const dragonsData = await dragonService.getAllDragons();
      console.log('📨 Dragon data received:', dragonsData);
      
      if (dragonsData.data && dragonsData.data.length > 0) {
        // Get the highest level dragon from server
        const serverHighestLevel = Math.max(...dragonsData.data.map((dragon: any) => dragon.level || 1));
        const localHighestLevel = Math.max(...dragons.map(d => d.level));
        
        console.log(`🔍 Server highest: ${serverHighestLevel}, Local highest: ${localHighestLevel}`);
        
        // Sync logic: take the higher level
        const finalHighestLevel = Math.max(serverHighestLevel, localHighestLevel);
        
        if (finalHighestLevel !== highestDragonLevel) {
          setHighestDragonLevel(finalHighestLevel);
          localStorage.setItem('highestDragonLevel', finalHighestLevel.toString());
          
          // 🐉 NEW: Sync to stats
          await syncDragonLevelToStats(finalHighestLevel);
          
          console.log(`✅ Highest dragon level synced to: ${finalHighestLevel}`);
        }
        
        // If local has higher level than server, update server
        if (localHighestLevel > serverHighestLevel) {
          console.log('🔄 Local has higher dragon, updating server...');
          await saveHighestDragonToServer(localHighestLevel);
        }
        
        // If server has higher level than local, update local dragons
        if (serverHighestLevel > localHighestLevel) {
          console.log('🔄 Server has higher dragon, updating local storage...');
          const newDragons = [...dragons];
          const hasServerLevel = newDragons.find(d => d.level === serverHighestLevel);
          if (!hasServerLevel) {
            newDragons.push({ level: serverHighestLevel, count: 1 });
            setDragons(newDragons);
          }
        }
      } else {
        console.log('⚠️ No dragons found on server, syncing local highest to server...');
        // If no dragons on server but we have local dragons, sync to server
        const localHighestLevel = Math.max(...dragons.map(d => d.level));
        if (localHighestLevel > 0) {
          await saveHighestDragonToServer(localHighestLevel);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching/syncing dragons:', error);
      setError('Không thể đồng bộ dữ liệu rồng với server');
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isAuthenticated) {
        const localUserLevel = localStorage.getItem('userLevel');
        const localHighestDragon = localStorage.getItem('highestDragonLevel');
        if (localUserLevel) {
          setUserLevel(parseInt(localUserLevel));
        }
        if (localHighestDragon) {
          setHighestDragonLevel(parseInt(localHighestDragon));
        }
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const [profileData, balanceData] = await Promise.all([
          userService.getProfile(),
          userService.getBalance()
        ]);

        const serverUserLevel = profileData.data.level || 1;
        const localUserLevel = parseInt(localStorage.getItem('userLevel') || '1');
        const finalUserLevel = Math.max(serverUserLevel, localUserLevel);
        
        setUserLevel(finalUserLevel);
        localStorage.setItem('userLevel', finalUserLevel.toString());

        // Sync user level if local is higher
        if (localUserLevel > serverUserLevel) {
          syncUserLevelToServer(localUserLevel);
        }

        setDiamond(balanceData.data.diamonds || 0);
        setCoins(balanceData.data.coins || 0);

        setActiveDragon({ level: finalUserLevel } as Dragon);
        setDragonImage(dragonService.getDragonImage(finalUserLevel));

        // Fetch and sync dragon data
        await fetchAndSyncHighestDragon();
        
        const savedLastClaimTime = localStorage.getItem('lastDragonClaimTime');
        if (savedLastClaimTime) {
          setLastClaimTime(parseInt(savedLastClaimTime));
        } else {
          setLastClaimTime(Date.now());
          localStorage.setItem('lastDragonClaimTime', Date.now().toString());
        }
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setDiamond(0);
        setCoins(0);
        const localUserLevel = localStorage.getItem('userLevel');
        const localHighestDragon = localStorage.getItem('highestDragonLevel');
        if (localUserLevel) {
          setUserLevel(parseInt(localUserLevel));
        }
        if (localHighestDragon) {
          setHighestDragonLevel(parseInt(localHighestDragon));
        }
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [isAuthenticated]);
  
  // Show reward notification
  const showRewardNotification = (amount: number, type: 'diamond' | 'coin' = 'diamond') => {
    setRewardNotification({ show: true, amount, type });
    setTimeout(() => {
      setRewardNotification({ show: false, amount: 0, type: 'diamond' });
    }, 3000);
  };

  // Update balance to server
  const updateBalanceToServer = async (newDiamonds?: number, newCoins?: number) => {
    if (!isAuthenticated) return;
    
    try {
      const finalDiamonds = newDiamonds !== undefined ? newDiamonds : diamond;
      const finalCoins = newCoins !== undefined ? newCoins : coins;
      
      await userService.updateBalance(finalCoins, finalDiamonds);
    } catch (error) {
      console.error('Error updating balance to server:', error);
      setError('Failed to sync balance with server');
    }
  };

  // Periodically fetch balance
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchBalance();

    const balanceInterval = setInterval(() => {
      fetchBalance();
    }, 5000);

    return () => {
      clearInterval(balanceInterval);
    };
  }, [isAuthenticated]);

  // Create grid of dragons
  let gridDragons: (number | undefined)[] = [];
  dragons.forEach((d) => {
    for (let i = 0; i < d.count; i++) gridDragons.push(d.level);
  });
  while (gridDragons.length < MAX_PETS) gridDragons.push(undefined);

  // Get highest level dragon
  const mainDragon = gridDragons.reduce((max, current) => 
    current !== undefined && (max === undefined || current > max) ? current : max
  , undefined as number | undefined);
  const mainConfig = mainDragon ? dragonConfigs[mainDragon - 1] : dragonConfigs[0];

  // Format numbers nicely
  const formatNumber = (num: number, alwaysDecimal = false) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    if (alwaysDecimal) return num.toFixed(2);
    return num.toFixed(0);
  };

  // Buy new dragon
  const buyDragon = async () => {
    try {
      const actualDragonCount = gridDragons.filter(d => d !== undefined).length;
      
      if (diamond < 50 || actualDragonCount >= MAX_PETS) return;
      
      const newDiamondAmount = diamond - 50;
      
      await updateBalanceToServer(newDiamondAmount, undefined);
      setDiamond(newDiamondAmount);
      
      setDragons((prev) => {
        const newDragons = [...prev];
        const level1Index = newDragons.findIndex(d => d.level === 1);
        
        if (level1Index !== -1) {
          newDragons[level1Index] = {
            ...newDragons[level1Index],
            count: newDragons[level1Index].count + 1
          };
        } else {
          newDragons.push({ level: 1, count: 1 });
        }
        
        saveDragonsToLocal(newDragons);
        return newDragons;
      });

      try {
        await progressTracker.trackCreateDragon();
      } catch (error) {
        console.warn('Progress tracking failed:', error);
      }
      
      showRewardNotification(1, 'diamond');
      
    } catch (error) {
      console.error('Error buying dragon:', error);
      setError('Không thể mua rồng. Vui lòng thử lại.');
      const savedDragons = localStorage.getItem('dragonStorage');
      if (savedDragons) {
        setDragons(JSON.parse(savedDragons));
      }
      await fetchBalance();
    }
  };

  // Claim dragon rewards
  const claimDragonRewards = async () => {
    try {
      const currentTime = Date.now();
      const timeDiffInSeconds = (currentTime - lastClaimTime) / 1000;
      const diamondsToAdd = Math.floor(timeDiffInSeconds * totalDiamondPerSec);
      
      if (diamondsToAdd <= 0) {
        showRewardNotification(0, 'diamond');
        return;
      }
      
      const newDiamondAmount = diamond + diamondsToAdd;
      
      await updateBalanceToServer(newDiamondAmount, undefined);
      
      setDiamond(newDiamondAmount);
      
      const newClaimTime = Date.now();
      setLastClaimTime(newClaimTime);
      setAccumulatedDiamonds(0);
      
      localStorage.setItem('lastDragonClaimTime', newClaimTime.toString());
      
      showRewardNotification(diamondsToAdd, 'diamond');
      
    } catch (error) {
      console.error('Error claiming dragon rewards:', error);
      setError('Failed to claim rewards');
      await fetchBalance();
    }
  };

  // Select slot for merging
  const selectSlot = (idx: number) => {
    if (gridDragons[idx] === undefined) return;
    
    if (selected.includes(idx)) {
      setSelected(selected.filter((i) => i !== idx));
      return;
    }

    if (selected.length === 0) {
      setSelected([idx]);
      return;
    }

    if (selected.length === 1) {
      const firstDragon = gridDragons[selected[0]]!;
      const secondDragon = gridDragons[idx]!;
      
      if (firstDragon === secondDragon && firstDragon < 5) {
        mergeDragons(selected[0], idx);
        return;
      } else {
        setSelected([idx]);
        return;
      }
    }

    setSelected([idx]);
  };

  // Updated: Merge dragons với stats sync
  const mergeDragons = async (idx1: number, idx2: number) => {
    try {
      const lv = gridDragons[idx1]!;
      
      if (gridDragons[idx1] !== gridDragons[idx2] || lv >= 5) {
        setSelected([]);
        return;
      }
      
      let newGridDragons: (number | undefined)[] = [...gridDragons];
      
      newGridDragons[idx1] = undefined;
      newGridDragons[idx2] = undefined;
      
      const emptySlotIndex = newGridDragons.findIndex(d => d === undefined);
      if (emptySlotIndex !== -1) {
        newGridDragons[emptySlotIndex] = lv + 1;
      } else {
        newGridDragons[idx1] = lv + 1;
      }
      
      const newDragonsData = convertGridToDragons(newGridDragons);
      const newHighestLevel = Math.max(...newDragonsData.map(d => d.level));
      
      setDragons(newDragonsData);
      setSelected([]);
      await saveDragonsToLocal(newDragonsData);
      
      // Track progress
      try {
        await progressTracker.trackDragonLevelUp(lv + 1);
      } catch (error) {
        console.warn('Progress tracking failed:', error);
      }
      
      // Always show reward for successful merge
      showRewardNotification(1, 'diamond');
      
      // Sync to server if we got a new highest level dragon
      if (newHighestLevel > highestDragonLevel) {
        console.log(`🐉 New highest dragon level achieved: ${newHighestLevel}`);
        
        // Update local state immediately
        setHighestDragonLevel(newHighestLevel);
        localStorage.setItem('highestDragonLevel', newHighestLevel.toString());
        
        // 🐉 NEW: Sync to user stats immediately
        await syncDragonLevelToStats(newHighestLevel);
        
        // Sync to server in background
        await saveHighestDragonToServer(newHighestLevel);
        
        console.log('✅ New highest dragon level updated locally, stats, and queued for server sync');
      }
      
    } catch (error) {
      console.error('Error merging dragons:', error);
      setError('Failed to merge dragons');
      setSelected([]);
      const savedDragons = localStorage.getItem('dragonStorage');
      if (savedDragons) {
        setDragons(JSON.parse(savedDragons));
      }
    }
  };

  // Convert grid to dragons format
  const convertGridToDragons = (gridData: (number | undefined)[]): { level: number; count: number }[] => {
    const dragonsMap = new Map<number, number>();
    
    gridData.forEach(level => {
      if (level !== undefined) {
        dragonsMap.set(level, (dragonsMap.get(level) || 0) + 1);
      }
    });
    
    return Array.from(dragonsMap.entries())
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => a.level - b.level);
  };

  // Periodic sync với server
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncInterval = setInterval(async () => {
      const currentHighestLevel = Math.max(...dragons.map(d => d.level));
      if (currentHighestLevel > highestDragonLevel && !isSyncing) {
        console.log(`🔄 Periodic sync: Local highest (${currentHighestLevel}) > Stored highest (${highestDragonLevel})`);
        await saveHighestDragonToServer(currentHighestLevel);
      }
    }, 120000); // Check every 2 minutes

    return () => clearInterval(syncInterval);
  }, [dragons, isAuthenticated, highestDragonLevel, isSyncing]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <div
      className="flex flex-col items-center min-h-screen max-w-[430px] mx-auto relative p-0 overflow-hidden bg-gradient-to-b from-blue-200 to-green-100"
      style={{ background: `url(${bgImg}) center/cover no-repeat` }}
    >
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 bg-[#3a2323cc] rounded-full px-3 py-1 shadow-md">
          <span className="text-white font-bold text-sm">Lv.{userLevel}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#3a2323cc] rounded-full px-3 py-1 shadow-md">
          <img src={diamondIcon} alt="diamond" className="w-5 h-5" />
          <span className="text-[#7c3aed] font-bold text-sm">{formatNumber(totalDiamondPerSec, true)}/s</span>
        </div>
        <div className="flex items-center gap-2 bg-[#3a2323cc] rounded-full px-4 py-1.5 shadow-md">
          <img src={diamondIcon} alt="diamond" className="w-6 h-6" />
          <span className="text-[#f59e42] font-bold text-xl">{formatNumber(diamond)}</span>
        </div>
        <button className="rounded-full shadow-md p-2 bg-[#3a2323cc] transition-all" >
          <img src={closeIcon} alt="close" className="w-6 h-6" onClick={() => navigate('/')} />
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="w-full px-4 mb-2">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded text-sm text-center">
            Đang tải dữ liệu...
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="w-full px-4 mb-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-800 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Reward notification */}
      {rewardNotification.show && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-yellow-600 flex items-center gap-2">
            <img 
              src={rewardNotification.type === 'diamond' ? diamondIcon : coinIcon} 
              alt={rewardNotification.type} 
              className="w-6 h-6" 
            />
            <span className="font-bold text-lg">
              {rewardNotification.amount > 0 
                ? `+${formatNumber(rewardNotification.amount, true)} ${rewardNotification.type === 'diamond' ? 'Diamond' : 'Coin'}!` 
                : 'Chưa có thưởng!'
              }
            </span>
          </div>
        </div>
      )}

      {/* Main dragon */}
      <div className="flex flex-col items-center w-full mt-2 mb-4">
        <div className="relative flex flex-col items-center justify-center">
          {mainDragon && (
            <>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-yellow-400 text-white font-bold rounded-full px-3 py-0.5 shadow-lg border-2 border-yellow-600 text-sm">{mainDragon}</span>
              </div>
              <div className="bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-full w-32 h-32 flex items-center justify-center border-4 border-yellow-400 shadow-xl">
                <img
                  src={dragonImages[mainDragon - 1]}
                  alt={`dragon-lv${mainDragon}`}
                  className="w-28 h-28 object-contain drop-shadow-lg"
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-2 text-center">
          <div className="text-yellow-700 font-bold text-base drop-shadow">Level hiện tại: {mainDragon ? mainDragon : 1}</div>
          <div className="text-xl font-extrabold text-[#f59e42] drop-shadow">{mainConfig.name}</div>
        </div>
      </div>

      {/* Dragon grid */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="w-full px-4 mb-2">
          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-2 text-center">
            <span className="text-blue-700 text-sm font-medium">
              {selected.length === 0 
                ? "Chọn 2 rồng cùng cấp để ghép" 
                : selected.length === 1 
                ? "Chọn rồng thứ 2 cùng cấp để ghép" 
                : "Đang ghép rồng..."
              }
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3 px-3">
          {gridDragons.map((d, idx) =>
            d !== undefined ? (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-end bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-2xl border-4 
                  ${selected.includes(idx) 
                    ? 'border-purple-400 scale-105 shadow-xl bg-gradient-to-b from-purple-100 to-purple-200' 
                    : 'border-yellow-400 shadow-lg hover:scale-105'
                  } transition-all duration-200 cursor-pointer`}
                onClick={() => selectSlot(idx)}
              >
                <img
                  src={dragonImages[d - 1]}
                  alt={`dragon-lv${d}`}
                  className="w-14 h-14 object-contain mt-1 drop-shadow-md"
                />
                <span className="absolute top-1 left-1 bg-yellow-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-yellow-600">{d}</span>
                <div className="flex items-center gap-1 mb-1">
                  <img src={diamondIcon} alt="diamond" className="w-4 h-4" />
                  <span className="text-[#7c3aed] font-bold text-xs max-w-[40px] truncate">{dragonConfigs[d - 1].diamondPerSecond}/s</span>
                </div>
                {selected.includes(idx) && (
                  <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                    ✓
                  </div>
                )}
              </div>
            ) : (
              <div key={idx} className="w-[4.5rem] h-24 bg-yellow-50/80 rounded-2xl border-2 border-yellow-200/80" />
            )
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full px-4 py-3 mt-2 space-y-2">
        <button
          onClick={claimDragonRewards}
          disabled={isLoading}
          className={`w-full py-2 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
            isLoading 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : accumulatedDiamonds > 0
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer animate-pulse'
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-pointer'
          }`}
        >
          <img src={diamondIcon} alt="diamond" className="w-5 h-5" />
          <span>
            {isLoading 
              ? 'Đang tải...' 
              : `Nhận Thưởng (${formatNumber(accumulatedDiamonds, true)})`
            }
          </span>
        </button>
        
        <button
          onClick={buyDragon}
          disabled={diamond < 50 || gridDragons.filter(d => d !== undefined).length >= MAX_PETS || isLoading}
          className={`w-full py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
            diamond >= 50 && gridDragons.filter(d => d !== undefined).length < MAX_PETS && !isLoading
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 cursor-pointer'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          <span>Mua Rồng (50 <img src={diamondIcon} alt="diamond" className="w-4 h-4 inline-block" />)</span>
        </button>
      </div>
    </div>
  );
};

export default DragonStorage;