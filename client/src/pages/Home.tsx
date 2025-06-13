import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import dragonService from "../services/dragon.service";
import type { Dragon } from "../services/dragon.service";
import "../index.css";
import axios from "axios";

// Đường dẫn ảnh assets
const bgImg = "/src/assets/background.png";
const menuIcon = "/src/assets/menu.png";
const userIcon = "/src/assets/user.png";
const friendIcon = "/src/assets/friend button.png";
const taskIcon = "/src/assets/tasks button.png";
const shoppingIcon = "/src/assets/shopping button.png";
const mailIcon = "/src/assets/mail button.png";
const bellIcon = "/src/assets/notifications button.png";
const dragonIcon = "/src/assets/dargon button.png";
const bagIcon = "/src/assets/bag.png";

interface ChestTimerResponse {
  success: boolean;
  chestTimer: string;
}

const Home: React.FC = () => {
  const [coinBalance, setCoinBalance] = useState<number>(0);
  const [diamondBalance, setDiamondBalance] = useState<number>(0);
  const [chestCoins, setChestCoins] = useState<number>(0);
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);
  const [timer, setTimer] = useState("00:00:00");
  const [isLoading, setIsLoading] = useState(true);
  const [activeDragon, setActiveDragon] = useState<Dragon | null>(null);
  const [dragonImage, setDragonImage] = useState<string>("");
  
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Lấy thông tin stats và rồng ban đầu
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Lấy thông tin profile và balance
        const [profileData, balanceData] = await Promise.all([
          userService.getProfile(),
          userService.getBalance()
        ]);

        setCoinBalance(balanceData.data.coins || 0);
        setDiamondBalance(balanceData.data.diamonds || 0);

        // THAY ĐỔI: Lấy lastClaimTime từ localStorage để duy trì trạng thái timer
        const savedTimestamp = localStorage.getItem('lastClaimTimestamp');
        if (savedTimestamp) {
          setLastClaimTime(parseInt(savedTimestamp, 10));
        } else {
          // Nếu không có, đặt là thời gian hiện tại và lưu lại
          const now = Date.now();
          setLastClaimTime(now);
          localStorage.setItem('lastClaimTimestamp', now.toString());
        }

        setActiveDragon({ level: profileData.data.level } as Dragon);
        setDragonImage(dragonService.getDragonImage(profileData.data.level));
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setCoinBalance(0);
        setDiamondBalance(0);
        // THAY ĐỔI: Đặt fallback nếu có lỗi
        const now = Date.now();
        setLastClaimTime(now);
        localStorage.setItem('lastClaimTimestamp', now.toString());
        setDragonImage("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [isAuthenticated]);


  // Xử lý tính toán chest coins và timer
  useEffect(() => {
    // THAY ĐỔI: Chỉ cần lastClaimTime và activeDragon để chạy
    if (!isAuthenticated || !activeDragon || lastClaimTime === null) return;

    const coinsPerMinute = dragonService.calculateCoinsPerMinute(activeDragon.level);
    const maxAccumulatedMinutes = 24 * 60; // 24 giờ

    const update = () => {
      // Logic chính không đổi, nhưng nguồn lastClaimTime giờ đã bền bỉ
      const elapsedMs = Date.now() - lastClaimTime;
      const elapsedMinutes = elapsedMs / (1000 * 60);
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      
      // Giới hạn thời gian tích lũy là 24 giờ
      const effectiveElapsedMinutes = Math.min(elapsedMinutes, maxAccumulatedMinutes);

      const newChestCoins = Math.floor(effectiveElapsedMinutes * coinsPerMinute);
      setChestCoins(newChestCoins);

      // Hiển thị timer dạng HH:mm:ss
      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);
      const seconds = elapsedSeconds % 60;
      setTimer(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastClaimTime, activeDragon, isAuthenticated]);

  // Xử lý nhận coins từ chest
  const claimChestCoins = async () => {
    if (!isAuthenticated || chestCoins <= 0 || !activeDragon) return;

    try {
      const response = await userService.claimChestCoins(chestCoins);
      setCoinBalance(response.data.coins);

      // THAY ĐỔI: Cập nhật và lưu lastClaimTime mới vào localStorage
      const newLastClaimTime = Date.now();
      setLastClaimTime(newLastClaimTime);
      localStorage.setItem('lastClaimTimestamp', newLastClaimTime.toString());
      
      setChestCoins(0);
      setTimer("00:00:00");
    } catch (error) {
      console.error('Error claiming chest coins:', error);
    }
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      navigate('/user-info');
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-900"></div>
    </div>;
  }

  // JSX không thay đổi
  return (
    <div className="flex flex-col items-center justify-between min-h-screen max-w-[390px] mx-auto relative p-0 overflow-hidden" style={{background: `url(${bgImg}) center/cover no-repeat`}}>
      {/* Top bar */}
      <div className="w-full flex justify-between items-center mt-2 mb-4 px-4 pt-4">
        {/* Menu icon */}
        <button className="rounded-full shadow p-2" onClick={() => navigate('/user-info')}>
          <img src={menuIcon} alt="menu" className="w-8 h-8" />
        </button>
        {/* Balance */}
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a2323cc] border border-[#fff2] shadow">
            <img src="/src/assets/Coin button.png" alt="coin" className="w-6 h-6" />
            <span className="text-white font-bold text-lg">
              {(coinBalance || 0).toFixed(2)}$
            </span>
          </div>
        </div>
        {/* User icon */}
        <button className="rounded-full shadow p-2" onClick={handleUserIconClick}>
          <img 
            src={userIcon} 
            alt="user" 
            className="w-8 h-8" 
          />
          {isAuthenticated && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        <div className="flex flex-row items-center justify-center w-full max-w-[390px] gap-0 mt-4">
          {/* Left icons */}
          <div className="flex flex-col gap-8 items-center flex-1 mb-12">
            <button className="rounded-full p-5 shadow-md" onClick={() => navigate('/missions')}>
              <img src={taskIcon} alt="task" className="w-12 h-12" />
            </button>
            <button className="rounded-full p-5 shadow-md" onClick={() => navigate('/friends')}>
              <img src={friendIcon} alt="friend" className="w-12 h-12" />
            </button>
            <button className="rounded-full p-5 shadow-md" onClick={() => navigate('/shop')}>
              <img src={shoppingIcon} alt="shopping" className="w-12 h-12" />
            </button>
          </div>
          {/* Dragon image */}
          <div className="flex flex-col items-center flex-[2]">
            <div className="border-2 border-[#d32f2f] rounded-2xl p-6 bg-[#2a0a0a]/80 shadow-lg relative">
              <img src={dragonImage} alt="Dragon" className="w-[180px] h-[180px] object-contain mx-auto" />
              {activeDragon && (
                <div className="absolute top-2 right-2 bg-[#3a2323cc] px-2 py-1 rounded text-white text-sm">
                  Lv.{activeDragon.level}
                </div>
              )}
            </div>
            {/* Timer */}
            <div className="flex items-center gap-2 mt-2 bg-transparent relative">
              <div className="relative">
                <img 
                  src="/src/assets/chest.png" 
                  alt="timer" 
                  className={`w-12 h-12 ${chestCoins > 0 ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`} 
                  onClick={claimChestCoins} 
                />
                {chestCoins > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 border-2 border-white shadow-lg min-w-[24px] text-center translate-x-1/2 -translate-y-1/2">
                    {chestCoins}
                  </span>
                )}
              </div>
              <span className="text-red-800 text-2xl font-bold">{timer}</span>
            </div>
          </div>
          {/* Right icons */}
          <div className="flex flex-col gap-8 items-center flex-1 mb-12">
            <button className="rounded-full p-5 shadow-md" onClick={() => navigate('/dragon-storage')}>
              <img src={dragonIcon} alt="dragon" className="w-12 h-12" />
            </button>
            <button className="rounded-full p-5 shadow-md" onClick={() => navigate('/mail')}>
              <img src={mailIcon} alt="mail" className="w-12 h-12" />
            </button>
            <button className="rounded-full p-5 shadow-md" onClick={() => navigate('/notification')}>
              <img src={bellIcon} alt="bell" className="w-12 h-12" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;