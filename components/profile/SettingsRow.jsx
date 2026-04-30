// components/profile/SettingsRow.jsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { T } from './tokens';

const AnimatedTouch = Animated.createAnimatedComponent(TouchableOpacity);

export default function SettingsRow({
  icon,
  label,
  onPress,
  destructive = false,
  showDivider = true,
  rightElement,
}) {
  const bg = useSharedValue('rgba(0,0,0,0)');
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: bg.value,
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    bg.value = withTiming('#F3FBF6', { duration: 80 });
    scale.value = withTiming(0.982, { duration: 80 });
  }, []);

  const onPressOut = useCallback(() => {
    bg.value = withTiming('rgba(0,0,0,0)', { duration: 200 });
    scale.value = withTiming(1, { duration: 200 });
  }, []);

  return (
    <>
      <Animated.View style={animStyle}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          style={styles.row}
        >
          {/* Icon pill */}
          <View style={[styles.iconWrap, destructive && styles.iconWrapRed]}>
            {icon}
          </View>

          {/* Label */}
          <Text
            style={[
              styles.label,
              destructive && styles.labelRed,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>

          {/* Right */}
          <View style={styles.right}>
            {rightElement ? rightElement : null}
            <ChevronRight
              size={15}
              strokeWidth={2.2}
              color={destructive ? T.textRed : '#C5CCC8'}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: T.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapRed: {
    backgroundColor: T.iconBgRed,
  },
  label: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '500',
    color: T.textDark,
    letterSpacing: -0.1,
  },
  labelRed: {
    color: T.textRed,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  divider: {
    height: 1,
    backgroundColor: T.divider,
    marginLeft: 72,   // indented past icon
    marginRight: 0,
  },
});