// src/app/register.tsx
import React, { useState, useMemo } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Feather } from "@expo/vector-icons";
import styles, { COLORS } from "../styles/register.styles";
import { registerUser, User, HttpError } from "../services/userService";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [correo, setcorreo] = useState("");
  const [password_hash, setpassword_hash] = useState("");
  const [celular, setCelular] = useState("");
  const [rut, setRut] = useState(""); // <-- AÑADIDO: Estado para el RUT
  const [isLoading, setIsLoading] = useState(false);

  const isInvalid = useMemo(
    // AÑADIDO: Validación para el RUT
    () => !nombre.trim() || !correo.trim() || !password_hash.trim() || !rut.trim(),
    [nombre, correo, password_hash, rut]
  );

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const goToLogin = () => router.replace("/login");

  const handleRegister = async () => {
    // AÑADIDO: Mensaje de error más específico
    if (isInvalid) {
      Alert.alert("Error", "Por favor, completa todos los campos requeridos, incluyendo el RUT.");
      return;
    }
    setIsLoading(true);
    try {
      const newUser: User = {
        correo: correo.trim().toLowerCase(),
        password_hash,
        nombre: nombre.trim(),
        numero_telefono: celular.trim(),
        apellido: "", // Este campo es opcional en la BD
        rut: rut.trim(), // <-- AÑADIDO: Se usa el RUT del estado
      };

      await registerUser(newUser);
      Alert.alert("Éxito", "Cuenta creada correctamente. Ahora puedes iniciar sesión.");
      router.replace("/login");

    } catch (e) {
      const error = e as HttpError;
      console.error("Error en el registro:", error);
      
      if (error.message && error.message.includes("duplicada")) {
        Alert.alert("Error", "Ya existe una cuenta con este correo electrónico.");
      } else {
        Alert.alert("Error", "No se pudo completar el registro. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.darkestBlue, COLORS.darkBlue]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Pressable style={styles.backBtn} onPress={goBack} hitSlop={10}>
          <AntDesign name="left" size={18} color={COLORS.lightestBlue} />
        </Pressable>
        <Text style={styles.headerTitle}>Crear{"\n"}Cuenta</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.cardWrapper}
      >
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Feather name="user" size={18} color={COLORS.mediumBlue} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Nombre Completo"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />
          </View>
          {/* AÑADIDO: Campo de entrada para el RUT */}
          <View style={styles.inputRow}>
            <Feather name="credit-card" size={18} color={COLORS.mediumBlue} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="RUT (con dígito verificador)"
              value={rut}
              onChangeText={setRut}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputRow}>
            <Feather name="mail" size={18} color={COLORS.mediumBlue} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Correo Electrónico"
              value={correo}
              onChangeText={setcorreo}
              keyboardType="email-address" // <-- CORREGIDO
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputRow}>
            <Feather name="lock" size={18} color={COLORS.mediumBlue} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Contraseña"
              value={password_hash}
              onChangeText={setpassword_hash}
              secureTextEntry
            />
          </View>
            <View style={styles.inputRow}>
            <Feather name="phone" size={18} color={COLORS.mediumBlue} style={styles.inputIcon} />
            <TextInput
              style={styles.inputField}
              placeholder="Número de Celular (Opcional)"
              value={celular}
              onChangeText={setCelular}
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity
            style={[styles.button, (isLoading || isInvalid) && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading || isInvalid}
          >
            {isLoading ? <ActivityIndicator color={COLORS.lightestBlue} /> : <Text style={styles.buttonText}>Registrarse</Text>}
          </TouchableOpacity>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              ¿Ya tienes una cuenta?{" "}
              <Text style={styles.footerLink} onPress={goToLogin}>
                Inicia Sesión
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
