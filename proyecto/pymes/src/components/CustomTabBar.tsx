// src/components/CustomTabBar.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap | undefined;
        if (route.name === 'home') iconName = isFocused ? 'home' : 'home-outline';
        else if (route.name === 'inventory') iconName = isFocused ? 'cube' : 'cube-outline';
        else if (route.name === 'orders') iconName = isFocused ? 'document-text' : 'document-text-outline';
        
        if (!iconName) return null;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons name={iconName} size={24} color={isFocused ? '#6DD5FA' : 'white'} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute', bottom: 25, left: 20, right: 20,
    flexDirection: 'row', height: 60, borderRadius: 30,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});