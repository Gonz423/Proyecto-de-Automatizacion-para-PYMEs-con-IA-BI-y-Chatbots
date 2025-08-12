import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../hooks/userAuth'; // Importa tu hook de autenticación

export default function HomeScreen() {
  // Usa el hook para obtener el usuario y la función de logout
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Después de cerrar sesión, redirige al usuario a la pantalla de inicio
    router.replace('/'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a la Home!</Text>
      {/* Muestra el correo del usuario si está disponible */}
      {user ? (
        <Text style={styles.subtitle}>Has iniciado sesión como: {user.correo}</Text>
      ) : (
        <Text style={styles.subtitle}>Cargando datos del usuario...</Text>
      )}
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});
