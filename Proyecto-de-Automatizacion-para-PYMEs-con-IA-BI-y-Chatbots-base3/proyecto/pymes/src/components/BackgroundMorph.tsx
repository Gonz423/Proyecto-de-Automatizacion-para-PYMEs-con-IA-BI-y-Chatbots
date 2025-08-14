import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLG, Stop, Path } from 'react-native-svg';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedProps, interpolate } from 'react-native-reanimated';
import { palette } from '../theme/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function BackgroundMorph() {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 9000 }), -1, true);
  }, []);

  const animatedPropsA = useAnimatedProps(() => {
    // morph sutil entre dos curvas (mismo número de puntos)
    const k = interpolate(t.value, [0, 1], [0, 1]);
    // forma A y B (paths compatibles)
    const A = `M0,120 C60,80 120,40 220,60 C320,80 360,160 420,200 C480,240 560,270 600,260 L600,0 L0,0 Z`;
    const B = `M0,110 C80,70 140,20 230,40 C330,70 370,150 430,190 C510,230 560,280 600,270 L600,0 L0,0 Z`;
    // en móvil sin lib de morph, hacemos snap near A/B + opacidad → efecto suave
    return { d: k < 0.5 ? A : B };
  });

  const animatedPropsB = useAnimatedProps(() => {
    const k = interpolate(t.value, [0, 1], [0, 1]);
    const A = `M0,520 C80,500 160,470 250,490 C340,510 430,560 520,600 L600,600 L0,600 Z`;
    const B = `M0,530 C90,510 180,480 260,505 C350,535 440,575 520,600 L600,600 L0,600 Z`;
    return { d: k < 0.5 ? A : B };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[palette.bgTop, palette.bg]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top organic blob */}
      <Svg width="100%" height="42%" viewBox="0 0 600 300" style={styles.svg}>
        <Defs>
          <SvgLG id="gradTop" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={palette.mid3} stopOpacity={0.45} />
            <Stop offset="1" stopColor={palette.mid2} stopOpacity={0.25} />
          </SvgLG>
        </Defs>
        <AnimatedPath animatedProps={animatedPropsA} fill="url(#gradTop)" />
      </Svg>

      {/* Bottom organic blob */}
      <Svg width="100%" height="50%" viewBox="0 0 600 600" style={styles.svgBottom}>
        <Defs>
          <SvgLG id="gradBottom" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={palette.mid2} stopOpacity={0.25} />
            <Stop offset="1" stopColor={palette.mid3} stopOpacity={0.45} />
          </SvgLG>
        </Defs>
        <AnimatedPath animatedProps={animatedPropsB} fill="url(#gradBottom)" />
      </Svg>

      {/* Glow suave */}
      <View pointerEvents="none" style={styles.glow} />
    </View>
  );
}

const styles = StyleSheet.create({
  svg: { position: 'absolute', top: 0, left: 0, right: 0, opacity: 0.9 },
  svgBottom: { position: 'absolute', bottom: -40, left: -20, right: 0, opacity: 0.9 },
  glow: {
    position: 'absolute',
    inset: 0,
    shadowColor: palette.light,
    shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.2,
    shadowRadius: 40,
  },
});
