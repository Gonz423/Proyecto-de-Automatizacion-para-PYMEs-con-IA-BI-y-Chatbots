import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#021024' }}>
      <LinearGradient
        // Usamos los azules más oscuros para el fondo
        colors={['#021024', '#052659']}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Gestiona y haz crecer tu pyme.</Text>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerButtonText}>Crear una Cuenta</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    // El azul más claro para el título, para máximo contraste
    color: '#C1E8FF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    // Un tono medio para el subtítulo
    color: '#7DA0CA',
    textAlign: 'center',
    marginBottom: 60,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    maxWidth: 340,
  },
  loginButton: {
    // Un azul intermedio y sólido para el botón principal
    backgroundColor: '#5483B3',
  },
  registerButton: {
    // Botón secundario con borde, estilo "fantasma"
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#7DA0CA',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    // Texto claro para el botón principal
    color: '#C1E8FF',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
     // Texto de tono medio para el botón secundario
    color: '#7DA0CA',
  },
});