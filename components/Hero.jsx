import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { C } from '../lib/theme';
import LogoIcon from './icons/LogoIcon';

export default function Hero() {
  const opacity = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(-14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: y }], alignItems: 'center', paddingTop: 20 }}>
      <LogoIcon />
      <Text style={{ fontSize: 30, fontWeight: '900', color: '#2E8B3A' }}>C-Hub</Text>
      <Text style={{ textAlign: 'center', fontWeight: '800', fontSize: 18 }}>
        Find your perfect{"\n"}campus home
      </Text>
    </Animated.View>
  );
}