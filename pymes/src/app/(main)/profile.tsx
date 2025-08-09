import { View, Text } from 'react-native';
import styles from '../../styles/profile.styles';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Esta es la pantalla de Perfil!</Text>
    </View>
  );
}