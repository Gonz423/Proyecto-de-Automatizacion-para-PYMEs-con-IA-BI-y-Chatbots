// src/hooks/userAuth.tsx
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa el tipo desde su única fuente de verdad
import { User } from "../services/userService";

const USER_STORAGE_KEY = "user_session";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error cargando el usuario desde el almacenamiento:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData: User) => {
    try {
      // Guardamos el usuario y el token en el almacenamiento
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error guardando el usuario en el almacenamiento:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error("Error eliminando el usuario del almacenamiento:", error);
    }
  };

  return { user, isLoading, login, logout };
};
