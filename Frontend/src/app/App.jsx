import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { useEffect } from "react";
// Trimeric...
const App = () => {
  const auth = useAuth();

  useEffect(() => {
    const theme = window.localStorage.getItem("plexshity-theme") || "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
    auth.getMeHandler();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
