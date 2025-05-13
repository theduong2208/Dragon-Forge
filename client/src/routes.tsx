import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import FriendList from "./components/FriendList";
import MissionPage from "./components/MissionPage";
import ShopPage from "./components/ShopPage";
import Notification from "./components/Notification";
import Mail from "./components/Mail";
import DragonStorage from "./components/DragonStorage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserInfo from "./components/UserInfo";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Navigate to="/" />,
  },
  {
    path: "/friends",
    element: <FriendList />,
  },
  {
    path: "/missions",
    element: <MissionPage />,
  },
  {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/notification",
    element: <Notification />,
  },
  {
    path: "/mail",
    element: <Mail />,
  },
  {
    path: "/dragon-storage",
    element: <DragonStorage />,
  },
  {
    path: "/login",
    element: <Login onSubmit={() => {}} />,
  },
  {
    path: "/signup",
    element: <SignUp onSubmit={() => {}} />,
  },
  {
    path: "/user-info",
    element: (
      <UserInfo 
        user={{
          username: "YGGDRASIL",
          telegramId: "1597531",
          avatar: "/src/assets/user.png",
          level: 10,
          following: 0,
          followers: 0,
          friends: 0,
          coins: 10.00,
          diamonds: 100.00,
          joinDate: "15/4/2025"
        }}
        onLogout={() => {
          window.location.href = '/login';
        }}
      />
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  }
]);

export default route;
