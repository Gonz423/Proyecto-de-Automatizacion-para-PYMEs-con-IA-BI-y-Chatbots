import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 40 },
    input: { borderWidth: 1, padding: 15, marginBottom: 20, borderRadius: 8, borderColor: "#ccc" },
    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
            },
        }),
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    buttonDisabled: { backgroundColor: "#a0c4ff" },
});

export default styles;