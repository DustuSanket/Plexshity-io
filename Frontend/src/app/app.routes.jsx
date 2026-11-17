import { createBrowserRouter, Navigate } from "react-router";
import Home from "../features/auth/pages/Home.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import VerifyEmail from "../features/auth/pages/VerifyEmail.jsx";
import EmailVerified from "../features/auth/pages/EmailVerified.jsx";
import Dashboard from "../features/chat/pages/Dashboard.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/email-verified",
    element: <EmailVerified />,
  },
  {
    path: "/dashboard",
    element: <Navigate to="/" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  },
]);
