import { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");
        if (token && userData) {
          setAuthToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.log("Failed to load user from storage:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const register = async (name, email, password, orgName = null) => {
  const res = await api.post("/api/auth/register", { name, email, password, orgName });
  const { token, ...userData } = res.data;
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(userData));
  setAuthToken(token);
  setUser(userData);
};

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { token, ...userData } = res.data;
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
