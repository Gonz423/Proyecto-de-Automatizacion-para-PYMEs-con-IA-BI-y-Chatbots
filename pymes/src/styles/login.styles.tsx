import { StyleSheet } from "react-native";
import { colors } from "./theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.textPrimary,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderColor: colors.border,
        borderWidth: 1,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        // ** Aquí se corrige la advertencia **
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        elevation: 5, // Esta propiedad se usa en Android para simular sombras
    },
    buttonDisabled: {
        backgroundColor: colors.disabled,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default styles;
