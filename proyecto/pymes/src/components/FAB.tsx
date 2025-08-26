import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

type Props = { onPress?: () => void; label?: string };

export default function FAB({ onPress, label = 'Acción' }: Props) {
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <Animated.View style={[{ position: 'absolute', right: 16, bottom: 24 }, style]}>
      <Pressable
        onPressIn={() => (s.value = withSpring(0.92))}
        onPressOut={() => (s.value = withSpring(1))}
        onPress={onPress}
        style={{
          backgroundColor: '#22d3ee',
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 999,
          shadowColor: '#22d3ee',
          shadowOpacity: 0.6,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
        }}
      >
        <Text style={{ color: '#041014', fontWeight: '800' }}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}
