import { View, Text } from "react-native";
import styles from "../../styles/home.styles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Has iniciado sesión correctamente.</Text>
    </View>
  );
}