import React from "react";
import { useNavigate } from "react-router-dom";

const notifications = [
  { date: "26/4/2025", message: "Đừng quên nhận tinh thể của bạn! Đăng nhập để nhận." },
  { date: "27/4/2025", message: "Đừng quên nhận tinh thể của bạn! Đăng nhập để nhận." },
  { date: "28/4/2025", message: "Đừng quên nhận tinh thể của bạn! Đăng nhập để nhận." },
  { date: "29/4/2025", message: "Đừng quên nhận tinh thể của bạn! Đăng nhập để nhận." },
];

const Notification: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#2a0a0a] relative w-full flex flex-col">
      {/* Overlay card */}
      <div className="absolute top-0 left-0 w-full h-full z-0" style={{background: 'rgba(0,0,0,0.10)'}}></div>
      <div className="relative z-10 mt-16 rounded-t-3xl bg-[#a2c3d6] pb-0 pt-0 px-0 w-full max-w-[100vw]" style={{borderTopLeftRadius: '32px', borderTopRightRadius: '32px'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <span className="text-[36px] font-bold text-black leading-none">Notice</span>
          <button onClick={() => navigate(-1)} className="bg-white w-14 h-14 flex items-center justify-center rounded-full border-2 border-[#eee] shadow-md">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#222" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
        </div>
        <div className="flex flex-col gap-4 px-0 pb-8">
          {notifications.map((n, idx) => (
            <div key={idx} className="mx-4 rounded-xl bg-white border border-gray-200 shadow-sm p-0 overflow-hidden mt-2">
              <div className="bg-[#e5d8ce] px-5 py-2 rounded-t-xl text-lg font-semibold text-gray-800 leading-none border-b border-gray-200">{n.date}</div>
              <div className="px-5 py-4 text-gray-800 text-base font-normal leading-snug">{n.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification; 