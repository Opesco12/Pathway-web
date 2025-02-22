import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";

import Loader from "../component/ui/LoadingAnimation";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [loading, setLoading] = useState(true);

  // Save authentication state to localStorage
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setUser({});
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    user,
    setUser,
    logout,
  };

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />; // Prevents redirecting before auth is confirmed

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export { UserContext, UserProvider };
