import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";

import Loader from "../component/ui/LoadingAnimation";

import { authEvents } from "../api/apiClient";

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

  useEffect(() => {
    // Listen for auth errors
    const handleAuthErrorEvent = () => {
      setIsAuthenticated(false);
      setUser({});
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      toast.error("Your session has expired. Please login again.");
      window.location.href = "/login";
    };

    authEvents.addEventListener("authError", handleAuthErrorEvent);

    return () => {
      authEvents.removeEventListener("authError", handleAuthErrorEvent);
    };
  }, []);

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
      <div className="flex h-[100vh] items-center justify-center">
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
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

export { UserContext, UserProvider };
