// src/app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
    </Tabs>
  );
}