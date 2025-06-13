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
import authService from "./services/auth.service";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Navigate to="/" />,
  },
  {
    path: "/friends",
    element: (
      <ProtectedRoute>
        <FriendList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/missions",
    element: (
      <ProtectedRoute>
        <MissionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/shop",
    element: (
      <ProtectedRoute>
        <ShopPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notification",
    element: (
      <ProtectedRoute>
        <Notification />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mail",
    element: (
      <ProtectedRoute>
        <Mail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dragon-storage",
    element: (
      <ProtectedRoute>
        <DragonStorage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/user-info",
    element: (
      <ProtectedRoute>
        <UserInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  }
]);

export default route;

