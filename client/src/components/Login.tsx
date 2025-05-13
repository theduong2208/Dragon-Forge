import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


interface LoginProps {
  onSubmit: (data: { username: string; password: string; telegramId: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    telegramId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#2a0a0a] relative w-full">
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

      {/* Login Form */}
      <div className="mt-8 rounded-t-2xl bg-[#a2b8be] pb-8 pt-4 px-4 w-full min-h-[calc(100vh-88px)]">
        <div className="bg-white/90 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#d3c3b7] text-black placeholder-[#6b4c3b] focus:outline-none focus:ring-2 focus:ring-[#bfa59a]"
              />
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#d3c3b7] text-black placeholder-[#6b4c3b] focus:outline-none focus:ring-2 focus:ring-[#bfa59a]"
              />
            </div>

            <div>
              <input
                type="text"
                name="telegramId"
                placeholder="Telegram ID"
                value={formData.telegramId}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#d3c3b7] text-black placeholder-[#6b4c3b] focus:outline-none focus:ring-2 focus:ring-[#bfa59a]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-full bg-[#bfa59a] text-black font-bold text-base hover:bg-[#a89088] transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-[#6b4c3b]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-semibold hover:text-[#bfa59a]">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 