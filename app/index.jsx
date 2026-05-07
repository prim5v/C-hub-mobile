// /**
//  * app/(auth)/index.jsx
//  *
//  * This is the Expo Router entry point for the auth group.
//  * It checks AsyncStorage on mount:
//  *   - First launch  → shows OnboardingScreen
//  *   - Return visit  → shows AuthScreen directly
//  */

// import React, { useEffect, useState } from 'react';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // import OnboardingScreen from '../../screens/OnboardingScreen';
// import OnboardingScreen from '@/app/OnboardingScreen'
// import AuthScreen from '@/screens/AuthScreen'
// // import AuthScreen from '../../screens/AuthScreen';

// const ONBOARDING_KEY = '@chub_onboarding_complete';

// export default function AuthEntry() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [showOnboarding, setShowOnboarding] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
//         setShowOnboarding(completed === null); // null means first launch
//       } catch (_) {
//         setShowOnboarding(false); // fallback: go straight to auth
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="small" color="#38C864" />
//       </View>
//     );
//   }

//   if (showOnboarding) {
//     return <OnboardingScreen />;
//   }

//   return <AuthScreen />;
// }

// const styles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     backgroundColor: '#000A04',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


// This file is the root of the auth group. It decides whether to show onboarding or auth screens based on AsyncStorage.

// import React, { useEffect } from 'react';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';

// const ONBOARDING_KEY = '@chub_onboarding_complete';

// export default function Index() {
//   useEffect(() => {
//     checkOnboarding();
//   }, []);

//   const checkOnboarding = async () => {
//     try {
//       const completed = await AsyncStorage.getItem(ONBOARDING_KEY);

//       if (completed) {
//         router.replace('/(auth)');
//       } else {
//         router.replace('/OnboardingScreen');
//       }
//     } catch (error) {
//       router.replace('/(auth)');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="small" color="#38C864" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000A04',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    router.replace('/SplashScreen');
  }, []);

  return null;
}