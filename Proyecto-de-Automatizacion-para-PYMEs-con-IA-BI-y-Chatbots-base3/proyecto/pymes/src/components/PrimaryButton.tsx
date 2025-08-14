import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { palette } from '../theme/colors';

type Props = { title: string; onPress?: () => void; style?: ViewStyle };

export default function PrimaryButton({ title, onPress, style }: Props) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <Animated.View style={[a, style, styles.shadow]}>
      <Pressable
        onPressIn={() => (s.value = withSpring(0.98))}
        onPressOut={() => (s.value = withSpring(1))}
        onPress={onPress}
        style={{ borderRadius: 14, overflow: 'hidden' }}
      >
        <LinearGradient
          colors={[palette.light, '#9fd7f8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btn}
        >
          <Text style={styles.txt}>{title}</Text>
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
