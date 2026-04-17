import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, Roles }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!auth || !auth.token || !Roles.includes(auth.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;

