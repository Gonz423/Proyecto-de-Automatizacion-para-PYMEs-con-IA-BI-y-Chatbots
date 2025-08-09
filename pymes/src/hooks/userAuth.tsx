import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define la interfaz para el objeto de usuario con email y contraseña.
// Es importante que esta interfaz coincida con lo que esperas del backend.
interface User {
  email: string;
  // Agrega aquí cualquier otro dato del usuario, como un nombre, ID, etc.
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser) as User);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // La función login ahora espera un objeto de tipo `User` que contiene el email.
  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user to storage:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Error removing user from storage:", error);
    }
  };

  return { user, isLoading, login, logout };
};