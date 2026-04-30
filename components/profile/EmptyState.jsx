// components/profile/EmptyState.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from './tokens';

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconRing}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 44,
    paddingBottom: 80,
    gap: 12,
  },
  iconRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: T.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: T.textDark,
    textAlign: 'center',
  },
  sub: {
    fontSize: 13.5,
    color: T.textSoft,
    textAlign: 'center',
    lineHeight: 20,
  },
});