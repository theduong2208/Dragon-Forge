import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Friend {
  id: number;
  name: string;
  diamond: number;
  avatar: string;
}

const initialFriends: Friend[] = Array(10).fill(null).map((_, index) => ({
  id: index,
  name: "First bro",
  diamond: 10000.0,
  avatar: "https://i.imgur.com/1X4hYw3.png"
}));

const FriendList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const navigate = useNavigate();

  const handleDeleteFriend = (friendId: number) => {
    setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e2a07b] to-[#d18a6e] w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7ba6b0] to-[#e2a07b] px-6 py-3 flex items-center relative">
        <button
          className="bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow theme-icon"
          onClick={() => navigate('/')}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <span className="text-xl font-bold text-white ml-4">Friend</span>
      </div>

      {/* Friend List */}
      <div className="px-2 py-4 h-[calc(100vh-64px)] overflow-y-auto">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center bg-white/10 backdrop-blur-sm rounded-2xl mb-2 px-3 py-3 shadow image-overlay">
            <img src={friend.avatar} alt="avatar" className="w-16 h-16 rounded-full border-2 border-white/50 mr-4 dragon-image" />
            <div className="flex-1">
              <div className="font-semibold text-white text-lg">{friend.name}</div>
              <div className="flex items-center gap-2 text-white">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="dragon-icon"><polygon points="12,2 22,21 2,21" fill="currentColor"/></svg>
                <span className="font-bold text-lg">{friend.diamond.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleDeleteFriend(friend.id)}
                className="p-2 rounded-full hover:bg-red-500/20 theme-icon"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-white/20 theme-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="12" cy="18" r="2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList; 