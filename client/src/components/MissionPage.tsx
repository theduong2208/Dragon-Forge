import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Mission {
  title: string;
  desc: string;
  reward: number;
  done: boolean;
  progress?: string;
}

const dailyMissions: Mission[] = [
  {
    title: "Add",
    desc: "Add dragon forge to your home screen.",
    reward: 100,
    done: false,
  },
  {
    title: "Training",
    desc: "Upgrade your dragon to Level 10.",
    reward: 100,
    done: true,
  },
  {
    title: "Subscribe",
    desc: "Subscribe our channel on Youtube, X and Fb",
    reward: 100,
    done: false,
  },
  {
    title: "Coin harvest",
    desc: "DragonCoin reach 1000",
    reward: 200,
    done: false,
    progress: "0/1000"
  },
];

const specialMissions: Mission[] = [
  {
    title: "Upgrade",
    desc: "Upgrade your dragon",
    reward: 10,
    done: false,
  },
  {
    title: "Sign in",
    desc: "Sign in",
    reward: 10,
    done: true,
  },
  {
    title: "Receive dragon diamond",
    desc: "Click to receive your dragon diamond",
    reward: 10,
    done: false,
  },
  {
    title: "Receive DragonCoin",
    desc: "Click to receive your DragonCoin in home page",
    reward: 10,
    done: false,
  },
  {
    title: "Share",
    desc: "Share dragon forge 0/1",
    reward: 10,
    done: false,
  },
];

const MissionPage: React.FC = () => {
  const [tab, setTab] = useState<'mission' | 'special'>('mission');
  const navigate = useNavigate();
  const missions = tab === 'mission' ? dailyMissions : specialMissions;

  return (
    <div className="min-h-screen bg-[#2a0a0a] relative w-full">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button className="rounded-full shadow p-2 bg-white/20" onClick={() => navigate(-1)}>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
      </div>
      {/* Card */}
      <div className="mt-8 rounded-t-2xl bg-[#a2b8be] pb-8 pt-4 px-2 w-full">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-8 py-3 rounded-full font-bold text-lg ${tab === 'mission' ? 'bg-[#bfa59a] text-black' : 'bg-[#d3c3b7] text-[#6b4c3b]'}`}
            onClick={() => setTab('mission')}
          >
            Mission
          </button>
          <button
            className={`px-8 py-3 rounded-full font-bold text-lg ${tab === 'special' ? 'bg-[#bfa59a] text-black' : 'bg-[#d3c3b7] text-[#6b4c3b]'}`}
            onClick={() => setTab('special')}
          >
            Special mison
          </button>
        </div>
        {/* Mission List */}
        <div className="flex flex-col gap-4">
          {missions.map((m, idx) => (
            <div key={idx} className="bg-white/90 rounded-2xl px-4 py-4 flex flex-col gap-2 shadow">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-black">{m.title}</span>
                <div className="flex items-center gap-1">
                  <img src="/src/assets/Coin button.png" alt="coin" className="w-6 h-6" />
                  <span className="font-bold text-base text-black">+{m.reward}</span>
                </div>
                <button 
                  className={`ml-2 px-6 py-2 rounded-full font-bold text-base ${
                    m.done 
                      ? 'bg-[#d3d3d3] text-[#6b4c3b] cursor-default' 
                      : 'bg-[#bfa59a] text-black hover:bg-[#a89088] cursor-pointer'
                  }`}
                >
                  {m.done ? 'In Progress' : 'Claim'}
                </button>
              </div>
              <div className="text-black text-base font-normal">{m.desc}</div>
              {m.progress && (
                <div className="text-xs text-[#6b4c3b] font-semibold">{m.progress}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionPage; 