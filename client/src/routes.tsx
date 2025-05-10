import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "./components/Layouts/MainLayouts";
// import ErrorElement from "./components/ui/ErrorElement";
import Home from "./pages/Home";

const route = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/",
    element: <MainLayouts />,
  },
]);

export default route;
