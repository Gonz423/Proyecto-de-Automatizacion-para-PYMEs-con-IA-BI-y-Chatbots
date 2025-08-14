import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Animated, { Layout, FadeInDown } from 'react-native-reanimated';


export default function RootLayout() {
  useEffect(() => {
    // Cualquier preparación global de reanimated si la necesitas
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1220' }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        {/* Overlay sutil para glow global cuando navegues */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          layout={Layout.springify()}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
