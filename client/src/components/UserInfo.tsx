import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfoProps {
  user: {
    username: string;
    telegramId: string;
    avatar?: string;
    level?: number;
    followers?: number;
    following?: number;
    friends?: number;
    coins?: number;
    diamonds?: number;
    joinDate?: string;
  };
  onLogout?: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#2a0a0a] relative w-full">
      {showCopyNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-50">
          Copied to clipboard!
        </div>
      )}

      {/* Top bar */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button 
          className="rounded-full shadow p-2 bg-white/20"
          onClick={() => navigate('/')}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="mt-8 rounded-t-2xl bg-[#a2b8be] pb-8 pt-4 px-4 w-full min-h-[calc(100vh-88px)] space-y-4">
        {/* Profile Header */}
        <div className="bg-white/90 rounded-2xl p-6 mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-black">@{user.username}</h2>
                <button 
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => handleCopy(user.username)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-black">TID: {user.telegramId}</p>
                <button 
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => handleCopy(user.telegramId)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-black mt-1">Lv{user.level}</p>
            </div>
          </div>
          <div className="text-sm text-[#6b4c3b]">
            Joined: since {user.joinDate}
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white/90 rounded-2xl p-6">
          <h3 className="text-black font-bold mb-4">Statistics</h3>
          <div className="flex justify-between text-center">
            <div>
              <p className="font-bold text-black text-xl">{user.following}</p>
              <p className="text-sm text-[#6b4c3b]">theo dõi</p>
            </div>
            <div>
              <p className="font-bold text-black text-xl">{user.followers}</p>
              <p className="text-sm text-[#6b4c3b]">fan</p>
            </div>
            <div>
              <p className="font-bold text-black text-xl">{user.friends}</p>
              <p className="text-sm text-[#6b4c3b]">bạn bè</p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/90 rounded-2xl p-6">
          <h3 className="text-black font-bold mb-4">Balance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/src/assets/Coin button.png" alt="coin" className="w-8 h-8" />
                <span className="text-[#6b4c3b]">Dragon Coin</span>
              </div>
              <span className="text-black font-bold text-lg">{user.coins}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/src/assets/dragon coin.png" alt="diamond" className="w-8 h-8" />
                <span className="text-[#6b4c3b]">Dragon Diamond</span>
              </div>
              <span className="text-black font-bold text-lg">{user.diamonds}</span>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white/90 rounded-2xl p-6">
            <button
              onClick={onLogout}
              className="w-full py-3 px-6 rounded-full bg-[#d3d3d3] text-[#6b4c3b] font-bold text-base"
            >
              Đăng xuất
            </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;