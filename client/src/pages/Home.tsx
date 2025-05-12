import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

// Đường dẫn ảnh assets
const dragonImg = "/src/assets/dragon - level 1.png";
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

const Home: React.FC = () => {
  const [coinBalance, setCoinBalance] = useState(0);
  const [diamondBalance, setDiamondBalance] = useState(0);
  const [chestCoins, setChestCoins] = useState(0);
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);
  const [timer, setTimer] = useState("00:00:00");
  const navigate = useNavigate();

  useEffect(() => {
    const dragonLevel = 1;
    const coinsPerMinute = dragonLevel;
    const maxAccumulatedMinutes = 24 * 60;
    const update = () => {
      if (lastClaimTime === null) {
        setLastClaimTime(Date.now());
        setChestCoins(0);
        setTimer("00:00:00");
        return;
      }
      const elapsedMs = Date.now() - lastClaimTime;
      const elapsedMinutes = elapsedMs / (1000 * 60);
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const newChestCoins = Math.min(Math.floor(elapsedMinutes * coinsPerMinute), maxAccumulatedMinutes * coinsPerMinute);
      setChestCoins(newChestCoins);
      // Hiển thị timer dạng HH:mm:ss
      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);
      const seconds = elapsedSeconds % 60;
      setTimer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastClaimTime]);

  const claimChestCoins = () => {
    setCoinBalance(prev => prev + chestCoins);
    if (lastClaimTime !== null) {
      const timeToAdd = chestCoins * 60 * 1000; // mỗi coin = 1 phút
      let newLastClaimTime = lastClaimTime + timeToAdd;
      if (newLastClaimTime > Date.now()) newLastClaimTime = Date.now();
      setLastClaimTime(newLastClaimTime);
    }
    setChestCoins(0);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen max-w-[390px] mx-auto relative p-0 overflow-hidden" style={{background: `url(${bgImg}) center/cover no-repeat`}}>
      {/* Top bar */}
      <div className="w-full flex justify-between items-center mt-2 mb-4 px-4 pt-4">
        {/* Menu icon */}
        <button className="rounded-full  shadow p-2">
          <img src={menuIcon} alt="menu" className="w-8 h-8" />
        </button>
        {/* Balance */}
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a2323cc] border border-[#fff2] shadow">
            <img src="/src/assets/Coin button.png" alt="coin" className="w-6 h-6" />
            <span className="text-white font-bold text-lg">{coinBalance.toFixed(2)}$</span>
          </div>
        </div>
        {/* User icon */}
        <button className="rounded-full shadow p-2">
          <img src={userIcon} alt="user" className="w-8 h-8" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        <div className="flex flex-row items-center justify-center w-full max-w-[390px] gap-0 mt-4">
          {/* Left icons */}
          <div className="flex flex-col gap-8 items-center flex-1 mb-12">
            <button className=" rounded-full p-5 shadow-md" >
              <img src={taskIcon} alt="task" className="w-12 h-12" onClick={() => navigate('/missions')} />
            </button>
            <button className=" rounded-full p-5 shadow-md" >
              <img src={friendIcon} alt="friend" className="w-12 h-12" onClick={() => navigate('/friends')} />
            </button>
            <button className=" rounded-full p-5 shadow-md" onClick={() => navigate('/shop')}>
              <img src={shoppingIcon} alt="shopping" className="w-12 h-12" />
            </button>
          </div>
          {/* Dragon image */}
          <div className="flex flex-col items-center flex-[2]">
            <div className="border-2 border-[#d32f2f] rounded-2xl p-6 bg-[#2a0a0a]/80 shadow-lg relative">
              <img src={dragonImg} alt="Dragon" className="w-58 h-54 object-contain" />
            </div>
            {/* Timer */}
            <div className="flex items-center gap-2 mt-2 bg-transparent relative">
              <div className="relative">
                <img src="/src/assets/chest.png" alt="timer" className="w-12 h-12" onClick={claimChestCoins} />
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
            <button className=" rounded-full p-5 shadow-md">
              <img src={dragonIcon} alt="dragon" className="w-12 h-12" onClick={() => navigate('/dragon-merge')} />
            </button>
            <button className="rounded-full p-5 shadow-md">
              <img src={mailIcon} alt="mail" className="w-12 h-12" onClick={() => navigate('/mail')} />
            </button>
            <button className="rounded-full p-5 shadow-md">
              <img src={bellIcon} alt="bell" className="w-12 h-12" onClick={() => navigate('/notification')} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
