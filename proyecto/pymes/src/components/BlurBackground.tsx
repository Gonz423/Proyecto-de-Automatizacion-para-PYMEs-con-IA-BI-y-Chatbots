import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { palette } from '../theme/colors';

export default function BlurBackground() {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 7000 }), -1, true);
  }, []);

  const blobA = useAnimatedStyle(() => {
    const scale = interpolate(t.value, [0, 1], [0.95, 1.05]);
    return { transform: [{ scale }], opacity: 0.4 };
  });
  const blobB = useAnimatedStyle(() => {
    const scale = interpolate(t.value, [0, 1], [1.05, 0.95]);
    return { transform: [{ scale }], opacity: 0.35 };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[palette.bgTop, palette.bg]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.blob, { top: -80, left: -40, backgroundColor: palette.mid2 }, blobA]} />
      <Animated.View style={[styles.blob, { bottom: -100, right: -60, backgroundColor: palette.mid3 }, blobB]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 300,
  },
});
