import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../hooks/userAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.info}>{user.nombre}</Text>
          <Text style={styles.label}>correo:</Text>
          <Text style={styles.info}>{user.correo}</Text>
        </View>
      ) : (
        <Text>Cargando perfil...</Text>
      )}
      <Button title="Cerrar Sesión" onPress={handleLogout} color="#e74c3c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  userInfo: {
    alignItems: 'flex-start',
    marginBottom: 30,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  info: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
});
