import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

export const AnimatedTempo: React.FC = () => {
  const { theme } = useTheme();

  // Animations
  const bounceY = useRef(new Animated.Value(0)).current;
  const wheelRotate = useRef(new Animated.Value(0)).current;
  const puffOpacity = useRef(new Animated.Value(0)).current;
  const puffTranslate = useRef(new Animated.Value(0)).current;
  const clickBounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Suspension road bounce
    const bounceAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, {
          toValue: -2,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceY, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Continuous wheel spin
    const wheelAnim = Animated.loop(
      Animated.timing(wheelRotate, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 3. Smoke puff from exhaust
    const puffAnim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(puffOpacity, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(puffOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(puffTranslate, {
          toValue: -10,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnim.start();
    wheelAnim.start();
    puffAnim.start();

    return () => {
      bounceAnim.stop();
      wheelAnim.stop();
      puffAnim.stop();
    };
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(clickBounce, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(clickBounce, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(clickBounce, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const spin = wheelRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={styles.container}>
      <Animated.View
        style={[
          styles.tempoWrapper,
          {
            transform: [{ translateY: bounceY }, { scale: clickBounce }],
          },
        ]}
      >
        {/* Exhaust smoke puff */}
        <Animated.View
          style={[
            styles.exhaustPuff,
            {
              backgroundColor: theme.textMuted,
              opacity: puffOpacity,
              transform: [{ translateX: puffTranslate }],
            },
          ]}
        />

        {/* Cargo Box (Back of Tempo) */}
        <LinearGradient
          colors={theme.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cargoBox}
        >
          {/* Cargo decorative slats */}
          <View style={styles.cargoSlat} />
          <View style={styles.cargoSlat} />
        </LinearGradient>

        {/* Front Cabin */}
        <View style={[styles.cabin, { backgroundColor: theme.accent }]}>
          {/* Windshield / Window */}
          <View style={styles.windshield} />
          {/* Headlight */}
          <View style={styles.headlight} />
        </View>

        {/* Front Bumper */}
        <View style={styles.bumper} />

        {/* Wheels */}
        {/* Rear Wheel */}
        <Animated.View
          style={[
            styles.wheel,
            styles.rearWheel,
            { transform: [{ rotate: spin }] },
          ]}
        >
          <View style={styles.rim} />
          <View style={styles.hub} />
        </Animated.View>

        {/* Front Wheel */}
        <Animated.View
          style={[
            styles.wheel,
            styles.frontWheel,
            { transform: [{ rotate: spin }] },
          ]}
        >
          <View style={styles.rim} />
          <View style={styles.hub} />
        </Animated.View>
      </Animated.View>

      {/* Road line under tempo */}
      <View style={[styles.roadLine, { backgroundColor: theme.border }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 46,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  tempoWrapper: {
    width: 42,
    height: 26,
    position: 'relative',
  },
  cargoBox: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 22,
    height: 16,
    borderRadius: 3,
    borderTopLeftRadius: 4,
    justifyContent: 'space-evenly',
    paddingHorizontal: 2,
    zIndex: 2,
  },
  cargoSlat: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 1,
  },
  cabin: {
    position: 'absolute',
    left: 22,
    top: 5,
    width: 17,
    height: 13,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 2,
    zIndex: 2,
  },
  windshield: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 6,
    backgroundColor: '#e0f2fe',
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 1,
  },
  headlight: {
    position: 'absolute',
    bottom: 2,
    right: 0,
    width: 2.5,
    height: 3,
    backgroundColor: '#fef08a',
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
  },
  bumper: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 3,
    height: 4,
    backgroundColor: '#475569',
    borderRadius: 1,
    zIndex: 3,
  },
  wheel: {
    position: 'absolute',
    bottom: -2,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  rearWheel: {
    left: 6,
  },
  frontWheel: {
    right: 4,
  },
  rim: {
    width: 5,
    height: 1,
    backgroundColor: '#cbd5e1',
  },
  hub: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#ffffff',
  },
  exhaustPuff: {
    position: 'absolute',
    left: -2,
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    zIndex: 1,
  },
  roadLine: {
    position: 'absolute',
    bottom: 3,
    left: 0,
    right: 0,
    height: 1.5,
    borderRadius: 1,
  },
});
