import React from "react";
import "../index.css";

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-b from-red-950 to-red-900 p-4 max-w-[390px] mx-auto">
      {/* Top section with menu and user info */}
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <div className="flex items-center gap-1">
              <span className="text-white">10 ncs</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white">100.00</span>
          </div>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>

      {/* Middle section with dragon character and menu buttons */}
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-full p-3 flex justify-center items-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <div className="relative">
            <div className="border-4 border-red-600 rounded-lg p-2 bg-gradient-to-b from-red-800 to-red-900 shadow-lg">
              {/* Replace with your dragon image */}
              <img
                src="/dragon.png"
                alt="Dragon character"
                className="w-24 h-24 object-contain"
              />
            </div>
            {/* Add a glow effect */}
            <div className="absolute inset-0 rounded-lg bg-red-500 opacity-20 blur-md -z-10"></div>
          </div>

          <div className="bg-white rounded-full p-3 flex justify-center items-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-full p-3 flex justify-center items-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-purple-900 px-3 py-1.5 rounded-lg flex items-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white text-sm font-medium">10:20:30</span>
            </div>
          </div>

          <div className="bg-white rounded-full p-3 flex justify-center items-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom hexagon button */}
      <div className="mb-8 relative">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rotate-45 relative shadow-lg">
          <div className="absolute inset-0 -rotate-45 flex items-center justify-center">
            {/* You can add an icon here if needed */}
          </div>
        </div>
        {/* Add a glow effect */}
        <div className="absolute inset-0 bg-orange-500 opacity-30 blur-md -z-10 rotate-45"></div>
      </div>
    </div>
  );
};

export default App;
