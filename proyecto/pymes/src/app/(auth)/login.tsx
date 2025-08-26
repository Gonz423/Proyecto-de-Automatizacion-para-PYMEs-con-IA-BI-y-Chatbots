import React, { useMemo, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Alert, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

// Componentes y Lógica
import BackgroundMorph from '../../components/BackgroundMorph';
import GlassInput from '../../components/GlassInput';
import PrimaryButton from '../../components/PrimaryButton';
import { palette } from '../../theme/colors';
import { useAuth } from '../../hooks/userAuth';
import { loginSmart } from '../../services/userService';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isInvalid = useMemo(() => !email.trim() || !password.trim(), [email, password]);

  const handleLogin = async () => {
    if (isInvalid) {
      Alert.alert("Error", "Por favor, introduce tu correo y contraseña.");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ CORRECCIÓN: Desestructura la respuesta para obtener 'user' y 'token'
      const { user, token } = await loginSmart(email.trim().toLowerCase(), password);

      // ✅ CORRECCIÓN: Pasa ambos argumentos a la función login del contexto
      await login(user, token);
      
      Alert.alert("Éxito", `¡Bienvenido, ${user.nombre}!`);
      
      // La redirección a /home se manejará automáticamente por el RootLayout
      // gracias al cambio en el estado de 'user'.

    } catch (error: any) {
      console.error("Error de inicio de sesión:", error);
      Alert.alert("Error", error.message || "No se pudo iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <BackgroundMorph />

      <Pressable onPress={() => router.canGoBack() && router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
      </Pressable>

      <View style={styles.card}>
        <Animated.Text entering={FadeInDown.springify()} style={styles.title}>
          Welcome Back
        </Animated.Text>
        <View style={{ height: 14 }} />
        <GlassInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
        />
        <View style={{ height: 10 }} />
        <GlassInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />
        <View style={{ height: 12 }} />
        <Text style={styles.forgot}>Forgot Password?</Text>
        <View style={{ height: 16 }} />
        <PrimaryButton
          title="Log In"
          onPress={handleLogin}
          disabled={isLoading || isInvalid}
          isLoading={isLoading}
        />
        {/* Eliminamos los elementos de redes sociales para simplificar */}
        <View style={{ height: 16 }} />
        <Text style={styles.footer}>
          Don't have an account?{' '}
          <Link href="/register" style={styles.link}>
            Sign up
          </Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.bgTop, justifyContent: 'center' },
    back: { position: 'absolute', top: 50, left: 16, zIndex: 10, padding: 6 },
    card: { marginHorizontal: 18, padding: 20, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(0,0,0,0.22)' },
    title: { color: palette.white, fontSize: 26, fontWeight: '800' },
    forgot: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'right' },
    footer: { color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
    link: { color: palette.light, fontWeight: '700' },
});