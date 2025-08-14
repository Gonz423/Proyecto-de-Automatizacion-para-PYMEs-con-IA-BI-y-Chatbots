import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export default function AnimatedGradient() {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 6000 }), -1, true);
  }, []);

  const glow = useAnimatedStyle(() => {
    const scale = interpolate(t.value, [0, 1], [0.95, 1.05]);
    const opacity = interpolate(t.value, [0, 1], [0.35, 0.6]);
    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#0b1220', '#101a33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.blob, { top: -80, left: -50, backgroundColor: '#4f46e5' }, glow]} />
      <Animated.View style={[styles.blob, { bottom: -90, right: -60, backgroundColor: '#06b6d4' }, glow]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 240,
    opacity: 0.4,
  },
});
