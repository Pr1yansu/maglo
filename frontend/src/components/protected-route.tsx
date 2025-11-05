import { Navigate } from "react-router-dom";
import Loader from "@/components/loader";
import { useAuth } from "@/hooks/use-auth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
