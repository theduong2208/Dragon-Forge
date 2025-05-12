import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

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
  const navigate = useNavigate();
  // State
  const [dragons, setDragons] = useState([
    { level: 1, count: 1 },
  ]); // chỉ có 1 rồng lv1 khi bắt đầu
  const [diamond, setDiamond] = useState(10000); 
  const [selected, setSelected] = useState<number[]>([]); // index các slot được chọn

  // Tính tổng diamond/s
  const totalDiamondPerSec = dragons.reduce(
    (sum, d) => sum + dragonConfigs[d.level - 1].diamondPerSecond * d.count,
    0
  );

  // Tự động sinh diamond
  useEffect(() => {
    const interval = setInterval(() => {
      setDiamond((old) => old + totalDiamondPerSec);
    }, 1000);
    return () => clearInterval(interval);
  }, [totalDiamondPerSec]);

  // Tạo danh sách pet nhỏ cho grid (mỗi slot là 1 con riêng biệt)
  let gridDragons: (number | undefined)[] = [];
  dragons.forEach((d) => {
    for (let i = 0; i < d.count; i++) gridDragons.push(d.level);
  });
  while (gridDragons.length < MAX_PETS) gridDragons.push(undefined);

  // Pet lớn nhất (level cao nhất)
  const mainDragon = gridDragons.reduce((max, current) => 
    current !== undefined && (max === undefined || current > max) ? current : max
  , undefined as number | undefined);
  const mainConfig = mainDragon ? dragonConfigs[mainDragon - 1] : dragonConfigs[0];

  // Format số đẹp
  const formatNumber = (num: number, alwaysDecimal = false) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    if (alwaysDecimal) return num.toFixed(2);
    return num.toFixed(0);
  };

 // Mua rồng mới
const buyDragon = () => {
  // Đếm số lượng rồng thực tế (không tính các ô trống)
  const actualDragonCount = gridDragons.filter(d => d !== undefined).length;
  
  // Kiểm tra điều kiện mua
  if (diamond < 50 || actualDragonCount >= MAX_PETS) return;
  
  // Trừ 50 diamond
  setDiamond((d) => d - 50);
  
  // Thêm rồng level 1 mới
  setDragons((prev) => {
    const newDragons = [...prev];
    const level1Index = newDragons.findIndex(d => d.level === 1);
    
    if (level1Index !== -1) {
      // Nếu đã có rồng level 1, tăng số lượng lên 1
      newDragons[level1Index] = {
        ...newDragons[level1Index],
        count: newDragons[level1Index].count + 1
      };
    } else {
      // Nếu chưa có rồng level 1, thêm mới với count = 1
      newDragons.push({ level: 1, count: 1 });
    }
    
    return newDragons;
  });
};


  // Chọn slot để ghép
  const selectSlot = (idx: number) => {
    if (gridDragons[idx] === undefined) return;
    
    // Nếu slot đã được chọn thì bỏ chọn
    if (selected.includes(idx)) {
      setSelected(selected.filter((i) => i !== idx));
      return;
    }

    // Kiểm tra có thể ghép không
    if (selected.length === 1) {
      const firstDragon = gridDragons[selected[0]]!;
      const secondDragon = gridDragons[idx]!;
      
      // Nếu 2 rồng cùng cấp và chưa max level thì ghép luôn
      if (firstDragon === secondDragon && firstDragon < 5) {
        mergeDragons(selected[0], idx);
        return;
      }
    }

    // Chọn slot mới
    setSelected([...selected, idx]);
  };

  // Ghép rồng
  const mergeDragons = (idx1: number, idx2: number) => {
    const lv = gridDragons[idx1]!;
    // Xóa 2 con ở vị trí selected, thêm 1 con lv+1
    let flat: number[] = [];
    gridDragons.forEach((d, i) => {
      if (d !== undefined && i !== idx1 && i !== idx2) flat.push(d);
    });
    flat.push(lv + 1);
    // Đếm lại số lượng từng cấp
    let newDragons: { level: number, count: number }[] = [];
    flat.forEach((lv) => {
      const found = newDragons.find((d) => d.level === lv);
      if (found) found.count++;
      else newDragons.push({ level: lv, count: 1 });
    });
    setDragons(newDragons);
    setSelected([]);
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen max-w-[430px] mx-auto relative p-0 overflow-hidden bg-gradient-to-b from-blue-200 to-green-100"
      style={{ background: `url(${bgImg}) center/cover no-repeat` }}
    >
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 bg-[#3a2323cc] rounded-full px-3 py-1 shadow-md">
          <img src={diamondIcon} alt="diamond" className="w-5 h-5" />
          <span className="text-[#7c3aed] font-bold text-sm">{formatNumber(totalDiamondPerSec, true)}/s</span>
        </div>
        <div className="flex items-center gap-2 bg-[#3a2323cc] rounded-full px-4 py-1.5 shadow-md">
          <img src={diamondIcon} alt="diamond" className="w-6 h-6" />
          <span className="text-[#f59e42] font-bold text-xl">{formatNumber(diamond)}</span>
        </div>
        <button className="rounded-full shadow-md p-2 bg-[#3a2323cc] transition-all" >
          <img src={closeIcon} alt="close" className="w-6 h-6"   onClick={() => navigate('/')} />
        </button>
      </div>

      {/* Pet lớn nhất */}
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

      {/* Grid pet nhỏ */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-4 gap-3 px-3">
          {gridDragons.map((d, idx) =>
            d !== undefined ? (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-end bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-2xl border-4 
                  ${selected.includes(idx) 
                    ? 'border-purple-400 scale-105 shadow-xl' 
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
              </div>
            ) : (
              <div key={idx} className="w-[4.5rem] h-24 bg-yellow-50/80 rounded-2xl border-2 border-yellow-200/80" />
            )
          )}
        </div>
      </div>

      {/* Buy dragon button */}
       <div className="w-full px-4 py-3 mt-2">
        <button
          onClick={buyDragon}
          className="w-full py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 cursor-pointer"
        >
          <span>Mua Rồng (50 <img src={diamondIcon} alt="diamond" className="w-4 h-4 inline-block" />)</span>
        </button>
      </div>
    </div>
  );
};

export default DragonStorage; 