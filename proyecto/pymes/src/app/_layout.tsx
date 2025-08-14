import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // Esta configuración de Stack es para la navegación principal
    <Stack screenOptions={{ headerShown: false }}>
      {/* Pantallas que no están dentro de un grupo */}
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      {/* Aquí puedes añadir las pantallas que estarán disponibles después del login */}
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="inventory" />

    </Stack>
  );
}
