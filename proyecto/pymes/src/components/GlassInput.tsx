import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';

export default function GlassInput(props: TextInputProps) {
  return (
    <View style={styles.wrap}>
      <TextInput
        placeholderTextColor="rgba(255,255,255,0.6)"
        {...props}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    overflow: 'hidden',
  },
  input: {
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15.5,
  },
});
