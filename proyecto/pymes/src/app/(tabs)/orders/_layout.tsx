// src/app/(tabs)/orders/_layout.tsx
import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="order">
      <Stack.Screen name="order" />
      {/* Si tienes una pantalla fija para crear: add.tsx */}
      <Stack.Screen name="add" />
    </Stack>
  );
}
