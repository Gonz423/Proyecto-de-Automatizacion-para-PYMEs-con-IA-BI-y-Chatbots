import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import BackgroundMorph from '../components/BackgroundMorph';
import GlassInput from '../components/GlassInput';
import PrimaryButton from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <BackgroundMorph />

      {/* Back chevron */}
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
      </Pressable>

      {/* Card “vidrio” */}
      <View style={styles.card}>
        <Animated.Text entering={FadeInDown.springify()} style={styles.title}>Welcome Back</Animated.Text>

        <View style={{ height: 14 }} />
        <GlassInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <View style={{ height: 10 }} />
        <GlassInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <View style={{ height: 12 }} />
        <Text style={styles.forgot}>Forgot Password?</Text>

        <View style={{ height: 16 }} />
        <PrimaryButton title="log in" onPress={() => {/* do login */}} />

        {/* Divider “or” */}
        <View style={styles.dividerWrap}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Social */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn}><FontAwesome name="facebook" size={20} color="#fff" /></Pressable>
          <Pressable style={styles.socialBtn}><FontAwesome name="google" size={20} color="#fff" /></Pressable>
        </View>

        <View style={{ height: 16 }} />
        <Text style={styles.footer}>
          Don’t have an account? <Link href="/register" style={styles.link}>Sign up</Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bgTop, justifyContent: 'center' },
  back: { position: 'absolute', top: 18, left: 16, zIndex: 10, padding: 6 },
  card: {
    marginHorizontal: 18,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  title: { color: palette.white, fontSize: 26, fontWeight: '800' },
  forgot: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'right' },
  dividerWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  dividerText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 6 },
  socialBtn: {
    width: 42, height: 42, borderRadius: 42, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
  },
  footer: { color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  link: { color: palette.light, fontWeight: '700' },
});
