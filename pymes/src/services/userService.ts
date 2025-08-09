import { Platform } from 'react-native';

// Interfaz User actualizada para incluir todos los campos del formulario de registro
export interface User {
  email: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  rut?: string;
  numeroTelefono?: string;
}

// Detecta la base URL según la plataforma
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3001' // Android Emulator
    : 'http://localhost:3001'; // Web o iOS Simulator

/**
 * Obtiene todos los usuarios desde la API.
 * @returns {Promise<User[]>} Una promesa que se resuelve con un array de usuarios.
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const users = await response.json();
  return users as User[];
}

/**
 * Registra un nuevo usuario en la API.
 * @param {User} newUser El objeto de usuario a registrar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el registro es exitoso.
 */
export async function registerUser(newUser: User): Promise<void> {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al registrar el usuario.');
  }
}
