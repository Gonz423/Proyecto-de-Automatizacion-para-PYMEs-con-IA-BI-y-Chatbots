import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import BackgroundMorph from '../components/BackgroundMorph';
import GlassInput from '../components/GlassInput';
import PrimaryButton from '../components/PrimaryButton';
import { palette } from '../theme/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <BackgroundMorph />

      <Pressable onPress={() => router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
      </Pressable>

      <View style={styles.card}>
        <Animated.Text entering={FadeInDown.springify()} style={styles.title}>Create Account</Animated.Text>

        <View style={{ height: 14 }} />
        <GlassInput placeholder="Full name" value={name} onChangeText={setName} />
        <View style={{ height: 10 }} />
        <GlassInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <View style={{ height: 10 }} />
        <GlassInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

        <View style={{ height: 16 }} />
        <PrimaryButton title="Sign up" onPress={() => {/* do register */}} />

        <View style={styles.dividerWrap}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn}><FontAwesome name="facebook" size={20} color="#fff" /></Pressable>
          <Pressable style={styles.socialBtn}><FontAwesome name="google" size={20} color="#fff" /></Pressable>
        </View>

        <View style={{ height: 16 }} />
        <Text style={styles.footer}>
          Already have an account? <Link href="/login" style={styles.link}>Log in</Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bgTop,
    justifyContent: 'center',
  },

  // botón/back (icono chevron)
  back: {
    position: 'absolute',
    top: 18,
    left: 16,
    zIndex: 10,          // ← ojo: zIndex (no "z")
    padding: 6,
  },

  // tarjeta “vidrio”
  card: {
    marginHorizontal: 18,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },

  // títulos principales
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
  },

  // “Forgot Password?”
  forgot: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'right',
  },

  // separador “or”
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },

  // redes sociales
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 6,
  },
  socialBtn: {
    width: 42,
    height: 42,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  // pie con links (login/register)
  footer: {
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  link: {
    color: palette.light,
    fontWeight: '700',
  },
});
