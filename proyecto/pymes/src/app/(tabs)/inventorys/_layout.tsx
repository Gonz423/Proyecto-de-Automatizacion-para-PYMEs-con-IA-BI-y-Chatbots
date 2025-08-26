import { Stack } from 'expo-router';

export default function InventorysLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="inventory">
      {/* Lista (archivo inventory.tsx) */}
      <Stack.Screen name="inventory" />
      {/* Detalle/Crear (archivo [id].tsx) */}
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
