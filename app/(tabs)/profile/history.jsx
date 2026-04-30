// app/profile/history.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Clock, MapPin, ChevronRight } from 'lucide-react-native';

import SubScreenHeader from '@/components/profile/SubScreenHeader';
import EmptyState from '@/components/profile/EmptyState';
import { T } from '@/components/profile/tokens';

// ── Set to [] to see empty state ─────────────────────────────────────────────
const HISTORY = [
  { id: '1', title: 'Studio near UoN Main Campus', location: 'Parklands, Nairobi', date: 'Apr 18, 2025', price: 'KES 18,500/mo', status: 'Viewed' },
  { id: '2', title: '1BR Apartment · Strathmore Area', location: 'Ngong Road, Nairobi', date: 'Apr 12, 2025', price: 'KES 24,000/mo', status: 'Saved' },
  { id: '3', title: 'Bedsitter · JKUAT Corridor', location: 'Thika Road, Nairobi', date: 'Mar 30, 2025', price: 'KES 9,800/mo', status: 'Viewed' },
];

const STATUS = {
  Viewed: { bg: '#F0F1F0', color: T.textMid },
  Saved:  { bg: '#ECFAF3', color: T.textGreen },
  Booked: { bg: '#FFF7ED', color: '#D97706' },
};

function HistoryCard({ item, index }) {
  const s = STATUS[item.status] ?? STATUS.Viewed;
  return (
    <Animated.View entering={FadeInDown.delay(index * 55 + 60).duration(340).springify()}>
      <TouchableOpacity style={styles.card} activeOpacity={0.78}>
        <View style={styles.cardLeft}>
          <View style={styles.iconBox}>
            <Clock size={17} color={T.textGreen} strokeWidth={2} />
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={11} color={T.textSoft} strokeWidth={2} />
            <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.price}>{item.price}</Text>
            <View style={[styles.badge, { backgroundColor: s.bg }]}>
              <Text style={[styles.badgeText, { color: s.color }]}>{item.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.date}>{item.date}</Text>
          <ChevronRight size={14} color="#C5CCC8" strokeWidth={2} />
        </View>
      </TouchableOpacity>
      <View style={styles.divider} />
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <SubScreenHeader title="History" />

      {HISTORY.length === 0 ? (
        <EmptyState
          icon={<Clock size={28} color={T.textGreen} strokeWidth={1.8} />}
          title="No history yet"
          subtitle="Rooms you browse and save will appear here. Start exploring to find your next space."
        />
      ) : (
        <FlatList
          data={HISTORY}
          keyExtractor={(i) => i.id}
          renderItem={({ item, index }) => <HistoryCard item={item} index={index} />}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.countText}>{HISTORY.length} recent items</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  list: { paddingHorizontal: 0 },
  countText: { fontSize: 12.5, color: T.textSoft, paddingHorizontal: 20, paddingVertical: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  cardLeft: {},
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 14.5, fontWeight: '600', color: T.textDark },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: T.textSoft, flex: 1 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 1 },
  price: { fontSize: 12.5, fontWeight: '700', color: T.textGreen },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100 },
  badgeText: { fontSize: 10.5, fontWeight: '600' },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  date: { fontSize: 11, color: T.textSoft },
  divider: { height: 1, backgroundColor: T.divider, marginLeft: 72 },
});