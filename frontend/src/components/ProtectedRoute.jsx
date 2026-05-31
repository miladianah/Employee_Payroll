import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. Define the component
const ProtectedRoute = () => {
  const { token } = useAuth();

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child route
  return <Outlet />;
};

// 2. THIS LINE IS CRITICAL (The Default Export)
export default ProtectedRoute;