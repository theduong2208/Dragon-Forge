import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import FriendList from "./components/FriendList";
import MissionPage from "./components/MissionPage";
import ShopPage from "./components/ShopPage";
import Notification from "./components/Notification";
import Mail from "./components/Mail";
import DragonMergeGame from "./components/DragonMergeGame";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    path: "/dragon-merge",
    element: <DragonMergeGame />,
  },
]);

export default route;
