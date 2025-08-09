import { Platform } from 'react-native';

export interface User {
  email: string;
  password?: string;
}

// Detecta la base URL según la plataforma
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3001' // Android Emulator
    : 'http://localhost:3001'; // Web o iOS Simulator

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const users = await response.json();
  return users as User[];
}
