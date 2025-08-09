import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import styles from "../../styles/login.styles";
import { getUsers, registerUser, User } from "../../services/userService";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [numeroTelefono, setNumeroTelefono] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!email.trim() || !password.trim() || !nombre.trim() || !apellido.trim() || !rut.trim() || !numeroTelefono.trim()) {
            Alert.alert("Error", "Por favor, completa todos los campos para registrarte.");
            return;
        }

        setIsLoading(true);

        try {
            // Verificar si el usuario ya existe por email
            const users = await getUsers();
            const userExists = users.some((u: User) => u.email === email);

            if (userExists) {
                Alert.alert("Error", "Ya existe una cuenta con este correo electrónico.");
            } else {
                const newUser: User = {
                    email,
                    password,
                    nombre,
                    apellido,
                    rut,
                    numeroTelefono,
                };
                await registerUser(newUser);

                Alert.alert("Éxito", "¡Te has registrado correctamente!");
                router.replace('/(auth)/login');
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un problema al intentar registrarte. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const goToLogin = () => {
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear una cuenta</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
                editable={!isLoading}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
                autoCapitalize="words"
                editable={!isLoading}
            />
            <TextInput
                style={styles.input}
                placeholder="RUT"
                value={rut}
                onChangeText={setRut}
                autoCapitalize="none"
                editable={!isLoading}
            />
            <TextInput
                style={styles.input}
                placeholder="Número de Teléfono"
                value={numeroTelefono}
                onChangeText={setNumeroTelefono}
                keyboardType="phone-pad"
                autoCapitalize="none"
                editable={!isLoading}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
            />
            
            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Registrarse</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 20 }} onPress={goToLogin}>
                <Text style={{ textAlign: 'center', color: '#007AFF' }}>¿Ya tienes una cuenta? Inicia sesión.</Text>
            </TouchableOpacity>
        </View>
    );
}