// src/app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../hooks/userAuth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/*
          Aquí solo se declaran las rutas de nivel superior.
          Las pantallas como 'home' o 'login' son manejadas
          por los layouts de sus respectivos grupos.
        */}
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </AuthProvider>
  );
}