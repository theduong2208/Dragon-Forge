import React from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../assets/back button.png";

interface Dragon {
  level: number;
  name: string;
  income: number;
  price: number;
}

const dragons: Dragon[] = [
  {
    level: 1,
    name: "Newborn dragon",
    income: 0.25,
    price: 1990,
  },
  {
    level: 2,
    name: "Small dragon",
    income: 0.5,
    price: 3980,
  },
  {
    level: 3,
    name: "Big dragon",
    income: 0.75,
    price: 7960,
  },
  {
    level: 4,
    name: "red dragon",
    income: 1,
    price: 15900,
  },
  {
    level: 5,
    name: "Blue dragon",
    income: 2,
    price: 20900,
  },
  {
    level: 6,
    name: "Green dragon",
    income: 3,
    price: 25900,
  },
  
];

const ShopPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2a0a0a] relative w-full">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
      </div>
      {/* Back button */}
      <div className="absolute top-6 left-4">
        <button className="rounded-full shadow p-2 bg-white/20" onClick={() => navigate(-1)}>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>      
      </div>

      {/* Shop Title */}
      <div className="mt-8 text-center">
        <div className="inline-block px-12 py-2 bg-[#d3c3b7] rounded-full">
          <span className="text-2xl font-bold text-black">SHOP</span>
        </div>
      </div>

      {/* Dragon List */}
      <div className="mt-8 px-4">
        {/* Header */}
        <div className="grid grid-cols-4 mb-4 px-4">
          <span className="text-white font-semibold">Level</span>
          <span className="text-white font-semibold">Dragon</span>
          <span className="text-white font-semibold">Income</span>
          <span className="text-white font-semibold">Price</span>
        </div>

        {/* Dragon Items */}
        <div className="flex flex-col gap-4">
          {dragons.map((dragon) => (
            <div 
              key={dragon.level}
              className="bg-[#bfa59a] rounded-xl p-4 flex items-center justify-between"
            >
              <div className="text-4xl font-bold text-black w-16">{dragon.level}</div>
              <div className="bg-[#d3c3b7] rounded-xl px-4 py-2 flex-1 mx-4">
                <span className="text-black font-medium">{dragon.name}</span>
              </div>
              <div className="flex items-center gap-1 w-35">
              <img src="/src/assets/Coin button.png" alt="coin" className="w-4 h-4" />
                <span className="text-black font-bold">{dragon.income}/s</span>
              </div>
              <div className="bg-[#e8e5b9] rounded-full px-4 py-1 flex items-center gap-1 ml-4">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 22,21 2,21" fill="currentColor"/>
                </svg>
                <span className="text-black font-bold">{(dragon.price / 1000).toFixed(2)}k</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;