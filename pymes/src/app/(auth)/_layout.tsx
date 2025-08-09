import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../hooks/userAuth";

export default function AuthLayout() {
  const { user } = useAuth();

  // Si el usuario ya está logueado, lo redirige a la pantalla principal
  if (user) {
    return <Redirect href="/(main)/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}