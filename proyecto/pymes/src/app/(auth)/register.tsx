// src/app/(auth)/register.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

// --- UI ---
import BackgroundMorph from '../../components/BackgroundMorph';
import GlassInput from '../../components/GlassInput';
import PrimaryButton from '../../components/PrimaryButton';
import { palette } from '../../theme/colors';

// --- Servicio (usa 'register' del userService) ---
import { register as registerUser } from '../../services/userService';

// Payload local para el registro (ajústalo si tu backend pide otra forma)
type RegisterPayload = {
  nombre: string;
  apellido: string;
  rut: string;
  correo: string;
  password: string;          // muchos backends esperan 'password' (no 'password_hash')
  numero_telefono?: string;  // opcional
};

export default function Register() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isInvalid = useMemo(
    () => !name.trim() || !lastName.trim() || !rut.trim() || !email.trim() || !password.trim(),
    [name, lastName, rut, email, password]
  );

  const handleRegister = async () => {
    if (isInvalid) {
      Alert.alert('Error', 'Por favor, completa todos los campos requeridos.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: RegisterPayload = {
        nombre: name.trim(),
        apellido: lastName.trim(),
        rut: rut.trim(),
        correo: email.trim().toLowerCase(),
        password,
        numero_telefono: phoneNumber.trim() || undefined,
      };

      // casteamos a any por si el tipo del service difiere
      await registerUser(payload as any);

      Alert.alert('Éxito', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.');
      router.replace('/login');
    } catch (e: any) {
      console.error('Error en el registro:', e);
      if (e?.status === 409) {
        Alert.alert('Error', e?.message || 'El correo o RUT ya está en uso.');
      } else if (e?.message === 'Network request failed') {
        Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor.');
      } else {
        Alert.alert('Error', e?.message || 'No se pudo completar el registro. Inténtalo de nuevo.');
      }
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

      <Pressable onPress={() => router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
      </Pressable>

      <View style={styles.card}>
        <Animated.Text entering={FadeInDown.springify()} style={styles.title}>
          Crear Cuenta
        </Animated.Text>

        <View style={{ height: 14 }} />

        <GlassInput placeholder="Nombre" value={name} onChangeText={setName} editable={!isLoading} />
        <View style={{ height: 10 }} />
        <GlassInput placeholder="Apellido" value={lastName} onChangeText={setLastName} editable={!isLoading} />
        <View style={{ height: 10 }} />
        <GlassInput
          placeholder="RUT (con dígito verificador)"
          value={rut}
          onChangeText={setRut}
          editable={!isLoading}
          autoCapitalize="none"
        />
        <View style={{ height: 10 }} />
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
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />
        <View style={{ height: 10 }} />
        <GlassInput
          placeholder="Número de Teléfono"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={!isLoading}
        />

        <View style={{ height: 16 }} />

        <PrimaryButton
          title="Registrarse"
          onPress={handleRegister}
          isLoading={isLoading}
          disabled={isLoading || isInvalid}
        />

        <View style={{ height: 24 }} />
        <Text style={styles.footer}>
          ¿Ya tienes una cuenta? <Link href="/login" style={styles.link}>Inicia Sesión</Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bgTop, justifyContent: 'center' },
  back: { position: 'absolute', top: 18, left: 16, zIndex: 10, padding: 6 },
  card: {
    marginHorizontal: 18,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '800' },
  footer: { color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  link: { color: palette.light, fontWeight: '700' },
});
