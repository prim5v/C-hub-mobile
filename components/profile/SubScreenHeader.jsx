// components/profile/SubScreenHeader.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { T } from './tokens';

export default function SubScreenHeader({ title, rightAction }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + (Platform.OS === 'android' ? 8 : 4) }]}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.back}
        hitSlop={12}
        activeOpacity={0.65}
      >
        <ArrowLeft size={20} color={T.textDark} strokeWidth={2} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightSlot}>
        {rightAction ?? null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.sheet,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.divider,
    gap: 10,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: T.textDark,
    letterSpacing: -0.2,
  },
  rightSlot: {
    width: 36,
    alignItems: 'flex-end',
  },
});