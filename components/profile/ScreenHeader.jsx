// components/profile/ScreenHeader.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { C, S } from './theme';

export default function ScreenHeader({ title, rightAction }) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['rgba(0,20,8,0.98)', 'rgba(0,10,4,0.0)']}
      style={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
        hitSlop={12}
        activeOpacity={0.7}
      >
        <ArrowLeft size={20} color={C.textPrimary} strokeWidth={2} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightSlot}>
        {rightAction || null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S.md,
    paddingBottom: 18,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: C.textPrimary,
    letterSpacing: -0.2,
  },
  rightSlot: {
    width: 38,
    alignItems: 'flex-end',
  },
});
