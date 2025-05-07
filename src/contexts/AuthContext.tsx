import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { env } from "../config/env";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setLoading(true);
      axios
        .get(`${env.API_URL}${env.API_ROUTES.USERS.VERIFY}`)
        .then((response) => {
          setIsAuthenticated(true);
          setUser(response.data.user);
        })
        .catch(() => {
          Cookies.remove("token");
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${env.API_URL}${env.API_ROUTES.USERS.LOGIN}`,
        { email, password }
      );
      const { token, user} = response.data;
      Cookies.set("token", token, { expires: 7 }); 
      setIsAuthenticated(true);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError("Неверный email или пароль");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${env.API_URL}${env.API_ROUTES.USERS.REGISTER}`,
        { email, password }
      );
      const { token, user } = response.data;
      Cookies.set("token", token, { expires: 7 });
      setIsAuthenticated(true);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError("Ошибка при регистрации");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        error,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
