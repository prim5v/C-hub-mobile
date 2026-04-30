// app/profile/language.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import ScreenHeader from '@/components/profile/ScreenHeader';
import { C, R, S } from '@/components/profile/theme';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧', region: 'Global' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', region: 'East Africa' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷', region: 'Global' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦', region: 'Middle East' },
  { code: 'pt', label: 'Portuguese', native: 'Português', flag: '🇧🇷', region: 'South America' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸', region: 'Global' },
  { code: 'zh', label: 'Chinese', native: '中文', flag: '🇨🇳', region: 'Asia' },
];

function LangItem({ item, selected, onSelect, index }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50 + 60).duration(340).springify()}>
      <TouchableOpacity
        style={[styles.item, selected && styles.itemSelected]}
        onPress={() => onSelect(item.code)}
        activeOpacity={0.78}
      >
        {selected && (
          <LinearGradient
            colors={['rgba(56,200,100,0.10)', 'rgba(56,200,100,0.04)']}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.itemText}>
          <Text style={[styles.itemLabel, selected && styles.itemLabelSelected]}>
            {item.label}
          </Text>
          <Text style={styles.itemNative}>{item.native} · {item.region}</Text>
        </View>
        {selected && (
          <View style={styles.checkCircle}>
            <Check size={13} color="#fff" strokeWidth={2.5} />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.divider} />
    </Animated.View>
  );
}

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('en');

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(45,186,96,0.07)', C.bg]}
        locations={[0, 0.4]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <ScreenHeader title="Language" />

      <FlatList
        data={LANGUAGES}
        keyExtractor={(i) => i.code}
        renderItem={({ item, index }) => (
          <LangItem
            item={item}
            selected={selected === item.code}
            onSelect={setSelected}
            index={index}
          />
        )}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              Select your preferred display language
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: S.md },
  listHeader: {
    backgroundColor: C.bgCard,
    borderRadius: R.card,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.md,
    marginBottom: 14,
    marginTop: 4,
  },
  listHeaderText: { fontSize: 13.5, color: C.textSecondary, lineHeight: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: S.md,
    gap: 14,
    borderRadius: 0,
    overflow: 'hidden',
  },
  itemSelected: {
    borderRadius: 0,
  },
  flag: { fontSize: 26, lineHeight: 32 },
  itemText: { flex: 1, gap: 2 },
  itemLabel: { fontSize: 15.5, fontWeight: '500', color: C.textPrimary },
  itemLabelSelected: { color: C.green, fontWeight: '700' },
  itemNative: { fontSize: 12, color: C.textMuted },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  divider: { height: 1, backgroundColor: C.divider, marginLeft: 70 },
});
