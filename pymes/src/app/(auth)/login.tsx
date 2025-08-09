import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../../hooks/userAuth";
import { getUsers, User } from "../../services/userService"; 
import { router } from "expo-router";
import styles from "../../styles/login.styles"; // Importa los estilos desde el archivo separado

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Por favor, introduce tu email y contraseña.");
            return;
        }

        setIsLoading(true);

        try {
            const users = await getUsers();
            const user = users.find((u: User) => u.email === email && u.password === password);

            if (user) {
                login({ email: user.email });
                Alert.alert("Éxito", "¡Has iniciado sesión correctamente!");
                router.replace('/(main)');
            } else {
                Alert.alert("Error", "Credenciales incorrectas. Por favor, inténtalo de nuevo.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un problema al intentar iniciar sesión.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>
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
            onPress={handleLogin}
            disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                <Text style={styles.buttonText}>Entrar</Text>
                )}
                </TouchableOpacity>
                </View>);
}