import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const ONBOARDING_KEY = '@chub_onboarding_complete';

export default function SplashScreen() {
  const animationRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let completedValue = null;

    animationRef.current?.play();

    const navigate = () => {
      if (!isMounted) return;

      if (completedValue) {
        router.replace('/(auth)');
      } else {
        router.replace('/OnboardingScreen');
      }
    };

    const initApp = async () => {
      try {
        completedValue = await AsyncStorage.getItem(ONBOARDING_KEY);

        // minimum splash duration
        setTimeout(() => {
          navigate();
        }, 2000);

      } catch (e) {
        router.replace('/(auth)');
      }
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../assets/animations/splash.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />

      <Text style={styles.title}>Comrade Sasa</Text>
      <Text style={styles.subtitle}>
        Connecting your campus life
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 6,
  },
});