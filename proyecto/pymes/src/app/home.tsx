import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown, FadeIn, useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedGradient from '../components/AnimatedGradient';
import GlassTile from '../components/GlassTile';
import FAB from '../components/FAB';
import { MotiView } from 'moti';
import { useMemo } from 'react';

export default function HomeScreen() {
  const y = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      y.value = e.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const scale = interpolate(y.value, [0, 120], [1, 0.92], Extrapolate.CLAMP);
    const opacity = interpolate(y.value, [0, 120], [1, 0.0], Extrapolate.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  const chips = useMemo(
    () => [
      { label: 'Ventas', href: '/ventas' },
      { label: 'Métricas', href: '/metricas' },
      { label: 'Sugerencia IA', href: '/sugerencia' },
    ],
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0b1220' }}>
      <AnimatedGradient />

      {/* Header con parallax + glow */}
      <Animated.View style={[{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 18 }, headerStyle]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.00)']}
          style={{ borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
        >
          <Text style={{ color: 'white', fontSize: 14, opacity: 0.8 }}>Bienvenido 👋</Text>
          <Text style={{ color: 'white', fontSize: 26, fontWeight: '800', marginTop: 4 }}>
            Panel de Inicio
          </Text>

          {/* Chips animados */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            {chips.map((c, i) => (
              <Link key={c.label} href={c.href} asChild>
                <Pressable>
                  <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 120 * (i + 1), type: 'timing' }}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.10)',
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: '700' }}>{c.label}</Text>
                  </MotiView>
                </Pressable>
              </Link>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Contenido scroll con tiles animadas */}
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Bloque “Acciones rápidas” */}
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Acciones rápidas</Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <GlassTile
            title="Ventas"
            subtitle="Resumen diario y detalle"
            delay={60}
            Icon={<TileIcon emoji="📈" />}
            onPress={() => {}}
          />
          <GlassTile
            title="Métricas"
            subtitle="KPIs en tiempo real"
            delay={120}
            Icon={<TileIcon emoji="📊" />}
            onPress={() => {}}
          />
        </View>
<View style={{ height: 24 }} />
<Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Cuenta</Text>
<View style={{ flexDirection: 'row', gap: 12 }}>
  <Link href="/login" asChild>
    <Pressable>
      <GlassTile title="Iniciar sesión" subtitle="Accede a tu cuenta" Icon={<Text style={{fontSize:18}}>🔐</Text>} />
    </Pressable>
  </Link>
  <Link href="/register" asChild>
    <Pressable>
      <GlassTile title="Crear cuenta" subtitle="Regístrate en minutos" Icon={<Text style={{fontSize:18}}>✨</Text>} />
    </Pressable>
  </Link>
</View>
        <View style={{ height: 12 }} />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <GlassTile
            title="Sugerencia IA"
            subtitle="Recomendaciones para hoy"
            delay={180}
            Icon={<TileIcon emoji="🤖" />}
            onPress={() => {}}
          />
          <GlassTile
            title="Inventario"
            subtitle="Stock & alertas"
            delay={240}
            Icon={<TileIcon emoji="📦" />}
            onPress={() => {}}
          />
        </View>

        {/* Sección animada con tarjetas pequeñas */}
        <View style={{ height: 24 }} />
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Hoy</Text>

        <Animated.View entering={FadeIn.duration(600)} style={{ gap: 12 }}>
          <MiniCard title="Objetivo de ventas" value="$ 1.200.000" trend="+8%" />
          <MiniCard title="Órdenes" value="173" trend="+12" />
          <MiniCard title="Ticket promedio" value="$ 6.930" trend="+3%" />
        </Animated.View>
      </Animated.ScrollView>

      {/* FAB */}
      <FAB label="Nueva venta" onPress={() => {}} />
    </View>
  );
}

function TileIcon({ emoji }: { emoji: string }) {
  return (
    <MotiView
      from={{ rotate: '0deg', scale: 0.9, opacity: 0 }}
      animate={{ rotate: '0deg', scale: 1, opacity: 1 }}
      transition={{ type: 'spring' }}
      style={{
        width: 38,
        height: 38,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
// ...venías desde TileIcon( ) abierto
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
    </MotiView>
  );
}

function MiniCard({ title, value, trend }: { title: string; value: string; trend?: string }) {
  return (
    <Animated.View entering={FadeInDown.springify()} style={{ overflow: 'hidden', borderRadius: 16 }}>
      <LinearGradient
        colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 14,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 6 }}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: '800' }}>{value}</Text>
          {!!trend && (
            <Text style={{ color: '#22d3ee', fontWeight: '700', fontSize: 12 }}>{trend}</Text>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

