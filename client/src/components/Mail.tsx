import React from "react";
import { useNavigate } from "react-router-dom";


const mails: any[] = [];

const Mail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#2a0a0a] relative w-full flex flex-col">
      {/* Overlay card */}
      <div className="absolute top-0 left-0 w-full h-full z-0" style={{background: 'rgba(0,0,0,0.10)'}}></div>
      <div className="relative z-10 mt-16 rounded-t-3xl bg-[#a2c3d6] pb-0 pt-0 px-0 w-full max-w-[100vw] flex flex-col h-[calc(100vh-4rem)]" style={{borderTopLeftRadius: '32px', borderTopRightRadius: '32px'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
          <span className="text-[36px] font-bold text-black leading-none">Mail</span>
          <button onClick={() => navigate(-1)} className="bg-white w-14 h-14 flex items-center justify-center rounded-full border-2 border-[#eee] shadow-md">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#222" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          {mails.length === 0 ? (
            <div className="flex flex-col items-center justify-end w-full pb-8">
              <svg width="120" height="120" fill="none" viewBox="0 0 24 24" stroke="#bbb" strokeWidth="2" className="mb-4"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#bbb" strokeWidth="2" fill="none"/><polyline points="3,7 12,13 21,7" stroke="#bbb" strokeWidth="2" fill="none"/></svg>
              <span className="text-2xl text-gray-500 font-medium mb-2">Nothing here</span>
            </div>
          ) : (
            <div className="flex flex-col gap-7 px-0 pb-8">
              {mails.map((m, idx) => (
                <div key={idx} className="mx-4 rounded-xl bg-white border border-gray-200 shadow-sm p-0 overflow-hidden mt-2">
                  <div className="bg-[#e5d8ce] px-5 py-2 rounded-t-xl text-lg font-semibold text-gray-800 leading-none border-b border-gray-200">{m.date} - {m.subject}</div>
                  <div className="px-5 py-4 text-gray-800 text-base font-normal leading-snug">{m.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mail; 