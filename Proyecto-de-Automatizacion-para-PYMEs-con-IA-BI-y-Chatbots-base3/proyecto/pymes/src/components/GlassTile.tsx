import React, { ReactNode } from 'react';
import { Pressable, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  Icon?: ReactNode;
  delay?: number;
};

export default function GlassTile({ title, subtitle, onPress, Icon, delay = 0 }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      layout={Layout.springify()}
      style={{ flex: 1, minHeight: 140 }}
    >
      <Pressable
        onPress={onPress}
        style={{
          overflow: 'hidden',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.10)',
        }}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 16 }}
        >
          <View style={{ marginBottom: 8 }}>{Icon}</View>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>{title}</Text>
          {subtitle ? (
            <Text style={{ color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>{subtitle}</Text>
          ) : null}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
