import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { palette } from '../theme/colors';

// 1. Añadimos las nuevas propiedades opcionales
type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  isLoading?: boolean;
  disabled?: boolean;
};

// 2. Recibimos las nuevas props en el componente
export default function PrimaryButton({ title, onPress, style, isLoading, disabled }: Props) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  // Determina si el botón debe estar inactivo
  const isInactive = isLoading || disabled;

  return (
    <Animated.View style={[a, style, styles.shadow]}>
      <Pressable
        // 3. Deshabilitamos el Pressable si está inactivo
        disabled={isInactive}
        onPressIn={() => (s.value = withSpring(0.98))}
        onPressOut={() => (s.value = withSpring(1))}
        onPress={onPress}
        style={{ borderRadius: 14, overflow: 'hidden' }}
      >
        <LinearGradient
          // 4. Cambiamos el estilo visual si está inactivo
          style={[styles.btn, isInactive && styles.btnDisabled]}
          colors={isInactive ? ['#a1a1a1', '#7d7d7d'] : [palette.light, '#9fd7f8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* 5. Mostramos el indicador de carga o el texto */}
          {isLoading ? (
            <ActivityIndicator color="#021024" />
          ) : (
            <Text style={styles.txt}>{title}</Text>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
  },
  // Nuevo estilo para el estado deshabilitado
  btnDisabled: {
    opacity: 0.6,
  },
  txt: {
    color: '#021024',
    fontWeight: '800',
    fontSize: 16,
  },
  shadow: {
    ...Platform.select({
      ios: { shadowColor: palette.light, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 6 },
    }),
  },
});