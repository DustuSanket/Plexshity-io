import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import LoadingScreen from "../features/shared/components/LoadingScreen.jsx";

const App = () => {
  const auth = useAuth();
  const loading = useSelector((state) => state.auth.loading);

  useLayoutEffect(() => {
    const theme = window.localStorage.getItem("plexshity-theme") || "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  useEffect(() => {
    auth.getMeHandler();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      {loading && <LoadingScreen />}
    </>
  );
};

export default App;
