import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import LoadingScreen from "../../shared/components/LoadingScreen";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/home" replace />;

  return children;
};

export default Protected;
