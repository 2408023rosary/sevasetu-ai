import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("sevasetu_user");
    const token = localStorage.getItem("sevasetu_token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("sevasetu_user");
        localStorage.removeItem("sevasetu_token");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { accessToken, user } = response.data.data;

    localStorage.setItem("sevasetu_token", accessToken);
    localStorage.setItem("sevasetu_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);

    const { accessToken, user } = response.data.data;

    localStorage.setItem("sevasetu_token", accessToken);
    localStorage.setItem("sevasetu_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("sevasetu_token");
    localStorage.removeItem("sevasetu_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
