import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import route from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="max-w-md mx-auto h-screen" style={{ maxWidth: "390px" }}>
      <RouterProvider router={route} />
    </div>
  </StrictMode>
);
