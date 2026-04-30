import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function OnboardingSlide({ item, isActive, index, scrollX }) {
  const insets = useSafeAreaInsets();

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(28);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const descOpacity = useSharedValue(0);
  const descTranslateY = useSharedValue(16);
  const badgeOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0.85);

  useEffect(() => {
    if (isActive) {
      titleOpacity.value = withDelay(
        100,
        withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })
      );
      titleTranslateY.value = withDelay(
        100,
        withTiming(0, { duration: 520, easing: Easing.out(Easing.cubic) })
      );
      subtitleOpacity.value = withDelay(
        220,
        withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) })
      );
      subtitleTranslateY.value = withDelay(
        220,
        withTiming(0, { duration: 480, easing: Easing.out(Easing.cubic) })
      );
      descOpacity.value = withDelay(
        360,
        withTiming(1, { duration: 440, easing: Easing.out(Easing.cubic) })
      );
      descTranslateY.value = withDelay(
        360,
        withTiming(0, { duration: 440, easing: Easing.out(Easing.cubic) })
      );
      badgeOpacity.value = withDelay(
        80,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
      );
      badgeScale.value = withDelay(
        80,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
      );
    } else {
      titleOpacity.value = withTiming(0, { duration: 180 });
      titleTranslateY.value = withTiming(14, { duration: 180 });
      subtitleOpacity.value = withTiming(0, { duration: 160 });
      subtitleTranslateY.value = withTiming(10, { duration: 160 });
      descOpacity.value = withTiming(0, { duration: 140 });
      descTranslateY.value = withTiming(8, { duration: 140 });
      badgeOpacity.value = withTiming(0, { duration: 160 });
      badgeScale.value = withTiming(0.88, { duration: 160 });
    }
  }, [isActive]);

  // Parallax: image moves at 18% of scroll speed for depth effect
  const imageParallaxStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    const translateX = interpolate(scrollX.value, inputRange, [
      -SCREEN_WIDTH * 0.18,
      0,
      SCREEN_WIDTH * 0.18,
    ]);
    const scale = interpolate(scrollX.value, inputRange, [1.08, 1, 1.08]);
    return { transform: [{ translateX }, { scale }] };
  });

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const descStyle = useAnimatedStyle(() => ({
    opacity: descOpacity.value,
    transform: [{ translateY: descTranslateY.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      {/* Parallax image layer */}
      <Animated.View style={[StyleSheet.absoluteFillObject, imageParallaxStyle]}>
        <ImageBackground
          source={item.image}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Top vignette */}
      <LinearGradient
        colors={['rgba(0,0,0,0.22)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />

      {/* Main bottom gradient — dark green to near-black */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(2,18,8,0.30)',
          'rgba(2,18,8,0.62)',
          'rgba(1,14,6,0.84)',
          'rgba(1,10,5,0.96)',
          'rgba(0,8,3,1.0)',
        ]}
        locations={[0, 0.28, 0.48, 0.65, 0.80, 1]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      {/* Subtle green glow mid-screen */}
      <LinearGradient
        colors={['transparent', 'rgba(45,180,85,0.06)', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.glowAccent}
        pointerEvents="none"
      />

      {/* Text content anchored to bottom */}
      <View style={[styles.content, { paddingBottom: insets.bottom + 184 }]}>
        {/* Pill badge */}
        <Animated.View style={[styles.badgeWrapper, badgeStyle]}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <Animated.Text style={[styles.title, titleStyle]}>
          {item.title}
        </Animated.Text>

        {/* Subtitle / tagline */}
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          {item.subtitle}
        </Animated.Text>

        {/* Green accent rule */}
        <Animated.View style={[styles.divider, subtitleStyle]} />

        {/* Body copy */}
        <Animated.Text style={[styles.description, descStyle]}>
          {item.description}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#000A04',
  },
  image: {
    width: SCREEN_WIDTH * 1.36,
    height: SCREEN_HEIGHT,
    marginLeft: -SCREEN_WIDTH * 0.18,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.74,
  },
  glowAccent: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.3,
    left: 0,
    right: 0,
    height: 140,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45,180,85,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(45,180,85,0.32)',
    borderRadius: 100,
    paddingHorizontal: 13,
    paddingVertical: 6,
    gap: 7,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38C864',
  },
  badgeText: {
    color: '#7FEAA6',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: SCREEN_WIDTH < 380 ? 29 : 33,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.7,
    lineHeight: SCREEN_WIDTH < 380 ? 35 : 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15.5,
    fontWeight: '500',
    color: '#38C864',
    letterSpacing: 0.15,
    marginBottom: 13,
  },
  divider: {
    width: 36,
    height: 2,
    backgroundColor: 'rgba(56,200,100,0.38)',
    borderRadius: 2,
    marginBottom: 15,
  },
  description: {
    fontSize: 14.5,
    color: 'rgba(255,255,255,0.62)',
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: 0.1,
    maxWidth: '90%',
  },
});
