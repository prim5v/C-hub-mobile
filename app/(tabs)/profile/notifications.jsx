// app/profile/notifications.jsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell, MessageSquare, Tag, TrendingUp, Shield, Star } from 'lucide-react-native';

import ScreenHeader from '@/components/profile/ScreenHeader';
import { C, R, S } from '@/components/profile/theme';

const INITIAL_SETTINGS = [
  {
    group: 'Listings',
    items: [
      { id: 'new_listings', label: 'New Listings Near You', sub: 'Rooms matching your preferences', icon: Bell, enabled: true },
      { id: 'price_drops', label: 'Price Drops', sub: 'When a saved listing price decreases', icon: TrendingUp, enabled: true },
    ],
  },
  {
    group: 'Communication',
    items: [
      { id: 'messages', label: 'Messages', sub: 'Replies from landlords', icon: MessageSquare, enabled: true },
      { id: 'booking_updates', label: 'Booking Updates', sub: 'Status changes on your bookings', icon: Star, enabled: true },
    ],
  },
  {
    group: 'Promotions',
    items: [
      { id: 'promos', label: 'Promo Codes & Offers', sub: 'Exclusive deals and discount codes', icon: Tag, enabled: false },
      { id: 'tips', label: 'Moving Tips', sub: 'Guides and campus housing advice', icon: Shield, enabled: false },
    ],
  },
];

function NotifRow({ item, value, onChange, showDivider }) {
  const Icon = item.icon;
  return (
    <>
      <View style={styles.row}>
        <View style={styles.rowIcon}>
          <Icon size={16} color={C.green} strokeWidth={2} />
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>{item.label}</Text>
          <Text style={styles.rowSub}>{item.sub}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: 'rgba(255,255,255,0.1)', true: C.greenDark }}
          thumbColor={value ? C.green : 'rgba(255,255,255,0.4)'}
          ios_backgroundColor="rgba(255,255,255,0.1)"
          style={Platform.OS === 'android' ? { transform: [{ scale: 0.9 }] } : undefined}
        />
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState(() => {
    const map = {};
    INITIAL_SETTINGS.forEach((g) => g.items.forEach((i) => { map[i.id] = i.enabled; }));
    return map;
  });

  const toggle = useCallback((id) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const enabledCount = Object.values(settings).filter(Boolean).length;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(45,186,96,0.07)', C.bg]}
        locations={[0, 0.4]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <ScreenHeader title="Notifications" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status card */}
        <Animated.View
          entering={FadeInDown.delay(60).duration(420).springify()}
          style={styles.statusCard}
        >
          <LinearGradient
            colors={['rgba(56,200,100,0.12)', 'rgba(56,200,100,0.04)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.statusCardBorder} />
          <Bell size={18} color={C.green} strokeWidth={2} />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>
              {enabledCount} of {Object.keys(settings).length} notifications active
            </Text>
            <Text style={styles.statusSub}>
              Stay informed about your campus housing journey
            </Text>
          </View>
        </Animated.View>

        {INITIAL_SETTINGS.map((group, gi) => (
          <Animated.View
            key={group.group}
            entering={FadeInDown.delay(gi * 80 + 100).duration(380).springify()}
          >
            <Text style={styles.sectionTitle}>{group.group}</Text>
            <View style={styles.card}>
              {group.items.map((item, ii) => (
                <NotifRow
                  key={item.id}
                  item={item}
                  value={settings[item.id]}
                  onChange={() => toggle(item.id)}
                  showDivider={ii < group.items.length - 1}
                />
              ))}
            </View>
          </Animated.View>
        ))}

        <Animated.View
          entering={FadeInDown.delay(320).duration(360)}
          style={styles.noteCard}
        >
          <Text style={styles.noteText}>
            📱 System notification permissions are managed in your device Settings app under C-Hub.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: S.md, gap: 10 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: R.cardLg,
    borderWidth: 1,
    borderColor: C.greenBorder,
    padding: S.md,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 6,
  },
  statusCardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: R.cardLg,
    borderWidth: 1,
    borderColor: C.greenBorder,
  },
  statusTitle: { fontSize: 14, fontWeight: '600', color: C.textPrimary, letterSpacing: -0.1 },
  statusSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: C.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginLeft: 4,
    marginBottom: 6,
    marginTop: 6,
  },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: R.card,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: S.md,
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bgCardStrong,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 14.5, fontWeight: '500', color: C.textPrimary },
  rowSub: { fontSize: 12, color: C.textMuted },
  divider: { height: 1, backgroundColor: C.divider, marginLeft: 64 },
  noteCard: {
    backgroundColor: C.bgCard,
    borderRadius: R.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.md,
    marginTop: 6,
  },
  noteText: { fontSize: 13, color: C.textSecondary, lineHeight: 20 },
});
