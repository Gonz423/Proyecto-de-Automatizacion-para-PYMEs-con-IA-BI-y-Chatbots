import { Redirect, Stack } from "expo-router";
import { useAuth } from "../hooks/userAuth";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {user ? (
        // Si hay un usuario, muestra las rutas de la app principal
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      ) : (
        // Si no, muestra las rutas de autenticación y lo redirige a login
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}