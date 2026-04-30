import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// import OnboardingSlide from '../components/onboarding/OnboardingSlide';
// import PaginationDots from '../components/onboarding/PaginationDots';
import OnboardingSlide from '@/components/OnboardingSlide'
import PaginationDots from '@/components/PaginationDots'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ONBOARDING_KEY = '@chub_onboarding_complete';

const SLIDES = [
  {
    id: '1',
    badge: 'C-Hub · Campus Housing',
    title: 'Find Rooms\nNear Campus',
    subtitle: 'Fast. Verified. Stress-free.',
    description:
      'Discover verified student housing near your campus in minutes. No middlemen, no hassle.',
    image: require('../assets/ad1.jpeg'),
  },
  {
    id: '2',
    badge: 'Smart Search',
    title: 'Rooms\nAround You',
    subtitle: 'Search smarter.',
    description:
      'Explore nearby listings with maps, live pricing, and real-time availability — all in one place.',
    image: require('../assets/ad2.jpeg'),
  },
  {
    id: '3',
    badge: 'Move In Ready',
    title: 'Move In Without\nthe Hassle',
    subtitle: 'Smart student housing.',
    description:
      'Find your next space quickly and settle in stress-free. Your perfect room is a tap away.',
    image: require('../assets/ad3.jpeg'),
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      runOnJS(setActiveIndex)(index);
    },
  });

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (_) {}
    router.replace('/(auth)');
  }, []);

  const goNext = useCallback(() => {
    if (activeIndex < SLIDES.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    } else {
      completeOnboarding();
    }
  }, [activeIndex, completeOnboarding]);

  const skip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  // Skip button fades out on last slide
  const skipStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [0, (SLIDES.length - 2) * SCREEN_WIDTH, (SLIDES.length - 1) * SCREEN_WIDTH],
      [1, 1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Next button label animates on last slide
  const isLast = activeIndex === SLIDES.length - 1;

  const nextBtnScale = useSharedValue(1);

  const handleNextPressIn = () => {
    nextBtnScale.value = withSpring(0.94, { damping: 14, stiffness: 280 });
  };
  const handleNextPressOut = () => {
    nextBtnScale.value = withSpring(1, { damping: 14, stiffness: 280 });
  };

  const nextBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextBtnScale.value }],
  }));

  const renderItem = useCallback(
    ({ item, index }) => (
      <OnboardingSlide
        item={item}
        isActive={activeIndex === index}
        index={index}
        scrollX={scrollX}
      />
    ),
    [activeIndex, scrollX]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      {/* Pager */}
      <AnimatedFlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        getItemLayout={getItemLayout}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
      />

      {/* Bottom controls overlay */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 36 }]}>
        {/* Skip */}
        <Animated.View style={[styles.skipWrapper, skipStyle]}>
          <TouchableOpacity onPress={skip} hitSlop={12} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Pagination */}
        <PaginationDots count={SLIDES.length} scrollX={scrollX} />

        {/* Next / Get Started button */}
        <Animated.View style={nextBtnStyle}>
          <TouchableOpacity
            onPress={goNext}
            onPressIn={handleNextPressIn}
            onPressOut={handleNextPressOut}
            activeOpacity={1}
            style={styles.nextBtnOuter}
          >
            <LinearGradient
              colors={['#2DBA60', '#1A8A43']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextBtn}
            >
              {/* Inner glass sheen */}
              <LinearGradient
                colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <Text style={styles.nextBtnText}>
                {isLast ? 'Get Started →' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Top left wordmark */}
      <View style={[styles.wordmark, { top: insets.top + 20 }]} pointerEvents="none">
        <View style={styles.wordmarkDot} />
        <Text style={styles.wordmarkText}>C-Hub</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000A04',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  skipWrapper: {
    minWidth: 56,
  },
  skipText: {
    color: 'rgba(255,255,255,0.52)',
    fontSize: 14.5,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  nextBtnOuter: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#2DBA60',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 10,
  },
  nextBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    minWidth: 108,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  wordmark: {
    position: 'absolute',
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  wordmarkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38C864',
  },
  wordmarkText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
