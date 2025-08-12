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
      
      {/* CORREGIDO: Se eliminó la siguiente línea que causaba el error: */}
      {/* <Stack.Screen name="(main)" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
