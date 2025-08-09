import { Stack, router } from "expo-router";
import { Button } from "react-native";
import { useAuth } from "../../hooks/userAuth";

export default function MainLayout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Inicio",
          headerRight: () => <Button title="Salir" onPress={handleLogout} />
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: "Perfil",
          headerRight: () => <Button title="Salir" onPress={handleLogout} />
        }}
      />
    </Stack>
  );
}