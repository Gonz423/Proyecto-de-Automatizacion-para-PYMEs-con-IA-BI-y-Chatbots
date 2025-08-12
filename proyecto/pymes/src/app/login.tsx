// src/app/login.tsx
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator, Alert, Text, TextInput, TouchableOpacity,
  View, KeyboardAvoidingView, Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/login.styles";
import { useAuth } from "../hooks/userAuth";
import { loginSmart, HttpError } from "../services/userService";

export default function LoginScreen() {
  const { login } = useAuth();
  const [correo, setcorreo] = useState("");
  const [password_hash, setpassword_hash] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isInvalid = useMemo(
    () => !correo.trim() || !password_hash.trim(),
    [correo, password_hash]
  );

  const handleLogin = async () => {
    const normalizedcorreo = correo.trim().toLowerCase();
    if (isInvalid) {
      Alert.alert("Error", "Por favor, introduce tu correo y contraseña.");
      return;
    }

    setIsLoading(true);
    try {
      const userData = await loginSmart(normalizedcorreo, password_hash);
      login(userData);
      Alert.alert("Éxito", `¡Bienvenido, ${userData.nombre}!`);
      
      // CORREGIDO: Se elimina el grupo (main) de la ruta.
      // Ahora redirige a /home, asumiendo que tienes un archivo app/home.tsx.
      router.replace("/home"); 

    } catch (err) {
      const error = err as HttpError;
      console.error("Error de inicio de sesión:", error);
      
      let msg = "No se pudo iniciar sesión. Revisa tu conexión.";
      if (error.status === 401) {
        msg = "Correo o contraseña inválidos.";
      } else if (error.message) {
        msg = error.message;
      }
      Alert.alert("Error", msg);

    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => router.push("/register");

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8DB3FF", "#5E78F7", "#2C3E91"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.cardWrapper}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={correo}
            onChangeText={setcorreo}
            keyboardType="email-address" // <-- CORREGIDO
            autoCapitalize="none"
            editable={!isLoading}
            onSubmitEditing={handleLogin}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password_hash}
            onChangeText={setpassword_hash}
            secureTextEntry
            editable={!isLoading}
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            style={[styles.button, (isLoading || isInvalid) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading || isInvalid}
            activeOpacity={0.85}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
          </TouchableOpacity>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              ¿No tienes una cuenta?{" "}
              <Text style={styles.footerLink} onPress={handleRegister}>
                Regístrate aquí.
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
