// src/hooks/userAuth.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE } from "../services/api";
import { User } from "../services/userService";

const USER_STORAGE_KEY = "user_session";
const TOKEN_STORAGE_KEY = "auth_token";

interface AuthContextType {
  user: User | null;
  token: string | null;            // ← exponemos el token
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, authToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!user && !!token;

  // ✅ Verifica la validez del token SOLO con GET y Authorization header.
  const verifyToken = async (authToken: string): Promise<boolean> => {
    if (!authToken) return false;
    try {
      const resp = await fetch(`${API_BASE}/auth/verify`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` }, // ← nada de body aquí
      });
      return resp.ok;
    } catch (error) {
      console.error("Error de red al verificar token:", error);
      return false;
    }
  };

  // Carga de sesión al iniciar la app
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

        if (storedToken && storedUser) {
          const isValid = await verifyToken(storedToken);
          if (isValid) {
            setUser(JSON.parse(storedUser) as User);
            setToken(storedToken);
          } else {
            await logout(); // limpia si no es válido
          }
        }
      } catch (error) {
        console.error("Error al verificar el estado de autenticación:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login: persiste user y token por separado
  const login = async (userData: User, authToken: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, authToken);

      setUser(userData);
      setToken(authToken);

      router.replace("/home");
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // Logout: limpia almacenamiento y estado
  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);

      setUser(null);
      setToken(null);

      router.replace("/login");
    } catch (error) {
      console.error("Error en logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return ctx;
};
