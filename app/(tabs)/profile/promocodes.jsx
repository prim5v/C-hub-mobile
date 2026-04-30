// app/profile/promocodes.jsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Tag, CheckCircle2, Clock, ArrowRight } from 'lucide-react-native';

import SubScreenHeader from '@/components/profile/SubScreenHeader';
import EmptyState from '@/components/profile/EmptyState';
import { T } from '@/components/profile/tokens';

const CODES = [
  { id: '1', code: 'CAMPUS20', discount: '20% off first month', expires: 'May 31, 2025', used: false },
  { id: '2', code: 'WELCOME10', discount: 'KES 1,000 off booking', expires: 'Apr 30, 2025', used: true },
];

function CodeCard({ item, index }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 65 + 60).duration(350).springify()}
      style={[styles.promoCard, item.used && styles.promoCardUsed]}
    >
      <View style={[styles.promoIcon, item.used && styles.promoIconUsed]}>
        {item.used
          ? <CheckCircle2 size={17} color={T.textSoft} strokeWidth={2} />
          : <Tag size={17} color={T.textGreen} strokeWidth={2} />
        }
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[styles.promoCode, item.used && styles.promoCodeUsed]}>{item.code}</Text>
        <Text style={styles.promoDiscount}>{item.discount}</Text>
        <View style={styles.expiryRow}>
          <Clock size={10} color={T.textSoft} strokeWidth={2} />
          <Text style={styles.expiryText}>Expires {item.expires}</Text>
        </View>
      </View>
      <View style={[styles.promoBadge, item.used ? styles.promoBadgeUsed : styles.promoBadgeActive]}>
        <Text style={[styles.promoBadgeText, item.used && styles.promoBadgeTextUsed]}>
          {item.used ? 'Used' : 'Active'}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function PromoCodesScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const apply = useCallback(() => {
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Invalid Code', `"${code.toUpperCase()}" is not a valid promo code.`);
      setCode('');
    }, 800);
  }, [code]);

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SubScreenHeader title="Promo Codes" />

      <FlatList
        data={CODES}
        keyExtractor={(i) => i.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => <CodeCard item={item} index={index} />}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Input card */}
            <Animated.View entering={FadeInDown.delay(40).duration(400).springify()} style={styles.inputCard}>
              <Text style={styles.inputTitle}>Have a code?</Text>
              <Text style={styles.inputSub}>Enter it below to unlock your discount</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputWrap}>
                  <Tag size={15} color={T.textSoft} strokeWidth={2} />
                  <TextInput
                    style={styles.input}
                    value={code}
                    onChangeText={(t) => setCode(t.toUpperCase())}
                    placeholder="e.g. CAMPUS20"
                    placeholderTextColor={T.textSoft}
                    autoCapitalize="characters"
                    returnKeyType="done"
                    onSubmitEditing={apply}
                  />
                </View>
                <TouchableOpacity
                  onPress={apply}
                  disabled={!code.trim() || loading}
                  activeOpacity={0.85}
                  style={[styles.applyBtn, (!code.trim() || loading) && { opacity: 0.4 }]}
                >
                  <LinearGradient colors={[T.heroMid, T.heroTop]} style={styles.applyGrad}>
                    <Text style={styles.applyText}>{loading ? '...' : 'Apply'}</Text>
                    {!loading && <ArrowRight size={14} color="#fff" strokeWidth={2.5} />}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Text style={styles.sectionLabel}>YOUR CODES</Text>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Tag size={26} color={T.textGreen} strokeWidth={1.8} />}
            title="No codes yet"
            subtitle="Enter a promo code above to unlock discounts on your next booking."
          />
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  inputCard: {
    backgroundColor: '#F7FAF8',
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E6F5EC',
  },
  inputTitle: { fontSize: 16, fontWeight: '700', color: T.textDark },
  inputSub: { fontSize: 13, color: T.textSoft },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 2 },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.divider,
    paddingHorizontal: 12,
    gap: 8,
    height: 46,
  },
  input: { flex: 1, fontSize: 14.5, color: T.textDark, fontWeight: '600', letterSpacing: 1 },
  applyBtn: { borderRadius: 12, overflow: 'hidden' },
  applyGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 18, height: 46, borderRadius: 12 },
  applyText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: T.textSoft,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    paddingTop: 8,
    paddingBottom: 4,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAF8',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#D8F0E2',
  },
  promoCardUsed: { backgroundColor: '#F8F8F8', borderColor: T.divider, opacity: 0.7 },
  promoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoIconUsed: { backgroundColor: '#F0F0F0' },
  promoCode: { fontSize: 15, fontWeight: '800', color: T.textDark, letterSpacing: 0.6 },
  promoCodeUsed: { color: T.textSoft },
  promoDiscount: { fontSize: 12.5, color: T.textMid },
  expiryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  expiryText: { fontSize: 11, color: T.textSoft },
  promoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  promoBadgeActive: { backgroundColor: '#E8F9EE' },
  promoBadgeUsed: { backgroundColor: '#F0F0F0' },
  promoBadgeText: { fontSize: 11, fontWeight: '700', color: T.textGreen },
  promoBadgeTextUsed: { color: T.textSoft },
});